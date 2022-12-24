import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MonitorIoTSignal } from '@models/monitor-iot-signal';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MonitorResolver implements Resolve<MonitorIoTSignal[]> {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<MonitorIoTSignal[]> {
    return this.apiService.getMonitorData({ limit: 100 }).pipe(catchError(err => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}