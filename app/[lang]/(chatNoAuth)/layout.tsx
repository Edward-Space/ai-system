export default function ChatNoAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages don't need token validation
  return <>{children}</>;
}