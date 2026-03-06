import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

// Prisma 6'da bu kadar basit!
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Prisma 6 ile veritabanına bağlanılıyor...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gozplatformu.com' },
    update: {},
    create: {
      email: 'admin@gozplatformu.com',
      name: 'Süper Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ İşlem Başarılı: Admin eklendi ->', admin.email);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Hata oluştu:', e);
    await prisma.$disconnect();
    process.exit(1);
  });