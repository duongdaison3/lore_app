import { getTranslations } from "next-intl/server"

export default async function TermsPage() {
  const t = await getTranslations("Legal")

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-20 px-4">
      <div className="glass-panel w-full max-w-4xl rounded-3xl p-8 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-xl space-y-10">
        
        <header className="space-y-4 border-b border-[var(--border)]/50 pb-8 text-center sm:text-left">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-[var(--foreground)] tracking-tight">
            {t("termsTitle")}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] font-sans">
            {t("termsDesc")}
          </p>
        </header>

        <div className="space-y-8 text-[var(--foreground)]/90 leading-relaxed font-sans text-base md:text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">1. Chấp nhận Điều khoản</h2>
            <p>Bằng việc đăng ký và sử dụng Lore, bạn đồng ý tuân thủ các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng dịch vụ.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">2. Mô tả Dịch vụ</h2>
            <p>Lore là một nền tảng nhật ký cá nhân tích hợp AI, giúp người dùng ghi chép lại những suy nghĩ, cảm xúc và kỷ niệm hàng ngày. Lore sử dụng AI để gợi ý các câu hỏi và tạo ra những đoạn tổng hợp mang tính cá nhân hóa.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">3. Trách nhiệm của Người dùng</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
              <li>Bạn chịu trách nhiệm về nội dung do chính mình tạo ra trên Lore.</li>
              <li>Không sử dụng Lore cho các mục đích vi phạm pháp luật hoặc xâm phạm quyền của bên thứ ba.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">4. Quyền sở hữu Dữ liệu</h2>
            <p>Bạn là chủ sở hữu duy nhất của tất cả các dữ liệu, nhật ký, và kỷ niệm bạn nhập vào Lore. Chúng tôi không yêu cầu bất kỳ quyền sở hữu nào đối với nội dung cá nhân của bạn.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">5. Chấm dứt Sử dụng</h2>
            <p>Bạn có thể ngừng sử dụng Lore và xóa tài khoản của mình bất cứ lúc nào. Khi tài khoản bị xóa, toàn bộ dữ liệu cá nhân của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">6. Thay đổi Điều khoản</h2>
            <p>Chúng tôi có quyền cập nhật các Điều khoản Dịch vụ này. Mọi thay đổi sẽ được thông báo đến bạn thông qua ứng dụng hoặc email.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
