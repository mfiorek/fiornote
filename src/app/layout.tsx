import "~/styles/globals.css";
import Providers from "~/components/providers/Providers";

export const metadata = {
  title: "fiornote",
  description: "fiornote - Notes app using React Server Components",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`flex min-h-screen flex-col bg-slate-800 text-slate-200`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
