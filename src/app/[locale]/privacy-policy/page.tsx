import { getTranslations } from "next-intl/server"

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("Legal")

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-20 px-4">
      <div className="glass-panel w-full max-w-4xl rounded-3xl p-8 md:p-14 animate-in fade-in slide-in-from-bottom-6 duration-1000 shadow-xl space-y-10">
        
        <header className="space-y-4 border-b border-[var(--border)]/50 pb-8 text-center sm:text-left">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-[var(--foreground)] tracking-tight">
            {t("privacyTitle")}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] font-sans">
            {t("privacyDesc")}
          </p>
        </header>

        <div className="space-y-8 text-[var(--foreground)]/90 leading-relaxed font-sans text-base md:text-lg">
          
          <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 p-6 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-[var(--primary)] mb-2">Cam Kết 100% Quyền Riêng Tư</h2>
            <p>Lore được xây dựng với nguyên tắc "Privacy-First". Chúng tôi <strong>không đọc, không bán và không chia sẻ</strong> nhật ký cá nhân của bạn với bất kỳ bên thứ ba nào. Dữ liệu của bạn là của riêng bạn.</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">1. Dữ liệu chúng tôi thu thập</h2>
            <p>Chúng tôi chỉ thu thập những thông tin cần thiết để vận hành dịch vụ:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Thông tin tài khoản: Tên, email, số điện thoại (để xác thực).</li>
              <li>Nội dung của bạn: Các mục nhật ký, câu trả lời, cảm xúc bạn nhập vào.</li>
              <li>Dữ liệu phân tích ẩn danh (Telemetry): Số lượng bài viết, số lần nhấn nút, hoàn toàn không chứa văn bản cá nhân.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">2. Cách chúng tôi sử dụng AI</h2>
            <p>Khi bạn sử dụng các tính năng liên quan đến AI (như câu hỏi gợi mở, tổng hợp tháng), dữ liệu của bạn sẽ được gửi đến mô hình AI để xử lý. Tuy nhiên, các nhà cung cấp AI của chúng tôi (như Google/OpenAI) cam kết không sử dụng dữ liệu này để huấn luyện (train) mô hình của họ. Bạn cũng có thể tắt tính năng "Cá nhân hóa AI" trong cài đặt quyền riêng tư.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">3. Đo lường và Phân tích (Telemetry)</h2>
            <p>Để cải thiện ứng dụng, chúng tôi theo dõi các sự kiện tương tác trong ứng dụng. Tất cả định danh người dùng trong telemetry đều được băm (hashing bằng SHA-256) một chiều. Chúng tôi tuyệt đối không ghi nhận lại nguyên văn (raw text) nhật ký của bạn.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">4. Quyền kiểm soát dữ liệu của bạn</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Truy cập & Tải về:</strong> Bạn có thể xuất (export) toàn bộ nhật ký của mình dưới dạng JSON bất cứ lúc nào.</li>
              <li><strong>Xóa ký ức:</strong> Bạn có thể xóa từng suy luận mà AI ghi nhớ về bạn, hoặc xóa sạch toàn bộ ký ức.</li>
              <li><strong>Xóa tài khoản:</strong> Khi bạn chọn "Xóa tài khoản", toàn bộ dữ liệu, nhật ký, thông tin đăng nhập sẽ bị xóa vĩnh viễn và không thể khôi phục.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">5. Bảo mật dữ liệu</h2>
            <p>Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Chúng tôi áp dụng các tiêu chuẩn bảo mật hiện đại để bảo vệ thông tin của bạn khỏi việc truy cập trái phép.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
