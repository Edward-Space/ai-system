import { funcUtils } from "@/lib/funcUtils";
import { TOptionHook, TResponseData } from "@/model";
import { IBot } from "@/model/bot";
import useSWR from "swr";
import { getCookie } from "cookies-next/client";
import { SWR_KEYS } from "@/lib/swr-key";
import axiosInstance, { apiClient } from "@/lib/axios";
export const useGetListBot = (option?: TOptionHook<any>) => {
  const { config, isFetch = true, params } = option ?? {};
  //
  const token = getCookie("token");
  //
  const fetcher = async () => {
    const urlAPi = funcUtils.combineUrl("/api/v1/bots", params);
    try {
      const rest = await axiosInstance.get(urlAPi)
      // const res = await fetch(urlAPi, {
      //   method: "GET",
      //   credentials: "include",
      //   ...funcUtils.fetchHeader(token),
      // });

      // if (!res.ok) {
      //   console.error("Error fetching data:", res.statusText);
      //   throw new Error(res.statusText);
      // }

      const data: TResponseData<IBot[]> = rest.data;

      return data;
    } catch (error) {
      console.error("Fetcher error:", error);
      return null;
    }
  };

  const { data, error, isLoading, mutate } = useSWR(SWR_KEYS.BOTS, fetcher, {
    revalidateIfStale: true,
    // ...config,
  });

  return { data, error, isLoading, mutate };
};
