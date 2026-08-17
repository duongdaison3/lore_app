import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const prompts = [
  // --- REFLECTION (Deep / Gentle) ---
  { text: "Hôm nay, bạn đã nói 'không' với điều gì để bảo vệ năng lượng của mình?", category: "reflection", tone: "deep", intensity: 6, suitableMoods: ["😐", "🙂", "🫠"] },
  { text: "Một khoảnh khắc rất nhỏ hôm nay khiến bạn khựng lại một nhịp?", category: "reflection", tone: "gentle", intensity: 4, suitableMoods: ["🙂", "🥰"] },
  { text: "Nếu hôm nay là một tập phim, bạn sẽ đặt tên nó là gì?", category: "reflection", tone: "playful", intensity: 3, suitableMoods: ["🙂", "😵‍💫", "🔥"] },
  { text: "Điều gì đang chiếm nhiều 'băng thông' nhất trong đầu bạn lúc này?", category: "reflection", tone: "deep", intensity: 7, suitableMoods: ["😵‍💫", "🫠"] },
  { text: "Bạn đã thỏa hiệp điều gì hôm nay mà đáng lẽ không nên?", category: "reflection", tone: "deep", intensity: 8, suitableMoods: ["😐", "🫠", "😵‍💫"] },
  { text: "Điều gì bạn đã làm hôm nay chỉ vì thói quen, chứ không phải vì muốn?", category: "reflection", tone: "deep", intensity: 6, suitableMoods: ["😐", "🫠"] },
  { text: "Một cảm xúc bạn đã cố tình lờ đi hôm nay?", category: "reflection", tone: "deep", intensity: 8, suitableMoods: ["😐", "🫠"] },
  { text: "Hôm nay bạn đã cho phép bản thân nghỉ ngơi thực sự chưa?", category: "reflection", tone: "gentle", intensity: 4, suitableMoods: ["🫠", "😵‍💫"] },
  { text: "Điều gì bạn đã hoàn thành hôm nay mà không ai biết, nhưng bạn rất tự hào?", category: "reflection", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰"] },
  { text: "Hôm nay, bạn có đang sống đúng với phiên bản mình muốn trở thành?", category: "reflection", tone: "deep", intensity: 9, suitableMoods: ["😐", "🙂"] },
  { text: "Có điều gì bạn đang chờ đợi người khác công nhận, trong khi bạn đã có thể tự công nhận mình?", category: "reflection", tone: "deep", intensity: 8, suitableMoods: ["😐", "🫠"] },
  { text: "Một bài học nhỏ bạn nhận ra từ một sai lầm trong ngày?", category: "reflection", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "😐"] },
  { text: "Hôm nay bạn đã nói chuyện với bản thân bằng giọng điệu như thế nào?", category: "reflection", tone: "deep", intensity: 7, suitableMoods: ["🫠", "😐"] },
  { text: "Nếu được làm lại một việc trong ngày hôm nay, bạn sẽ làm gì khác đi?", category: "reflection", tone: "gentle", intensity: 4, suitableMoods: ["😐", "🙂"] },

  // --- MEMORY (Deep / Gentle) ---
  { text: "Mùi hương nào luôn khiến bạn nhớ về tuổi thơ?", category: "memory", tone: "gentle", intensity: 3, suitableMoods: ["🙂", "🥰"] },
  { text: "Lần gần nhất bạn khóc vì hạnh phúc là khi nào?", category: "memory", tone: "deep", intensity: 7, suitableMoods: ["🥰", "🙂"] },
  { text: "Kỷ niệm nào đột nhiên xẹt qua đầu bạn dạo gần đây?", category: "memory", tone: "random", intensity: 4, suitableMoods: ["😐", "🙂"] },
  { text: "Một người đã từng rất thân, nhưng giờ chỉ còn là người lạ từng quen?", category: "memory", tone: "deep", intensity: 8, suitableMoods: ["🫠", "😐"] },
  { text: "Món đồ cũ kỹ nào bạn vẫn giữ đến bây giờ dù không còn dùng đến?", category: "memory", tone: "gentle", intensity: 4, suitableMoods: ["🙂", "🥰"] },
  { text: "Một câu nói vô thưởng vô phạt từ rất lâu trước đây mà bạn vẫn nhớ như in?", category: "memory", tone: "deep", intensity: 6, suitableMoods: ["😐", "🫠"] },
  { text: "Kỷ niệm vui nhất mà bạn có với một người bạn đã lâu không gặp?", category: "memory", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰"] },
  { text: "Nơi nào bạn luôn muốn quay lại một lần nữa chỉ vì cảm giác nó mang lại?", category: "memory", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰", "🔥"] },
  { text: "Lần đầu tiên bạn nhận ra mình đã thực sự trưởng thành là khi nào?", category: "memory", tone: "deep", intensity: 8, suitableMoods: ["😐", "🙂"] },
  { text: "Một bài hát gắn liền với một khoảng thời gian đen tối nhưng giờ bạn đã vượt qua?", category: "memory", tone: "deep", intensity: 7, suitableMoods: ["🙂", "🔥"] },
  { text: "Bức ảnh nào trong điện thoại mang lại cho bạn nhiều cảm xúc nhất?", category: "memory", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰"] },
  { text: "Lần gần nhất bạn thực sự cảm thấy bình yên là ở đâu?", category: "memory", tone: "gentle", intensity: 6, suitableMoods: ["🥰", "🙂"] },

  // --- GRATITUDE (Gentle) ---
  { text: "Một điều bình dị hôm nay khiến bạn thấy biết ơn?", category: "gratitude", tone: "gentle", intensity: 2, suitableMoods: ["🙂", "🥰"] },
  { text: "Ai là người đã giúp cuộc sống của bạn dễ dàng hơn một chút trong tuần này?", category: "gratitude", tone: "gentle", intensity: 4, suitableMoods: ["🥰", "🙂"] },
  { text: "Một món đồ công nghệ nào đang cứu rỗi cuộc đời bạn mỗi ngày?", category: "gratitude", tone: "playful", intensity: 2, suitableMoods: ["🙂", "🔥"] },
  { text: "Một khả năng của chính bạn mà bạn thường xuyên coi nhẹ?", category: "gratitude", tone: "deep", intensity: 6, suitableMoods: ["😐", "🙂"] },
  { text: "Có điều gì tệ đã KHÔNG xảy ra hôm nay mà bạn thấy may mắn?", category: "gratitude", tone: "random", intensity: 3, suitableMoods: ["😵‍💫", "🫠", "😐"] },
  { text: "Một người lạ đã vô tình mang lại niềm vui cho bạn gần đây?", category: "gratitude", tone: "gentle", intensity: 4, suitableMoods: ["🙂", "🥰"] },
  { text: "Món ăn nào gần đây khiến bạn cảm thấy hạnh phúc khi thưởng thức?", category: "gratitude", tone: "playful", intensity: 2, suitableMoods: ["🙂", "🥰", "🔥"] },
  { text: "Bạn biết ơn điều gì nhất ở cơ thể của mình ngày hôm nay?", category: "gratitude", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰"] },
  { text: "Một lỗi lầm trong quá khứ mà giờ đây bạn biết ơn vì nó đã xảy ra?", category: "gratitude", tone: "deep", intensity: 7, suitableMoods: ["🙂", "😐"] },
  { text: "Điều gì bạn đang có hiện tại mà 5 năm trước bạn hằng ao ước?", category: "gratitude", tone: "deep", intensity: 6, suitableMoods: ["🥰", "🙂", "🔥"] },
  { text: "Một quyển sách hoặc bộ phim đã thay đổi cách nhìn của bạn về cuộc sống?", category: "gratitude", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰"] },
  { text: "Bài học lớn nhất bạn học được từ một người không hề hoàn hảo?", category: "gratitude", tone: "deep", intensity: 6, suitableMoods: ["😐", "🙂"] },

  // --- RELATIONSHIP (Deep / Playful) ---
  { text: "Ai là người bạn có thể nhắn tin lúc 2 giờ sáng mà không ngần ngại?", category: "relationship", tone: "gentle", intensity: 5, suitableMoods: ["🥰", "🙂"] },
  { text: "Lời nói dối vô hại nào bạn thường nói với những người xung quanh?", category: "relationship", tone: "random", intensity: 4, suitableMoods: ["😐", "😵‍💫"] },
  { text: "Có ai bạn đang cố gắng giữ khoảng cách dạo gần đây không? Vì sao?", category: "relationship", tone: "deep", intensity: 7, suitableMoods: ["🫠", "😐"] },
  { text: "Đặc điểm nào ở người khác luôn thu hút bạn ngay từ lần đầu gặp?", category: "relationship", tone: "playful", intensity: 3, suitableMoods: ["🙂", "🔥"] },
  { text: "Lần cuối bạn cảm thấy ghen tị với ai đó, điều gì thực sự ẩn đằng sau nó?", category: "relationship", tone: "deep", intensity: 8, suitableMoods: ["🫠", "😐"] },
  { text: "Có mối quan hệ nào bạn đang cố gắng duy trì chỉ vì tiếc thời gian đã bỏ ra?", category: "relationship", tone: "deep", intensity: 9, suitableMoods: ["🫠", "😵‍💫"] },
  { text: "Một người bạn đã dạy bạn cách yêu thương bản thân tốt hơn?", category: "relationship", tone: "gentle", intensity: 6, suitableMoods: ["🥰", "🙂"] },
  { text: "Câu nói nào từ ai đó làm tổn thương bạn nhiều hơn họ nghĩ?", category: "relationship", tone: "deep", intensity: 8, suitableMoods: ["🫠", "😐"] },
  { text: "Bạn thường đóng vai trò gì trong nhóm bạn thân?", category: "relationship", tone: "playful", intensity: 3, suitableMoods: ["🙂", "🔥"] },
  { text: "Lần gần nhất bạn cố tình làm ai đó vui lòng dù bản thân không muốn?", category: "relationship", tone: "deep", intensity: 7, suitableMoods: ["🫠", "😐"] },
  { text: "Có ai bạn muốn xin lỗi nhưng lại không dám không?", category: "relationship", tone: "deep", intensity: 8, suitableMoods: ["🫠", "😐"] },
  { text: "Một hành động quan tâm nhỏ bé từ ai đó khiến bạn rung động?", category: "relationship", tone: "gentle", intensity: 5, suitableMoods: ["🥰", "🙂"] },

  // --- IDENTITY (Deep) ---
  { text: "Có phần tính cách nào của bạn chỉ xuất hiện khi bạn ở một mình?", category: "identity", tone: "deep", intensity: 6, suitableMoods: ["😐", "🙂", "🫠"] },
  { text: "Nếu không có công việc hiện tại, bạn định nghĩa bản thân bằng điều gì?", category: "identity", tone: "deep", intensity: 8, suitableMoods: ["😵‍💫", "🫠"] },
  { text: "Một sự thật về bạn mà rất ít người biết đến?", category: "identity", tone: "random", intensity: 5, suitableMoods: ["🙂", "😐"] },
  { text: "Bạn có đang cố gắng chứng tỏ điều gì với ai không?", category: "identity", tone: "deep", intensity: 7, suitableMoods: ["🫠", "😵‍💫"] },
  { text: "Nếu được miêu tả bản thân bằng 3 từ vào lúc này, đó là gì?", category: "identity", tone: "gentle", intensity: 3, suitableMoods: ["🙂", "😐", "🥰", "🔥", "😵‍💫", "🫠"] },
  { text: "Điều gì bạn từng rất tin tưởng về bản thân nhưng giờ đã thay đổi?", category: "identity", tone: "deep", intensity: 7, suitableMoods: ["😐", "🙂"] },
  { text: "Phiên bản 'tốt nhất' của bạn trông như thế nào trong trí tưởng tượng?", category: "identity", tone: "deep", intensity: 6, suitableMoods: ["🔥", "🙂"] },
  { text: "Có sở thích nào bạn đang giấu diếm vì sợ bị đánh giá không?", category: "identity", tone: "random", intensity: 5, suitableMoods: ["😐", "😵‍💫"] },
  { text: "Phần tính cách nào của bố/mẹ mà bạn nhận ra mình cũng đang có?", category: "identity", tone: "deep", intensity: 7, suitableMoods: ["😐", "🫠"] },
  { text: "Bạn thường đóng vai trò gì khi ở cạnh những người xa lạ?", category: "identity", tone: "playful", intensity: 4, suitableMoods: ["😐", "🙂"] },
  { text: "Một lời khen nào bạn luôn muốn được nghe nhưng hiếm khi nhận được?", category: "identity", tone: "deep", intensity: 8, suitableMoods: ["🫠", "😐"] },
  { text: "Điều gì khiến bạn cảm thấy tự ti nhất, và bạn đang xử lý nó thế nào?", category: "identity", tone: "deep", intensity: 9, suitableMoods: ["🫠", "😵‍💫"] },

  // --- CREATIVE (Playful / Random) ---
  { text: "Nếu bị kẹt trên hoang đảo, 3 món đồ vô dụng nhưng mang lại niềm vui bạn sẽ mang theo?", category: "creative", tone: "playful", intensity: 2, suitableMoods: ["🙂", "🔥", "😵‍💫"] },
  { text: "Nếu bạn có thể viết luật cho một quốc gia riêng, luật đầu tiên là gì?", category: "creative", tone: "unhinged", intensity: 4, suitableMoods: ["🔥", "😵‍💫", "🙂"] },
  { text: "Nếu cuộc đời bạn là một cuốn sách, chương hiện tại có tựa đề là gì?", category: "creative", tone: "deep", intensity: 5, suitableMoods: ["😐", "🙂", "🫠"] },
  { text: "Bạn muốn sở hữu một siêu năng lực siêu vô dụng nào?", category: "creative", tone: "playful", intensity: 2, suitableMoods: ["🙂", "🥰", "😵‍💫"] },
  { text: "Nếu màu sắc có mùi vị, bạn nghĩ màu xanh dương vị gì?", category: "creative", tone: "random", intensity: 2, suitableMoods: ["🙂", "😐"] },
  { text: "Thiết kế một ngôi nhà trong mơ của bạn mà không quan tâm đến vật lý?", category: "creative", tone: "playful", intensity: 3, suitableMoods: ["🥰", "🙂", "🔥"] },
  { text: "Nếu động vật có thể nói chuyện, loài nào sẽ thô lỗ nhất?", category: "creative", tone: "unhinged", intensity: 3, suitableMoods: ["🔥", "😵‍💫", "🙂"] },
  { text: "Sáng chế ra một ngày lễ mới. Mọi người sẽ kỷ niệm nó như thế nào?", category: "creative", tone: "playful", intensity: 4, suitableMoods: ["🙂", "🥰"] },
  { text: "Nếu bạn là một con ma, bạn sẽ ám ai và ám như thế nào để họ phát điên?", category: "creative", tone: "unhinged", intensity: 5, suitableMoods: ["🔥", "😵‍💫"] },
  { text: "Bạn được chọn một bài hát làm nhạc nền mỗi khi bước vào phòng, đó là bài gì?", category: "creative", tone: "playful", intensity: 3, suitableMoods: ["🔥", "🙂", "🥰"] },
  { text: "Nếu có thể tải bất kỳ kỹ năng nào thẳng vào não như Ma trận, bạn chọn gì?", category: "creative", tone: "playful", intensity: 4, suitableMoods: ["🔥", "🙂"] },
  { text: "Một câu quote vô tri nhưng lại rất đúng mà bạn tự nghĩ ra?", category: "creative", tone: "random", intensity: 3, suitableMoods: ["😵‍💫", "😐", "🙂"] },

  // --- FUTURE (Deep / Gentle) ---
  { text: "Một điều nhỏ xíu bạn đang mong đợi vào ngày mai?", category: "future", tone: "gentle", intensity: 3, suitableMoods: ["🙂", "🥰", "😐"] },
  { text: "Nỗi sợ lớn nhất của bạn về tương lai lúc này là gì?", category: "future", tone: "deep", intensity: 8, suitableMoods: ["😵‍💫", "🫠", "😐"] },
  { text: "5 năm nữa, bạn mong muốn được trả lời câu hỏi nào một cách tự hào?", category: "future", tone: "deep", intensity: 7, suitableMoods: ["🔥", "🙂"] },
  { text: "Điều gì bạn đang trì hoãn mà lẽ ra nên bắt đầu từ hôm nay?", category: "future", tone: "deep", intensity: 6, suitableMoods: ["😐", "🫠", "😵‍💫"] },
  { text: "Viễn cảnh tương lai nào khiến bạn cảm thấy an tâm nhất?", category: "future", tone: "gentle", intensity: 5, suitableMoods: ["🥰", "🙂"] },
  { text: "Kế hoạch nào bạn đang ấp ủ nhưng chưa dám nói với ai?", category: "future", tone: "deep", intensity: 6, suitableMoods: ["🔥", "🙂", "😐"] },
  { text: "Bạn muốn phiên bản tương lai của mình cảm ơn bạn vì điều gì hôm nay?", category: "future", tone: "gentle", intensity: 5, suitableMoods: ["🙂", "🥰"] },
  { text: "Nếu biết chắc chắn mình không thể thất bại, bạn sẽ làm gì vào ngày mai?", category: "future", tone: "deep", intensity: 6, suitableMoods: ["🔥", "🙂"] },
  { text: "Bạn đang chuẩn bị gì cho một phiên bản tốt hơn của chính mình?", category: "future", tone: "deep", intensity: 6, suitableMoods: ["🔥", "🙂"] },
  { text: "Một kỹ năng bạn luôn muốn học nhưng cứ lùi lại mãi?", category: "future", tone: "gentle", intensity: 4, suitableMoods: ["😐", "🙂"] },
  { text: "Chuyến đi nào bạn nhất định phải thực hiện trong năm tới?", category: "future", tone: "playful", intensity: 4, suitableMoods: ["🔥", "🥰", "🙂"] },
  { text: "Bạn hy vọng điều gì sẽ KHÔNG thay đổi trong 10 năm nữa?", category: "future", tone: "deep", intensity: 7, suitableMoods: ["🥰", "🙂", "😐"] },

  // --- UNHINGED (Unhinged / Random) ---
  { text: "Hôm nay ai hoặc điều gì đã test nhân phẩm của bạn?", category: "unhinged", tone: "unhinged", intensity: 6, suitableMoods: ["😵‍💫", "🔥", "🫠"] },
  { text: "Thuyết âm mưu vô tri nhất mà bạn từng tin sái cổ?", category: "unhinged", tone: "unhinged", intensity: 4, suitableMoods: ["😵‍💫", "🙂"] },
  { text: "Nếu hôm nay bị bế lên phường vì một lý do ngớ ngẩn, đó sẽ là gì?", category: "unhinged", tone: "unhinged", intensity: 5, suitableMoods: ["😵‍💫", "🔥", "🙂"] },
  { text: "Lời chửi thề nào miêu tả chính xác nhất tâm trạng của bạn lúc này?", category: "unhinged", tone: "unhinged", intensity: 7, suitableMoods: ["🫠", "😵‍💫", "🔥"] },
  { text: "Một drama không liên quan đến mình nhưng bạn lại hít rất nhiệt tình gần đây?", category: "unhinged", tone: "random", intensity: 4, suitableMoods: ["🔥", "🙂", "😵‍💫"] },
  { text: "Nếu tiền không thành vấn đề, cách bốc đồng nhất bạn sẽ tiêu tiền hôm nay là gì?", category: "unhinged", tone: "unhinged", intensity: 6, suitableMoods: ["🔥", "😵‍💫", "🥰"] },
  { text: "Tin nhắn gửi nhầm nào khiến bạn muốn đào hố chôn mình ngay lập tức?", category: "unhinged", tone: "random", intensity: 5, suitableMoods: ["😵‍💫", "🫠"] },
  { text: "Sự thật phũ phàng nào mà bạn mới giác ngộ ra dạo gần đây?", category: "unhinged", tone: "deep", intensity: 7, suitableMoods: ["🫠", "😐", "😵‍💫"] },
  { text: "Giả vờ như vũ trụ đang nghe, hãy chửi xéo vũ trụ một câu.", category: "unhinged", tone: "unhinged", intensity: 6, suitableMoods: ["🫠", "😵‍💫", "🔥"] },
  { text: "Món đồ tốn tiền vô lý nhất mà bạn từng mua chỉ vì 'thích thì nhích'?", category: "unhinged", tone: "random", intensity: 4, suitableMoods: ["😵‍💫", "🙂", "🔥"] },
  { text: "Nếu được tàng hình trong 1 tiếng, bạn sẽ đi phá làng phá xóm ở đâu?", category: "unhinged", tone: "unhinged", intensity: 5, suitableMoods: ["🔥", "😵‍💫", "🙂"] },
  { text: "Một quy tắc xã hội ngớ ngẩn nào mà bạn muốn hủy bỏ ngay bây giờ?", category: "unhinged", tone: "unhinged", intensity: 6, suitableMoods: ["🔥", "😵‍💫", "😐"] }
]

async function main() {
  console.log("Start seeding prompts...")
  for (const p of prompts) {
    // Generate a unique slug-like ID or just rely on the text
    // We will use upsert based on text matching if possible, but Prompt only has ID as unique.
    // So we'll find first by text, if exists update, else create
    const existing = await prisma.prompt.findFirst({ where: { text: p.text } })
    if (existing) {
      await prisma.prompt.update({
        where: { id: existing.id },
        data: {
          category: p.category,
          tone: p.tone,
          intensity: p.intensity,
          suitableMoods: p.suitableMoods
        }
      })
    } else {
      await prisma.prompt.create({
        data: {
          text: p.text,
          category: p.category,
          tone: p.tone,
          intensity: p.intensity,
          suitableMoods: p.suitableMoods
        }
      })
    }
  }
  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
