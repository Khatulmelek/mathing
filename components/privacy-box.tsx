import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PrivacyBox() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-center text-lg sm:text-xl">Polityka prywatności</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 text-sm sm:text-base text-muted-foreground space-y-4">
        <ol>
          <li>Przetwarzane dane to adres IP oraz wprowadzona nazwa użytkownika.</li>
          <li>Adres IP nie podlega przechowywaniu i jest używany jedynie do obłsugi tego programu.</li>
          <li>Nazwa użytkownika jest udostępniana publicznie na tablicy liderów, oraz przechowywana na czas nieokreślony</li>
          <li>Administratorem danych jest Antoni Sołtys. Kontakt: <a href="mailto:antonsolt48@gmail.com">antonsolt48@gmail.com</a></li>
        </ol>
      </CardContent>
    </Card>
  )
}
