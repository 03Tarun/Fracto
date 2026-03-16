using System.ComponentModel.DataAnnotations;

namespace FractooAPI.DTOs
{
    // --- AUTH ---
    public class RegisterDto
    {
        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    // --- USER ---
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? ProfileImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateUserDto
    {
        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required, MaxLength(10)]
        public string Role { get; set; } = "User";
    }

    public class UpdateUserDto
    {
        [MaxLength(50)]
        public string? Username { get; set; }

        [EmailAddress, MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(10)]
        public string? Role { get; set; }
    }

    // --- SPECIALIZATION ---
    public class SpecializationDto
    {
        public int SpecializationId { get; set; }
        public string SpecializationName { get; set; } = string.Empty;
        public int DoctorCount { get; set; }
    }

    public class CreateSpecializationDto
    {
        [Required, MaxLength(100)]
        public string SpecializationName { get; set; } = string.Empty;
    }

    // --- DOCTOR ---
    public class DoctorDto
    {
        public int DoctorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SpecializationName { get; set; } = string.Empty;
        public int SpecializationId { get; set; }
        public string City { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string? ProfileImagePath { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? About { get; set; }
        public int ExperienceYears { get; set; }
        public decimal ConsultationFee { get; set; }
    }

    public class CreateDoctorDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int SpecializationId { get; set; }

        [Required, MaxLength(50)]
        public string City { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(15)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? About { get; set; }

        public int ExperienceYears { get; set; }
        public decimal ConsultationFee { get; set; }
    }

    public class UpdateDoctorDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }
        public int? SpecializationId { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(15)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? About { get; set; }

        public int? ExperienceYears { get; set; }
        public decimal? ConsultationFee { get; set; }
    }

    public class DoctorSearchDto
    {
        public string? City { get; set; }
        public int? SpecializationId { get; set; }
        public DateTime? Date { get; set; }
        public decimal? MinRating { get; set; }
    }

    // --- APPOINTMENT ---
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string SpecializationName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class BookAppointmentDto
    {
        [Required]
        public int DoctorId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public string TimeSlot { get; set; } = string.Empty;
    }

    // --- RATING ---
    public class RatingDto
    {
        public int RatingId { get; set; }
        public int DoctorId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int RatingValue { get; set; }
        public string? Review { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddRatingDto
    {
        [Required]
        public int DoctorId { get; set; }

        [Required, Range(1, 5)]
        public int RatingValue { get; set; }

        [MaxLength(500)]
        public string? Review { get; set; }
    }

    // --- TIME SLOTS ---
    public class TimeSlotDto
    {
        public string TimeSlot { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
