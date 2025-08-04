"use client";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
export const SWRProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  const optionConfigSWR = {
    revalidateOnFocus: false,
  };
  return (
    <SWRConfig value={optionConfigSWR}>
      <NextThemesProvider {...props}>
        <Toaster />
        {children}
      </NextThemesProvider>
    </SWRConfig>
  );
};
