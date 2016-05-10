using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using System.Configuration;
using System.Data.SqlClient;
using teamprojects17.Models;
using System.Diagnostics;

namespace teamprojects17.Controllers
{
    public class HomeController : Controller
    {
        private SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        SqlCommand cmd = new SqlCommand();
        private SqlConnection sqlConnection2 = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        SqlDataReader reader = null;
        public ActionResult Index()
        {
            ViewBag.Title = "Dashboard";
            ViewBag.Message = "Your home page.";

            return View();
        }

        public ActionResult Help()
        {
            ViewBag.Title = "Help Page";
            ViewBag.Message = "Questions and answers.";

            return View();
        }

        public ActionResult Timetable()
        {
            ViewBag.Title = "Timetable";
            ViewBag.Message = "Your timetable booking page.";

            return View();
        }

        public ActionResult Upload()
        {
            ViewBag.Title = "Upload file";
            ViewBag.Message = "Upload file page.";

            return View();
        }

        public ActionResult Calendar()
        {
            ViewBag.Title = "Calendar";
            ViewBag.Message = "Your overview timetable page.";

            return View();
        }

        public ActionResult Settings()
        {
            ViewBag.Title = "Settings";
            ViewBag.Message = "Change your settings here.";

            return View();
        }

        public ActionResult Rooms()
        {
            return View();
        }

        [HttpPost]
        public JsonResult getRoomStuff(string SQLQ)
        {
            cmd.CommandText = SQLQ;
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            var list = new List<Room>();
            reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                SqlCommand cmd2 = new SqlCommand();
                cmd2.CommandText = "Select FacilityName FROM Facility WHERE FacilityID IN (SELECT FacilityID FROM FacilityRoom where RoomCode='" + reader.GetString(0) + "')";
                cmd2.CommandType = System.Data.CommandType.Text;
                cmd2.Connection = sqlConnection2;
                sqlConnection2.Open();
                SqlDataReader reader2 = cmd2.ExecuteReader();
                var Faciladd = new List<string>();
                while (reader2.Read())
                {
                    Faciladd.Add(reader2.GetString(0));
                }
                list.Add(new Room
                {
                    RoomCode = reader.GetString(0),
                    Capacity = reader.GetInt32(1),
                    BuildingCode = reader.GetString(2),
                    FacilityName = Faciladd

                });
                sqlConnection2.Close();
            }
            sqlConnection.Close();
            return Json(list);
        }
        
    }


}
