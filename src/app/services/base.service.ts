import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class BaseService<T> {
    private _refreshItens$ = new Subject<void>();
    host = "http://www.centropopular.com.br/api/";
    baseURL: string = "";
    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        }),
    };

    get refreshItens$() {
        return this._refreshItens$;
    }

    constructor(endPoint: string, private http: HttpClient) {
        this.baseURL = this.host + endPoint;
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

    getAll(): Observable<T[]> {
        return this.http
            .get<T[]>(this.baseURL, this.httpOptions)
            .pipe(retry(2), catchError(this.handleError));
    }

    getById(Id: number): Observable<T> {
        return this.http.get<T>(`${this.baseURL}/${Id}`);
    }

    post(entity: T) {
        return this.http.post(this.baseURL, entity, this.httpOptions).pipe(
            tap(() => {
                this._refreshItens$.next();
            }),
            retry(2),
            catchError(this.handleError)
        );
    }

    put(entity: T) {
        return this.http.put(this.baseURL, entity);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseURL}/${id}`);
    }
}
