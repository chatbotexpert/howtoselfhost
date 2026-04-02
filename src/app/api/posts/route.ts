import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateReadingTime } from '@/lib/utils';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: {
      published?: boolean;
      category?: string;
      featured?: boolean;
    } = {};

    if (published === 'true') where.published = true;
    if (published === 'false') where.published = false;
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    const parsedPosts = posts.map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : []
    }));

    return NextResponse.json(parsedPosts);
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags = [],
      published = false,
      featured = false,
      publishedAt,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const readingTime = calculateReadingTime(content);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? '',
        content,
        coverImage: coverImage ?? null,
        category: category ?? 'Docker',
        tags: JSON.stringify(tags),
        published,
        featured,
        readingTime,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return NextResponse.json({ ...post, tags });
  } catch (error: unknown) {
    console.error('POST /api/posts error:', error);
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint')
    ) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
