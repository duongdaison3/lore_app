# Lore - A tiny daily conversation with yourself

Lore is a Vietnamese-first daily journaling web application. This repository contains the foundational code based on Next.js App Router, Tailwind CSS, Prisma, and next-intl.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4, `next-themes` (Dark/Light mode)
- **Database**: PostgreSQL (via Prisma ORM)
- **Localization**: `next-intl` (vi/en)
- **UI Components**: custom components built with Tailwind, Sonner (Toasts), Lucide React (Icons)
- **Validation**: Zod

## Hướng dẫn sử dụng (Getting Started)

Trải nghiệm Lore trực tuyến ngay tại: **[https://lore.xpea.io.vn/](https://lore.xpea.io.vn/)**

### 1. Bắt đầu hành trình
- Truy cập vào đường link trên và bấm **Bắt đầu ngay** (Register) để tạo một tài khoản mới.
- Điền các thông tin cơ bản như: Tên hiển thị, Email và Mật khẩu.

### 2. Viết nhật ký (Daily Journaling)
- Từ màn hình chính (Dashboard), ứng dụng sẽ chào bạn và hỏi bạn đang cảm thấy thế nào hôm nay thông qua **Thang đo cảm xúc**.
- Dựa vào cảm xúc của bạn, AI sẽ tự động chọn lọc và gợi ý một câu hỏi phù hợp để khơi nguồn cảm hứng (ví dụ: *Điều gì làm bạn mỉm cười hôm nay?*).
- Bạn chỉ cần trả lời tự nhiên như đang nhắn tin cho một người bạn.
- Sau câu trả lời đầu tiên, AI có thể đưa ra thêm 1-2 câu hỏi đào sâu (Follow-up) theo ngữ cảnh để giúp bạn hiểu rõ bản thân hơn.
- Nhấn **Hoàn thành** để lưu lại nhật ký của ngày hôm nay.

### 3. Đọc lại và Tạo ảnh Quote
- Toàn bộ nhật ký của bạn được lưu trữ an toàn trong mục **Thư viện (Library)**.
- Khi xem lại một bài viết, nếu bạn tâm đắc với một câu trả lời nào đó, hãy nhấn vào biểu tượng **Chia sẻ** (Share icon).
- Ứng dụng sẽ tự động biến câu trả lời của bạn thành một tấm ảnh trích dẫn (Quote) tuyệt đẹp với hiệu ứng nghệ thuật để bạn có thể **Tải về** và chia sẻ.

### 4. Khám phá bản thân (Lore Recap)
- Khi bạn viết đủ nhiều, AI sẽ tự động đúc kết những điểm nổi bật thành **Kỷ niệm** (Memories).
- Truy cập trang **Lore** để xem tổng kết tháng: Cảm xúc chủ đạo, những kỷ niệm nổi bật và những câu chuyện nhỏ thú vị về bạn.
- Ở màn hình chính, bạn có thể nhấn vào banner **✨ Lore Recap** để trải nghiệm lại toàn bộ hành trình thấu hiểu bản thân dưới dạng một câu chuyện trượt dọc đẹp mắt (giống như Spotify Wrapped).

## Project Structure
- `src/app/[locale]`: The Next.js App router with internationalization.
- `src/components/ui`: Reusable foundational UI components (Button, Card, Input, Modal).
- `messages/`: Localization dictionaries (`vi.json`, `en.json`).
- `prisma/`: Database schema definitions.

## Design Philosophy
The UI follows a calm, minimalist editorial interface inspired by Apple. It uses soft rounded corners, restrained motion, and a color palette featuring warm whites/soft zincs in Light Mode and charcoal/deep slates in Dark Mode.
