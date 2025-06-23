import { RootLayoutComponent } from "@/components/layout/RootLayoutComponent";

export function generateStaticParams() {
  const lang = [{ lang: "vi" }];
  return lang;
}
/* ------------------------------------------------------------------------------------ */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  /* ------------------------------------------------------------------------------------ */
  const { lang } = await params;
  /* ------------------------------------------------------------------------------------ */
  return <RootLayoutComponent lang={lang}>{children}</RootLayoutComponent>;
}
