export const metadata = {
  title: 'Newsroom Rundown',
  description: 'Daily Rundown Operations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen">{children}</body>
    </html>
  )
}
