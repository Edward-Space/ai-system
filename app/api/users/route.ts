import { NextRequest, NextResponse } from 'next/server';
import apiService from '@/service';
import { ApiResponse, User } from '@/model';

/**
 * GET: Lấy danh sách người dùng
 */
export async function GET(request: NextRequest) {
  try {
    // Lấy query params
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    // Gọi API từ server
    const response = await apiService.get<User[]>(`/users?page=${page}&limit=${limit}`);
    
    // Trả về kết quả
    return NextResponse.json(response);
  } catch (error: any) {
    // Xử lý lỗi
    return NextResponse.json(
      { 
        status: error.status || 500, 
        message: error.message || 'Đã xảy ra lỗi không xác định',
        success: false,
        data: null
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST: Tạo người dùng mới
 */
export async function POST(request: NextRequest) {
  try {
    // Lấy dữ liệu từ request body
    const body = await request.json();
    
    // Gọi API từ server
    const response = await apiService.post<User>('/users', body);
    
    // Trả về kết quả
    return NextResponse.json(response);
  } catch (error: any) {
    // Xử lý lỗi
    return NextResponse.json(
      { 
        status: error.status || 500, 
        message: error.message || 'Đã xảy ra lỗi không xác định',
        success: false,
        data: null,
        errors: error.errors
      },
      { status: error.status || 500 }
    );
  }
}