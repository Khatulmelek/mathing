import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PrivacyBox() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-center text-lg sm:text-xl">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 text-sm sm:text-base text-muted-foreground space-y-4">
        <section>
          <h3 className="font-semibold text-foreground mb-1">Information We Collect</h3>
          <p>Your display name, quiz performance data (response times), and completion timestamp.</p>
        </section>
        
        <section>
          <h3 className="font-semibold text-foreground mb-1">How We Use It</h3>
          <p>To display your results on the leaderboard and generate your completion certificate.</p>
        </section>
        
        <section>
          <h3 className="font-semibold text-foreground mb-1">Data Storage</h3>
          <p>Data is stored locally. Your display name is visible to others on the leaderboard.</p>
        </section>
        
        <section>
          <h3 className="font-semibold text-foreground mb-1">Cookies</h3>
          <p>This application does not use cookies or tracking technologies.</p>
        </section>
        
        <div className="pt-2 text-center">
          <Link href="/privacy" className="text-primary hover:underline text-sm">
            View Full Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
