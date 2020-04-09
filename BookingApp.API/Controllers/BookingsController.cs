using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BookingApp.API.Data;
using BookingApp.API.Dtos;
using BookingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingApp.API.Controllers
{
    // [ServiceFilter(typeof(LogUserActivity))] TO BE CONTINUED
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;
        public BookingsController(IBookingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name = "GetBooking")]
        public async Task<IActionResult> GetBooking(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var booking = await _repo.GetBooking(id);

            if (booking == null)
                return NotFound();

            var bookingToReturn = _mapper.Map<BookingForDetailedDto>(booking);

            return Ok(bookingToReturn);
        }

        [HttpGet]
        public async Task<IActionResult> GetBookings()
        {

            var bookings = await _repo.GetBookings();

            var bookingsToReturn = _mapper.Map<IEnumerable<BookingForListDto>>(bookings);

            return Ok(bookingsToReturn);
        }

        [HttpGet("thread")]
        public async Task<IActionResult> GetBookingsForUser(int userId)
        {
            var bookings = await _repo.GetBookingsForUser(userId);

            var bookingsToReturn = _mapper.Map<IEnumerable<BookingForDetailedDto>>(bookings);

            return Ok(bookingsToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking(int userId, BookingForCreationDto bookingForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(userId);

            bookingForCreationDto.UserId = userId;

            bookingForCreationDto.Status = "Request Sent";

            var booking = _mapper.Map<Booking>(bookingForCreationDto);

            userFromRepo.Bookings.Add(booking);

            if (await _repo.SaveAll()) {
                var bookingForReturn = _mapper.Map<BookingForDetailedDto>(booking);
                return CreatedAtRoute("GetBooking", new {userId, id = booking.Id}, bookingForReturn);
            }
            
            throw new Exception("Creating the booking failed on save");
        }
    }
}