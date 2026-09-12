import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "front-end-test-1-ui-design",
  description: "Next.js app shell",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
