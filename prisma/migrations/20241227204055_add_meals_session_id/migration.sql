/*
  Warnings:

  - The required column `sessionId` was added to the `Meal` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diet" BOOLEAN NOT NULL,
    "sessionId" TEXT NOT NULL
);
INSERT INTO "new_Meal" ("createdAt", "description", "diet", "id", "name") SELECT "createdAt", "description", "diet", "id", "name" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
