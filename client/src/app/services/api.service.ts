import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '@models/user';
import { ApiResponse } from '@models/responses';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private usersSubject: Subject<User[]>;
    private httpOptions: {} = {
        headers: {},
        responseType: 'json'
    }

    constructor(
        private http: HttpClient,) {
        this.usersSubject = new Subject<User[]>();
    }

    getUsersObservable(): Observable<User[]> {
        return this.usersSubject.asObservable();
    }

    setUsers(users: User[]): void {
        this.usersSubject.next(users);
    }

    getUsers(): any {
        return this.http.get('/api/users', this.httpOptions)
            .pipe(
                map((res: any) => {
                    this.setUsers(res);
                    return res;
                }),
                catchError(this.handleError));
    }

    saveUser(user: User): any {
        return this.http.put<ApiResponse>('/api/users', user, this.httpOptions)
            .pipe(
                map((res: any) => {
                    this.setUsers([res.user]);
                    return res;
                }),
                catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof HttpErrorResponse) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }

        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
    }
}