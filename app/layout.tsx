import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@/styles/globals.css";
import "@/styles/heritage.css";
import "@/styles/brand-theme.css";
import "@/styles/admin-studio.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { siteUrl } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ardhanari Collection — Elegance, Woven Into Every Thread.",
    template: "%s | Ardhanari Collection",
  },
  description:
    "A considered exploration of luxury sarees, textile artistry, and timeless drapes. Demo storefront.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Ardhanari Collection",
    locale: "en_IN",
    images: ["/images/heritage-hero.jpg"],
  },
};
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider afterSignOutUrl="/" signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/auth/continue" signUpFallbackRedirectUrl="/auth/continue" appearance={{variables:{colorPrimary:'#340509',colorBackground:'#f8f5ef',colorForeground:'#29221d',colorInput:'#fffaf2',borderRadius:'2px',fontFamily:'Manrope, sans-serif'}}}>
          <Providers>
          <a href="#main" className="skip-link">
          Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          {modal}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}