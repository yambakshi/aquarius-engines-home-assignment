import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '@models/user';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersResolver implements Resolve<User[]> {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.apiService.getUsers().pipe(catchError(err => {
      this.router.navigateByUrl('/404');
      return of(null);
    }));
  }
}