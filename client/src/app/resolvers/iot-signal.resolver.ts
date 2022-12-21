import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IoTSignal } from '@models/iot-signal';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SignalsResolver implements Resolve<IoTSignal[]> {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IoTSignal[]> {
    return this.apiService.getIoTSignals().pipe(catchError(err => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}