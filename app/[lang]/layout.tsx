import { RootLayoutComponent } from "@/components/layout/RootLayoutComponent";
import { SWRProvider } from "../provider";

export function generateStaticParams() {
  const lang = [{ lang: "vi" }];
  return lang;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <SWRProvider>
      <RootLayoutComponent lang={lang}>{children}</RootLayoutComponent>
    </SWRProvider>
  );
}
