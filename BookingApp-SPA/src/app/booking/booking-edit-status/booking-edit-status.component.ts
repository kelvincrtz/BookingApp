import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BookingService } from 'src/app/_services/booking.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-booking-edit-status',
  templateUrl: './booking-edit-status.component.html',
  styleUrls: ['./booking-edit-status.component.css']
})
export class BookingEditStatusComponent implements OnInit {
  booking: Booking;
  bookingStatus: Booking;
  bookingForm: FormGroup;

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private router: Router,
              private bookingService: BookingService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.booking = data.booking;
    });

    this.bookingForm = new FormGroup({
      status: new FormControl('', Validators.required),
    });
  }

  updateBookingStatusRequest() {
    console.log(this.bookingForm.value);
    if (this.bookingForm.valid) {
      this.bookingStatus = Object.assign({}, this.bookingForm.value);
      this.bookingService.updateBookingStatus(this.authService.decodedToken.nameid, this.booking.id, this.bookingStatus).subscribe(next => {
        this.alertify.success('Booking status has been updated');
        this.bookingForm.reset(this.booking);
      }, error => {
        this.alertify.error('Error sending the request');
      }, () => {
        this.router.navigate(['bookings']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/bookings/']);
  }

}
