using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Model
{
    public class DBInteractor : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(@"Data Source = UrlTransformation.db;");
        }
        public DbSet<UrlTransformation> UrlTransformation { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UrlTransformation>().HasData(
                new UrlTransformation() { Id = 1, shortUrl = "abc", longUrl = "long_abc"},
                new UrlTransformation() { Id = 2, shortUrl = "cde", longUrl = "long_cde" }
            );
        }
    }
}
