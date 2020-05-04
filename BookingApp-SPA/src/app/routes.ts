import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail-resolver';
import { MemberListResolver } from './_resolvers/member-list-resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit-resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { BookingListComponent } from './booking/booking-list/booking-list.component';
import { BookingListResolver } from './_resolvers/booking-list-resolver';
import { BookingFormComponent } from './booking/booking-form/booking-form.component';
import { PreventBookingFormUnsavedChanges } from './_guards/prevent-bookingform-unsaved-changes.guard';
import { BookingListForUserComponent } from './booking/booking-list-for-user/booking-list-for-user.component';
import { BookingListForUserResolver } from './_resolvers/booking-list-for-user-resolver';
import { BookingEditComponent } from './booking/booking-edit/booking-edit.component';
import { BookingEditResolver } from './_resolvers/booking-edit-resolver';
import { PreventEditBookingFormUnsavedChanges } from './_guards/prevent-editbookingform-unsaved-changes.guard';
import { BookingEditStatusResolver } from './_resolvers/booking-edit-status-resolver';
import { BookingEditStatusComponent } from './booking/booking-edit-status/booking-edit-status.component';
import { MessagesResolver } from './_resolvers/messages-resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
            { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            { path: 'member/edit', component: MemberEditComponent, resolve: {user: MemberEditResolver},
                canDeactivate: [PreventUnsavedChanges]},
            { path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver}},
            { path: 'bookings', component: BookingListComponent, resolve: {bookings: BookingListResolver}},
            { path: 'bookingrequest', component: BookingFormComponent, resolve: null,
                canDeactivate: [PreventBookingFormUnsavedChanges]},
            { path: 'bookingsforuser', component: BookingListForUserComponent, resolve: {bookings: BookingListForUserResolver}},
            { path: 'booking/edit/:id', component: BookingEditComponent, resolve: {booking: BookingEditResolver}},
            { path: 'booking/edit/status/:id', component: BookingEditStatusComponent, resolve: {booking: BookingEditStatusResolver}},
            { path: 'admin', component: AdminPanelComponent, data: {roles: ['Admin', 'Moderator']}}
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full'}
];
