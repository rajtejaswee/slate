import "./globals.css";
import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google"; // Import Bricolage

const inter = Inter({ subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  variable: "--font-bricolage" // Define CSS variable
});

export const metadata: Metadata = {
  title: "Slate",
  description: "The infinite canvas for creative teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${bricolage.variable} bg-white`}>
        {children}
      </body>
    </html>
  );
}