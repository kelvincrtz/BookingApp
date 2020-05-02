import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BookingService } from 'src/app/_services/booking.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrls: ['./booking-edit.component.css']
})
export class BookingEditComponent implements OnInit {
  booking: Booking;
  bookingForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  bookingFromRepoId: any;
  @Output() cancelRegister = new EventEmitter();

  bsValue = new Date(); // CLUE !!

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.bookingForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private bookingService: BookingService, private authService: AuthService, private alertify: AlertifyService,
              private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.booking = data.booking;
    });

    this.bookingFromRepoId = this.booking.id;

    this.bsConfig = {
      containerClass: 'theme-red'
    };

    this.bsValue = new Date(this.transformDate(this.booking.when)); // CLUE !!

    this.bookingForm = new FormGroup({
      when: new FormControl('', Validators.required),
      location: new FormControl(this.booking.location, Validators.required),
      fromTime: new FormControl(this.booking.fromTime, Validators.required),
      toTime: new FormControl(this.booking.toTime, Validators.required),
    }, this.dateValidator);
  }

  dateValidator(g: FormGroup) {
    return g.get('when').value >= Date.now() ? null : {errordate: true } ;
  }

  transformDate(date: any) {
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

  updateBookingRequest() {
    if (this.bookingForm.valid) {
      this.booking = Object.assign({}, this.bookingForm.value);
      this.bookingService.updateBooking(this.authService.decodedToken.nameid, this.bookingFromRepoId, this.booking).subscribe(next => {
        this.alertify.success('Booking request has been updated');
        this.bookingForm.reset(this.booking);
      }, error => {
        this.alertify.error('Error sending the request');
      }, () => {
        this.router.navigate(['/bookingsforuser/']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/bookingsforuser/']);
  }

}
