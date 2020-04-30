import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Booking } from 'src/app/_models/booking';
import { Message } from 'src/app/_models/message';
import { BookingService } from 'src/app/_services/booking.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  messagesReceived: Message[];
  bookings: Booking[];
  authDecodeToken: any;

  dismissible = true;
  alerts: any;

  constructor(private route: ActivatedRoute, private authService: AuthService,
              private bookingService: BookingService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
      this.messagesReceived = data.user.messagesReceived;
    });

    this.authDecodeToken = this.authService.decodedToken.nameid;

    this.loadNofifyBookings();
  }

  onClosed(bookingId: any) {
    this.markAsSeenNotify(bookingId);
    this.bookings.splice(this.bookings.findIndex(m => m.id === bookingId), 1);
  }

  loadNofifyBookings() {
    this.bookingService.getNotifyBookings(this.authService.decodedToken.nameid)
      .subscribe((booking: any) => {
      this.bookings = booking;
    }, error => {
      console.log(error);
    });
  }

  markAsSeenNotify(bookingId: number) {
    this.bookingService.markSeenNotify(this.authService.decodedToken.nameid, bookingId);
  }
}
