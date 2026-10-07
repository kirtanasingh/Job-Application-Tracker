using Microsoft.AspNetCore.Mvc;
using JobTrack.Data;

namespace JobTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly JobDbContext _context;

    public ApplicationsController(JobDbContext context)
    {
        _context = context;
    }

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            status = "Online",
            service = "JobTrack API",
            timestamp = DateTime.UtcNow
        });
    }
}
