import { ErrorComponent } from './error/error.component';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwIfEmpty } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = 'An unknown error occured';
                if (error.error.message) {
                    errorMsg = error.error.message;
                }
                this.dialog.open(ErrorComponent , {data : {message: errorMsg}});
                return throwError(error);
            })
        );
    }
}
