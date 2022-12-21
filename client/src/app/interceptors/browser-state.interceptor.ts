import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { environment } from "@environments/environment";


@Injectable({
    providedIn: 'root'
})
export class BrowserStateInterceptor implements HttpInterceptor {
    initialFetch: Set<string> = new Set();

    constructor(private transferState: TransferState) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method !== 'GET' || this.initialFetch.has(request.url)) {
            return next.handle(request);
        }

        this.initialFetch.add(request.url);
        const url = `${environment.apiUrl}${request.url}`;
        const storedResponse: string = this.transferState.get(makeStateKey(url), null);

        if (storedResponse) {
            const response = new HttpResponse({ body: storedResponse, status: 200 });
            return of(response);
        }

        return next.handle(request);
    }
}