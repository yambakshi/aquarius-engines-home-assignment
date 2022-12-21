import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: [
        './page-not-found.component.common.scss',
        './page-not-found.component.desktop.scss',
        './page-not-found.component.mobile.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class PageNotFoundComponent {
    constructor(private titleService: Title) {
        this.titleService.setTitle('404');
    }
}