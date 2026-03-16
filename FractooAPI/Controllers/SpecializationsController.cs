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
    public class SpecializationsController : ControllerBase
    {
        private readonly FractooDbContext _context;

        public SpecializationsController(FractooDbContext context)
        {
            _context = context;
        }

        // GET: api/specializations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecializationDto>>> GetSpecializations()
        {
            var specializations = await _context.Specializations
                .Include(s => s.Doctors)
                .Select(s => new SpecializationDto
                {
                    SpecializationId = s.SpecializationId,
                    SpecializationName = s.SpecializationName,
                    DoctorCount = s.Doctors.Count
                })
                .OrderBy(s => s.SpecializationName)
                .ToListAsync();

            return Ok(specializations);
        }

        // POST: api/specializations (Admin only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SpecializationDto>> CreateSpecialization(CreateSpecializationDto dto)
        {
            if (await _context.Specializations.AnyAsync(s =>
                s.SpecializationName.ToLower() == dto.SpecializationName.ToLower()))
            {
                return BadRequest(new { message = "Specialization already exists." });
            }

            var specialization = new Specialization
            {
                SpecializationName = dto.SpecializationName
            };

            _context.Specializations.Add(specialization);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSpecializations), null,
                new SpecializationDto
                {
                    SpecializationId = specialization.SpecializationId,
                    SpecializationName = specialization.SpecializationName,
                    DoctorCount = 0
                });
        }
    }
}
