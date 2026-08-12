import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string || 'Untitled Template';
    const category = formData.get('category') as string || 'General';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const textContent = await file.text();
    let jsonContent;
    try {
      jsonContent = JSON.parse(textContent);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
    }

    // Basic Elementor validation
    if (!jsonContent.content || !Array.isArray(jsonContent.content)) {
      return NextResponse.json({ error: 'Invalid Elementor template format' }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        name: name,
        category: category,
        tier: 'BASIC', // Default tier
        configJson: jsonContent,
        isActive: true,
      }
    });

    return NextResponse.json({ success: true, templateId: template.id });
  } catch (error: any) {
    console.error('Error uploading template:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
