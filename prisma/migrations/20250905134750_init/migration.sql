-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "rootTs" TEXT NOT NULL,
    "ts" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "user" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
