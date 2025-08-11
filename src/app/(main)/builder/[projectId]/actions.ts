'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getOrCreatePage(projectId: string) {
  // Get or create the default home page
  let page = await (prisma as any).page.findFirst({
    where: {
      projectId,
      path: '/'
    }
  })

  if (!page) {
    page = await (prisma as any).page.create({
      data: {
        projectId,
        name: 'Home',
        path: '/',
        content: {
          elements: []
        }
      }
    })
  }

  return page
}

export async function updatePageContent(pageId: string, content: any) {
  await (prisma as any).page.update({
    where: { id: pageId },
    data: { content }
  })
  
  revalidatePath('/builder/[projectId]')
}

export async function publishPage(pageId: string) {
  await (prisma as any).page.update({
    where: { id: pageId },
    data: { published: true }
  })
  
  revalidatePath('/builder/[projectId]')
}