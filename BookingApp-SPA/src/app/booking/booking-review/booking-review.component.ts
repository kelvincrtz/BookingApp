import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from 'src/app/_models/booking';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { BookingService } from 'src/app/_services/booking.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css']
})
export class BookingReviewComponent implements OnInit {
  booking: Booking;

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private router: Router,
              private bookingService: BookingService, private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.booking = data.booking;
    });
  }

}
