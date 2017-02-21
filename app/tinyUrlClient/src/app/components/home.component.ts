import { Component } from '@angular/core';

import { UrlService } from '../services/url.service';
import { Router } from '@angular/router';

export class UrlSet {
    longUrl: string;
    shortUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
    longUrl: string;
    shortUrl: string;

    constructor(private urlService: UrlService, private router: Router) {

    }

    onSubmit() {
        this.urlService.getShortUrl(this.longUrl)
            .subscribe(
                result => {
                    this.shortUrl = result.shortUrl;
                    this.router.navigateByUrl('client/urls/' + this.shortUrl);
                },
                error => {
                    console.log(error); // TODO: Payson debug only
                }
            );
    }
}
