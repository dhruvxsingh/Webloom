import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { PageBuilder } from '@/components/builder/page-builder'
import { getOrCreatePage } from './actions'

export default async function BuilderPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const user = await currentUser()
  if (!user) notFound()
  const { projectId } = await params
  const project = await prisma.subAccount.findFirst({
    where: {
      id: projectId,
      agency: {
        members: {
          some: {
            user: {
              clerkId: user.id
            }
          }
        }
      }
    }
  })

  if (!project) notFound()

  // Get or create the page
  const page = await getOrCreatePage(projectId)

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b bg-white p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href={`/agency/${project.agencyId}/projects`} className="text-sm">
            ← Back
          </a>
          <span className="font-semibold">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm border rounded">Preview</button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded">
            Publish
          </button>
        </div>
      </div>

      {/* Page Builder Component */}
      <PageBuilder page={page} projectId={projectId} />
    </div>
  )
}