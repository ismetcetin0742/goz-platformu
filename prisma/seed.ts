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

  // Varsayılan Sistem (SMTP) Ayarlarını Ekleme
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      mailService: 'SMTP',
      smtpHost: 'smtp.resend.com', 
      smtpPort: 587,              
      smtpUser: 'resend', 
      smtpPass: 're_JCA2TEPh_57AFm6vZ3QcJ8qS4oFZzgF4S',       
      fromEmail: 'onboarding@resend.dev', 
    },
  });

  console.log('✅ İşlem Başarılı: Varsayılan SMTP ayarları eklendi.');
}

main()
  .catch((e) => {
    console.error('❌ Hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });