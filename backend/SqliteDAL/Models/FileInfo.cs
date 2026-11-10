using System;
using System.Collections.Generic;
using System.Text;

namespace SqliteDAL.Models
{
    public class FileInfo
    {
        public int FileInfo_Id { get; set; }

        public string File_Name { get; set; } = string.Empty;

        public string Path { get; set; } = string.Empty;

        // Navigation property
        public Mp3Info? Mp3Info { get; set; }
    }
}
