import { POST } from "@/service/api";

interface CreateFileOptions {
  customName?: string;
  customPath?: string;
  storageType?: "local" | "cloud";
}

interface CreateFileResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

const handleCreateFile = async <T extends unknown>(file: File, options?: CreateFileOptions) => {
  const fileName = options?.customName || file.name || "unnamed";
  const filePath = options?.customPath || fileName;
  const storageType = options?.storageType || "local";

  try {
    const createFile = await POST<T>("/api/v1/files", {
      name: fileName,
      size: file.size,
      mime_type: file.type,
      path: filePath,
      storage_type: storageType,
    });

    if (!createFile) return;
    return createFile;
  } catch (e) {
    console.log(e);

    return null;
  }
};

const handleCreateBot = async <T extends unknown>(payload: any) => {
  try {
    const resp = await POST<T>("/api/v1/bots", payload);

    return resp
  } catch (e) {
    return e
  }
};

export { handleCreateFile, handleCreateBot };
