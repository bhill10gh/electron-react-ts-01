using System;
using System.Collections.Generic;
using System.Text;

namespace SqliteDAL.Models
{
    public class Mp3Info
    {
        public int Mp3Info_Id { get; set; }

        public int FileInfo_Id { get; set; }

        public string Song_Title { get; set; } = string.Empty;

        public string? Album { get; set; }

        public string? Genre { get; set; }

        public string? Comments { get; set; }

        public int? Track { get; set; }

        public string? Song_Numeraton { get; set; }

        // Navigation properties
        public FileInfo? FileInfo { get; set; }

        public ICollection<Artist> Artists { get; set; } = new List<Artist>();
    }
}
