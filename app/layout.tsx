
import { ClerkProvider } from '@clerk/nextjs'
// import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { Inter, Space_Grotesk } from "next/font/google"
import './globals.css'
import { ThemeProvider } from '@/context/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-inter"
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-spaceGrotesk"
})
export const metadata = {
  title: "DevFlow",
  description: "By Nikita Biichuk",
  icons: {
    icon: '/assets/images/site-logo.svg'
  }
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider appearance={{
          layout: {
            logoImageUrl: "/assets/images/site-logo.svg",
            socialButtonsVariant: "iconButton",
          },
          variables: {
            colorText: "#fff",
            colorPrimary: "#0E78F9",
            colorBackground: "#1C1F2E",
            colorInputBackground: "#252a41",
            colorInputText: "#fff",
            colorTextSecondary: "#fff"
            // button color
          }
        }}>
          <ThemeProvider>
            {/* <ChakraProvider> */}
            {children}
            {/* </ChakraProvider> */}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}