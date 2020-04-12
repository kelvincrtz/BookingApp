import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';

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

  constructor(private booking: BookingService, private alertify: AlertifyService,
              private modalService: BsModalService, private authService: AuthService) { }

  ngOnInit() {

    this.loadBookingsForUser();

    /*
    this.route.data.subscribe(data => {
      this.bookings = data.bookings;
    });
    */
  }

  loadBookingsForUser() {
    this.booking.getBookingsForUser(this.userId).subscribe(bookings => {
      this.bookings = bookings;
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

}
