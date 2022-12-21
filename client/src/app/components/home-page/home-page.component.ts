import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@models/user';
import { ApiService } from '@services/api.service';


@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: [
        './home-page.component.common.scss',
        './home-page.component.desktop.scss',
        './home-page.component.mobile.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent {
    subscriptions: { users: Subscription } = { users: null };
    users: User[];

    constructor(
        private titleService: Title,
        private apiService: ApiService,
        private route: ActivatedRoute) {
        this.titleService.setTitle('Home');

        this.route.data.subscribe(data => {
            if (!data['resolverResponse']) {
                return;
            }
        });

        this.subscriptions.users = this.apiService.getUsersObservable().subscribe((users: User[]) => {
            this.users = users;
        });
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}