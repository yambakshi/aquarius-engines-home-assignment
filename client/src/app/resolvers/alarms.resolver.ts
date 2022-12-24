import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { BaseIoTSignal } from '@models/base-iot-signal';

@Injectable({
  providedIn: 'root'
})
export class AlarmsResolver implements Resolve<BaseIoTSignal[]> {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<BaseIoTSignal[]> {
    return this.apiService.getAlarms().pipe(catchError(err => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}