﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using teamprojects17.Models;

namespace teamprojects17.Controllers
{
    public class TimetableController : Controller
    {
        private DbCon db = new DbCon();

        // GET: Timetable
        public ActionResult Index()
        {
            return View(db.Timetable.ToList());
        }
    }
}