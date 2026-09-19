import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const cleanUser = String(username || '').trim();
    const cleanPass = String(password || '').trim();

    // Authenticate specifically for mk / mk
    if (cleanUser === 'mk' && cleanPass === 'mk') {
      const response = NextResponse.json({
        success: true,
        message: 'خوش آمدید! ورود موفقیت‌آمیز بود.',
        user: {
          username: 'mk',
          displayName: 'کاربر mk',
          role: 'owner',
        },
        token: 'auth_token_mk_session',
      });

      // Set auth cookie
      response.cookies.set('rayan_auth', 'authenticated_mk', {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'نام کاربری یا رمز عبور اشتباه است. (راهنما: mk / mk)',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور در احراز هویت' },
      { status: 500 }
    );
  }
}
