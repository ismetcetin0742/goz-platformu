import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya uzantısını al
    const ext = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;
    
    // Yükleme dizinini kontrol et ve oluştur
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);

    // Erişilebilir URL'yi dön
    return NextResponse.json({ 
      url: `/uploads/${fileName}`,
      name: file.name
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 });
  }
}
