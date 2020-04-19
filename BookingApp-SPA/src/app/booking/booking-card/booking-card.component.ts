import { Component, OnInit, Input } from '@angular/core';
import { Booking } from 'src/app/_models/booking';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css']
})
export class BookingCardComponent implements OnInit {
  @Input() booking: Booking;
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.getUser(this.booking.userId).subscribe((user: User) => {
      this.user = user;
    }, error => {
      console.log(error);
    });
  }

}
