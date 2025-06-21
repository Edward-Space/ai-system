import { funcUtils } from "@/lib/funcUtils";
import { TOptionHook, TResponseData } from "@/model";
import { IBot, ICategory } from "@/model/bot";
import useSWR from "swr";
import { getCookie } from "cookies-next/client";
export const useGetCategory = (option?: TOptionHook<any>) => {
  const { config, isFetch = true, params } = option ?? {};
  //
  const token = getCookie("token");
  //
  const fetcher = async (url: string) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        ...funcUtils.fetchHeader(token),
      });

      if (!res.ok) {
        console.error("Error fetching data:", res.statusText);
        throw new Error(res.statusText);
      }

      const data: TResponseData<ICategory[]> = await res.json();

      return data;
    } catch (error) {
      console.error("Fetcher error:", error);
      return null;
    }
  };

  const urlAPi = funcUtils.combineUrl("/api/v1/categories", params);

  const { data, error, isLoading, mutate } = useSWR(
    isFetch ? urlAPi : null,
    fetcher,
    {
      revalidateIfStale: false,
      ...config,
    }
  );

  return { data, error, isLoading, mutate };
};
