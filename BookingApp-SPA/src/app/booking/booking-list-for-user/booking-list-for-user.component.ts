import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/_services/booking.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-booking-list-for-user',
  templateUrl: './booking-list-for-user.component.html',
  styleUrls: ['./booking-list-for-user.component.css']
})
export class BookingListForUserComponent implements OnInit {
  @Input() userId: any;
  bookings: Booking[];

  constructor(private route: ActivatedRoute, private booking: BookingService, private alertify: AlertifyService) { }

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

}
