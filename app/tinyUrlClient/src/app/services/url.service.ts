import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { UrlSet } from '../components/index';

@Injectable()
export class UrlService {
    urlApi = '/api/v1/urls';
    constructor(private http: Http) { }

    getShortUrl(longUrl: string): Observable<UrlSet> {
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});

        return this.http.post(this.urlApi, {longUrl: longUrl}, options)
                    .map(this.extractUrlSet)
                    .catch(this.handleError);
    }

    getLongUrl(shortUrl: string): Observable<UrlSet> {
        const getUrl = `${this.urlApi}/${shortUrl}`;
        return this.http.get(getUrl)
                        .map(this.extractUrlSet)
                        .catch(this.handleError);
    }

    getStatsInfo(shortUrl: string, info: string): Observable<any> {
        const getUrl = `${this.urlApi}/${shortUrl}/${info}`;
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});

        return this.http.get(getUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    extractUrlSet(res: Response) {
        const body = res.json();
        return body as UrlSet || {};
    }

    extractData(res: Response) {
        const body = res.json();
        return body; // notes: if body is 0, then 0 || {} => {}
    }

    handleError(error: Response | any) {
        // TODO: Payson: add error handling
        console.log('error');
        return Observable.throw(error);
    }
}
