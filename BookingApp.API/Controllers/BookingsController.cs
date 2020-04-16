using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BookingApp.API.Data;
using BookingApp.API.Dtos;
using BookingApp.API.Helpers;
using BookingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingApp.API.Controllers
{
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
        public async Task<IActionResult> GetBookings([FromQuery]BookingParams bookingParams)
        {
            var bookings = await _repo.GetBookings(bookingParams);

            var bookingsToReturn = _mapper.Map<IEnumerable<BookingForListDto>>(bookings);

            Response.AddPagination(bookings.CurrentPage, bookings.PageSize, bookings.TotalCount, bookings.TotalPages);

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int userId, int id, BookingForUpdateDto bookingForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var bookingFromRepo = await _repo.GetBooking(id);

            if (bookingFromRepo == null)
                return BadRequest();

            if (bookingFromRepo.UserId != userId)
                return Unauthorized();
            
            _mapper.Map(bookingForUpdateDto, bookingFromRepo); 
            // Be careful here. Make sure no await, no task. Just classes or else mapping exception eventhough you have already did automapper mapping

            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating booking {id} failed on save");
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateBookingStatus(int userId, int id, BookingForUpdateStatusDto bookingForUpdateStatusDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var bookingFromRepo = await _repo.GetBooking(id);

            if (bookingFromRepo == null)
                return BadRequest();

            // Check if Admin ID is the one updating the request. Implement this after Identity and Role Management
                 
            
            _mapper.Map(bookingForUpdateStatusDto, bookingFromRepo); 
            // Be careful here. Make sure no await, no task. Just classes or else mapping exception eventhough you have already did automapper mapping

            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating booking status {id} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var bookingFromRepo = await _repo.GetBooking(id);

            if (bookingFromRepo == null)
                return BadRequest();

            if (bookingFromRepo.UserId.Equals(userId)) {
                _repo.Delete(bookingFromRepo);
            } else {
                return Unauthorized();
            }

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Error deleting the request");
        }
    }
}