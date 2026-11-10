using Microsoft.EntityFrameworkCore;
using SqliteDAL.Models;

namespace SqliteDAL.Data
{
    public class Mp3DbContext : DbContext
    {
        public Mp3DbContext(DbContextOptions<Mp3DbContext> options)
            : base(options)
        {
        }

        public DbSet<Models.FileInfo> FileInfo => Set<Models.FileInfo>();

        public DbSet<Mp3Info> Mp3Info => Set<Mp3Info>();

        public DbSet<Artist> Artists => Set<Artist>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.FileInfo>(entity =>
            {
                entity.ToTable("tbFileInfo");

                entity.HasKey(e => e.FileInfo_Id);

                entity.Property(e => e.File_Name)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Path)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasOne(e => e.Mp3Info)
                    .WithOne(e => e.FileInfo)
                    .HasForeignKey<Mp3Info>(e => e.FileInfo_Id);
            });

            modelBuilder.Entity<Mp3Info>(entity =>
            {
                entity.ToTable("tbMp3Info");

                entity.HasKey(e => e.Mp3Info_Id);

                entity.Property(e => e.Song_Title)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Album).HasMaxLength(255);
                entity.Property(e => e.Genre).HasMaxLength(255);
                entity.Property(e => e.Comments).HasMaxLength(255);
                entity.Property(e => e.Song_Numeraton).HasMaxLength(255);

                entity.HasMany(e => e.Artists)
                    .WithOne(e => e.Mp3Info)
                    .HasForeignKey(e => e.Mp3Info_Id);
            });

            modelBuilder.Entity<Artist>(entity =>
            {
                entity.ToTable("tbArtist");

                entity.HasKey(e => e.Artist_Id);

                entity.Property(e => e.Artist_Name)
                    .IsRequired()
                    .HasMaxLength(255);
            });
        }
    }
}


