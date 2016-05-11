using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Razor.Models
{
    [Table("User")]
    public class UserAccount
    {
        [Key]
        public string Username { get; set; }

        public string Password { get; set; }
        public string DeptCode { get; set; }
    }

    public class DBCon : DbContext
    {
        public DbSet<UserAccount> User { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<DBCon>(null);
        }
    }
}