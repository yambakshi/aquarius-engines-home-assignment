import { Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IoTSignal } from '@models/iot-signal';
import { ApiService } from '@services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { SignalRService } from '@services/signalr.service';
import { IoTSignalType } from 'app/enums/iot-signal-type.enum';
import * as moment from 'moment';


@Component({
    selector: 'alarms-page',
    templateUrl: './alarms-page.component.html',
    styleUrls: [
        './alarms-page.component.common.scss',
        './alarms-page.component.desktop.scss',
        './alarms-page.component.mobile.scss'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class AlarmsPageComponent {
    subscriptions: { iotSignals: Subscription } = { iotSignals: null };
    iotSignals: IoTSignal[];

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private titleService: Title,
        private apiService: ApiService,
        private signalRService: SignalRService,
        private route: ActivatedRoute) {
        this.titleService.setTitle('Alarms');

        this.route.data.subscribe(data => {
            if (!data['resolverResponse']) {
                return;
            }
        });

        this.subscriptions.iotSignals = this.apiService.getIoTSignalsObservable().subscribe((iotSignals: IoTSignal[]) => {
            this.iotSignals = iotSignals;
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}