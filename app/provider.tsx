"use client";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  const optionConfigSWR = {
    revalidateOnFocus: false,
  };
  return (
    <SWRConfig value={optionConfigSWR}>
      <RecoilRoot>{children}</RecoilRoot>
    </SWRConfig>
  );
};
