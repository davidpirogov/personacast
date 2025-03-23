-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'authenticated';

-- CreateTable
CREATE TABLE "variables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variables_pkey" PRIMARY KEY ("id")
);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON variables;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON variables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
