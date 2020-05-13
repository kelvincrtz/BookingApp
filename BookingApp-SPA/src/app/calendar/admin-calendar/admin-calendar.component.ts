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
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
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
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.css']
})
export class AdminCalendarComponent implements OnInit {
  activeDayIsOpen = true;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        // this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[];

  constructor(private authService: AuthService, private booking: BookingService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getCalendarEvents((this.viewDate.getFullYear()), (this.viewDate.getMonth() + 1));
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
        color: colors.blue,
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
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.getCalendarEvents((this.viewDate.getFullYear()), (this.viewDate.getMonth() + 1));
  }

}
