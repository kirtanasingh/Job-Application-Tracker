using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JobTrack.Models;

public class JobApplication
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [JsonIgnore]
    public User? User { get; set; }

    [Required]
    [MaxLength(100)]
    public string Company { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string JobRole { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;

    [Required]
    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(50)]
    public string JobType { get; set; } = "Full-time";

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Applied";

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Salary { get; set; }

    [MaxLength(500)]
    public string? JobUrl { get; set; }

    public string? Notes { get; set; }
}
