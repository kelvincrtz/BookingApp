using System;

namespace BookingApp.API.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsApproved { get; set; }
        public string PublicId { get; set; }
        public int Rating { get; set; }
        public virtual User User { get; set; }
        public int UserId { get; set; }

        // From here //
        public virtual Booking Booking { get; set; }
        public int BookingId { get; set; }
        // To here //
    }
}