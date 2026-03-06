import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Kullanıcı zaten var mı kontrolü
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 400 });
    }

    // 2. Admin panelinden kaydedilen mail ayarlarını veritabanından oku
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    
    if (!settings) {
      return NextResponse.json({ error: "Sistem mail ayarları henüz yapılmamış (Admin > Ayarlar)." }, { status: 500 });
    }

    // 3. Şifreleme ve Token oluşturma
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = uuidv4();

    // 4. Kullanıcıyı kaydet
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
        role: "USER",
      },
    });

    const verifyLink = `${process.env.NEXTAUTH_URL}/api/verify?token=${verifyToken}`;

    // 5. Ayarlara göre Mail Gönderimi
    if (settings.mailService === "SMTP") {
      // SMTP (Kendi Sunucun) Ayarları
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost!,
        port: settings.smtpPort,
        secure: settings.smtpPort === 465, // SSL için 465 portu kontrolü
        auth: {
          user: settings.smtpUser!,
          pass: settings.smtpPass!,
        },
      });

      await transporter.sendMail({
        from: settings.fromEmail,
        to: email,
        subject: "Göz Platformu - Hesabınızı Doğrulayın",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hoş geldin ${name}!</h2>
            <p>Hesabınızı doğrulamak için lütfen aşağıdaki butona tıklayın:</p>
            <a href="${verifyLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Hesabımı Doğrula</a>
          </div>
        `
      });

    } else if (settings.mailService === "RESEND" && settings.resendApiKey) {
      // Resend API Ayarları
      const resend = new Resend(settings.resendApiKey);
      await resend.emails.send({
        from: settings.fromEmail,
        to: email,
        subject: "Göz Platformu - Hesabınızı Doğrulayın",
        html: `<p>Merhaba ${name}, hesabını doğrulamak için <a href="${verifyLink}">tıkla</a>.</p>`
      });
    }

    return NextResponse.json({ message: "Kayıt başarılı! Mailinizi kontrol edin." });

  } catch (error: any) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + error.message }, { status: 500 });
  }
}