"use client";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import { Toaster } from 'sonner';
export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  const optionConfigSWR = {
    revalidateOnFocus: false,
  };
  return (
    <SWRConfig value={optionConfigSWR}>
      <Toaster />
      <RecoilRoot>{children}</RecoilRoot>
    </SWRConfig>
  );
};
