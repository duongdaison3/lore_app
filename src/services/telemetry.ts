import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// We use a salt from environment variables, or a fallback for local development.
// This ensures identical userIds always map to the same distinctId on this server,
// allowing us to calculate DAU and retention without knowing WHO the user is.
const SALT = process.env.TELEMETRY_SALT || "fallback-local-salt-39f28a"

export function getDistinctId(userId: string): string {
  return crypto.createHmac("sha256", SALT).update(userId).digest("hex")
}

// Ensure no raw PII or text content accidentally slips into the analytics database
export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized = { ...metadata }
  const restrictedKeys = ["content", "text", "promptText", "rawResponse", "answer", "journalText"]
  
  for (const key of restrictedKeys) {
    if (key in sanitized) {
      delete sanitized[key]
    }
  }

  // Deep sanitize for nested objects
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeMetadata(sanitized[key])
    }
  }

  return sanitized
}

export async function trackEvent(userId: string, eventName: string, metadata: Record<string, any> = {}) {
  try {
    const distinctId = getDistinctId(userId)
    const cleanMetadata = sanitizeMetadata(metadata)

    await prisma.telemetryEvent.create({
      data: {
        distinctId,
        name: eventName,
        type: "PRODUCT",
        metadata: cleanMetadata
      }
    })
  } catch (error) {
    // Analytics should never crash the main application flow
    console.error(`[Telemetry Error] Failed to track ${eventName}:`, error)
  }
}

export async function trackAIEvent(userId: string, eventName: string, metadata: Record<string, any> = {}) {
  try {
    const distinctId = getDistinctId(userId)
    const cleanMetadata = sanitizeMetadata(metadata)

    await prisma.telemetryEvent.create({
      data: {
        distinctId,
        name: eventName,
        type: "AI",
        metadata: cleanMetadata
      }
    })
  } catch (error) {
    console.error(`[Telemetry Error] Failed to track AI event ${eventName}:`, error)
  }
}
