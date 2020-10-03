import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class TempoService {

    host = " http://127.0.0.1:5000/";
    baseURL: string = "";
    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        }),
    };


    constructor(private http: HttpClient) {
    }

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error("1) An error occurred:", error.error.message);
        } else {
            console.error(
                `2)Backend returned code ${error.status}, ` +
                    `3)body was: ${error.error}`
            );
        }
        return throwError("4)Something bad happened; please try again later.");
    }

    getAll(): Observable<any> {
        return this.http
            .get(this.baseURL, this.httpOptions)
            .pipe(retry(2), catchError(this.handleError));
    }

    getBy(cidade: string): Observable<any> {
        return this.http.get(`${this.baseURL}/${cidade}`);
    }
}
