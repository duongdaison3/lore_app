"use client"

import { useState } from "react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await loginAction(formData)
    } catch (err: any) {
      if (err.message.includes("CredentialsSignin")) {
         toast.error("Sai tài khoản hoặc mật khẩu")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">Chào mừng bạn trở lại với Lore.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên đăng nhập (Username)</label>
              <Input name="username" required placeholder="Nhập username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Input type="password" name="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
            <div className="text-center text-sm pt-4">
              Chưa có tài khoản?{" "}
              <Link href="/vi/register" className="text-[var(--primary)] hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
