using System.ComponentModel.DataAnnotations;

namespace JobTrack.DTOs;

public class CreateJobApplicationDto
{
    [Required(ErrorMessage = "Company name is required")]
    [StringLength(100)]
    public string Company { get; set; } = string.Empty;

    [Required(ErrorMessage = "Job role is required")]
    [StringLength(100)]
    public string JobRole { get; set; } = string.Empty;

    [StringLength(100)]
    public string Location { get; set; } = string.Empty;

    [Required(ErrorMessage = "Application date is required")]
    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

    [Required(ErrorMessage = "Job type is required")]
    [StringLength(50)]
    public string JobType { get; set; } = "Full-time";

    [Required(ErrorMessage = "Status is required")]
    [StringLength(50)]
    public string Status { get; set; } = "Applied";

    public decimal? Salary { get; set; }

    [StringLength(500)]
    public string? JobUrl { get; set; }

    public string? Notes { get; set; }
}

public class UpdateJobApplicationDto : CreateJobApplicationDto
{
}
