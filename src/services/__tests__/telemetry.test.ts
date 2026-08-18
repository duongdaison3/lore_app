import { describe, it, expect, vi } from 'vitest';
import { sanitizeMetadata, getDistinctId, trackEvent } from '../telemetry';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    telemetryEvent: {
      create: vi.fn()
    }
  }
}));

import { prisma } from '@/lib/prisma';

describe('Telemetry Privacy Filters', () => {
  it('strips restricted keys from metadata', () => {
    const input = {
      model: "gemini",
      latency: 120,
      content: "This is private journal text",
      text: "Private text here too",
      promptText: "What did you do?",
      rawResponse: "I went to the store",
      answer: "My answer",
      journalText: "My full journal text",
      validKey: "allowed"
    };

    const output = sanitizeMetadata(input);

    expect(output).toEqual({
      model: "gemini",
      latency: 120,
      validKey: "allowed"
    });
  });

  it('strips restricted keys from nested objects in metadata', () => {
    const input = {
      model: "gemini",
      nested: {
        content: "I am sad",
        allowedKey: 123,
        deeper: {
          text: "hidden",
          ok: true
        }
      }
    };

    const output = sanitizeMetadata(input);

    expect(output).toEqual({
      model: "gemini",
      nested: {
        allowedKey: 123,
        deeper: {
          ok: true
        }
      }
    });
  });

  it('hashes userId into a stable distinctId', () => {
    const id1 = getDistinctId("user_abc");
    const id2 = getDistinctId("user_abc");
    const id3 = getDistinctId("user_xyz");

    // Identical inputs produce identical distinct IDs
    expect(id1).toBe(id2);
    
    // Different inputs produce different distinct IDs
    expect(id1).not.toBe(id3);

    // Should be a 64 character hex string (sha256)
    expect(id1).toMatch(/^[a-f0-9]{64}$/);
    
    // Original string should not be part of the distinctId
    expect(id1).not.toContain("user_abc");
  });

  it('tracks event using sanitized data and hashed userId', async () => {
    await trackEvent("user_123", "journal_started", {
      content: "Secret text",
      latency: 50
    });

    expect(prisma.telemetryEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          distinctId: expect.stringMatching(/^[a-f0-9]{64}$/),
          name: "journal_started",
          type: "PRODUCT",
          metadata: { latency: 50 }
        })
      })
    );
  });
});
