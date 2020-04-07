using System;

namespace BookingApp.API.Dtos
{
    public class BookingForCreationDto
    {        
        public int UserId { get; set; }
        public string Status { get; set; }
        public DateTime When { get; set; } 
        public DateTime FromTime { get; set; } 
        public DateTime ToTime { get; set; } 
        public DateTime DateAdded { get; set; }
        public string Location { get; set; }

        public BookingForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}