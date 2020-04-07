import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../_models/booking';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBookings(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl + 'users/' + id + '/bookings');
  }

  getBooking(id: number, bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(this.baseUrl + 'users/' + id + '/bookings/' + bookingId) ;
  }

}
