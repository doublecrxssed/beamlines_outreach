import { redirect } from 'next/navigation'

export default function RootPage() {
  // If a user hits the absolute root, immediately redirect to English.
  // The middleware will eventually handle Accept-Language intercepting.
  redirect('/en')
}
