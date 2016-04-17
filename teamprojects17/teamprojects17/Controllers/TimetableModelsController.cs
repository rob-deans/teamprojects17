using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using teamprojects17.Models;

namespace teamprojects17.Controllers
{
    public class TimetableModelsController : Controller
    {
        private TimetableContext db = new TimetableContext();

        // GET: TimetableModels
        public ActionResult Index()
        {
            return View();
        }

        // GET: TimetableModels/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TimetableModel timetableModel = db.Timetable.Find(id);
            if (timetableModel == null)
            {
                return HttpNotFound();
            }
            return View(timetableModel);
        }

        // GET: TimetableModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: TimetableModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id")] TimetableModel timetableModel)
        {
            if (ModelState.IsValid)
            {
                db.Timetable.Add(timetableModel);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(timetableModel);
        }

        // GET: TimetableModels/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TimetableModel timetableModel = db.Timetable.Find(id);
            if (timetableModel == null)
            {
                return HttpNotFound();
            }
            return View(timetableModel);
        }

        // POST: TimetableModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id")] TimetableModel timetableModel)
        {
            if (ModelState.IsValid)
            {
                db.Entry(timetableModel).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(timetableModel);
        }

        // GET: TimetableModels/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            TimetableModel timetableModel = db.Timetable.Find(id);
            if (timetableModel == null)
            {
                return HttpNotFound();
            }
            return View(timetableModel);
        }

        // POST: TimetableModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            TimetableModel timetableModel = db.Timetable.Find(id);
            db.Timetable.Remove(timetableModel);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
