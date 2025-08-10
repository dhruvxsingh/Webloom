import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create Svix instance
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email_addresses[0]?.email_address,
        imageUrl: image_url,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
      },
      create: {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        imageUrl: image_url,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
      },
    })
  }

  return new Response('', { status: 200 })
}