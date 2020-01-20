import { Time } from '@angular/common';
import { User } from './user';


export interface Booking {
    id: number;
    status: string;
    when: Date;
    fromTime: Time;
    ToTime: Time;
    location: string;
    user: User;
    userId: Number;
}

