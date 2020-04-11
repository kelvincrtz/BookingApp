using System;

namespace BookingApp.API.Dtos
{
    public class BookingForDetailedDto
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public DateTime When { get; set; }
        public DateTime FromTime { get; set; }
        public DateTime ToTime { get; set; }
        public string Location { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsEdited { get; set; }
    }
}