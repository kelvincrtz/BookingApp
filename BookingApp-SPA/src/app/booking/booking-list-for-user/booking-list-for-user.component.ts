import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private booking: BookingService, private alertify: AlertifyService,
              private modalService: BsModalService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {

    // this.loadBookingsForUser();

    this.route.data.subscribe(data => {
      this.bookings = data.bookings.result;
      this.pagination = data.bookings.pagination;
    });

  }

  loadBookingsForUser() {
    this.booking.getBookingsForUser(this.userId, null, null, null).subscribe(bookings => {
      this.bookings = bookings.result;
      this.pagination = bookings.pagination;
    }, error => {
        this.alertify.error(error);
    });
  }

  loadBookingsForUserPagination() {
    this.booking.getBookingsForUser(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, null)
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

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBookingsForUserPagination();
  }

}
