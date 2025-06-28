import { getTokenUser, getRefreshToken, refreshAccessToken } from '@/action/AuthAction';

/**
 * Kiểm tra xem token có hết hạn không
 * @param token JWT token
 * @returns true nếu token hết hạn
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Coi như hết hạn nếu không parse được
  }
}

/**
 * Lấy token hợp lệ, tự động refresh nếu cần
 * @returns Promise<string | null> - Token hợp lệ hoặc null nếu không thể lấy
 */
export async function getValidToken(): Promise<string | null> {
  try {
    const currentToken = await getTokenUser();
    
    if (!currentToken) {
      return null;
    }
    
    // Kiểm tra token có hết hạn không
    if (isTokenExpired(currentToken)) {
      console.log('Token expired, attempting to refresh...');
      
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token available');
        return null;
      }
      
      // Thử refresh token
      try {
        const newToken = await refreshAccessToken();
        return newToken;
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        return null;
      }
    }
    
    return currentToken;
  } catch (error) {
    console.error('Error getting valid token:', error);
    return null;
  }
}

/**
 * Kiểm tra thời gian còn lại của token (tính bằng giây)
 * @param token JWT token
 * @returns số giây còn lại, hoặc 0 nếu đã hết hạn
 */
export function getTokenTimeRemaining(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = payload.exp - currentTime;
    return Math.max(0, timeRemaining);
  } catch (error) {
    console.error('Error parsing token:', error);
    return 0;
  }
}

/**
 * Thiết lập auto-refresh token trước khi hết hạn
 * @param token JWT token
 * @param refreshCallback Function để gọi khi cần refresh
 * @returns timeout ID để có thể clear nếu cần
 */
export function setupAutoRefresh(
  token: string,
  refreshCallback: () => Promise<void>
): NodeJS.Timeout | null {
  try {
    const timeRemaining = getTokenTimeRemaining(token);
    
    // Refresh token trước 5 phút (300 giây) khi hết hạn
    const refreshTime = Math.max(0, (timeRemaining - 300) * 1000);
    
    if (refreshTime > 0) {
      console.log(`Auto refresh scheduled in ${refreshTime / 1000} seconds`);
      return setTimeout(async () => {
        try {
          await refreshCallback();
        } catch (error) {
          console.error('Auto refresh failed:', error);
        }
      }, refreshTime);
    }
    
    return null;
  } catch (error) {
    console.error('Error setting up auto refresh:', error);
    return null;
  }
}