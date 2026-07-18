import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { searchEntries } from "@/content/library";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/jetbrains-mono/800.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: {
      default: "Commonplace — Personal Learning Library",
      template: "%s · Commonplace",
    },
    description:
      "A private, structured library for technical review, reading notes, projects, and ideas.",
    applicationName: "Commonplace",
    openGraph: {
      title: "Commonplace — Personal Learning Library",
      description: "Technical concepts, reading notes, projects, and ideas—kept in one quiet place.",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Commonplace personal learning library" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Commonplace — Personal Learning Library",
      description: "A private hub for learning.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#1d2021",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell searchEntries={searchEntries}>{children}</AppShell>
      </body>
    </html>
  );
}
