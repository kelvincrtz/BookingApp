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

  createBooking(id: number, book: Booking) {
    return this.http.post<Booking>(this.baseUrl + 'users/' + id + '/bookings', book);
  }

  getBookingsForUser(id: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl + 'users/' + id + '/bookings/thread');
  }

  updateBooking(id: number, bookingId: number, book: Booking) {
    return this.http.put<Booking>(this.baseUrl + 'users/' + id + '/bookings/' + bookingId, book);
  }

  deleteBooking(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/bookings/' + id);
  }

}
