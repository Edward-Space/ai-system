import { funcUtils } from "@/lib/funcUtils";
import { TOptionHook, TResponseData } from "@/model";
import useSWR from "swr";
import { getCookie } from "cookies-next/client";
import { IModel } from "@/model/model";
//
export const useGetModels = (option?: TOptionHook<any>) => {
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

      const data: TResponseData<IModel[]> = await res.json();

      return data;
    } catch (error) {
      console.error("Fetcher error:", error);
      return null;
    }
  };

  const urlAPi = funcUtils.combineUrl("/api/v1/llms", params);

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
