using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace teamprojects17.Models
{
    public class TimetableModel
    {
        public int Id { get; set; }
        public int Period { get; set; }
    }

    public class TimetableContext : DbContext
    {
        public DbSet<TimetableModel> Timetable { get; set; }
    }
}