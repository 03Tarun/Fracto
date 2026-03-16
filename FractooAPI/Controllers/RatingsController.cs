using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FractooAPI.Data;
using FractooAPI.DTOs;
using FractooAPI.Models;

namespace FractooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RatingsController : ControllerBase
    {
        private readonly FractooDbContext _context;

        public RatingsController(FractooDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST: api/ratings
        [HttpPost]
        public async Task<ActionResult<RatingDto>> AddRating(AddRatingDto dto)
        {
            var userId = GetUserId();

            var doctor = await _context.Doctors.FindAsync(dto.DoctorId);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            // Check if user already rated this doctor
            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.DoctorId == dto.DoctorId);
            if (existingRating != null)
                return BadRequest(new { message = "You have already rated this doctor." });

            var rating = new Rating
            {
                DoctorId = dto.DoctorId,
                UserId = userId,
                RatingValue = dto.RatingValue,
                Review = dto.Review,
                CreatedAt = DateTime.UtcNow
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            // Recalculate doctor's average rating
            var avgRating = await _context.Ratings
                .Where(r => r.DoctorId == dto.DoctorId)
                .AverageAsync(r => (decimal)r.RatingValue);
            doctor.Rating = Math.Round(avgRating, 1);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return Ok(new RatingDto
            {
                RatingId = rating.RatingId,
                DoctorId = rating.DoctorId,
                UserId = userId,
                Username = user!.Username,
                RatingValue = rating.RatingValue,
                Review = rating.Review,
                CreatedAt = rating.CreatedAt
            });
        }

        // GET: api/ratings/doctor/5
        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<RatingDto>>> GetDoctorRatings(int doctorId)
        {
            var ratings = await _context.Ratings
                .Include(r => r.User)
                .Where(r => r.DoctorId == doctorId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new RatingDto
                {
                    RatingId = r.RatingId,
                    DoctorId = r.DoctorId,
                    UserId = r.UserId,
                    Username = r.User.Username,
                    RatingValue = r.RatingValue,
                    Review = r.Review,
                    CreatedAt = r.CreatedAt
                }).ToListAsync();

            return Ok(ratings);
        }
    }
}
