"use client";
import { useState } from "react";
import { mutate } from "swr";
import axiosInstance from "@/lib/axios";

export const useDeleteBot = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBot = async (botId: string) => {
    if (!botId) {
      setError("ID bot không hợp lệ");
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // Gọi API delete bot
      const response = await axiosInstance.delete(
        `/api/v1/bots/${botId}`
      );

      if (response.status === 200 || response.status === 204) {
        // Revalidate danh sách bots sau khi xóa thành công
        await mutate(
          (key) => typeof key === "string" && key.includes("/api/v1/bots"),
          undefined,
          { revalidate: true }
        );

        return true;
      } else {
        throw new Error("Không thể xóa bot");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi xóa bot";
      setError(errorMessage);
      console.error("Delete bot error:", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    deleteBot,
    isDeleting,
    error,
    resetError,
  };
};