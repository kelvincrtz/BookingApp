using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public async Task<IEnumerable<Booking>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        public Task<IEnumerable<Booking>> GetBookingsForUser(int id)
        {
            // TO BE CONTINUED SECTION
            var bookings = _context.Bookings.AsQueryable();

            bookings = bookings.Where(u => u.UserId == id);

            bookings = bookings.OrderByDescending(d => d.DateAdded);

            return null;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(b => b.Bookings).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(b => b.Bookings).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}