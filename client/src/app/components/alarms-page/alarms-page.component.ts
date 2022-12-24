import { Component, Inject, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MonitorIoTSignal } from '@models/monitor-iot-signal';
import { ApiService } from '@services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Moment } from 'moment';
import { BaseIoTSignal } from '@models/base-iot-signal';
import { IoTSignalFlag } from 'app/enums/iot-signal-flag.enum';
import { IoTSignalStreamlType } from 'app/enums/iot-signal-stream-type.enum';


interface AlarmRow extends BaseIoTSignal {
    index: number;
}

@Component({
    selector: 'alarms-page',
    templateUrl: './alarms-page.component.html',
    styleUrls: ['./alarms-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AlarmsPageComponent {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource: MatTableDataSource<AlarmRow>;
    displayedColumns: string[] = ['timestamp', 'value', 'type'];
    subscriptions: { alarms: Subscription, monitor: Subscription } = { alarms: null, monitor: null };
    alarmsRows: AlarmRow[];

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private titleService: Title,
        private apiService: ApiService,
        private route: ActivatedRoute) {
        this.titleService.setTitle('Alarms');
        this.dataSource = new MatTableDataSource([]);
        this.route.data.subscribe(data => {
            if (!data['resolverResponse']) {
                return;
            }
        });

        this.subscriptions.alarms = this.apiService.getIoTSignalsObservable(IoTSignalStreamlType.Alarms).subscribe((iotSignals: MonitorIoTSignal[]) => {
            this.alarmsRows = iotSignals.map((iotSignal: BaseIoTSignal, i: number): AlarmRow => ({
                index: i,
                ...iotSignal
            }))
        })

        this.subscriptions.monitor = this.apiService.getIoTSignalsObservable(IoTSignalStreamlType.Monitor).subscribe((iotSignals: MonitorIoTSignal[]) => {
            const newAlarmsRows = iotSignals.reduce((acc, iotSignal: MonitorIoTSignal, i: number): AlarmRow[] => {
                if (iotSignal.flag !== IoTSignalFlag.OutOfBounds) return acc;

                const ioTSignalRow: AlarmRow = {
                    index: i,
                    ...iotSignal
                }

                acc.push(ioTSignalRow);

                return acc;
            }, [])

            // this.alarmsRows = this.alarmsRows.concat(newAlarmsRows);
            this.dataSource.data = this.alarmsRows;
        });
    }

    get isNoIoTSignals(): boolean {
        return this.alarmsRows.length === 0;
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
    }

    sortData(sort: Sort) {
        const data = this.dataSource.data.slice();
        if (!sort.active || sort.direction === '') {
            this.dataSource.data = this.alarmsRows;
            return;
        }

        const compare = (
            a: boolean | number | string | Moment,
            b: boolean | number | string | Moment,
            isAsc: boolean) => (a < b ? -1 : 1) * (isAsc ? 1 : -1);

        this.dataSource.data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'timestamp': return compare(a.timestamp, b.timestamp, isAsc);
                case 'value': return compare(a.value, b.value, isAsc);
                case 'type': return compare(a.type, b.type, isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
    }
}