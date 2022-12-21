import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IoTSignal } from '@models/iot-signal';
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
    subscriptions: { iotSignals: Subscription } = { iotSignals: null };
    iotSignals: IoTSignal[];

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

        this.subscriptions.iotSignals = this.apiService.getIoTSignalsObservable().subscribe((iotSignals: IoTSignal[]) => {
            this.iotSignals = iotSignals;
        });
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}