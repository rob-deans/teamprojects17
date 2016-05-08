using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using System.Configuration;
using System.Data.SqlClient;

namespace teamprojects17.Controllers
{
    public class HomeController : Controller
    {
        private SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        SqlCommand cmd = new SqlCommand();

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
    }
}
