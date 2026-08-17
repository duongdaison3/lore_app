import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processJournalEntryForMemories, retrieveActiveMemories } from '../aiMemoryEngine';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    memory: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), deleteMany: vi.fn() }
  }
}));

vi.mock('ai', () => ({
  generateObject: vi.fn()
}));

// Mock process.env
process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test_key";

describe('aiMemoryEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('retrieveActiveMemories', () => {
    it('returns empty array if personalization is disabled', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ personalizationEnabled: false } as never);

      const result = await retrieveActiveMemories('user_123');
      expect(result).toEqual([]);
      expect(prisma.memory.findMany).not.toHaveBeenCalled();
    });

    it('returns active memories for correct user if enabled', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ personalizationEnabled: true } as never);
      const mockMemories = [{ id: '1', type: 'goal', content: 'test' }];
      vi.mocked(prisma.memory.findMany).mockResolvedValueOnce(mockMemories as never);

      const result = await retrieveActiveMemories('user_123');
      
      expect(result).toEqual(mockMemories);
      expect(prisma.memory.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_123', status: 'active' },
        orderBy: { confidence: 'desc' },
        take: 10
      });
    });
  });

  describe('processJournalEntryForMemories', () => {
    it('skips if personalization disabled', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ personalizationEnabled: false } as never);

      await processJournalEntryForMemories('user_123', 'entry_1', 'some text');
      
      expect(generateObject).not.toHaveBeenCalled();
    });

    it('creates new candidate memory if AI confidence is low', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ personalizationEnabled: true } as never);
      vi.mocked(prisma.memory.findMany).mockResolvedValueOnce([]); // no existing memories

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          extracted_memories: [
            { type: 'preference', content: 'likes coffee', confidence: 0.4, isNew: true }
          ]
        }
      } as never);

      await processJournalEntryForMemories('user_123', 'entry_1', 'I like coffee');

      expect(prisma.memory.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user_123',
          type: 'preference',
          content: 'likes coffee',
          confidence: 0.4,
          status: 'candidate'
        })
      }));
    });

    it('bumps confidence and sets to active if threshold crossed', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ personalizationEnabled: true } as never);
      vi.mocked(prisma.memory.findMany).mockResolvedValueOnce([
        { id: 'mem_1', type: 'preference', content: 'likes coffee', confidence: 0.5, status: 'candidate' }
      ] as never);

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          extracted_memories: [
            { id: 'mem_1', type: 'preference', content: 'likes coffee', confidence: 0.8, isNew: false }
          ]
        }
      } as never);

      await processJournalEntryForMemories('user_123', 'entry_2', 'I drank coffee again');

      expect(prisma.memory.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'mem_1' },
        data: expect.objectContaining({
          confidence: 0.8,
          status: 'active'
        })
      }));
    });
  });
});
