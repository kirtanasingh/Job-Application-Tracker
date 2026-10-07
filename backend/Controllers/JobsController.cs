using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using JobTrack.Data;
using JobTrack.Models;
using JobTrack.DTOs;

namespace JobTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly JobDbContext _context;
    private readonly ILogger<JobsController> _logger;

    public JobsController(JobDbContext context, ILogger<JobsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private int GetCurrentUserId()
    {
        // 1. Check Claims from JWT Token
        var claimUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(claimUserId) && int.TryParse(claimUserId, out var parsedClaimId))
        {
            return parsedClaimId;
        }

        // 2. Check X-User-Id Header
        if (Request.Headers.TryGetValue("X-User-Id", out var userIdHeader) && int.TryParse(userIdHeader, out var userId) && userId > 0)
        {
            return userId;
        }

        // 3. Default to ID 1 without querying DB if possible
        return 1;
    }

    // GET: api/jobs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobApplication>>> GetJobs([FromQuery] string? search, [FromQuery] string? status, [FromQuery] string? jobType)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = _context.JobApplications.AsNoTracking().Where(j => j.UserId == userId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(j => j.Company.ToLower().Contains(term) || j.JobRole.ToLower().Contains(term) || j.Location.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(j => j.Status.ToLower() == status.Trim().ToLower());
            }

            if (!string.IsNullOrWhiteSpace(jobType) && !jobType.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(j => j.JobType.ToLower() == jobType.Trim().ToLower());
            }

            var jobs = await query.OrderByDescending(j => j.ApplicationDate).ToListAsync();
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job applications.");
            return StatusCode(500, new { message = "An error occurred fetching applications", details = ex.Message });
        }
    }

    // GET: api/jobs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<JobApplication>> GetJob(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var job = await _context.JobApplications.AsNoTracking().FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);

            if (job == null)
            {
                return NotFound(new { message = $"Job application with ID {id} was not found." });
            }

            return Ok(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job application {Id}", id);
            return StatusCode(500, new { message = "An error occurred", details = ex.Message });
        }
    }

    // POST: api/jobs
    [HttpPost]
    public async Task<ActionResult<JobApplication>> CreateJob([FromBody] CreateJobApplicationDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = GetCurrentUserId();
            var job = new JobApplication
            {
                UserId = userId,
                Company = dto.Company.Trim(),
                JobRole = dto.JobRole.Trim(),
                Location = dto.Location?.Trim() ?? string.Empty,
                ApplicationDate = dto.ApplicationDate,
                JobType = dto.JobType.Trim(),
                Status = dto.Status.Trim(),
                Salary = dto.Salary,
                JobUrl = dto.JobUrl?.Trim(),
                Notes = dto.Notes?.Trim()
            };

            _context.JobApplications.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job application.");
            return StatusCode(500, new { message = "Failed to create application", details = ex.Message });
        }
    }

    // PUT: api/jobs/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobApplicationDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = GetCurrentUserId();
            var existingJob = await _context.JobApplications.FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);
            if (existingJob == null)
            {
                return NotFound(new { message = $"Job application with ID {id} was not found." });
            }

            existingJob.Company = dto.Company.Trim();
            existingJob.JobRole = dto.JobRole.Trim();
            existingJob.Location = dto.Location?.Trim() ?? string.Empty;
            existingJob.ApplicationDate = dto.ApplicationDate;
            existingJob.JobType = dto.JobType.Trim();
            existingJob.Status = dto.Status.Trim();
            existingJob.Salary = dto.Salary;
            existingJob.JobUrl = dto.JobUrl?.Trim();
            existingJob.Notes = dto.Notes?.Trim();

            _context.Entry(existingJob).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(existingJob);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job application {Id}", id);
            return StatusCode(500, new { message = "Failed to update application", details = ex.Message });
        }
    }

    // DELETE: api/jobs/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var job = await _context.JobApplications.FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);
            if (job == null)
            {
                return NotFound(new { message = $"Job application with ID {id} was not found." });
            }

            _context.JobApplications.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Job application with ID {id} deleted successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job application {Id}", id);
            return StatusCode(500, new { message = "Failed to delete application", details = ex.Message });
        }
    }
}
