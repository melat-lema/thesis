import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
// import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
// import font poppins and use it as the main font
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
// import Provider from "./provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} font-poppins`}>
          {/* <Provider> */}
          {/* <ToastProvider /> */}
          <Toaster />
          {children}
          <ConfettiProvider />
          {/* </Provider> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
