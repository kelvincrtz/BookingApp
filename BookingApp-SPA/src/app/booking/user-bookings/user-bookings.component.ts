import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {
  bookingForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.bookingForm = new FormGroup({
      when: new FormControl(),
      location: new FormControl(),
      fromTime: new FormControl(),
      toTime: new FormControl(),
    });
  }

  registerBooking() {
    console.log(this.bookingForm.value);
  }

  cancel() {

  }

}
