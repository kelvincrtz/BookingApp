import { Component, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
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
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BookingService } from 'src/app/_services/booking.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

const colors: any = {
  red: {
    primary: '#E00000',
    secondary: '#E00000',
  },
  green: {
    primary: '#90EE90',
    secondary: '#90EE90',
  },
  dark: {
    primary: '#989898',
    secondary: '#989898',
  },
};

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.css']
})
export class AdminCalendarComponent implements OnInit {
  activeDayIsOpen = true;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalRef: BsModalRef;

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[];

  constructor(private authService: AuthService, private booking: BookingService, private alertify: AlertifyService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getCalendarEvents((this.viewDate.getFullYear()), (this.viewDate.getMonth() + 1));
  }

  loopThroughEvents(res: any) {
    const obj: Array<any> = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < res.length; i++) {
      const dayTime = new Date(res[i].when);
      const startTime = new Date(res[i].fromTime);
      const endTime = new Date(res[i].toTime);
      // tslint:disable-next-line: ban-types
      const event: Object = {
        id: res[i].id,
        title: res[i].location,
        meta: res[i].status,
        start: new Date(dayTime.getFullYear(), dayTime.getMonth(), dayTime.getDate(), startTime.getHours(), startTime.getMinutes()),
        end: new Date(dayTime.getFullYear(), dayTime.getMonth(), dayTime.getDate(), endTime.getHours(), endTime.getMinutes()),
      };
      obj.push(event);
    }
    this.events = obj;
    this.refresh.next();

    this.colorEvents(this.events);
  }

  getCalendarEvents(year: number, month: number) {
    this.booking.getCalendarBookings(this.authService.decodedToken.nameid, year, month)
     .subscribe(bookings => {
      this.loopThroughEvents(bookings);
    }, error => {
      this.alertify.error(error);
    });
  }

  colorEvents(events: CalendarEvent[]) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < events.length; i++) {
      if (events[i].meta === 'Approved') {
          events[i].color = colors.green;
      }
      if (events[i].meta === 'Declined') {
        events[i].color = colors.red;
      }
      if (events[i].meta === 'Pending') {
        events[i].color = colors.dark;
      }
    }

    this.events = events;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.getCalendarEvents((this.viewDate.getFullYear()), (this.viewDate.getMonth() + 1));
  }

  openModal(event: CalendarEvent, template: TemplateRef<any>): void {
    console.log(event);
  }
}
