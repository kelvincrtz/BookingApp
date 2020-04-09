export interface Booking {
    id: number;
    status: string;
    when: Date;
    fromTime: Date;
    toTime: Date;
    location: string;
    dateAdded: Date;
    userId: number;
}
