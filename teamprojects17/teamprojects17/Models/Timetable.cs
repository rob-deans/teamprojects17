using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace teamprojects17.Models
{
   
    public class Timetable
    {
        public int semester { get; set; }
        public Week[] weeks { get; set; }
        Config config = new Config();

        public Timetable()
        {
            this.weeks = new Week[15];
        }

        public void addWeek(TimetableModel data, int week)
        {
            Week w = new Week(this.config, data, week);
            w.populate(data, week);
            
            this.weeks[w.week] = w;
        }

        public void populate(TimetableModel data)
        {
            for (int i = data.WeekStart- 1; i < data.WeekEnd; i++)
            {
                this.addWeek(data, i);
            }
        }
    }

    public class Config
    {
        public Config()
        {
            this.numberOfDays = 5;
            this.numberOfPeriods = 9;
            this.numberOfWeeks = 15;
        }
        public int numberOfWeeks { get; set; }
        public int numberOfDays { get; set; }
        public int numberOfPeriods { get; set; }
    }

    public class Week
    {
        public Config config { get; set; }

        public Week(Config config, TimetableModel data, int week)
        {
            this.week = week;
            this.config = config;
            this.days = new Day[1];
        }

        public void populate(TimetableModel data, int week)
        {
            this.addDay(data, data.Day, week);
        }

        public void addDay(TimetableModel data, int day,int week) 
        {
            Day d = new Day(this.config, data, day, week);
            d.populate(data, week, day);
            this.days[d.day-1] = d;
        }

        public Day[] days { get; set; }
        public int week { get; set; }

    }

    public class Day
    {
        public Config config { get; set; }
        public Day(Config config, TimetableModel data, int day, int week)
        {
            this.config = config;
            this.day = day;
            this.week = week;
            this.periods = new Period[9];
        }

        public Day populate(TimetableModel data, int week, int day)
        {

            this.addPeriod(data, week, day, data.Period, 0);
            return this;
        }

        public Day addPeriod(TimetableModel data, int week, int day, int period, int pos)
        {
            Weeks[] weeks = new Weeks[] {new Weeks(data.WeekStart, data.WeekEnd)};
            Period p = new Period(new Module(data.ModCode, ""), data.Period-1, new Rooms("B.1.11"), weeks, "Booked", "Tutorial", 0, 0);
            p.populate(data);
            this.periods[p.period] = p;
            return this;
        }
        
        public Period[] periods { get; set; }
        public Period[][] serverPeriods { get; set; }
        public int day { get; set; }
        public int week { get; set; }
    }

    public class Period
    {
        public Period(Module module, int period, Rooms rooms, Weeks[] weeks, string status, string type, int noOfRooms, int noOfStudents)
        {
            this.module = module;
            this.period = period;
            this.rooms = rooms;
            this.weeks = weeks;
            this.status = status;
            this.type = type;
            this.noOfRooms = noOfRooms;
            this.noOfStudents = noOfStudents;
        }

        public Period populate(TimetableModel data)
        {
            this.module = new Module("", data.ModCode);
            this.period = data.Period;
            this.rooms = new Rooms("B.1.11");
            Weeks[] weeks = new Weeks[] {new Weeks(data.WeekStart, data.WeekEnd)};
            this.weeks = weeks;
            this.status = "Booked";
            this.type = "Tutorial";
            this.noOfRooms = 0;
            this.noOfStudents = 0;

            return this;
        }

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
        public Module(string name, string code)
        {
            this.name = name;
            this.code = code;
        }
        public string name { get; set; }
        public string code { get; set; }
    }
    public class Weeks 
    {
        public Weeks(int start, int end)
        {
            this.start = start;
            this.end = end;
        }
        public int start{get;set;}
        public int end {get;set;}
    }
    public class Rooms
    {
        public Rooms(string name)
        {
            this.name = name;
        }
        public string name { get; set; }
    }
}