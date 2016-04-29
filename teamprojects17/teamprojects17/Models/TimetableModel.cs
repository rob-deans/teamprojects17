using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace teamprojects17.Models
{
    public class TimetableModel
    {
        [Key]
        public int ReqId { get; set; }

        public string ModCode { get; set; }
        public int Day { get; set; }
        public int Period { get; set; }
        public int Week { get; set; }
        public string BuildingCode { get; set; }
        public int ParkId { get; set; }
        public int DetailsYear { get; set; }
        public int DetailsSemester { get; set; }
    }

    public class DbCon : DbContext
    {
        public DbSet<TimetableModel> Request { get; set; }


    }
}