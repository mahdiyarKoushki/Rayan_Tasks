import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'رایان | مدیریت زمان و اهداف شیشه‌ای',
  description: 'تجربه کاربری مدرن و لوکس مدیریت کارهای روزانه، اهداف، تایم‌لاین زنده و عادات شخصی با رابط کاربری Liquid Glass',
  openGraph: {
    title: 'رایان | مدیریت زمان و اهداف شیشه‌ای',
    description: 'تجربه کاربری مدرن و لوکس مدیریت کارهای روزانه، اهداف، تایم‌لاین زنده و عادات شخصی با رابط کاربری Liquid Glass',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رایان | مدیریت زمان و اهداف شیشه‌ای',
    description: 'تجربه کاربری مدرن و لوکس مدیریت کارهای روزانه، اهداف، تایم‌لاین زنده و عادات شخصی با رابط کاربری Liquid Glass',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body suppressHydrationWarning className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}

