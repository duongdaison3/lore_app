import { prisma } from '@/lib/prisma';

export type UserNotificationState = 'new' | 'regular' | 'recently_inactive' | 'long_inactive';

export async function evaluateUserState(userId: string): Promise<UserNotificationState> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      journalEntries: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!user) throw new Error("User not found");

  const now = new Date();
  
  if (user.journalEntries.length === 0) {
    // If created within 3 days, they are 'new'
    const msSinceCreation = now.getTime() - user.createdAt.getTime();
    if (msSinceCreation < 3 * 24 * 60 * 60 * 1000) return 'new';
    return 'long_inactive'; // registered but never wrote, after 3 days
  }

  const lastEntryDate = user.journalEntries[0].createdAt;
  const daysSinceLastEntry = (now.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceLastEntry <= 3) return 'regular';
  if (daysSinceLastEntry <= 14) return 'recently_inactive';
  return 'long_inactive';
}

export function getNotificationCopy(state: UserNotificationState): string {
  // We use Vietnamese logic directly as per requirements
  const copyMap = {
    new: [
      "Lore đã sẵn sàng. Hôm nay bạn muốn kể chuyện gì không?",
      "Một thói quen nhỏ bắt đầu từ hôm nay. Viết một dòng cho chính mình nhé?"
    ],
    regular: [
      "Lore hôm nay có một câu hỏi dành cho bạn.",
      "Rảnh một phút không? Mình có một chuyện muốn hỏi."
    ],
    recently_inactive: [
      "Mình không nhắc bạn đâu. Chỉ là nếu hôm nay muốn quay lại, Lore vẫn ở đây.",
      "Vài ngày rồi không gặp. Hôm nay của bạn ổn chứ?"
    ],
    long_inactive: [
      "Hey. Lâu rồi không gặp. Hôm nay thử kể một chuyện nhỏ xem?",
      "Nếu hôm nay là một ngày dài, hãy để nó lại ở đây nhé."
    ]
  };

  const options = copyMap[state];
  return options[Math.floor(Math.random() * options.length)];
}
