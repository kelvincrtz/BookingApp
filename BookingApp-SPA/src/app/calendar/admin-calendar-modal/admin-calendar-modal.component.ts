import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-admin-calendar-modal',
  templateUrl: './admin-calendar-modal.component.html',
  styleUrls: ['./admin-calendar-modal.component.css']
})
export class AdminCalendarModalComponent implements OnInit {
  closeBtnName: string;
  event: CalendarEvent;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
