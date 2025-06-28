"use client";

import { funcUtils } from "@/lib/funcUtils";
import { TResponseData } from "@/model";
import { getCookie } from "cookies-next/client";
import { useState } from "react";
import { mutate } from "swr";
import axiosInstance from "@/lib/axios";

export const useDeleteConversation = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteConversation = async (conversationId: string) => {
    if (!conversationId) {
      setError("ID cuộc trò chuyện không hợp lệ");
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // Gọi API delete conversation
      const response = await axiosInstance.delete(
        `/api/v1/conversations/${conversationId}`
      );

      if (response.status === 200 || response.status === 204) {
        // Revalidate danh sách conversations sau khi xóa thành công
        await mutate(
          (key) => typeof key === "string" && key.includes("/api/v1/conversations"),
          undefined,
          { revalidate: true }
        );

        return true;
      } else {
        throw new Error("Không thể xóa cuộc trò chuyện");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi xóa cuộc trò chuyện";
      setError(errorMessage);
      console.error("Delete conversation error:", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    deleteConversation,
    isDeleting,
    error,
    resetError,
  };
};