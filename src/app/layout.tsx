import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nyxia - Assistante Mystique IA | Diane Boyer",
  description: "Nyxia, votre assistante magique IA prédictive. Découvrez la numérologie, le Design Human et recevez des guidance personnalisées avec Diane Boyer, Médium Psychopraticienne.",
  keywords: ["Nyxia", "IA mystique", "numérologie", "Design Human", "médium", "psychopraticienne", "Diane Boyer", "Oznya", "consultation", "spiritualité"],
  authors: [{ name: "Diane Boyer" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔮</text></svg>",
  },
  openGraph: {
    title: "Nyxia - Assistante Mystique IA",
    description: "Explorez les mystères de votre vie avec Nyxia, l'IA prédictive de Diane Boyer",
    url: "https://nyxia.oznya.com",
    siteName: "Nyxia",
    type: "website",
    images: [
      {
        url: "https://www.oznya.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nyxia - Assistante Mystique IA",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyxia - Assistante Mystique IA",
    description: "Explorez les mystères de votre vie avec Nyxia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
