export const metadata = {
  title: "Krzemienna Chata",
  description: "Dom w lesie pod Supraślem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
