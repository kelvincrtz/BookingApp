import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Booking } from '../_models/booking';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBookings(id: number, page?, itemsPerPage?, bookingParams?): Observable<PaginatedResult<Booking[]>> {
    const paginatedResult: PaginatedResult<Booking[]> = new PaginatedResult<Booking[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (bookingParams != null) {
      if (bookingParams.status != null) {
        params = params.append('status', bookingParams.status);
      }
      if (bookingParams.eventstoday != null) {
        params = params.append('eventstoday', bookingParams.eventstoday);
      }
      if (bookingParams.eventsthismonth != null) {
        params = params.append('eventsthismonth', bookingParams.eventsthismonth);
      }
    }

    return this.http.get<Booking[]>(this.baseUrl + 'users/' + id + '/bookings', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
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

  updateBookingStatus(id: number, bookingId: number, book: Booking) {
    return this.http.put<Booking>(this.baseUrl + 'users/' + id + '/bookings/status/' + bookingId, book);
  }

}
