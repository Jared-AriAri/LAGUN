import { Component, OnInit, NgZone } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsService, NewsArticle } from '../../../services/news.service';

@Component({
    standalone: true,
    imports: [NgIf, NgFor, DatePipe, RouterModule],
    templateUrl: './news-detail.page.html'
})
export class NewsDetailPage implements OnInit {
    article: NewsArticle | null = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private newsService: NewsService,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.newsService.getNewsBySlug(slug)
                .then(data => {
                    this.ngZone.run(() => {
                        this.article = data;
                        this.loading = false;
                    });
                })
                .catch(error => {
                    this.ngZone.run(() => {
                        this.article = null;
                        this.loading = false;
                    });
                });
        } else {
            this.loading = false;
        }
    }
}