import { prisma } from "@/lib/prisma"
import { Search, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPromptsPage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { category: "asc" },
    include: {
      _count: {
        select: { answers: true }
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Prompt Management</h1>
          <p className="text-slate-400 mt-2">Configure system reflection questions and AI behavior.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search prompts..." 
              className="w-full bg-[#1E293B]/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> New Prompt
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B]/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0F172A]/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="py-4 px-6 font-medium">Text</th>
                <th className="py-4 px-6 font-medium">Category & Tone</th>
                <th className="py-4 px-6 font-medium">Type</th>
                <th className="py-4 px-6 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-medium text-right">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {prompts.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 max-w-md">
                    <div className="text-white font-medium truncate">{p.text}</div>
                    <div className="text-xs text-slate-500 mt-1">Intensity: {p.intensity}/10</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs uppercase tracking-wider">{p.category}</span>
                      <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs uppercase tracking-wider">{p.tone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {p.isFollowUp ? 
                      <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs">Follow-up</span> : 
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">Primary</span>
                    }
                  </td>
                  <td className="py-4 px-6 text-center">
                    {p.active ? 
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> : 
                      <span className="inline-block w-2 h-2 rounded-full bg-slate-600"></span>
                    }
                  </td>
                  <td className="py-4 px-6 text-right text-slate-300 font-mono">
                    {p._count.answers}
                  </td>
                </tr>
              ))}
              {prompts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No prompts found in database</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
