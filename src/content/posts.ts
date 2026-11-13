/**
 * Web4 journal entries.
 *
 * Add new articles to this array. Keep the date in YYYY-MM-DD format.
 * Use a unique slug for each article. Content supports plain text paragraphs.
 * Nothing is published until an entry is added here.
 */
export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
};

export const journalPosts: JournalPost[] = [
  // Example:
  // {
  //   slug: 'building-better-systems',
  //   title: 'Building better systems',
  //   excerpt: 'Why useful systems begin with understanding the work.',
  //   category: 'Systems',
  //   date: '2026-11-13',
  //   readTime: '4 min read',
  //   content: ['First paragraph.', 'Second paragraph.'],
  // },
];
