import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider} from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        
        <ToastProvider/>{children}
        <ConfettiProvider />
      </body>
    </html>
  </ClerkProvider>
  );
}
