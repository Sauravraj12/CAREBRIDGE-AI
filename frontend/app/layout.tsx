import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareBridge AI",
  description: "AI Elderly Care coordination platform for family care and caregiver management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
