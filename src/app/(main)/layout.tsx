import { ClerkProvider } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="h-full">
      <main className="h-full">
        {children}
      </main>
    </div>
  )
}