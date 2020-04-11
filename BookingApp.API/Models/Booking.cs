using System;

namespace BookingApp.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public DateTime When { get; set; }
        public DateTime FromTime { get; set; }
        public DateTime ToTime { get; set; }
        public DateTime DateAdded { get; set; }
        public string Location { get; set; }
        public bool IsEdited { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}