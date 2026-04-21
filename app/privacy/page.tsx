import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Privacy Policy - Mathing',
  description: 'Privacy policy for the Mathing quiz application',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">← Back to Quiz</Link>
          </Button>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              When you use the Mathing quiz application, we collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Your chosen display name (entered when starting a quiz)</li>
              <li>Quiz performance data (score, response times)</li>
              <li>Timestamp of quiz completion</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              The information collected is used solely for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Displaying your score on the public leaderboard</li>
              <li>Generating your completion certificate</li>
              <li>Improving the quiz experience</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
            <p className="text-muted-foreground">
              Your quiz data is stored in a local SQLite database. We do not share your 
              information with third parties. The display name you provide is visible to 
              other users on the leaderboard.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
            <p className="text-muted-foreground">
              This application does not use cookies or tracking technologies to identify 
              individual users.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
            <p className="text-muted-foreground">
              Quiz results and leaderboard entries are retained indefinitely to maintain 
              the leaderboard functionality. If you wish to have your data removed, please 
              contact the site administrator.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              This application is suitable for users of all ages. We do not knowingly 
              collect personal information from children under 13. The only information 
              collected is the display name voluntarily provided by users.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. Any changes will be 
              reflected on this page with an updated revision date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy, please contact the 
              site administrator.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
