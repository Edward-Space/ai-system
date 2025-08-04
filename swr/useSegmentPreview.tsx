import useSWR from "swr";
import { apiClient } from "@/lib/axios";
import { ISegmentPreview } from "@/model/knowledge";

interface SegmentPreviewResponse {
  data: {
    segments: ISegmentPreview[];
  };
}

interface UseSegmentPreviewParams {
  fileUrl?: string;
  chunkingStrategy?: "auto" | "custom";
  enabled?: boolean;
}

const fetcher = async (
  url: string,
  fileUrl: string,
  chunkingStrategy: string
) => {
  const response = await apiClient.post<SegmentPreviewResponse>(url, {
    chunking_strategy: chunkingStrategy,
    document_url: fileUrl,
  });

  return response.data;
};

export const useSegmentPreview = ({
  fileUrl,
  chunkingStrategy = "auto",
  enabled = true,
}: UseSegmentPreviewParams) => {
  const shouldFetch = enabled && fileUrl;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch
      ? ["/api/v1/segments/preview", fileUrl, chunkingStrategy]
      : null,
    ([url, fileUrl, strategy]) => fetcher(url, fileUrl, strategy),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
      errorRetryCount: 2,
      errorRetryInterval: 1000,
    }
  );

  console.log("rs", data);

  // Transform API response to ISegmentPreview format
  const segmentPreviews: ISegmentPreview[] = data?.data?.segments
    ? data.data.segments.map((segment, index: number) => ({
        id: segment.id || `segment-${index}`,
        content: segment.content || "",
        metadata: segment.metadata || {},
      }))
    : [];

  return {
    segmentPreviews,
    isLoading,
    error: error?.response?.data?.message || error?.message || null,
    mutate,
    refetch: () => mutate(),
  };
};

export default useSegmentPreview;
