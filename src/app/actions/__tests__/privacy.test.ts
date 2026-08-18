import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteMemory, clearAllMemories, deleteAccount } from '../privacy';
import { GET as exportGET } from '../../api/export/route';

// Mock dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    memory: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn()
    },
    user: {
      delete: vi.fn()
    },
    dailyEntry: {
      findMany: vi.fn()
    }
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

describe('Privacy Server Actions & API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteMemory (IDOR & Unauthorized)', () => {
    it('throws Unauthorized if no session', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null as any);
      await expect(deleteMemory('mem_123')).rejects.toThrow('Unauthorized');
    });

    it('throws Unauthorized memory deletion if memory does not exist', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user_1' }, expires: '' } as any);
      vi.mocked(prisma.memory.findUnique).mockResolvedValueOnce(null);

      await expect(deleteMemory('mem_123')).rejects.toThrow('Unauthorized memory deletion');
    });

    it('throws Unauthorized memory deletion if memory belongs to another user (IDOR)', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user_1' }, expires: '' } as any);
      // Memory belongs to user_2
      vi.mocked(prisma.memory.findUnique).mockResolvedValueOnce({
        id: 'mem_123', userId: 'user_2', content: 'test', type: 'test', confidence: 1, status: 'active', createdAt: new Date(), updatedAt: new Date(), sourceEntryId: null, expiresAt: null
      });

      await expect(deleteMemory('mem_123')).rejects.toThrow('Unauthorized memory deletion');
      expect(prisma.memory.delete).not.toHaveBeenCalled();
    });

    it('deletes memory if user owns it', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user_1' }, expires: '' } as any);
      vi.mocked(prisma.memory.findUnique).mockResolvedValueOnce({
        id: 'mem_123', userId: 'user_1', content: 'test', type: 'test', confidence: 1, status: 'active', createdAt: new Date(), updatedAt: new Date(), sourceEntryId: null, expiresAt: null
      });

      const res = await deleteMemory('mem_123');
      expect(res.success).toBe(true);
      expect(prisma.memory.delete).toHaveBeenCalledWith({ where: { id: 'mem_123' } });
    });
  });

  describe('deleteAccount Authorization', () => {
    it('throws Unauthorized if no session', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null as any);
      await expect(deleteAccount()).rejects.toThrow('Unauthorized');
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('deletes user record based on session ID', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user_1' }, expires: '' } as any);
      const res = await deleteAccount();
      
      expect(res.success).toBe(true);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user_1' } });
    });
  });

  describe('Export API Authorization', () => {
    it('returns 401 Unauthorized if no session', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null as any);
      
      const response = await exportGET();
      expect(response.status).toBe(401);
      expect(await response.text()).toBe('Unauthorized');
      expect(prisma.dailyEntry.findMany).not.toHaveBeenCalled();
    });

    it('returns JSON data if authenticated', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user_1', name: 'Test' }, expires: '' } as any);
      vi.mocked(prisma.dailyEntry.findMany).mockResolvedValueOnce([]);

      const response = await exportGET();
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      
      const data = await response.json();
      expect(data.user).toBe('Test');
      expect(data.entries).toEqual([]);
      expect(prisma.dailyEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user_1' }
      }));
    });
  });
});
