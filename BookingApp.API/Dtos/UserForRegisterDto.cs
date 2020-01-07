using System.ComponentModel.DataAnnotations;

namespace BookingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required] // Validation required
        public string Username { get; set; }

        [Required] // Validation required
        [StringLength(20, MinimumLength = 8)] // Extra validation
        public string Password { get; set; }
    }
}