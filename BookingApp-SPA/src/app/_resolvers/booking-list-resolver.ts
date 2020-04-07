import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../_models/booking';
import { BookingService } from '../_services/booking.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class BookingListResolver implements Resolve<Booking[]> {

    constructor(private bookingService: BookingService, private router: Router, private alertify: AlertifyService,
                private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Booking[]> {
        return this.bookingService.getBookings(this.authService.decodedToken.nameId).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving bookings. ' + error);
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
