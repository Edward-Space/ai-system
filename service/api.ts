import { getTokenUser } from "@/action/AuthAction";
import { funcUtils } from "@/lib/funcUtils";
export const GET = async <T>(url: string) => {
  try {
    const token = await getTokenUser();
    // 
    const combineUrl = funcUtils.combineUrl(url);
    const resp = await fetch(combineUrl, {
      method: "GET",
      ...funcUtils.fetchHeader(token?.toString()),
    });

    return resp.json() as Promise<T>;
  } catch (e) {
    console.log(e);
  }
};

export const POST = async <T>(url: string, payload: any) => {
  try {
    const token = await getTokenUser();
    // 
    const combineUrl = funcUtils.combineUrl(url);
    const resp = await fetch(combineUrl, {
      method: "POST",
      ...funcUtils.fetchHeader(token?.toString()),
      body: JSON.stringify(payload),
    });

    return resp.json() as Promise<T>;
  } catch (e) {}
};
