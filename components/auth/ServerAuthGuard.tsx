import { getValidToken } from "@/utils/tokenUtils"
import { redirect } from "next/navigation"

interface ServerAuthGuardProps {
  children: React.ReactNode
  lang: string
}

export async function ServerAuthGuard({ children, lang }: ServerAuthGuardProps) {
  const token = await getValidToken()
  
  if (!token) {
    redirect(`/${lang}/login`)
  }
  
  return <>{children}</>
}