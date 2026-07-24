-- CreateTable
CREATE TABLE "insurance_documents" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurance_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "insurance_documents" ADD CONSTRAINT "insurance_documents_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
