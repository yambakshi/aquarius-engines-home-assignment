import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IoTSignal } from '@models/iot-signal';
import { ApiService } from '@services/api.service';
import { IoTSignalFlag } from 'app/enums/iot-signal-flag.enum';

@Injectable({
  providedIn: 'root'
})
export class SignalsResolver implements Resolve<IoTSignal[]> {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IoTSignal[]> {
    const destinationRoute = (route as any)._routerState.url;
    const filter: { flag?: IoTSignalFlag, limit?: number } = {};
    switch (destinationRoute) {
      case '/alarms':
        filter.flag = IoTSignalFlag.OutOfBounds;
        break;

      default:
        filter.limit = 100;
        break;
    }

    return this.apiService.getIoTSignals(filter).pipe(catchError(err => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}