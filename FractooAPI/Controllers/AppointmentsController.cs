using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using FractooAPI.Data;
using FractooAPI.DTOs;
using FractooAPI.Hubs;
using FractooAPI.Models;

namespace FractooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly FractooDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public AppointmentsController(FractooDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private string GetUserRole() =>
            User.FindFirstValue(ClaimTypes.Role)!;

        // POST: api/appointments
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> BookAppointment(BookAppointmentDto dto)
        {
            var userId = GetUserId();

            var doctor = await _context.Doctors
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.DoctorId == dto.DoctorId);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            if (dto.AppointmentDate.Date < DateTime.UtcNow.Date)
                return BadRequest(new { message = "Cannot book appointments in the past." });

            // Check if slot already booked
            var isBooked = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId
                && a.AppointmentDate.Date == dto.AppointmentDate.Date
                && a.TimeSlot == dto.TimeSlot
                && a.Status != "Cancelled");
            if (isBooked)
                return BadRequest(new { message = "This time slot is already booked." });

            // Check if user already has appointment at same time
            var hasConflict = await _context.Appointments.AnyAsync(a =>
                a.UserId == userId
                && a.AppointmentDate.Date == dto.AppointmentDate.Date
                && a.TimeSlot == dto.TimeSlot
                && a.Status != "Cancelled");
            if (hasConflict)
                return BadRequest(new { message = "You already have an appointment at this time." });

            var appointment = new Appointment
            {
                UserId = userId,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate.Date,
                TimeSlot = dto.TimeSlot,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", 
                $"New appointment booked for {dto.AppointmentDate:MMM dd, yyyy} at {dto.TimeSlot}.");

            var user = await _context.Users.FindAsync(userId);

            return CreatedAtAction(nameof(GetMyAppointments), null,
                new AppointmentDto
                {
                    AppointmentId = appointment.AppointmentId,
                    UserId = userId,
                    Username = user!.Username,
                    DoctorId = doctor.DoctorId,
                    DoctorName = doctor.Name,
                    SpecializationName = doctor.Specialization.SpecializationName,
                    AppointmentDate = appointment.AppointmentDate,
                    TimeSlot = appointment.TimeSlot,
                    Status = appointment.Status,
                    CreatedAt = appointment.CreatedAt
                });
        }

        // GET: api/appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
        {
            var userId = GetUserId();

            var appointments = await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.Specialization)
                .Include(a => a.User)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    UserId = a.UserId,
                    Username = a.User.Username,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.Name,
                    SpecializationName = a.Doctor.Specialization.SpecializationName,
                    AppointmentDate = a.AppointmentDate,
                    TimeSlot = a.TimeSlot,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                }).ToListAsync();

            return Ok(appointments);
        }

        // GET: api/appointments/all (Admin only)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.Specialization)
                .Include(a => a.User)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    UserId = a.UserId,
                    Username = a.User.Username,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.Name,
                    SpecializationName = a.Doctor.Specialization.SpecializationName,
                    AppointmentDate = a.AppointmentDate,
                    TimeSlot = a.TimeSlot,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                }).ToListAsync();

            return Ok(appointments);
        }

        // PUT: api/appointments/5/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userId = GetUserId();
            var role = GetUserRole();

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            // Users can only cancel their own appointments; Admins can cancel any
            if (role != "Admin" && appointment.UserId != userId)
                return Forbid();

            if (appointment.Status == "Cancelled")
                return BadRequest(new { message = "Appointment is already cancelled." });

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", 
                $"An appointment on {appointment.AppointmentDate:MMM dd, yyyy} at {appointment.TimeSlot} was cancelled.");

            return Ok(new { message = "Appointment cancelled successfully." });
        }

        // PUT: api/appointments/5/confirm (Admin only)
        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            if (appointment.Status == "Cancelled")
                return BadRequest(new { message = "Cannot confirm a cancelled appointment." });

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", 
                $"An appointment on {appointment.AppointmentDate:MMM dd, yyyy} at {appointment.TimeSlot} has been confirmed.");

            return Ok(new { message = "Appointment confirmed successfully." });
        }
    }
}
