import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "BookSphere - Discover Books",
  description: "Explore knowledge and ideas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        
        {/* FOOTER */}
        <footer className="w-full bg-gray-100 border-t border-gray-300 py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-lg text-gray-700">
                © 2026 BookSphere
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
