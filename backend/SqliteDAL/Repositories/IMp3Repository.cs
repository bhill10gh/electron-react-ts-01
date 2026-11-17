using SqliteDAL.Models;

namespace SqliteDAL.Repositories
{
    public interface IMp3Repository
    {
        List<Mp3SongWithArtists> FindArtistSongs(string artistName);
        List<Mp3SongWithArtists> FindSong(string songTitle);
    }
}