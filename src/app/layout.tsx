import React from "react";
import "./global.css";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: "AI Neural Node Workbench",
  description: "Full-Stack Next.js and GraphQL Execution Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
