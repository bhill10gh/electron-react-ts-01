using Microsoft.AspNetCore.Mvc;

namespace api_service.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class MusicDBController : ControllerBase
    {

        [HttpGet(Name = "GetReturnString")]
        public string Get(string str)
        {
            return "Hello from MusicDBController!  Here is your string: " + str;
        }
    }
}
