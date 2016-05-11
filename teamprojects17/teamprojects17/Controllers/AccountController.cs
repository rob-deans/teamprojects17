using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using Razor.Models;
using System.Web.Security;

namespace Razor.Controllers
{
    public class AccountController : Controller
    {
        private UserAccount db = new UserAccount();
        private SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DBCon"].ToString());
        SqlCommand cmd = new SqlCommand();
        SqlDataReader reader = null;

        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        //Login
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(UserAccount user)
        {
            Debug.WriteLine(user.Username + "--" + user.Password);
            cmd.CommandText = "Select Count(1) from [User] "
            + "where Username = '" + user.Username + "' AND Password='" + user.Password + "'"
            + "";
            Debug.WriteLine(cmd.CommandText);
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            int flagy = 0;

            try
            {
                while (reader.Read())
                {
                    flagy = reader.GetInt32(0);
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine("i don't know anymore" + e);
            }

            sqlConnection.Close();
            if (flagy != 0)
            {
                cmd.CommandText = "Select DeptCode FROM [USER] WHERE Username = '" + user.Username + "' AND Password='" + user.Password + "'";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                reader = cmd.ExecuteReader();
                Debug.WriteLine(cmd.CommandText);
                while (reader.Read())
                {
                    Debug.WriteLine(reader.GetString(0));
                    Session["DEPT"] = reader.GetString(0);
                }
                Debug.Write(Session["DEPT"]);
                sqlConnection.Close();
                return RedirectToAction("LoggedIn");
            }
            else
            {
                ModelState.AddModelError("", "Username or password is incorrect");
            }
            return View();

        }


        public ActionResult LoggedIn()
        {
            Debug.WriteLine("here");
            if (Session["DEPT"] != null)
            {
                Debug.WriteLine("midway");
                return RedirectToAction("Index", "Home");

            }
            else
            {
                return RedirectToAction("Login");
            }
        }


        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            Debug.WriteLine("Session from ->" + Session["DEPT"] + "<-");
            Session["DEPT"] = null;
            Debug.WriteLine("To ->" + Session["DEPT"] + "<-");
            return RedirectToAction("Login","Account" );
        }

    }
}