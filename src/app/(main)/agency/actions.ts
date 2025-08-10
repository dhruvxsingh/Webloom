'use server'

import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createAgency(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  
  if (!name) throw new Error('Agency name is required')

  // Get or create user in database
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {},
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
    }
  })

  // Create agency with user as owner
  const agency = await prisma.agency.create({
    data: {
      name,
      ownerId: dbUser.id,
      members: {
        create: {
          userId: dbUser.id,
          role: 'OWNER'
        }
      }
    }
  })

  redirect(`/agency/${agency.id}`)
}

export async function getUserAgencies() {
  const user = await currentUser()
  if (!user) return []

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      agencies: {
        include: {
          agency: true
        }
      }
    }
  })

  return dbUser?.agencies.map((membership: any)=> membership.agency) || []
}