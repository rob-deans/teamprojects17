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
            TimetableModel timetable = new TimetableModel();
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
            SqlCommand cmd = new SqlCommand();
            SqlDataReader reader = null;
            cmd.CommandText = "SELECT * FROM Request WHERE ReqId = 3";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            sqlConnection.Close();

            return View(timetable);
        }

        [HttpPost]
        public JsonResult getTimetable(string[] rooms, int[] weeks)
        {
            SqlDataReader reader = null;
            Debug.WriteLine("running");
            if (rooms != null)
            {
                foreach (var room in rooms)
                {
                    reader = getData(reader, weeks);
                    Debug.Write(reader);
                }
            }
            else
            {
                Debug.Write(reader);
                reader = getData(reader, weeks);
            }

            
            return Json(reader);
        }

        private SqlDataReader getData(SqlDataReader reader, int[] weeks)
        {
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
            SqlCommand cmd = new SqlCommand();

            foreach (var week in weeks)
            {
                cmd.CommandText = "SELECT * FROM Request WHERE " + week + " BETWEEN WeekStart AND WeekEnd";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                reader = cmd.ExecuteReader();
            }
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