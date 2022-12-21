import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "@environments/environment";
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ApiHttpInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let isAbsoluteUrl = this.isAbsoluteUrl(request.url);
        if (isAbsoluteUrl) {
            return next.handle(request);
        }

        const url = `${environment.apiUrl}${request.url}`;
        const modified = request.clone({ url: url });
        return next.handle(modified);
    }

    private isAbsoluteUrl(url: string): boolean {
        return url.startsWith('http');
    }
}