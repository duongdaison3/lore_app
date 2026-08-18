import { prisma } from "@/lib/prisma"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { journalEntries: true, memories: true }
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 mt-2">Manage and monitor platform accounts.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full bg-[#1E293B]/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      <div className="bg-[#1E293B]/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0F172A]/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Contact</th>
                <th className="py-4 px-6 font-medium">Entries</th>
                <th className="py-4 px-6 font-medium">Memories</th>
                <th className="py-4 px-6 font-medium">Joined</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{u.name || "Anonymous"}</div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">{u.username}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-300">{u.email}</div>
                    {u.phone && <div className="text-xs text-slate-500 mt-1">{u.phone}</div>}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-mono">
                    {u._count.journalEntries}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-mono">
                    {u._count.memories}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono">
                    {u.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No users found in database</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
