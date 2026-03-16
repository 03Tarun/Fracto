using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FractooAPI.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int SpecializationId { get; set; }

        [Required, MaxLength(50)]
        public string City { get; set; } = string.Empty;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        public string? ProfileImagePath { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(15)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? About { get; set; }

        public int ExperienceYears { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal ConsultationFee { get; set; } = 0;

        // Navigation
        [ForeignKey("SpecializationId")]
        public Specialization Specialization { get; set; } = null!;
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
