export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages don't need token validation
  return <>{children}</>;
}