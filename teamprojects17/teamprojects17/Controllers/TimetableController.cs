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
        private DbCon db = new DbCon();

        // GET: Timetable
        //TODO: Get their session so we know what to display
        public ActionResult Index()
        {
            TimetableModel timetable = new TimetableModel();
            return View(timetable);
        }

        public ActionResult Calendar()
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
            SqlCommand cmd = new SqlCommand();
            SqlDataReader reader = null;

            cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN (SELECT ReqID FROM Booking WHERE Status = 'Denied'"+
                "AND ReqID IN "
                +"(SELECT Request.ReqID FROM Request INNER JOIN Modules ON Modules.ModCode = Request.ModCode WHERE Modules.DeptCode = 'BS'))";

            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var List = new List<TimetableModel>();
            while(reader.Read())
            {
                List.Add(new TimetableModel
                {
                    ReqId = reader.GetInt32(0)
                });
            }
            sqlConnection.Close();
            return View(List);
        }

        [HttpPost]
        public JsonResult getTimetable(string[] rooms, int[] weeks)
        {
            SqlDataReader reader = null;
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
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
            SqlCommand cmd = new SqlCommand();
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
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
            SqlCommand cmd = new SqlCommand();
            
            Debug.WriteLine(timetable);
            return timetable;
        }
    }
}