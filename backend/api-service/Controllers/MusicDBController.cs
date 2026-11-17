using Microsoft.AspNetCore.Mvc;
using SqliteDAL.Models;
using SqliteDAL.Repositories;

namespace api_service.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class MusicDBController : ControllerBase
    {
        IMp3Repository _mp3Repository;

        public MusicDBController(IMp3Repository mp3Repository)
        {
            _mp3Repository = mp3Repository;
        }

        [HttpGet(Name = "GetReturnString")]
        public string Get([FromQuery] string str)
        {
            return "Hello from MusicDBController!  Here is your string: " + str;
        }

        [HttpGet("find-song/{search}", Name = "FindSong")]
        public List<Mp3SongWithArtists> FindSong([FromRoute] string search)
        {
            return _mp3Repository.FindSong(search);
        }

        [HttpGet("find-artist-songs/{search}", Name = "FindArtistSongs")]
        public List<Mp3SongWithArtists> FindArtistSongs([FromRoute] string search)
        {
            return _mp3Repository.FindArtistSongs(search);
        }
    }
}
