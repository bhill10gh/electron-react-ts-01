using System;
using System.Collections.Generic;
using System.Text;

namespace SqliteDAL.Models
{
    public class Artist
    {
        public int Artist_Id { get; set; }

        public int Mp3Info_Id { get; set; }

        public string Artist_Name { get; set; } = string.Empty;

        // Navigation property
        public Mp3Info? Mp3Info { get; set; }
    }
}
