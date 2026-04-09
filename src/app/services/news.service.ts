import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
    published_at: string;
    slug: string;
    categories: { name: string }[];
}

@Injectable({ providedIn: 'root' })
export class NewsService {
    constructor(private supa: SupabaseService) { }

    async getPublishedNews(): Promise<NewsArticle[]> {
        const { data, error } = await this.supa.supabase
            .from('news_articles')
            .select(`
        id, title, excerpt, content, cover_image_url, published_at, slug,
        news_article_categories ( news_categories ( name ) )
      `)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) throw error;

        return (data as any[]).map(art => ({
            id: art.id,
            title: art.title,
            excerpt: art.excerpt,
            content: art.content,
            cover_image_url: art.cover_image_url,
            published_at: art.published_at,
            slug: art.slug,
            categories: art.news_article_categories?.map((c: any) => c.news_categories) || []
        }));
    }

    async getNewsBySlug(slug: string): Promise<NewsArticle> {
        const { data, error } = await this.supa.supabase
            .from('news_articles')
            .select(`
        *,
        news_article_categories ( news_categories ( name ) )
      `)
            .eq('slug', slug)
            .single();

        if (error) throw error;

        return {
            ...data,
            categories: data.news_article_categories?.map((c: any) => c.news_categories) || []
        };
    }
}