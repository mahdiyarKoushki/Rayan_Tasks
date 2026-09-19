import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase, resetDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({
      success: true,
      data: db,
    });
  } catch (error) {
    console.error('API GET /api/db error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در بارگذاری دیتابیس' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset') {
      const resetData = resetDatabase();
      return NextResponse.json({
        success: true,
        message: 'دیتابیس بازنشانی شد',
        data: resetData,
      });
    }

    const updated = updateDatabase(body);
    return NextResponse.json({
      success: true,
      message: 'تغییرات با موفقیت در دیتابیس ذخیره شد',
      timestamp: updated.lastUpdated,
      version: updated.version,
      data: updated,
    });
  } catch (error) {
    console.error('API POST /api/db error:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ذخیره‌سازی اطلاعات در دیتابیس' },
      { status: 500 }
    );
  }
}
