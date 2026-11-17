using System;
using System.Collections.Generic;
using System.Text;

namespace SqliteDAL.Models
{
    public class Mp3SongWithArtists
    {
        public  Mp3Info Mp3Info { get; set; }

        public  List<Artist> ArtistList { get; set; }

        public string ArtistNames { get; set; }

    }
}
