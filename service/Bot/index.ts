import { GET } from "../api";

// Định nghĩa interface cho Bot
interface Bot {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Thêm các trường khác nếu cần
}

export const bot_service = {
  /**
   * Lấy danh sách bot
   */
  getListBot: () => {
    return GET<Bot[]>("/api/v1/bots");
  },

  /**
   * Lấy thông tin chi tiết của một bot
   */
  

};
