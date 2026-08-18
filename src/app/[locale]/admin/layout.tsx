import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import Link from "next/link"
import { LayoutDashboard, Users, MessageSquare, LineChart, LogOut } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const locale = await getLocale()
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }
  
  return (
    <div className="-mt-28 min-h-[100vh] w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#0F172A] text-[#F8FAFC] font-sans flex z-[100] admin-panel">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-[#1E293B] h-20 flex items-center">
          <h2 className="text-xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
            Lore Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[#1E293B] hover:text-white transition-colors text-slate-300">
            <LayoutDashboard size={18} /> Overview
          </Link>
          <Link href={`/${locale}/admin/analytics`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[#1E293B] hover:text-white transition-colors text-slate-300">
            <LineChart size={18} /> Analytics
          </Link>
          <Link href={`/${locale}/admin/users`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[#1E293B] hover:text-white transition-colors text-slate-300">
            <Users size={18} /> Users
          </Link>
          <Link href={`/${locale}/admin/prompts`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[#1E293B] hover:text-white transition-colors text-slate-300">
            <MessageSquare size={18} /> Prompts
          </Link>
        </nav>
        <div className="p-4 border-t border-[#1E293B]">
          <Link href={`/${locale}`} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400">
            <LogOut size={18} /> Exit Admin
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        <div className="p-8 max-w-6xl mx-auto pb-24">
          {children}
        </div>
      </main>
    </div>
  )
}
