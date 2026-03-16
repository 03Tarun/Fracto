using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FractooAPI.Data;
using FractooAPI.DTOs;
using FractooAPI.Models;
using FractooAPI.Services;

namespace FractooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly FractooDbContext _context;
        private readonly IAuthService _authService;

        public AdminController(FractooDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    ProfileImagePath = u.ProfileImagePath,
                    CreatedAt = u.CreatedAt
                })
                .OrderBy(u => u.Username)
                .ToListAsync();

            return Ok(users);
        }

        // POST: api/admin/users
        [HttpPost("users")]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email already exists." });

            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest(new { message = "Username already exists." });

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Role = dto.Role,
                PasswordHash = _authService.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), null, new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        // PUT: api/admin/users/5
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            if (!string.IsNullOrEmpty(dto.Username))
            {
                if (await _context.Users.AnyAsync(u => u.Username == dto.Username && u.UserId != id))
                    return BadRequest(new { message = "Username already taken." });
                user.Username = dto.Username;
            }

            if (!string.IsNullOrEmpty(dto.Email))
            {
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.UserId != id))
                    return BadRequest(new { message = "Email already taken." });
                user.Email = dto.Email;
            }

            if (!string.IsNullOrEmpty(dto.Role))
                user.Role = dto.Role;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/admin/users/5
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            if (user.Role == "Admin")
                return BadRequest(new { message = "Cannot delete admin user." });

            // Cancel all user's appointments first
            var appointments = await _context.Appointments
                .Where(a => a.UserId == id && a.Status != "Cancelled")
                .ToListAsync();
            foreach (var apt in appointments)
                apt.Status = "Cancelled";

            // Remove user's ratings
            var ratings = await _context.Ratings.Where(r => r.UserId == id).ToListAsync();
            _context.Ratings.RemoveRange(ratings);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(u => u.Role == "User"),
                TotalDoctors = await _context.Doctors.CountAsync(),
                TotalAppointments = await _context.Appointments.CountAsync(),
                ActiveAppointments = await _context.Appointments.CountAsync(a => a.Status == "Confirmed"),
                CancelledAppointments = await _context.Appointments.CountAsync(a => a.Status == "Cancelled"),
                TotalSpecializations = await _context.Specializations.CountAsync()
            };

            return Ok(stats);
        }
    }
}
