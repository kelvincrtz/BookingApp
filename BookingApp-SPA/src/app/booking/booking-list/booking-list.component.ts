import { Component, OnInit, ViewChild } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[];
  statusList = [{value: 'Approved', display: 'Approved'}, {value: 'Declined', display: 'Declined'}, {value: 'Request Sent',
  display: 'Pending'}];
  pagination: Pagination;
  bookingParams: any = {};
  @ViewChild('form', {static: true}) form: NgForm;

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
    this.loadBookings();
  }

  resetFilters() {
    this.form.reset(this.bookings);
    this.bookingService.getBookings(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage)
     .subscribe((res: PaginatedResult<Booking[]>) => {
     this.bookings = res.result;
     this.pagination = res.pagination;
     }, error => {
       this.alertify.error(error);
     });
  }

  loadBookings() {
    this.bookingService.getBookings(this.authService.decodedToken.nameid, this.pagination.currentPage,
       this.pagination.itemsPerPage, this.bookingParams)
      .subscribe((res: PaginatedResult<Booking[]>) => {
      this.bookings = res.result;
      this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
}
