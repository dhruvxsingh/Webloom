import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

async function createProject(formData: FormData) {
  'use server'
  
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  
  const agencyId = formData.get('agencyId') as string
  const name = formData.get('name') as string
  
  await prisma.subAccount.create({
    data: {
      name,
      agencyId
    }
  })
  
  revalidatePath(`/agency/${agencyId}/projects`)
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ agencyId: string }>  // Change to Promise
}) {
  const user = await currentUser()
  if (!user) notFound()

  const { agencyId } = await params  // Await params

  const projects = await prisma.subAccount.findMany({
    where: {
      agencyId: agencyId
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Create and manage your websites
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Website</CardTitle>
          <CardDescription>
            Start building a new website for your agency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="flex gap-4">
            <input type="hidden" name="agencyId" value={agencyId} />
            <Input
              name="name"
              placeholder="Website Name"
              required
              className="flex-1"
            />
            <Button type="submit">Create Website</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                Created {new Date(project.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/builder/${project.id}`}>
                <Button className="w-full">Open Builder</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}