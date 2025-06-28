"use client";

import { IBot } from "@/model/bot";
import { useState } from "react";
import { mutate } from "swr";
import axiosInstance from "@/lib/axios";

export const useUpdateBot = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBot = async (botId: string, botData: Partial<IBot>) => {
    if (!botId) {
      setError("ID bot không hợp lệ");
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      // Gọi API update bot
      const response = await axiosInstance.put(
        `/api/v1/bots/${botId}`,
        botData
      );

      if (response.status === 200) {
        // Revalidate danh sách bots và bot detail sau khi update thành công
        await mutate(
          (key) => typeof key === "string" && key.includes("/api/v1/bots"),
          undefined,
          { revalidate: true }
        );

        return response.data;
      } else {
        throw new Error("Không thể cập nhật bot");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi cập nhật bot";
      setError(errorMessage);
      console.error("Update bot error:", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    updateBot,
    isUpdating,
    error,
    resetError,
  };
};