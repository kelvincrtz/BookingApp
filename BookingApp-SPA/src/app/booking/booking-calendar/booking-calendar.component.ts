import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';

import { BookingService } from 'src/app/_services/booking.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.css']
})
export class BookingCalendarComponent implements OnInit {
  activeDayIsOpen = true;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  dayEvents: CalendarEvent[] = [];
  dayRefresh: Subject<any> = new Subject();

  todaysDate: Date;

  clickedDate: Date;

  clickedColumn: number;
  clickMessage = '';

  constructor(private authService: AuthService, private booking: BookingService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getCalendarEvents((this.viewDate.getFullYear()), (this.viewDate.getMonth() + 1));
    this.todaysDate = new Date();
  }

  notValidClick(day) {
    // console.log(day);
    const obj: Array<any> = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < day.events.length; i++) {
         // tslint:disable-next-line: ban-types
        const dayEvent: Object = {
          id: day.events[i].id,
          title: day.events[i].title,
          start: day.events[i].start,
          end: day.events[i].end,
        };
        obj.push(dayEvent);
    }
    this.dayEvents = obj;
    this.dayRefresh.next();

    this.clickMessage = 'This day is already fully booked. Please choose a different date.';
    this.alertify.error('You selected a fully booked day');
    this.clickedDate  = null;
  }

  validClick(day: any) {
    this.clickedDate  = day;
    this.clickMessage = null;
  }

  expiredCell() {
    this.clickMessage = 'Sorry but we cannot book you on a expired date. Please select a different date.';
    this.alertify.error('This date is expired');
    this.clickedDate = null;
  }

  loopThroughEvents(res: any) {
    const obj: Array<any> = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < res.length; i++) {
      const startTime = new Date(res[i].fromTime);
      const endTime = new Date(res[i].toTime);
      // tslint:disable-next-line: ban-types
      const event: Object = {
        id: res[i].id,
        title: res[i].location,
        color: colors.red,
        start: addHours(startOfDay(new Date(res[i].when)), startTime.getHours()),
        end: addHours(startOfDay(new Date(res[i].when)), endTime.getHours()),
      };
      obj.push(event);
    }
    this.events = obj;
    this.refresh.next();
  }

  getCalendarEvents(year: number, month: number) {
    this.booking.getCalendarBookings(this.authService.decodedToken.nameid, year, month)
     .subscribe(bookings => {
      this.loopThroughEvents(bookings);
    }, error => {
      this.alertify.error(error);
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.getCalendarEvents((this.viewDate.getFullYear()), (this.viewDate.getMonth() + 1));
  }
}
