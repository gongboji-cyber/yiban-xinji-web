import './globals.css';

export const metadata = {
  title: '易伴·心迹',
  description: '陪伴式对话、情绪洞察、日记生成与 ABC 认知分析原型站。'
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
