-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "preferredTones" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "personalizationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'vi',
    "category" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 1,
    "targetGoals" TEXT[],
    "suitableMoods" TEXT[],
    "seasonalRelevance" TEXT,
    "cooldownDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyEntry" (
    "id" TEXT NOT NULL,
    "localDate" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DailyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryAnswer" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entryId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,

    CONSTRAINT "EntryAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceEntryId" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyEntry_userId_idx" ON "DailyEntry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_userId_localDate_key" ON "DailyEntry"("userId", "localDate");

-- CreateIndex
CREATE INDEX "EntryAnswer_entryId_idx" ON "EntryAnswer"("entryId");

-- CreateIndex
CREATE INDEX "EntryAnswer_promptId_idx" ON "EntryAnswer"("promptId");

-- CreateIndex
CREATE UNIQUE INDEX "EntryAnswer_entryId_promptId_key" ON "EntryAnswer"("entryId", "promptId");

-- CreateIndex
CREATE INDEX "Memory_userId_status_idx" ON "Memory"("userId", "status");

-- AddForeignKey
ALTER TABLE "DailyEntry" ADD CONSTRAINT "DailyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryAnswer" ADD CONSTRAINT "EntryAnswer_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "DailyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryAnswer" ADD CONSTRAINT "EntryAnswer_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_sourceEntryId_fkey" FOREIGN KEY ("sourceEntryId") REFERENCES "DailyEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
