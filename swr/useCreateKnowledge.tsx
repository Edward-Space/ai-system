"use client";

import { useState } from "react";
import { mutate } from "swr";
import axiosInstance from "@/lib/axios";
import { TCreateKnowledgeSchema } from "@/lib/schema";

export const useCreateKnowledge = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createKnowledge = async (knowledgeData: TCreateKnowledgeSchema) => {
    if (!knowledgeData.name || !knowledgeData.description) {
      setError("Tên và mô tả không được để trống");
      return false;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Gọi API create knowledge
      const response = await axiosInstance.post(
        `/api/v1/knowledges`,
        knowledgeData
      );

      if (response.status === 200 || response.status === 201) {
        // Revalidate danh sách knowledges sau khi tạo thành công
        await mutate(
          (key) => typeof key === "string" && key.includes("/api/v1/knowledges"),
          undefined,
          { revalidate: true }
        );

        return response.data;
      } else {
        throw new Error("Không thể tạo knowledge");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi tạo knowledge";
      setError(errorMessage);
      console.error("Create knowledge error:", err);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    createKnowledge,
    isCreating,
    error,
    resetError,
  };
};