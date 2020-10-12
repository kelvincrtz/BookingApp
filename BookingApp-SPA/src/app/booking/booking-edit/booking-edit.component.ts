import { Component, OnInit, TemplateRef } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BookingService } from 'src/app/_services/booking.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrls: ['./booking-edit.component.css']
})
export class BookingEditComponent implements OnInit {
  booking: Booking;
  bookingToUpdate: Booking;
  bookingForm: FormGroup;
  bookingFromRepoId: any;

  modalRefConfirm: BsModalRef;

  isCollapsed = true;

  constructor(private bookingService: BookingService, private authService: AuthService, private alertify: AlertifyService,
              private router: Router, private route: ActivatedRoute, public bsModalRef: BsModalRef,
              private modalService: BsModalService) { }

  ngOnInit() {
    console.log(this.booking);
    this.bookingFromRepoId = this.booking.id;
    this.bookingForm = new FormGroup({
      when: new FormControl(this.booking.when, Validators.required),
      location: new FormControl(this.booking.location, Validators.required),
      fromTime: new FormControl(this.booking.fromTime, Validators.required),
      toTime: new FormControl(this.booking.toTime, Validators.required),
    });
  }

  updateBookingRequest(template: TemplateRef<any>) {
    this.modalRefConfirm = this.modalService.show(template, {class: 'modal-md'});
  }

  fixDate(d: Date): Date {
    d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
    return d;
  }

  cancel() {
    this.bsModalRef.hide();
  }

  confirm(): void {
    if (this.bookingForm.valid) {
      this.fixDate(new Date(this.bookingForm.get('fromTime').value));
      this.fixDate(new Date(this.bookingForm.get('toTime').value));
      this.bookingToUpdate = Object.assign({}, this.bookingForm.value);
      this.bookingService.updateBooking(this.authService.decodedToken.nameid, this.bookingFromRepoId, this.bookingToUpdate)
      .subscribe(next => {
        this.alertify.success('Booking request has been updated');
      }, error => {
        this.alertify.error('Error sending the request');
      });
    }
    this.modalRefConfirm.hide();
    this.bsModalRef.hide();
  }

  decline(): void {
    this.modalRefConfirm.hide();
    this.bsModalRef.hide();
    this.router.navigate(['/bookingsforuser/']);
  }

}
