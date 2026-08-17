"use client"

import { useState } from "react"
import { registerAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await registerAction(formData)
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.")
      router.push("/vi/login")
    } catch (err: any) {
      toast.error(err.message || "Đã có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">Bắt đầu hành trình của bạn với Lore.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Họ và tên</label>
                 <Input name="name" required placeholder="Tên của bạn" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Số điện thoại</label>
                 <Input name="phone" required placeholder="09xxxx" />
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" name="email" required placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên đăng nhập (Username)</label>
              <Input name="username" required placeholder="Nhập username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Input type="password" name="password" required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhập lại mật khẩu</label>
              <Input type="password" name="confirmPassword" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
            <div className="text-center text-sm pt-4">
              Đã có tài khoản?{" "}
              <Link href="/vi/login" className="text-[var(--primary)] hover:underline">
                Đăng nhập
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
