import type { Metadata } from "next";
import "./styles/globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Airport Announcements",
  description: "Offline-ready announcement reference for ground staff.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b1220"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
