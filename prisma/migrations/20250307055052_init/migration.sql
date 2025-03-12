-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "roles" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministrativeRegion" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255) NOT NULL,
    "codeName" VARCHAR(255),
    "codeNameEn" VARCHAR(255),

    CONSTRAINT "AdministrativeRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministrativeUnit" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(255),
    "fullNameEn" VARCHAR(255),
    "shortName" VARCHAR(255),
    "shortNameEn" VARCHAR(255),
    "codeName" VARCHAR(255),
    "codeNameEn" VARCHAR(255),

    CONSTRAINT "AdministrativeUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255),
    "fullName" VARCHAR(255) NOT NULL,
    "fullNameEn" VARCHAR(255) NOT NULL,
    "codeName" VARCHAR(255),
    "administrativeUnitId" INTEGER,
    "administrativeRegionId" INTEGER,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "District" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255),
    "fullName" VARCHAR(255),
    "fullNameEn" VARCHAR(255),
    "codeName" VARCHAR(255),
    "provinceCode" VARCHAR(20),
    "administrativeUnitId" INTEGER,

    CONSTRAINT "District_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Ward" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255),
    "fullName" VARCHAR(255),
    "fullNameEn" VARCHAR(255),
    "codeName" VARCHAR(255),
    "districtCode" VARCHAR(20),
    "administrativeUnitId" INTEGER,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_provinces_region" ON "Province"("administrativeRegionId");

-- CreateIndex
CREATE INDEX "idx_provinces_unit" ON "Province"("administrativeUnitId");

-- CreateIndex
CREATE INDEX "idx_districts_province" ON "District"("provinceCode");

-- CreateIndex
CREATE INDEX "idx_districts_unit" ON "District"("administrativeUnitId");

-- CreateIndex
CREATE INDEX "idx_wards_district" ON "Ward"("districtCode");

-- CreateIndex
CREATE INDEX "idx_wards_unit" ON "Ward"("administrativeUnitId");

-- AddForeignKey
ALTER TABLE "Province" ADD CONSTRAINT "Province_administrativeUnitId_fkey" FOREIGN KEY ("administrativeUnitId") REFERENCES "AdministrativeUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Province" ADD CONSTRAINT "Province_administrativeRegionId_fkey" FOREIGN KEY ("administrativeRegionId") REFERENCES "AdministrativeRegion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "Province"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_administrativeUnitId_fkey" FOREIGN KEY ("administrativeUnitId") REFERENCES "AdministrativeUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_districtCode_fkey" FOREIGN KEY ("districtCode") REFERENCES "District"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_administrativeUnitId_fkey" FOREIGN KEY ("administrativeUnitId") REFERENCES "AdministrativeUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
