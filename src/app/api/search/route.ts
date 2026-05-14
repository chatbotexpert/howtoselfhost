import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'All';

  try {
    const whereClause: any = { published: true };
    
    if (category !== 'All') {
      whereClause.category = category;
    }

    if (q) {
      // In SQLite, basic LIKE operations are case-insensitive by default in Prisma for some setups, 
      // but to be safe, we can use contains. Prisma SQLite provider supports 'contains'.
      whereClause.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        tags: true,
        published: true,
        featured: true,
        readingTime: true,
        createdAt: true,
        publishedAt: true,
      }
    });

    // Parse tags since they are stored as strings in SQLite
    const formattedPosts = posts.map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : []
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
  }
}
