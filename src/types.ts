export interface Comment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: 'AI' | 'Games' | 'Software' | 'Downloads' | 'Business' | 'Blog' | 'Education';
  categoryIndex: number;
  canonicalUrl?: string;
  date: string;
  isoDate: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  thumbnail: string;
  snippet: string;
  content: {
    intro: string;
    sections: {
      id: string;
      title: string;
      body: string[];
      note?: {
        type: 'info' | 'warn' | 'success';
        text: string;
      };
      code?: string;
      downloadUrl?: string;
    }[];
  };
  tags: string[];
  commentsCount: number;
  comments: Comment[];
  rawContent?: string;
  link?: string;
  modifiedIso?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  keywords?: string[];
}

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
  colorClass: string;
  description: string;
  image: string;
}

export type StandalonePageType = 'about' | 'contact' | 'privacy' | 'terms' | 'sitemap';

