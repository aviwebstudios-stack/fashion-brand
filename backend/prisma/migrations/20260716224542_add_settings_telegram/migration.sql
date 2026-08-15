-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "telegramChatId" TEXT,
    "telegramConnectToken" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
