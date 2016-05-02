using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace teamprojects17.Models
{
    [Table("Request")]
    public class TimetableModel
    {
        [Key]
        public int ReqId { get; set; }

        public string ModCode { get; set; }
        public int Day { get; set; }
        public int Period { get; set; }
        public string Week { get; set; }
        public string BuildingCode { get; set; }
        public int ParkId { get; set; }
        public int Year { get; set; }
        public int Semester { get; set; }

    }

    

    public class DbCon : DbContext
    {
        public DbSet<TimetableModel> Request { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<DbCon>(null);
        }
    }
}