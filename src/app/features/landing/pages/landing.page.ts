import { Component, OnInit, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { RouterModule } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.page.html'
})
export class LandingPage implements OnInit, OnDestroy {
  private supa = inject(SupabaseService);
  private zone = inject(NgZone);
  private cd = inject(ChangeDetectorRef);

  latestContent: any[] = [];
  loading = true;
  private channel?: RealtimeChannel;

  ngOnInit() {
    this.fetchContent();
    this.setupRealtime();
  }

  ngOnDestroy() {
    if (this.channel) {
      this.supa.supabase.removeChannel(this.channel);
    }
  }

  async fetchContent() {
    this.loading = true;
    this.cd.detectChanges();

    const [news, reviews] = await Promise.all([
      this.supa.supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6),
      this.supa.supabase
        .from('reviews')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6)
    ]);

    this.zone.run(() => {
      if (news.error) {
        console.error('Error cargando noticias:', news.error);
      }

      if (reviews.error) {
        console.error('Error cargando reseñas:', reviews.error);
      }

      const n = (news.data || []).map((i) => ({
        ...i,
        content_type: 'news',
        route: i.slug ? `/news/${i.slug}` : null
      }));

      const r = (reviews.data || []).map((i) => ({
        ...i,
        content_type: 'review',
        route: i.slug ? `/reviews/${i.slug}` : null
      }));

      this.latestContent = [...n, ...r]
        .sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || 0).getTime();
          const dateB = new Date(b.published_at || b.created_at || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 6);

      this.loading = false;
      this.cd.detectChanges();
    });
  }

  private setupRealtime() {
    this.channel = this.supa.supabase
      .channel('landing-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_articles' },
        () => this.fetchContent()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        () => this.fetchContent()
      )
      .subscribe();
  }
}