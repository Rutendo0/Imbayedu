export const dynamic = "force-dynamic";

export const metadata = {
  title: "Imbayedu Art Collective | Discover Unique African Art",
  description:
    "Discover unique African art pieces from talented artists at Imbayedu Art Collective. Shop our curated collection of contemporary paintings, sculptures, photography, and mixed media artwork.",
};

import "../client/src/index.css";
import { ReactNode } from "react";
import Providers from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}