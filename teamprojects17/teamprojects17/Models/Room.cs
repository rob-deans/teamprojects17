using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace teamprojects17.Models
{
    public class Room
    {
        public string RoomCode { get; set; }
        public int Capacity { get; set; }
        public string BuildingCode { get; set; }
        public string DeptCode { get; set; }
        public List<string> FacilityName { get; set; }

    }


}