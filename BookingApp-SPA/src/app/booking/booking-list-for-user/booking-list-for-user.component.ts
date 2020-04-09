import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-list-for-user',
  templateUrl: './booking-list-for-user.component.html',
  styleUrls: ['./booking-list-for-user.component.css']
})
export class BookingListForUserComponent implements OnInit {
  bookings: Booking[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.bookings = data.bookings;
    });
  }

}
