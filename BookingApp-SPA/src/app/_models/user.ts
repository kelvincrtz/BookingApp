import { Booking } from './booking';

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
}
