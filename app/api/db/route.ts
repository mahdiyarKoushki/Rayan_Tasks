import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase, resetDatabase, importDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    const download = req.nextUrl.searchParams.get('download') || req.nextUrl.searchParams.get('export');

    if (download === '1' || download === 'true') {
      return new NextResponse(JSON.stringify(db, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'attachment; filename="database.json"',
        },
      });
    }

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

    if (body.action === 'import') {
      const importedData = importDatabase(body.data);
      return NextResponse.json({
        success: true,
        message: 'دیتابیس با موفقیت از فایل بازیابی شد',
        timestamp: importedData.lastUpdated,
        version: importedData.version,
        data: importedData,
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

