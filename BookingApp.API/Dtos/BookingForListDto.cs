using System;

namespace BookingApp.API.Dtos
{
    public class BookingForListDto
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public DateTime When { get; set; }
        public string Location { get; set; }
    }
}