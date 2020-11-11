import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingService } from '../_services/booking.service';
import { AuthService } from '../_services/auth.service';
import { Review } from '../_models/review';

@Injectable()
export class ReviewAdminListResolver implements Resolve<Review[]> {

    constructor(private bookingService: BookingService, private router: Router, private route: ActivatedRoute,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Review[]> {
        return this.bookingService.getReviewsForAdmin(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error(error);
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
