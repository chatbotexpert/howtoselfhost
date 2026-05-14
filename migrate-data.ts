import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// 1. Initialize Prisma (which is now connected to PostgreSQL via your .env)
const prisma = new PrismaClient();

// 2. Connect directly to the old SQLite file
const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db');
console.log(`Reading from SQLite at: ${sqlitePath}`);
const sqlite = new Database(sqlitePath);

async function main() {
  console.log('Starting data migration...');

  // --- MIGRATE CATEGORIES ---
  console.log('Fetching Categories from SQLite...');
  const categories = sqlite.prepare('SELECT * FROM Category').all() as any[];
  
  if (categories.length > 0) {
    console.log(`Found ${categories.length} categories. Inserting into PostgreSQL...`);
    await prisma.category.createMany({
      data: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        color: c.color,
        icon: c.icon
      })),
      skipDuplicates: true,
    });
    console.log('Categories migrated successfully.');
  }

  // --- MIGRATE POSTS ---
  console.log('Fetching Posts from SQLite...');
  const posts = sqlite.prepare('SELECT * FROM Post').all() as any[];

  if (posts.length > 0) {
    console.log(`Found ${posts.length} posts. Inserting into PostgreSQL...`);
    await prisma.post.createMany({
      data: posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        category: p.category,
        tags: p.tags,
        published: p.published === 1, // SQLite stores booleans as 1/0
        featured: p.featured === 1,
        readingTime: p.readingTime,
        // SQLite dates are often stored as Unix timestamps or strings, need to parse them
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      })),
      skipDuplicates: true,
    });
    console.log('Posts migrated successfully.');
  }

  console.log('🎉 All data transferred successfully!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqlite.close();
  });
