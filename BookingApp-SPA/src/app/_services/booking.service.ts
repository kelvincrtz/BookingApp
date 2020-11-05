import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Booking } from '../_models/booking';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Review } from '../_models/review';

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
      if (bookingParams.eventstomorrow != null) {
        params = params.append('eventstomorrow', bookingParams.eventstomorrow);
      }
      if (bookingParams.eventsthismonth != null) {
        params = params.append('eventsthismonth', bookingParams.eventsthismonth);
      }
      if (bookingParams.orderBy != null) {
        params = params.append('orderby', bookingParams.orderBy);
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

  getCalendarBookings(userId: number, year: number, month: number): Observable<Booking> {
    return this.http.get<Booking>(this.baseUrl + 'users/' + userId + '/bookings/calendar/' + year + '/' + month) ;
  }

  getBooking(id: number, bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(this.baseUrl + 'users/' + id + '/bookings/' + bookingId) ;
  }

  getBookingForReview(id: number, bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(this.baseUrl + 'users/' + id + '/bookings/' + bookingId + '/review') ;
  }

  getNotifyBookings(userId: number): Observable<Booking> {
    return this.http.get<Booking>(this.baseUrl + 'users/' + userId + '/bookings/notify') ;
  }

  createBooking(id: number, book: Booking) {
    return this.http.post<Booking>(this.baseUrl + 'users/' + id + '/bookings', book);
  }

  getBookingsForUser(id: number, page?, itemsPerPage?, bookingParams?): Observable<PaginatedResult<Booking[]>> {
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
      if (bookingParams.eventstomorrow != null) {
        params = params.append('eventstomorrow', bookingParams.eventstomorrow);
      }
      if (bookingParams.eventsthismonth != null) {
        params = params.append('eventsthismonth', bookingParams.eventsthismonth);
      }
      if (bookingParams.orderBy != null) {
        params = params.append('orderby', bookingParams.orderBy);
      }
    }

    return this.http.get<Booking[]>(this.baseUrl + 'users/' + id + '/bookings/thread', { observe: 'response', params})
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

  updateBooking(id: number, bookingId: number, book: Booking) {
    return this.http.put<Booking>(this.baseUrl + 'users/' + id + '/bookings/' + bookingId, book);
  }

  deleteBooking(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/bookings/' + id);
  }

  updateBookingStatus(id: number, bookingId: number, book: Booking) {
    return this.http.put<Booking>(this.baseUrl + 'users/' + id + '/bookings/status/' + bookingId, book);
  }

  markSeenNotify(userId: number, bookingId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/bookings/seennotify/' + bookingId, {}).subscribe();
  }

  markSeenByAdmin(userId: number, bookingId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/bookings/seenbyadmin/' + bookingId, {}).subscribe();
  }

  createReview(userId: number, review: Review) {
    return this.http.post<Booking>(this.baseUrl + 'reviews/users/' + userId, review);
  }
}
