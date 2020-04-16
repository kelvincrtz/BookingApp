import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule, TabsModule, BsDatepickerModule, PaginationModule, ButtonsModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { TimeAgoPipe } from 'time-ago-pipe';
import { DatePipe } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail-resolver';
import { MemberListResolver } from './_resolvers/member-list-resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit-resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { UserService } from './_services/user.service';
import { BookingService } from './_services/booking.service';
import { BookingListResolver } from './_resolvers/booking-list-resolver';
import { BookingListComponent } from './booking/booking-list/booking-list.component';
import { BookingFormComponent } from './booking/booking-form/booking-form.component';
import { PreventBookingFormUnsavedChanges } from './_guards/prevent-bookingform-unsaved-changes.guard';
import { BookingListForUserComponent } from './booking/booking-list-for-user/booking-list-for-user.component';
import { BookingListForUserResolver } from './_resolvers/booking-list-for-user-resolver';
import { BookingEditComponent } from './booking/booking-edit/booking-edit.component';
import { BookingEditResolver } from './_resolvers/booking-edit-resolver';
import { PreventEditBookingFormUnsavedChanges } from './_guards/prevent-editbookingform-unsaved-changes.guard';
import { BookingCardComponent } from './booking/booking-card/booking-card.component';
import { BookingEditStatusResolver } from './_resolvers/booking-edit-status-resolver';
import { BookingEditStatusComponent } from './booking/booking-edit-status/booking-edit-status.component';

export function tokenGetter() {
   return localStorage.getItem('token'); // Fixes problem with Tokens when logging in
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      BookingListComponent,
      BookingFormComponent,
      BookingListForUserComponent,
      BookingEditComponent,
      TimeAgoPipe,
      BookingCardComponent,
      BookingEditStatusComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TimepickerModule.forRoot(),
      TabsModule.forRoot(),
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      JwtModule.forRoot({
         config: {
            tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      AuthService,
      UserService,
      BookingService,
      ErrorInterceptorProvider,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      BookingListResolver,
      BookingListForUserResolver,
      BookingEditResolver,
      BookingEditStatusResolver,
      PreventUnsavedChanges,
      PreventBookingFormUnsavedChanges,
      PreventEditBookingFormUnsavedChanges,
      DatePipe
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
