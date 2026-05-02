import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "BookSphere - Discover Your Next Great Read",
  description: "Explore a world of knowledge and stories. Upload, share, and discover books with a community of passionate readers.",
  keywords: ["books", "library", "reading", "ebooks", "community"],
};

export const viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1 relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
