import { getUserAgencies, createAgency } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AgencyPage() {
  const agencies = await getUserAgencies()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Agencies</h1>
      
      {agencies.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Your First Agency</CardTitle>
            <CardDescription>
              Get started by creating your first agency to manage websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAgency} className="space-y-4">
              <Input
                name="name"
                placeholder="Agency Name"
                required
              />
              <Button type="submit" className="w-full">
                Create Agency
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency:any) => (
            <Card key={agency.id}>
              <CardHeader>
                <CardTitle>{agency.name}</CardTitle>
                <CardDescription>
                  Created {new Date(agency.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <a href={`/agency/${agency.id}`}>Open Dashboard</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}