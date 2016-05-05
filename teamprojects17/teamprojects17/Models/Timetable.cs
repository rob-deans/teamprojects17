using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace teamprojects17.Models
{
    public class Timetable
    {
        public int semester { get; set; }
        public Week[] weeks { get; set; }

    }

    public class Week
    {
        public Day[] days { get; set; }
        public int week { get; set; }
    }

    public class Day
    {
        public Period[][] periods { get; set; }
        public int day { get; set; }
    }

    public class Period
    {
        public Module module { get; set; }
        public int period { get; set; }
        public Rooms rooms { get; set; }
        public Weeks[] weeks { get; set; }
        public string status { get; set; }
        public string type { get; set; }
        public int noOfRooms { get; set; }
        public int noOfStudents { get; set; }
    }

    public class Module
    {
        public string name { get; set; }
        public string code { get; set; }
    }
    public class Weeks 
    {
        public int start{get;set;}
        public int end {get;set;}
    }
    public class Rooms
    {
        public string name { get; set; }
    }
}