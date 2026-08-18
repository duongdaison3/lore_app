export type PromptPair = {
  prompt1: string;
  prompt2: string;
  relation: "exact_duplicate" | "semantic_duplicate" | "healthy_variation";
};

export const promptFixtures: PromptPair[] = [
  // Semantic Duplicates
  { prompt1: "Điều gì khiến bạn vui hôm nay?", prompt2: "Hôm nay có điều gì làm bạn cảm thấy vui?", relation: "semantic_duplicate" },
  { prompt1: "Kể về một kỷ niệm đáng nhớ.", prompt2: "Một ký ức khó quên của bạn là gì?", relation: "semantic_duplicate" },
  { prompt1: "Bạn biết ơn điều gì nhất trong ngày?", prompt2: "Hôm nay bạn thấy biết ơn nhất vì điều gì?", relation: "semantic_duplicate" },
  { prompt1: "Nỗi sợ lớn nhất của bạn là gì?", prompt2: "Điều gì khiến bạn sợ hãi nhất?", relation: "semantic_duplicate" },
  { prompt1: "Ai là người truyền cảm hứng cho bạn?", prompt2: "Người nào có ảnh hưởng lớn nhất đến bạn?", relation: "semantic_duplicate" },
  { prompt1: "Hãy kể về một lần bạn thất bại.", prompt2: "Bạn đã từng vấp ngã như thế nào?", relation: "semantic_duplicate" },
  { prompt1: "Món ăn yêu thích của bạn là gì?", prompt2: "Bạn thích ăn món gì nhất?", relation: "semantic_duplicate" },
  { prompt1: "Nếu trúng số, bạn sẽ làm gì?", prompt2: "Bạn sẽ tiêu tiền như thế nào nếu trúng vé số?", relation: "semantic_duplicate" },
  { prompt1: "Kể về người bạn thân nhất của bạn.", prompt2: "Hãy nói về một người bạn tốt của bạn.", relation: "semantic_duplicate" },
  { prompt1: "Bạn tự hào nhất về điều gì?", prompt2: "Thành tựu lớn nhất của bạn là gì?", relation: "semantic_duplicate" },
  { prompt1: "Một cuốn sách làm thay đổi bạn?", prompt2: "Cuốn sách nào đã thay đổi cuộc đời bạn?", relation: "semantic_duplicate" },
  { prompt1: "Bạn thích làm gì vào thời gian rảnh?", prompt2: "Sở thích của bạn là gì?", relation: "semantic_duplicate" },
  { prompt1: "Mục tiêu trong 5 năm tới của bạn?", prompt2: "Bạn thấy mình ở đâu sau 5 năm?", relation: "semantic_duplicate" },
  { prompt1: "Bài hát yêu thích của bạn lúc này?", prompt2: "Gần đây bạn hay nghe bài hát nào nhất?", relation: "semantic_duplicate" },
  { prompt1: "Điều gì làm bạn căng thẳng hôm nay?", prompt2: "Hôm nay có điều gì khiến bạn stress không?", relation: "semantic_duplicate" },

  // Exact Duplicates
  { prompt1: "Hôm nay của bạn thế nào?", prompt2: "Hôm nay của bạn thế nào?", relation: "exact_duplicate" },
  { prompt1: "Bạn đang cảm thấy thế nào?", prompt2: "Bạn đang cảm thấy thế nào?", relation: "exact_duplicate" },
  { prompt1: "Kể cho mình nghe về ngày hôm nay của bạn.", prompt2: "Kể cho mình nghe về ngày hôm nay của bạn.", relation: "exact_duplicate" },
  { prompt1: "Điều gì làm bạn mỉm cười hôm nay?", prompt2: "Điều gì làm bạn mỉm cười hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Ai đã giúp đỡ bạn hôm nay?", prompt2: "Ai đã giúp đỡ bạn hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Bạn đã học được gì mới hôm nay?", prompt2: "Bạn đã học được gì mới hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Một điều bạn muốn thay đổi trong ngày hôm nay?", prompt2: "Một điều bạn muốn thay đổi trong ngày hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Món ăn ngon nhất hôm nay là gì?", prompt2: "Món ăn ngon nhất hôm nay là gì?", relation: "exact_duplicate" },
  { prompt1: "Điều gì khiến bạn biết ơn hôm nay?", prompt2: "Điều gì khiến bạn biết ơn hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Một khoảnh khắc yên bình hôm nay?", prompt2: "Một khoảnh khắc yên bình hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Bạn đã làm gì để chăm sóc bản thân hôm nay?", prompt2: "Bạn đã làm gì để chăm sóc bản thân hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Điều gì khiến bạn tự hào hôm nay?", prompt2: "Điều gì khiến bạn tự hào hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Ai là người bạn nghĩ đến nhiều nhất hôm nay?", prompt2: "Ai là người bạn nghĩ đến nhiều nhất hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Một bài học từ ngày hôm nay?", prompt2: "Một bài học từ ngày hôm nay?", relation: "exact_duplicate" },
  { prompt1: "Bạn mong đợi điều gì vào ngày mai?", prompt2: "Bạn mong đợi điều gì vào ngày mai?", relation: "exact_duplicate" },

  // Healthy Variations (Different structural pattern, framing, or specific semantic divergence)
  { prompt1: "Điều gì khiến bạn vui hôm nay?", prompt2: "Nếu hôm nay là một bài hát, nó sẽ mang giai điệu vui vẻ chứ?", relation: "healthy_variation" },
  { prompt1: "Kể về một kỷ niệm đáng nhớ.", prompt2: "Hình ảnh nào đầu tiên xuất hiện khi bạn nghĩ về tuổi thơ?", relation: "healthy_variation" },
  { prompt1: "Bạn biết ơn điều gì nhất trong ngày?", prompt2: "Hãy miêu tả một khoảnh khắc nhỏ bé mà bạn muốn lưu giữ mãi.", relation: "healthy_variation" },
  { prompt1: "Nỗi sợ lớn nhất của bạn là gì?", prompt2: "Có điều gì bạn luôn lảng tránh nghĩ đến không?", relation: "healthy_variation" },
  { prompt1: "Ai là người truyền cảm hứng cho bạn?", prompt2: "Bạn ngưỡng mộ phẩm chất nào nhất ở người khác?", relation: "healthy_variation" },
  { prompt1: "Hãy kể về một lần bạn thất bại.", prompt2: "Bài học đắt giá nhất bạn học được từ một sai lầm là gì?", relation: "healthy_variation" },
  { prompt1: "Món ăn yêu thích của bạn là gì?", prompt2: "Nếu chỉ được ăn một món trong suốt quãng đời còn lại, bạn sẽ chọn gì?", relation: "healthy_variation" },
  { prompt1: "Nếu trúng số, bạn sẽ làm gì?", prompt2: "Nếu tiền bạc không phải là vấn đề, bạn sẽ dành cả ngày để làm gì?", relation: "healthy_variation" },
  { prompt1: "Kể về người bạn thân nhất của bạn.", prompt2: "Kỷ niệm điên rồ nhất mà bạn từng có với một người bạn?", relation: "healthy_variation" },
  { prompt1: "Bạn tự hào nhất về điều gì?", prompt2: "Lần gần đây nhất bạn cảm thấy thực sự hài lòng với bản thân là khi nào?", relation: "healthy_variation" },
  { prompt1: "Một cuốn sách làm thay đổi bạn?", prompt2: "Câu nói nào trong một cuốn sách khiến bạn suy nghĩ mãi?", relation: "healthy_variation" },
  { prompt1: "Bạn thích làm gì vào thời gian rảnh?", prompt2: "Một hoạt động nào khiến bạn hoàn toàn quên mất thời gian?", relation: "healthy_variation" },
  { prompt1: "Mục tiêu trong 5 năm tới của bạn?", prompt2: "Điều gì khiến bạn háo hức nhất khi nghĩ về tương lai?", relation: "healthy_variation" },
  { prompt1: "Bài hát yêu thích của bạn lúc này?", prompt2: "Bài hát nào gắn liền với một kỷ niệm đặc biệt của bạn?", relation: "healthy_variation" },
  { prompt1: "Điều gì làm bạn căng thẳng hôm nay?", prompt2: "Làm thế nào bạn tìm lại sự cân bằng sau một ngày mệt mỏi?", relation: "healthy_variation" },
  { prompt1: "Hôm nay của bạn thế nào?", prompt2: "Nếu dùng một màu sắc để vẽ ngày hôm nay, bạn chọn màu gì?", relation: "healthy_variation" },
  { prompt1: "Bạn đang cảm thấy thế nào?", prompt2: "Điều gì đang chiếm ưu thế trong suy nghĩ của bạn lúc này?", relation: "healthy_variation" },
  { prompt1: "Kể cho mình nghe về ngày hôm nay của bạn.", prompt2: "Có chi tiết nhỏ bé nào hôm nay khiến bạn chú ý không?", relation: "healthy_variation" },
  { prompt1: "Điều gì làm bạn mỉm cười hôm nay?", prompt2: "Bạn có mang lại niềm vui cho ai hôm nay không?", relation: "healthy_variation" },
  { prompt1: "Ai đã giúp đỡ bạn hôm nay?", prompt2: "Bạn đánh giá cao điều gì ở sự tương tác của bạn với người khác hôm nay?", relation: "healthy_variation" }
];
