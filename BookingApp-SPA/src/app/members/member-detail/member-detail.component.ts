import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Booking } from 'src/app/_models/booking';
import { BookingService } from 'src/app/_services/booking.service';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  bookings: Booking[];
  messages: Message[];
  authDecodeToken: any;

  dismissible = true;
  alerts: any;

  constructor(private route: ActivatedRoute, private authService: AuthService,
              private bookingService: BookingService, private messageService: MessageService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });

    this.authDecodeToken = this.authService.decodedToken.nameid;

    this.loadNofifyBookings();
    this.loadNofifyMessages();
  }

  onClosed(bookingId: any) {
    this.markAsSeenNotify(bookingId);
    this.bookings.splice(this.bookings.findIndex(m => m.id === bookingId), 1);
  }

  onClosedMessage(messageId: any, recipientId: any) {
    this.messageService.markNotified(recipientId, messageId);
    this.messages.splice(this.messages.findIndex(m => m.id === messageId), 1);
  }

  loadNofifyBookings() {
    this.bookingService.getNotifyBookings(this.authService.decodedToken.nameid)
      .subscribe((booking: any) => {
      this.bookings = booking;
    }, error => {
      console.log(error);
    });
  }

  loadNofifyMessages() {
    this.messageService.getNotifyMessages(this.authService.decodedToken.nameid)
      .subscribe((message: any) => {
      this.messages = message;
    }, error => {
      console.log(error);
    });
  }

  markMessageNotified(messageId: any, recipientId: any) {
    this.messageService.markNotified(recipientId, messageId);
    this.messages.splice(this.messages.findIndex(m => m.id === messageId), 1);
  }

  markAsSeenNotify(bookingId: number) {
    this.bookingService.markSeenNotify(this.authService.decodedToken.nameid, bookingId);
  }
}
