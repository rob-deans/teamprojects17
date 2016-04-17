﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

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

    }

    protected void Page_Load(object sender, EventArgs e)
    {
        using (SqlConnection cn = new SqlConnection(ConfigurationManager.ConnectionStrings["DBcon"].ToString()))
        {
            SqlCommand cmd = new SqlCommand("SELECT * FROM Park", cn);
            cn.Open();
            DropDownList1.DataSource = cmd.ExecuteReader();
            DropDownList1.DataTextField = "ParkName";
            DropDownList1.DataValueField = "ParkID";
            DropDownList1.DataBind();
        }

    }
}
