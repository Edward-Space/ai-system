import { SWRProvider } from "../provider";

export function generateStaticParams() {
  const lang = [{ lang: "vi" }];
  return lang;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SWRProvider>{children}</SWRProvider>;
}
