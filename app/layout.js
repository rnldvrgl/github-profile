import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Tomorrow } from 'next/font/google'

const tomorrow = Tomorrow({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] })

export const metadata = {
  title: 'Github Profile',
  description: 'Created using Next JS, Tailwind, Github API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={tomorrow.className} >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
