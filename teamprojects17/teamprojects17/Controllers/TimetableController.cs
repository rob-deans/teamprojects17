using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using teamprojects17.Models;

namespace teamprojects17.Controllers
{
    public class TimetableController : Controller
    {
        private string booked = "Approved";
        private DbCon db = new DbCon();
        private SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        SqlCommand cmd = new SqlCommand();
        SqlDataReader reader = null;

        // GET: Timetable
        //TODO: Get their session so we know what to display
        public ActionResult Index()
        {
            TimetableModel timetable = new TimetableModel();
            return View(timetable);
        }

        public ActionResult Calendar()
        {
            cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN (SELECT ReqID FROM Booking WHERE Status = '" + booked + "'" +
                "AND ReqID IN "
                + "(SELECT Request.ReqID FROM Request INNER JOIN Modules ON Modules.ModCode = Request.ModCode WHERE Modules.DeptCode = 'EC'))";

            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var List = new List<TimetableModel>();
            while (reader.Read())
            {
                List.Add(new TimetableModel
                {
                    ReqId = reader.GetInt32(0),
                    ModCode = reader.GetString(1),
                    Day = reader.GetInt32(2),
                    Period = reader.GetInt32(3),
                    WeekStart = reader.GetInt32(4),
                    WeekEnd = reader.GetInt32(5),
                    BuildingCode = reader.GetString(6),
                    ParkId = reader.GetInt32(7),
                    Year = reader.GetInt32(8),
                    Semester = reader.GetInt32(9)
                });
            }
            sqlConnection.Close();
            return View(List);
        }

        [HttpPost]
        public JsonResult getLecturerTimetable(int id)
        {
            cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN (SELECT ReqID FROM Booking WHERE Status = '" + booked + "'" +
                "AND ReqID IN "
                + "(SELECT Request.ReqID FROM Request INNER JOIN Modules ON Modules.ModCode = Request.ModCode WHERE Modules.LecturerID = '" + id + "'))";

            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var List = new List<TimetableModel>();
            while (reader.Read())
            {
                List.Add(new TimetableModel
                {
                    ReqId = reader.GetInt32(0),
                    ModCode = reader.GetString(1),
                    Day = reader.GetInt32(2),
                    Period = reader.GetInt32(3),
                    WeekStart = reader.GetInt32(4),
                    WeekEnd = reader.GetInt32(5),
                    BuildingCode = reader.GetString(6),
                    ParkId = reader.GetInt32(7),
                    Year = reader.GetInt32(8),
                    Semester = reader.GetInt32(9)
                });
            }
            sqlConnection.Close();
            return Json(List);
        }

        [HttpPost]
        public JsonResult getTimetable(string[] rooms, int[] weeks)
        {
            if (rooms != null)
            {
                foreach (var room in rooms)
                {
                    Debug.Write(room);
                    reader = getData(reader, weeks);
                }
            }
            else
            {
                Debug.Write("No rooms!");
            }


            return Json(reader);
        }

        private SqlDataReader getData(SqlDataReader reader, int[] weeks)
        {
            cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN " +
                "(SELECT ReqID FROM Assigned INNER JOIN Room ON Assigned.RoomCode = Room.RoomCode " +
                "WHERE Room.RoomCode = 'B.1.11'";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            sqlConnection.Close();
            return reader;
        }

        public string setTimetable(string timetable) {

            Debug.WriteLine(timetable);
            return timetable;
        }

        [HttpPost]
        public JsonResult updateDropDown(string table, string id, string column)
        {
            cmd.CommandText = "SELECT * FROM " + table + " WHERE " + column + " = '" + id+"'";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var buildingList = new List<Building>();
            var roomList = new List<Room>();
            while(reader.Read())
            {
                if (table == "Building")
                {
                    buildingList.Add(new Building
                    {
                        BuildingCode = reader.GetString(0),
                        BuildingName = reader.GetString(1),
                        ParkID = reader.GetInt32(2)
                    });
                }
                else
                {
                    roomList.Add(new Room
                    {
                        RoomCode = reader.GetString(0),
                        Capacity = reader.GetInt32(1),
                        BuildingCode = reader.GetString(2)
                    });
                }
            }
            sqlConnection.Close();
            if(table == "Building")
            {
                return Json(buildingList);
            }
            return Json(roomList);
        }

        [HttpPost]
        public JsonResult getModule(string val, bool b)
        {
            string columnGet;
            string columnName;
            if (!b)
            {
                columnGet = "ModCode";
                columnName = "ModName";
            }
            else
            {
                columnGet = "ModName";
                columnName = "ModCode";
            }
            cmd.CommandText = "SELECT " + columnGet + " FROM Modules WHERE " + columnName + " = '" + val + "'";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            string module = "";
            while (reader.Read())
            {
                module = reader.GetString(0);
            }
            Debug.WriteLine(module);
            sqlConnection.Close();
            return Json(module);
        }
    }
}