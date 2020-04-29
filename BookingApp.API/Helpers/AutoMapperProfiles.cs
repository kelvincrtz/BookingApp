using AutoMapper;
using BookingApp.API.Dtos;
using BookingApp.API.Models;

namespace BookingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.Age, opt => 
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.Age, opt => 
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Booking, BookingForDetailedDto>().ReverseMap();
            CreateMap<Booking, BookingForListDto>();
            CreateMap<BookingForCreationDto, Booking>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<BookingForUpdateDto, Booking>();
            CreateMap<BookingForUpdateStatusDto, Booking>();
            CreateMap<BookingForSeenAdminDto, Booking>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>();
            CreateMap<Message, MessageForDetailedDto>();
        }
    }
}