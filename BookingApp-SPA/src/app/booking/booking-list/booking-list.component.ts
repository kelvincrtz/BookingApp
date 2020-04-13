import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[];
  pagination: Pagination;

  constructor(private bookingService: BookingService, private alertify: AlertifyService, private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.bookings = data.bookings.result;
      this.pagination = data.bookings.pagination;
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBookings(this.pagination.currentPage);
  }

  loadBookings(currentPage: any) {
    this.bookingService.getBookings(this.authService.decodedToken.nameid, currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<Booking[]>) => {
      this.bookings = res.result;
      this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
}
