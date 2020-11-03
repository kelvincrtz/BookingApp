using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BookingApp.API.Data;
using BookingApp.API.Dtos;
using BookingApp.API.Helpers;
using BookingApp.API.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BookingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IBookingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public ReviewsController(IBookingRepository repo, IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repo;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetReview")]
        public async Task<IActionResult> GetReview(int id)
        {
            var reviewFromRepo =  await _repo.GetReview(id);

            var review = _mapper.Map<ReviewForReturnDto>(reviewFromRepo);

            return Ok(review);
        }

        [HttpPost]
        public async Task<IActionResult> AddReviewForUser(int userId, [FromForm]ReviewForCreationDto reviewForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

             var userFromRepo = await _repo.GetUser(userId);
             
             var file = reviewForCreationDto.File;

             var uploadResult = new ImageUploadResult();
            
            
             if (file.Length > 0) 
             {
                 using (var stream = file.OpenReadStream())
                 {
                     var uploadParams = new ImageUploadParams()
                     {
                         File = new FileDescription(file.Name, stream),
                         Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                     };

                    uploadResult = _cloudinary.Upload(uploadParams);
                 }
             }

             reviewForCreationDto.Url = uploadResult.Url.ToString();
             reviewForCreationDto.PublicId = uploadResult.PublicId;

             var review = _mapper.Map<Review>(reviewForCreationDto);

             //Console.WriteLine("Number is: "+ userFromRepo.Bookings.Count);
             
             userFromRepo.Reviews.Add(review);

             if (await _repo.SaveAll())
             {
                 
                 var reviewToReturn = _mapper.Map<ReviewForReturnDto>(review);

                 return CreatedAtRoute("GetReview", new {userId = userId, id = review.Id }, reviewToReturn);
                 
             }

             return BadRequest("Could not add the photo review");
        }  

}
}