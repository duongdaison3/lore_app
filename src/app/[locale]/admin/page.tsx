import { prisma } from "@/lib/prisma"
import { Activity, Users, FileText, Settings } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count()
  const totalEntries = await prisma.dailyEntry.count()
  const totalPrompts = await prisma.prompt.count()
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white tracking-tight">System Overview</h1>
        <p className="text-slate-400 mt-2">Welcome to the Lore admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1E293B]/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Total Users</p>
            <p className="text-2xl font-mono text-white mt-1">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-[#1E293B]/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Journal Entries</p>
            <p className="text-2xl font-mono text-white mt-1">{totalEntries}</p>
          </div>
        </div>

        <div className="bg-[#1E293B]/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Active Prompts</p>
            <p className="text-2xl font-mono text-white mt-1">{totalPrompts}</p>
          </div>
        </div>

        <div className="bg-[#1E293B]/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-slate-500/20 text-slate-400 rounded-lg">
            <Settings size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">System Status</p>
            <p className="text-lg font-medium text-emerald-400 mt-1">Operational</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B]/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl">
        <h3 className="text-sm font-medium text-slate-200 border-b border-slate-700/50 pb-4 mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {recentUsers.map(u => (
                <tr key={u.id}>
                  <td className="py-4 text-white font-medium">{u.name || "Anonymous"}</td>
                  <td className="py-4 text-slate-400">{u.email}</td>
                  <td className="py-4 text-slate-400 font-mono">{u.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
