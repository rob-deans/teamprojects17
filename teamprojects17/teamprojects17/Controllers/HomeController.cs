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
        private SqlConnection sqlConnectionFacil = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        private SqlConnection sqlConnectionPark = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        SqlDataReader reader = null;
        public ActionResult Index()
        {
            if (Session["DEPT"] == null)
            {
                Debug.WriteLine("no no no");
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Dashboard";
            ViewBag.Message = "Your home page.";

            return View();
        }

        public ActionResult Help()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Help Page";
            ViewBag.Message = "Questions and answers.";

            return View();
        }

        public ActionResult Timetable()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Timetable";
            ViewBag.Message = "Your timetable booking page.";

            return View();
        }

        public ActionResult Upload()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Upload file";
            ViewBag.Message = "Upload file page.";

            return View();
        }

        public ActionResult Calendar()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Calendar";
            ViewBag.Message = "Your overview timetable page.";

            return View();
        }

        public ActionResult Settings()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Settings";
            ViewBag.Message = "Change your settings here.";

            return View();
        }

        public ActionResult Rooms()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
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
                SqlCommand facilCmd = new SqlCommand();
                facilCmd.CommandText = "Select FacilityName FROM Facility WHERE FacilityID IN (SELECT FacilityID FROM FacilityRoom where RoomCode='" + reader.GetString(0) + "')";
                facilCmd.CommandType = System.Data.CommandType.Text;
                facilCmd.Connection = sqlConnectionFacil;
                sqlConnectionFacil.Open();
                SqlDataReader readerFacil = facilCmd.ExecuteReader();
                var Faciladd = new List<string>();
                while (readerFacil.Read())
                {
                    Faciladd.Add(readerFacil.GetString(0));
                }

                SqlCommand parkCmd = new SqlCommand();
                parkCmd.CommandText = "SELECT ParkName FROM Park JOIN Building ON Park.ParkID = Building.ParkID WHERE BuildingCode = '" + reader.GetString(2) + "'";
                parkCmd.CommandType = System.Data.CommandType.Text;
                parkCmd.Connection = sqlConnectionPark;
                sqlConnectionPark.Open();
                SqlDataReader readerPark = parkCmd.ExecuteReader();
                string parkName = "";
                while(readerPark.Read())
                {
                    parkName = readerPark.GetString(0);
                }
                sqlConnectionPark.Close();
                list.Add(new Room
                {
                    RoomCode = reader.GetString(0),
                    Capacity = reader.GetInt32(1),
                    BuildingCode = reader.GetString(2),
                    FacilityName = Faciladd,
                    ParkName = parkName
                });
                sqlConnectionFacil.Close();
            }
            sqlConnection.Close();
            return Json(list);
        }
        
    }


}
