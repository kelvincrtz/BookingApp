using System.Collections.Generic;
using System.Threading.Tasks;
using BookingApp.API.Helpers;
using BookingApp.API.Models;

namespace BookingApp.API.Data
{
    public interface IBookingRepository
    {
         void Add<T>(T entity) where T: class; // T for Generic classes
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<PagedList<User>> GetUsers(UserParams userParams);
         Task<User> GetUser(int id);
         Task<PagedList<Booking>> GetBookings(BookingParams bookingParams);
         Task<Booking> GetBooking(int id);
         Task<PagedList<Booking>> GetBookingsForUser(int id, BookingParams bookingParams);
         Task<Message> GetMessage(int id);
         Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
         Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}