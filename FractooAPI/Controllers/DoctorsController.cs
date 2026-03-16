using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using FractooAPI.Data;
using FractooAPI.DTOs;
using FractooAPI.Models;

namespace FractooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly FractooDbContext _context;
        private readonly IWebHostEnvironment _env;

        private static readonly string[] AllTimeSlots = new[]
        {
            "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00",
            "11:00-11:30", "11:30-12:00", "14:00-14:30", "14:30-15:00",
            "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00"
        };

        public DoctorsController(FractooDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/doctors?city=Hyderabad&specializationId=1&minRating=4
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetDoctors(
            [FromQuery] string? city,
            [FromQuery] int? specializationId,
            [FromQuery] decimal? minRating)
        {
            var query = _context.Doctors.Include(d => d.Specialization).AsQueryable();

            if (!string.IsNullOrEmpty(city))
                query = query.Where(d => d.City.ToLower() == city.ToLower());

            if (specializationId.HasValue)
                query = query.Where(d => d.SpecializationId == specializationId.Value);

            if (minRating.HasValue)
                query = query.Where(d => d.Rating >= minRating.Value);

            var doctors = await query.OrderByDescending(d => d.Rating)
                .Select(d => new DoctorDto
                {
                    DoctorId = d.DoctorId,
                    Name = d.Name,
                    SpecializationName = d.Specialization.SpecializationName,
                    SpecializationId = d.SpecializationId,
                    City = d.City,
                    Rating = d.Rating,
                    ProfileImagePath = d.ProfileImagePath,
                    Email = d.Email,
                    Phone = d.Phone,
                    About = d.About,
                    ExperienceYears = d.ExperienceYears,
                    ConsultationFee = d.ConsultationFee
                }).ToListAsync();

            return Ok(doctors);
        }

        // GET: api/doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorDto>> GetDoctor(int id)
        {
            var d = await _context.Doctors
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.DoctorId == id);

            if (d == null) return NotFound(new { message = "Doctor not found." });

            return Ok(new DoctorDto
            {
                DoctorId = d.DoctorId,
                Name = d.Name,
                SpecializationName = d.Specialization.SpecializationName,
                SpecializationId = d.SpecializationId,
                City = d.City,
                Rating = d.Rating,
                ProfileImagePath = d.ProfileImagePath,
                Email = d.Email,
                Phone = d.Phone,
                About = d.About,
                ExperienceYears = d.ExperienceYears,
                ConsultationFee = d.ConsultationFee
            });
        }

        // GET: api/doctors/5/timeslots?date=2024-03-20
        [HttpGet("{id}/timeslots")]
        public async Task<ActionResult<IEnumerable<TimeSlotDto>>> GetTimeSlots(int id, [FromQuery] DateTime date)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found." });

            var bookedSlots = await _context.Appointments
                .Where(a => a.DoctorId == id
                    && a.AppointmentDate.Date == date.Date
                    && a.Status != "Cancelled")
                .Select(a => a.TimeSlot)
                .ToListAsync();

            var slots = AllTimeSlots.Select(slot => new TimeSlotDto
            {
                TimeSlot = slot,
                IsAvailable = !bookedSlots.Contains(slot)
            });

            return Ok(slots);
        }

        // GET: api/doctors/cities
        [HttpGet("cities")]
        public async Task<ActionResult<IEnumerable<string>>> GetCities()
        {
            var cities = await _context.Doctors
                .Select(d => d.City)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(cities);
        }

        // POST: api/doctors (Admin only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DoctorDto>> CreateDoctor(CreateDoctorDto dto)
        {
            var specialization = await _context.Specializations.FindAsync(dto.SpecializationId);
            if (specialization == null)
                return BadRequest(new { message = "Invalid specialization." });

            var doctor = new Doctor
            {
                Name = dto.Name,
                SpecializationId = dto.SpecializationId,
                City = dto.City,
                Email = dto.Email,
                Phone = dto.Phone,
                About = dto.About,
                ExperienceYears = dto.ExperienceYears,
                ConsultationFee = dto.ConsultationFee,
                Rating = 0
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.DoctorId },
                new DoctorDto
                {
                    DoctorId = doctor.DoctorId,
                    Name = doctor.Name,
                    SpecializationName = specialization.SpecializationName,
                    SpecializationId = doctor.SpecializationId,
                    City = doctor.City,
                    Rating = doctor.Rating,
                    Email = doctor.Email,
                    Phone = doctor.Phone,
                    About = doctor.About,
                    ExperienceYears = doctor.ExperienceYears,
                    ConsultationFee = doctor.ConsultationFee
                });
        }

        // PUT: api/doctors/5 (Admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDoctor(int id, UpdateDoctorDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found." });

            if (!string.IsNullOrEmpty(dto.Name)) doctor.Name = dto.Name;
            if (dto.SpecializationId.HasValue) doctor.SpecializationId = dto.SpecializationId.Value;
            if (!string.IsNullOrEmpty(dto.City)) doctor.City = dto.City;
            if (!string.IsNullOrEmpty(dto.Email)) doctor.Email = dto.Email;
            if (!string.IsNullOrEmpty(dto.Phone)) doctor.Phone = dto.Phone;
            if (!string.IsNullOrEmpty(dto.About)) doctor.About = dto.About;
            if (dto.ExperienceYears.HasValue) doctor.ExperienceYears = dto.ExperienceYears.Value;
            if (dto.ConsultationFee.HasValue) doctor.ConsultationFee = dto.ConsultationFee.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/doctors/5 (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found." });

            // Check active appointments
            var hasActive = await _context.Appointments
                .AnyAsync(a => a.DoctorId == id && a.Status != "Cancelled");
            if (hasActive)
                return BadRequest(new { message = "Cannot delete doctor with active appointments." });

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/doctors/5/upload-profile-image (Admin only)
        [HttpPost("{id}/upload-profile-image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadProfileImage(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found." });

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            doctor.ProfileImagePath = $"/uploads/{uniqueFileName}";
            await _context.SaveChangesAsync();

            return Ok(new { profileImagePath = doctor.ProfileImagePath });
        }
    }
}
