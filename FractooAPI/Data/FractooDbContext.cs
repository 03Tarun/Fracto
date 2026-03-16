using Microsoft.EntityFrameworkCore;
using FractooAPI.Models;

namespace FractooAPI.Data
{
    public class FractooDbContext : DbContext
    {
        public FractooDbContext(DbContextOptions<FractooDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<Specialization> Specializations => Set<Specialization>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<Rating> Ratings => Set<Rating>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();
            });

            // Doctor -> Specialization (Many-to-One)
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.Specialization)
                .WithMany(s => s.Doctors)
                .HasForeignKey(d => d.SpecializationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Appointment -> User (Many-to-One)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.User)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Appointment -> Doctor (Many-to-One)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Rating -> Doctor
            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Doctor)
                .WithMany(d => d.Ratings)
                .HasForeignKey(r => r.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Rating -> User
            modelBuilder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany(u => u.Ratings)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique constraint: one rating per user per doctor
            modelBuilder.Entity<Rating>()
                .HasIndex(r => new { r.UserId, r.DoctorId })
                .IsUnique();

            // --- SEED DATA ---
            SeedData(modelBuilder);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            // Specializations
            modelBuilder.Entity<Specialization>().HasData(
                new Specialization { SpecializationId = 1, SpecializationName = "Cardiologist" },
                new Specialization { SpecializationId = 2, SpecializationName = "Dermatologist" },
                new Specialization { SpecializationId = 3, SpecializationName = "Neurologist" },
                new Specialization { SpecializationId = 4, SpecializationName = "Orthopedic" },
                new Specialization { SpecializationId = 5, SpecializationName = "Pediatrician" },
                new Specialization { SpecializationId = 6, SpecializationName = "Psychiatrist" },
                new Specialization { SpecializationId = 7, SpecializationName = "General Physician" },
                new Specialization { SpecializationId = 8, SpecializationName = "ENT Specialist" },
                new Specialization { SpecializationId = 9, SpecializationName = "Ophthalmologist" },
                new Specialization { SpecializationId = 10, SpecializationName = "Dentist" }
            );

            // Doctors
            modelBuilder.Entity<Doctor>().HasData(
                new Doctor { DoctorId = 1, Name = "Dr. Amit Sharma", SpecializationId = 1, City = "Hyderabad", Rating = 4.5m, Email = "amit.sharma@fractoo.com", Phone = "9876543210", About = "Experienced cardiologist with 15 years of practice.", ExperienceYears = 15, ConsultationFee = 800 },
                new Doctor { DoctorId = 2, Name = "Dr. Priya Reddy", SpecializationId = 2, City = "Hyderabad", Rating = 4.8m, Email = "priya.reddy@fractoo.com", Phone = "9876543211", About = "Specialist in skin care and cosmetology.", ExperienceYears = 10, ConsultationFee = 600 },
                new Doctor { DoctorId = 3, Name = "Dr. Rahul Verma", SpecializationId = 3, City = "Bangalore", Rating = 4.3m, Email = "rahul.verma@fractoo.com", Phone = "9876543212", About = "Expert neurologist specializing in migraine and epilepsy.", ExperienceYears = 12, ConsultationFee = 1000 },
                new Doctor { DoctorId = 4, Name = "Dr. Sneha Patil", SpecializationId = 5, City = "Mumbai", Rating = 4.7m, Email = "sneha.patil@fractoo.com", Phone = "9876543213", About = "Pediatrician with a caring approach to child health.", ExperienceYears = 8, ConsultationFee = 500 },
                new Doctor { DoctorId = 5, Name = "Dr. Vikram Singh", SpecializationId = 4, City = "Delhi", Rating = 4.6m, Email = "vikram.singh@fractoo.com", Phone = "9876543214", About = "Orthopedic surgeon specializing in joint replacement.", ExperienceYears = 20, ConsultationFee = 1200 },
                new Doctor { DoctorId = 6, Name = "Dr. Meera Iyer", SpecializationId = 7, City = "Chennai", Rating = 4.4m, Email = "meera.iyer@fractoo.com", Phone = "9876543215", About = "General physician with holistic treatment approach.", ExperienceYears = 7, ConsultationFee = 400 },
                new Doctor { DoctorId = 7, Name = "Dr. Arjun Das", SpecializationId = 1, City = "Bangalore", Rating = 4.2m, Email = "arjun.das@fractoo.com", Phone = "9876543216", About = "Cardiologist focused on preventive heart care.", ExperienceYears = 11, ConsultationFee = 900 },
                new Doctor { DoctorId = 8, Name = "Dr. Kavita Joshi", SpecializationId = 6, City = "Hyderabad", Rating = 4.9m, Email = "kavita.joshi@fractoo.com", Phone = "9876543217", About = "Psychiatrist with expertise in anxiety and depression.", ExperienceYears = 14, ConsultationFee = 700 },
                new Doctor { DoctorId = 9, Name = "Dr. Suresh Kumar", SpecializationId = 8, City = "Mumbai", Rating = 4.1m, Email = "suresh.kumar@fractoo.com", Phone = "9876543218", About = "ENT specialist with advanced surgical skills.", ExperienceYears = 9, ConsultationFee = 550 },
                new Doctor { DoctorId = 10, Name = "Dr. Anita Desai", SpecializationId = 10, City = "Delhi", Rating = 4.5m, Email = "anita.desai@fractoo.com", Phone = "9876543219", About = "Expert dentist in cosmetic and restorative dentistry.", ExperienceYears = 13, ConsultationFee = 650 }
            );

            // Admin user (password: Admin@123)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    Username = "admin",
                    Email = "admin@fractoo.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
