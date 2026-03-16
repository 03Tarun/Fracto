using System.ComponentModel.DataAnnotations;

namespace FractooAPI.Models
{
    public class Specialization
    {
        [Key]
        public int SpecializationId { get; set; }

        [Required, MaxLength(100)]
        public string SpecializationName { get; set; } = string.Empty;

        // Navigation
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}
