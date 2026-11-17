using Microsoft.EntityFrameworkCore;
using SqliteDAL.Data;
using SqliteDAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SqliteDAL.Repositories
{
    public class Mp3Repository : IMp3Repository
    {
        private readonly Mp3DbContext _mp3Context;
        public Mp3Repository(Mp3DbContext context)
        {
            _mp3Context = context;
        }
        public List<Mp3SongWithArtists> FindSong(string songTitle)
        {
            var songs = (from song in _mp3Context.Mp3Info
                         where
                         EF.Functions.Like(song.Song_Title.ToLower(), $"%{songTitle.ToLower()}%")
                         select song).ToList();

            var songIds = songs.Select(s => s.Mp3Info_Id).ToList();

            var artists = (from artist in _mp3Context.Artists
                           where songIds.Contains(artist.Mp3Info_Id)
                           select artist).ToList();

            List<Mp3SongWithArtists> mp3SongWithArtistsList = new List<Mp3SongWithArtists>();
            foreach (var song in songs)
            {
                Mp3SongWithArtists mp3SongWithArtist = new Mp3SongWithArtists
                {
                    Mp3Info = song,

                    ArtistList = artists.Where(a => a.Mp3Info_Id == song.Mp3Info_Id).ToList(), 
                    ArtistNames  = string.Join(", ", artists.Where(a => a.Mp3Info_Id == song.Mp3Info_Id).Select(a => a.Artist_Name))
                };

                mp3SongWithArtistsList.Add(mp3SongWithArtist);
            }
            return mp3SongWithArtistsList;
        }

        public List<Mp3SongWithArtists> FindArtistSongs(string artistName)
        {
            var artists = (from artist in _mp3Context.Artists
                           where EF.Functions.Like(artist.Artist_Name.ToLower(), $"%{artistName.ToLower()}%")
                           select artist).ToList();

            var songIds = artists.Select(a => a.Mp3Info_Id).ToList();

            var songs = (from song in _mp3Context.Mp3Info
                         where
                         songIds.Contains(song.Mp3Info_Id)
                         select song).ToList();
          

            List<Mp3SongWithArtists> mp3SongWithArtistsList = new List<Mp3SongWithArtists>();
            foreach (var song in songs)
            {
                Mp3SongWithArtists mp3SongWithArtist = new Mp3SongWithArtists
                {
                    Mp3Info = song,

                    ArtistList = artists.Where(a => a.Mp3Info_Id == song.Mp3Info_Id).ToList(),
                    ArtistNames = string.Join(", ", artists.Where(a => a.Mp3Info_Id == song.Mp3Info_Id).Select(a => a.Artist_Name))
                };

                mp3SongWithArtistsList.Add(mp3SongWithArtist);
            }
            return mp3SongWithArtistsList;
        }
    }
}
