import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IoTSignal } from '@models/iot-signal';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private iotSignalsSubject: Subject<IoTSignal[]>;
    private httpOptions: {} = {
        headers: {},
        responseType: 'json'
    }

    constructor(
        private http: HttpClient,) {
        this.iotSignalsSubject = new Subject<IoTSignal[]>();
    }

    getIoTSignalsObservable(): Observable<IoTSignal[]> {
        return this.iotSignalsSubject.asObservable();
    }

    setIoTSignals(iotSignals: IoTSignal[]): void {
        this.iotSignalsSubject.next(iotSignals);
    }

    getIoTSignals(): any {
        return this.http.get('/api/iotsignals', this.httpOptions)
            .pipe(
                map((res: any) => {
                    this.setIoTSignals(res);
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