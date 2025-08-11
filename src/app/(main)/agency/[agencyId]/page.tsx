import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AgencyDashboard({ 
  params 
}: { 
  params: { agencyId: string } 
}) {
  const user = await currentUser()
  if (!user) notFound()

  // Get agency with members
  const agency = await prisma.agency.findFirst({
    where: {
      id: params.agencyId,
      members: {
        some: {
          user: {
            clerkId: user.id
          }
        }
      }
    },
    include: {
      members: {
        include: {
          user: true
        }
      },
      projects: true
    }
  })

  if (!agency) notFound()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{agency.name}</h1>
        <p className="text-muted-foreground">
          Manage your websites and team members
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Your websites and funnels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {agency.projects.length} project(s)
            </p>
            <Button>Create New Website</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {agency.members.length} member(s)
            </p>
            <Button variant="outline">Invite Member</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}