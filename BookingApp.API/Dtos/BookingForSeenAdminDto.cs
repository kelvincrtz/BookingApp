namespace BookingApp.API.Dtos
{
    public class BookingForSeenAdminDto
    {
        public bool IsSeenByAdmin { get; set; }

        public BookingForSeenAdminDto()
        {   
            this.IsSeenByAdmin = true;
        }
    }
}