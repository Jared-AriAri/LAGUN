import { Component, OnInit, NgZone } from "@angular/core";
import { NgFor, NgIf, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NewsService, NewsArticle } from "../../../services/news.service";

@Component({
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterModule],
  templateUrl: './news-list.page.html'
})
export class NewsListPage implements OnInit {
  news: NewsArticle[] = [];
  loading = true;

  constructor(
    private newsService: NewsService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.newsService.getPublishedNews()
      .then(data => {
        this.ngZone.run(() => {
          this.news = data;
          this.loading = false;
        });
      })
      .catch(error => {
        this.ngZone.run(() => {
          this.news = [];
          this.loading = false;
        });
      });
  }
}