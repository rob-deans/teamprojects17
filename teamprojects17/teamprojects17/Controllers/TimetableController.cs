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
using teamprojects17.Models;

namespace teamprojects17.Controllers
{
    public class TimetableController : Controller
    {
        private string booked = "Approved";
        private DbCon db = new DbCon();
        private SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        private SqlConnection sqlConnection2 = new SqlConnection(ConfigurationManager.ConnectionStrings["DbCon"].ToString());
        SqlCommand cmd = new SqlCommand();
        SqlDataReader reader = null;

        // GET: Timetable
        //TODO: Get their session so we know what to display
        public ActionResult Index()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }

    
        public ActionResult Calendar()
        {
            if (Session["DEPT"] == null)
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }

        [HttpPost]
        public JsonResult getCourseTimetable(string courseCode, int year)
        {
            Debug.WriteLine(year);
            Debug.WriteLine(courseCode);
            cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN (SELECT ReqID FROM Booking WHERE Status = '" + booked + "')" +
                "AND ModCode IN "
                + "(SELECT ModCode FROM CourMod WHERE CourseCode = '"+courseCode+"' AND Year ='"+year+"')";

            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var List = new List<TimetableModel>();
            while (reader.Read())
            {
                List.Add(new TimetableModel
                {
                    ReqId = reader.GetInt32(0),
                    ModCode = reader.GetString(1),
                    Day = reader.GetInt32(2),
                    Period = reader.GetInt32(3),
                    WeekStart = reader.GetInt32(4),
                    WeekEnd = reader.GetInt32(5),
                    BuildingCode = reader.GetString(6),
                    ParkId = reader.GetInt32(7),
                    Year = reader.GetInt32(8),
                    Semester = reader.GetInt32(9)
                });
            }
            sqlConnection.Close();
            return Json(List);
        }

        [HttpPost]
        public JsonResult getLecturerTimetable(int id)
        {
            cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN (SELECT ReqID FROM Booking WHERE Status = '" + booked + "'" +
                "AND ReqID IN "
                + "(SELECT Request.ReqID FROM Request INNER JOIN Modules ON Modules.ModCode = Request.ModCode WHERE Modules.LecturerID = '" + id + "'))";

            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var List = new List<TimetableModel>();
            while (reader.Read())
            {
                List.Add(new TimetableModel
                {
                    ReqId = reader.GetInt32(0),
                    ModCode = reader.GetString(1),
                    Day = reader.GetInt32(2),
                    Period = reader.GetInt32(3),
                    WeekStart = reader.GetInt32(4),
                    WeekEnd = reader.GetInt32(5),
                    BuildingCode = reader.GetString(6),
                    ParkId = reader.GetInt32(7),
                    Year = reader.GetInt32(8),
                    Semester = reader.GetInt32(9)
                });
            }
            sqlConnection.Close();
            return Json(List);
        }

        [HttpPost]
        public JsonResult getTimetable(string[] rooms)
        {
            string roomList = "(";
            int counter = 0;
            foreach(var room in rooms)
            {
                if (counter != 0)
                {
                    roomList += ", " + "'" + room + "'";
                }
                else
                {
                    roomList += "'" + room + "'";
                }
                counter++;
            }
            roomList += ")";
            Debug.WriteLine(roomList);
            var tt = new List<TimetableModel>();
            Timetable timetable = new Timetable();
            if (rooms != null)
            {
                cmd.CommandText = "SELECT * FROM Request WHERE ReqID IN" +
                "(SELECT ReqID FROM Booking WHERE Status ='" + booked + "')" +
                "AND ReqID IN (SELECT ReqID FROM Assigned WHERE RoomCode IN "+roomList+")";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                reader = cmd.ExecuteReader();
                while(reader.Read())
                {
                    tt.Add(new TimetableModel
                    {
                        ReqId = reader.GetInt32(0),
                        ModCode = reader.GetString(1),
                        Day = reader.GetInt32(2),
                        Period = reader.GetInt32(3),
                        WeekStart = reader.GetInt32(4),
                        WeekEnd = reader.GetInt32(5),
                        BuildingCode = reader.GetString(6),
                        ParkId = reader.GetInt32(7),
                        Year = reader.GetInt32(8),
                        Semester = reader.GetInt32(9)
                    });
                    Debug.WriteLine(tt[0].ModCode);
                    timetable.populate(tt[tt.Count - 1]);
                }
                sqlConnection.Close();
            }
            else
            {
                Debug.Write("No rooms!");
            }
            return Json(timetable);
        }

        private SqlDataReader getData(SqlDataReader reader)
        {
            
            return reader;
        }

        
        public string setTimetable(string timetable, int parkID, string buildingCode) {
            Debug.WriteLine(timetable);
            timetable = timetable.Replace("periods", "serverPeriods");
            Debug.WriteLine(timetable);
            Timetable tt = JsonConvert.DeserializeObject<Timetable>(timetable);
            var request = new List<TimetableModel>();
            for(int i = 0; i < tt.weeks.Length; i++)
            {
                if (tt.weeks[i] != null)
                {
                    for (int j = 0; j < tt.weeks[i].days.Length; j++)
                    {
                        if (tt.weeks[i].days[j] != null)
                        {
                            for (int k = 0; k < tt.weeks[i].days[j].serverPeriods.Length; k++)
                            {
                                if (tt.weeks[i].days[j].serverPeriods[k] != null)
                                {
                                    for (int l = 0; l < tt.weeks[i].days[j].serverPeriods[k].Length; l++)
                                    {
                                        for(int m = 0; m < tt.weeks[i].days[j].serverPeriods[k][l].weeks.Length; m++)
                                        {
                                            int startIndex = request.FindIndex(r => r.WeekStart == tt.weeks[i].days[j].serverPeriods[k][l].weeks[m].start);
                                            int endIndex = request.FindIndex(req => req.WeekEnd == tt.weeks[i].days[j].serverPeriods[k][l].weeks[m].end);
                                            if(!(startIndex >= 0 && endIndex >= 0) && tt.weeks[i].days[j].serverPeriods[k][l].status != "Booked")
                                            {
                                                request.Add(new TimetableModel
                                                {
                                                    ModCode = tt.weeks[i].days[j].serverPeriods[k][l].module.name,
                                                    Day = j,
                                                    Period = tt.weeks[i].days[j].serverPeriods[k][l].period,
                                                    WeekEnd = tt.weeks[i].days[j].serverPeriods[k][l].weeks[m].end,
                                                    WeekStart = tt.weeks[i].days[j].serverPeriods[k][l].weeks[m].start,
                                                    BuildingCode = buildingCode,
                                                    ParkId = parkID,
                                                    Year = 2016,
                                                    Semester = 1
                                                });
                                                addToTable(request, tt.weeks[i].days[j].serverPeriods[k]);
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return timetable;
        }

        public void addToTable(List<TimetableModel> request, Period[] periods)
        {
            TimetableModel lastRequest = request[request.Count - 1];
            setRequest(lastRequest);
            var isOwned = new List<bool>();
            var roomRequest = new List<Rooms>();
            for (int i = 0; i < periods.Length; i++)
            {
                Rooms room = periods[i].rooms[0];
                Debug.WriteLine(room.name);
                setRoomRequest(room);
                Debug.WriteLine(getOwners(room));
                isOwned.Add(getOwners(room));
                roomRequest.Add(room);
            }

            setAssigned(roomRequest, isOwned);
        }

        public void setRequest(TimetableModel lastRequest)
        {
            string bc = getValue(lastRequest.BuildingCode);
            string park = getValue(lastRequest.ParkId.ToString());
            string colName = "";
            string parkName = "";
            if (bc.Length > 0)
            {
                bc = bc.Replace(", ", ",'");
                bc = bc + "'";
                colName = ", BuildingCode";
            }
            cmd.CommandText = "INSERT INTO Request (ModCode, Day, Period, WeekStart, WeekEnd" + colName + (parkName = park.Length > 0 ? ", ParkID" : "") + ", Year, Semester,Round)" +
                "VALUES ('" + lastRequest.ModCode + "'," + lastRequest.Day + "," + lastRequest.Period + "," + lastRequest.WeekStart + "," + lastRequest.WeekEnd + bc + park + "," + lastRequest.Year + "," + lastRequest.Semester + ",1)";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            cmd.ExecuteNonQuery();
            sqlConnection.Close();
        }

        public bool getOwners(Rooms room)
        {
            cmd.CommandText = "SELECT CASE WHEN OwnerCode IS NULL THEN 0 ELSE OwnerCode END FROM Room WHERE RoomCode = '" + room + "'";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            string ownerCode = "";
            while (reader.Read())
            {
                ownerCode = reader.GetString(0);
            }
            sqlConnection.Close();

            if(ownerCode != null)
            {
                return false;
            } 
            else
            {
                return true;
            }
        }

        public string getValue(string value)
        {
            Debug.WriteLine(value);
            if(value == "")
            {
                return "";
            }
            else
            {
                return ", " + value;
            }
        }

        public void setRoomRequest(Rooms rooms)
        {
            Debug.WriteLine(rooms.name);
            if (rooms.name != null)
            {

                int reqId = getReqId();
                
                cmd.CommandText = "INSERT INTO RoomRequest (ReqID, RoomCode)" +
                    "VALUES (" + reqId + ",'" + rooms.name + "')";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                cmd.ExecuteNonQuery();
                sqlConnection.Close();
            }
        }

        public void setAssigned(List<Rooms> rooms, List<bool> ownerCode)
        {
            int reqId = getReqId();
            if (!(ownerCode.Any(item => item == false)))
            {
                foreach (var room in rooms)
                {
                    cmd.CommandText = "INSERT INTO Assigned (ReqID, RoomCode)" +
                        "VALUES (" + reqId + ",'" + room.name + "')";
                    cmd.CommandType = System.Data.CommandType.Text;
                    cmd.Connection = sqlConnection;
                    sqlConnection.Open();
                    cmd.ExecuteNonQuery();
                    sqlConnection.Close();
                }
                cmd.CommandText = "INSERT INTO Booking (ReqID, Status)" +
                        "VALUES (" + reqId + ",'" + booked + "')";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                cmd.ExecuteNonQuery();
                sqlConnection.Close();
            }
            else
            {
                cmd.CommandText = "INSERT INTO Booking (ReqID, Status)" +
                    "VALUES (" + reqId + ",'Pending')";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                cmd.ExecuteNonQuery();
                sqlConnection.Close();
            }
            
        }

        public int getReqId()
        {
            cmd.CommandText = "SELECT MAX(ReqID) FROM Request";
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Connection = sqlConnection;
                sqlConnection.Open();
                reader = cmd.ExecuteReader();
                int reqId = 1;
                while (reader.Read())
                {
                    reqId = reader.GetInt32(0);
                }
                sqlConnection.Close();
                return reqId;
        }

        [HttpPost]
        public JsonResult updateDropDown(string table, string id, string column)
        {
            cmd.CommandText = "SELECT * FROM " + table + " WHERE " + column + " = '" + id+"'";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            var buildingList = new List<Building>();
            var roomList = new List<Room>();
            while(reader.Read())
            {
                if (table == "Building")
                {
                    buildingList.Add(new Building
                    {
                        BuildingCode = reader.GetString(0),
                        BuildingName = reader.GetString(1),
                        ParkID = reader.GetInt32(2)
                    });
                }
                else
                {
                    roomList.Add(new Room
                    {
                        RoomCode = reader.GetString(0),
                        Capacity = reader.GetInt32(1),
                        BuildingCode = reader.GetString(2)
                    });
                }
            }
            sqlConnection.Close();
            if(table == "Building")
            {
                return Json(buildingList);
            }
            return Json(roomList);
        }

        [HttpPost]
        public JsonResult getModule(string val, bool b)
        {
            string columnGet;
            string columnName;
            if (!b)
            {
                columnGet = "ModCode";
                columnName = "ModName";
            }
            else
            {
                columnGet = "ModName";
                columnName = "ModCode";
            }
            cmd.CommandText = "SELECT " + columnGet + " FROM Modules WHERE " + columnName + " = '" + val + "'";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            reader = cmd.ExecuteReader();
            string module = "";
            while (reader.Read())
            {
                module = reader.GetString(0);
            }
            Debug.WriteLine(module);
            sqlConnection.Close();
            return Json(module);
        }

        [HttpPost]
        public void releaseRequest(int reqID)
        {
            cmd.CommandText = "UPDATE Booking SET Status = 'Archived' WHERE ReqID = " + reqID;
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            cmd.ExecuteNonQuery();
            sqlConnection.Close();
        }

        [HttpPost]
        public JsonResult getAllRequests(string dept)
        {
            cmd.CommandText = "Select Request.* from Request JOIN Booking on request.ReqID=booking.reqid where request.modcode in (select  modcode from modules where Deptcode='"+dept+"')";
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Connection = sqlConnection;
            sqlConnection.Open();
            var list = new List<TimetableModel>();
            reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new TimetableModel
                {
                    ReqId = reader.GetInt32(0),
                    ModCode = reader.GetString(1),
                    Day = reader.GetInt32(2),
                    Period = reader.GetInt32(3),
                    WeekStart = reader.GetInt32(4),
                    WeekEnd = reader.GetInt32(5),
                    BuildingCode = reader.GetString(6),
                    ParkId = reader.GetInt32(7),
                    Year = reader.GetInt32(8),
                    Semester = reader.GetInt32(9)
                });
            }
            sqlConnection.Close();
            return Json(list);
        }

    }
}