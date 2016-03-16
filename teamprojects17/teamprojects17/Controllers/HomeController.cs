using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace teamprojects17.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Dashboard";
            ViewBag.Message = "Your home page.";

            return View();
        }

        public ActionResult Help()
        {
            ViewBag.Title = "Help page";
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
            return View();
        }

        public ActionResult Calendar()
        {
            return View();
        }

        public ActionResult Settings()
        {
            return View();
        }
    }
}
