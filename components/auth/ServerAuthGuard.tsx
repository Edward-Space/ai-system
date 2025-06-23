import { getTokenUser } from "@/action/AuthAction"
import { redirect } from "next/navigation"

interface ServerAuthGuardProps {
  children: React.ReactNode
  lang: string
}

export async function ServerAuthGuard({ children, lang }: ServerAuthGuardProps) {
  const token = await getTokenUser()
  
  if (!token) {
    redirect(`/${lang}/login`)
  }
  
  return <>{children}</>
}