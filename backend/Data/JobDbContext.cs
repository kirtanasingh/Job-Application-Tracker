using Microsoft.EntityFrameworkCore;
using JobTrack.Models;

namespace JobTrack.Data;

public class JobDbContext : DbContext
{
    public JobDbContext(DbContextOptions<JobDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Company).IsRequired().HasMaxLength(100);
            entity.Property(e => e.JobRole).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Location).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.JobType).HasMaxLength(50);

            entity.HasOne(j => j.User)
                  .WithMany(u => u.JobApplications)
                  .HasForeignKey(j => j.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
