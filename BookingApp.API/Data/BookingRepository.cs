using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookingApp.API.Helpers;
using BookingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingApp.API.Data
{
    public class BookingRepository : IBookingRepository
    {
        private readonly DataContext _context;

        public BookingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity); // No need to make Async. At this point it is only saved in memory
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Booking> GetBooking(int id)
        {
            return await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<PagedList<Booking>> GetBookings(BookingParams bookingParams)
        {
            var bookings = _context.Bookings.Include(u => u.User).AsQueryable();

            return await PagedList<Booking>.CreateAsync(bookings, bookingParams.PageNumber, bookingParams.PageSize);
        }

        public async Task<IEnumerable<Booking>> GetBookingsForUser(int id)
        {
            return await _context.Bookings.Where(u => u.UserId == id).OrderByDescending(d => d.DateAdded).ToListAsync();
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(b => b.Bookings).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(b => b.Bookings).OrderByDescending(u => u.LastActive).AsQueryable();

            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                        default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}