import { Booking } from './booking';
import { Message } from './message';

export interface User {
    id: number;
    username: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    city: string;
    country: string;
    fullName: string;
    contactNumber: string;
    bookings?: Booking[];
    messages?: Message[];
}
