using System.Collections.Generic;
using System.Threading.Tasks;
using BookingApp.API.Models;

namespace BookingApp.API.Data
{
    public interface IBookingRepository
    {
         void Add<T>(T entity) where T: class; // T for Generic classes
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int id);
         Task<IEnumerable<Booking>> GetBookings();
         Task<Booking> GetBooking(int id);
         Task<IEnumerable<Booking>> GetBookingsForUser(int id);
    }
}