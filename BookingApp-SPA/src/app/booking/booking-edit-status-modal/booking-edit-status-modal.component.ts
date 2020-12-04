import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Booking } from 'src/app/_models/booking';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { BookingService } from 'src/app/_services/booking.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-booking-edit-status-modal',
  templateUrl: './booking-edit-status-modal.component.html',
  styleUrls: ['./booking-edit-status-modal.component.css']
})
export class BookingEditStatusModalComponent implements OnInit {
  @Output() bookingBackToBookingsUser = new EventEmitter();
  event: CalendarEvent<any>;
  bookingToUpdate: Booking;
  bookingForm: FormGroup;
  bookingFromRepoId: any;

  modalRefConfirm: BsModalRef;

  // From old class
  messageForAdmin: any;
  authDecodeName: any;
  user: User;
  booking: Booking;
  bookingToGetUser: Booking;
  bookingStatus: Booking;

  @ViewChild('template2', {static: true}) template2: TemplateRef<any>;
  modalRef: BsModalRef;

  constructor(private bookingService: BookingService, private authService: AuthService, private alertify: AlertifyService,
              private router: Router, private route: ActivatedRoute, public bsModalRef: BsModalRef,
              private modalService: BsModalService, private userService: UserService) { }

  ngOnInit() {

    console.log(this.event.title);

    // From old class
    this.bookingForm = new FormGroup({
      status: new FormControl('', Validators.required),
    });

    this.authDecodeName = this.authService.decodedToken.unique_name;

    this.loadUser();

    this.bookingService.markSeenByAdmin(this.authService.decodedToken.nameid, +this.event.id);

    // From old class
  }


  updateBookingStatusRequest() {
    if (this.bookingForm.get('status').value === this.booking.status) {
        this.messageForAdmin = 'This request has already been ' + this.bookingForm.get('status').value.toLowerCase() + ' by you!';
        this.modalRef = this.modalService.show(this.template2, {class: 'modal-sm'});
        return this.modalRef;
    }

    if (this.bookingForm.valid) {
      this.bookingStatus = Object.assign({}, this.bookingForm.value);
      this.bookingService.updateBookingStatus(this.authService.decodedToken.nameid, this.booking.id, this.bookingStatus).subscribe(next => {
        this.alertify.success('Booking status has been updated');
        // this.bookingForm.reset(this.booking);
      }, error => {
        this.alertify.error('Error sending the request');
      }, () => {
        this.router.navigate(['bookings']);
      });
    }
  }

  confirm() {

  }

  cancel() {

  }

  decline(): void {
    this.modalRefConfirm.hide();
    this.bsModalRef.hide();
    this.router.navigate(['/calendar/']);
  }

  loadUser() {
    /*
    this.bookingService.getBooking(this.authService.decodedToken.nameid, +this.event.id).subscribe((booking: Booking) => {
      this.bookingToGetUser = booking;
    }, error => {
      console.log(error);
    });

    /* this.userService.getUser(this.booking.userId).subscribe((user: User) => {
      this.user = user;
    }, error => {
      console.log(error);
    }); */
  }

}
