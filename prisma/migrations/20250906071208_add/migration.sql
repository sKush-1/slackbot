-- CreateTable
CREATE TABLE "public"."WorkspaceToken" (
    "id" SERIAL NOT NULL,
    "teamId" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,

    CONSTRAINT "WorkspaceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceToken_teamId_key" ON "public"."WorkspaceToken"("teamId");
