import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingEditComponent } from '../booking-edit/booking-edit.component';

@Component({
  selector: 'app-booking-list-for-user',
  templateUrl: './booking-list-for-user.component.html',
  styleUrls: ['./booking-list-for-user.component.css']
})
export class BookingListForUserComponent implements OnInit {
  @Input() userId: any;
  @Input() authDecodeToken: any;
  bookings: Booking[];
  modalRef: BsModalRef;
  message: string;

  pageNumber = 1;
  pageSize = 8;
  pagination: Pagination;

  name: any;
  bookingParams: any = {};

  isCollapsed = true;

  date: Date = new Date();

  bsModalRef: BsModalRef;

  todaysDate: Date;

  constructor(private booking: BookingService, private alertify: AlertifyService, private router: Router,
              private modalService: BsModalService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.bookings = data.bookings.result;
      this.pagination = data.bookings.pagination;
    });

    this.name = this.authService.decodedToken.unique_name;

    this.bookingParams.orderBy = 'dateadded';

    this.bookingParams.all = true;

    this.todaysDate = new Date();
  }

  loadBookings() {
    this.booking.getBookingsForUser(this.authService.decodedToken.nameid, this.pagination.currentPage,
       this.pagination.itemsPerPage, this.bookingParams)
      .subscribe((res: PaginatedResult<Booking[]>) => {
      this.bookings = res.result;
      this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  deleteBooking(id: number) {
    this.booking.deleteBooking(this.authService.decodedToken.nameid, id).subscribe(() => {
      this.bookings.splice(this.bookings.findIndex(b => b.id === id), 1);
      this.alertify.success('Booking has been deleted');
      }, error => {
        this.alertify.error('Failed to delete booking');
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

  confirm(id: number): void {
    this.deleteBooking(id);
    this.modalRef.hide();
  }

  decline(id: number): void {
    this.modalRef.hide();
    this.alertify.error('Cancelled');
  }

  review(bookingId: number): void {
    this.router.navigate(['/booking/review/', bookingId]);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBookings();
  }

  loadMonth() {
    this.bookingParams.eventstoday = false;
    this.bookingParams.all = false;
    this.bookingParams.eventstomorrow = false;
    this.bookingParams.eventsthismonth = true;
    this.pagination.currentPage = 1;
    this.loadBookings();
  }

  loadToday() {
    this.bookingParams.eventsthismonth = false;
    this.bookingParams.all = false;
    this.bookingParams.eventstomorrow = false;
    this.bookingParams.eventstoday = true;
    this.pagination.currentPage = 1;
    this.loadBookings();
  }

  loadTomorrow() {
    this.bookingParams.eventsthismonth = false;
    this.bookingParams.all = false;
    this.bookingParams.eventstoday = false;
    this.bookingParams.eventstomorrow = true;
    this.pagination.currentPage = 1;
    this.loadBookings();
  }

  loadAll() {
    this.bookingParams.eventsthismonth = false;
    this.bookingParams.eventstoday = false;
    this.bookingParams.eventstomorrow = false;
    this.bookingParams.all = true;
    this.pagination.currentPage = 1;
    this.loadBookings();
  }

  loadOrderBy() {
    this.pagination.currentPage = 1;
    this.loadBookings();
  }

  openEditModal(booking: Booking): void {
    const initialState = {
        booking
    };

    this.bsModalRef = this.modalService.show(BookingEditComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';


    this.bsModalRef.content.bookingBackToBookingsUser.subscribe((value: Booking) => {
      this.bookings.splice(this.bookings.findIndex(b => b.id === booking.id), 1);
      this.bookings.unshift(value);
    }, error => {
        this.alertify.error('Failed to update booking' + error);
    });
  }

  fixDate(d: Date): Date {
    d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
    return d;
  }

}
