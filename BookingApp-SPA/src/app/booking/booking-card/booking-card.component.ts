import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/_models/booking';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css']
})
export class BookingCardComponent implements OnInit {
  @Input() booking: Booking;

  constructor() { }

  ngOnInit() {
  }

}
