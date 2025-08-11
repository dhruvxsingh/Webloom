import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AgencyLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ agencyId: string }>  // Change to Promise
}) {
  const user = await currentUser()
  if (!user) notFound()

  const { agencyId } = await params  // Await params

  const agency = await prisma.agency.findFirst({
    where: {
      id: agencyId,  // Use destructured value
      members: {
        some: {
          user: {
            clerkId: user.id
          }
        }
      }
    }
  })

  if (!agency) notFound()

  return (
    <div className="h-full">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/agency" className="font-semibold">
              Webloom
            </Link>
            <nav className="flex items-center gap-4">
              <Link href={`/agency/${agency.id}`}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href={`/agency/${agency.id}/projects`}>
                <Button variant="ghost" size="sm">Projects</Button>
              </Link>
              <Link href={`/agency/${agency.id}/team`}>
                <Button variant="ghost" size="sm">Team</Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{agency.name}</span>
          </div>
        </div>
      </header>
      <main className="h-[calc(100vh-73px)]">
        {children}
      </main>
    </div>
  )
}