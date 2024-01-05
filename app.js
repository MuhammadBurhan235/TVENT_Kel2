const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const EventRoute = require("./routes/EventRoute");
const UserRoute = require("./routes/UserRoute");
const AuthRoute = require("./routes/AuthRoute");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userAuthMiddleware = require("./middleware/userAuthMiddleware");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const port = 3253;
const expressLayouts = require("express-ejs-layouts");
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 604800000,
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static("public"));
app.use(UserRoute);
app.use(AuthRoute);
app.use(EventRoute);

app.use("/login", (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
});

// app.get("/login", (req, res) => {
//   res.render("Login_Register/login_register", {
//     title: "Login",
//     layout: "layouts/bs-layout",
//   });
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   try {
// const user = await prisma.user.findUnique({
//   where: {
//     email: email,
//   },
// });
//     console.log(user);

//     if (!user) {
//       return res.status(401).redirect("/login");
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//       req.session.user = email;
//       res.redirect("/");
//     } else {
//       res.status(401).redirect("/login");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).redirect("/login");
//   }
// });

// app.get("/signup", notLoggedInMiddleware, (req, res) => {
//   res.render("Signup/signup", {
//     title: "Sign Up",
//     layout: "layouts/bs-layout",
//   });
// });

// app.post("/signup", notLoggedInMiddleware, async (req, res) => {
//   try {
//     const {
//       email,
//       password,
//       nama_depan,
//       nama_belakang,
//       phone,
//       gender,
//       nim,
//       fakultas,
//       program_studi,
//     } = req.body;

//     // Hash password sebelum menyimpan ke database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Simpan data pengguna ke dalam database
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         nama_depan,
//         nama_belakang,
//         phone,
//         gender,
//         nim,
//         fakultas,
//         program_studi,
//       },
//     });

//     res.redirect("/login");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create user" });
//   }
// });

app.use("/", (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
});

// app.get("/", (req, res) => {
//   res.render("Main_Page/index", {
//     phone_number: "+62 858 1564 8255",
//     title: "Main Page",
//     layout: "layouts/main-layout",
//   });
// });

// app.get("/gallery", (req, res) => {
//   res.render("Main_Page/Gallery", {
//     title: "Galery Page",
//     layout: "layouts/main-layout",
//     phone_number: "+62 858 1564 8255",
//   });
// });

// app.get("/list-event", async (req, res) => {
//   try {
//         const events = await prisma.event.findMany({
//       where: {
//         status: "ACCEPTED"
//       },
//       select: {
//         id: true,
//         nama_event: true,
//         deskripsi_event: true,
//         kepanitiaan_mulai: true,
//       },
//     });
//     res.render("List_Event_Page/index", {
//       title: "List Event",
//       layout: "layouts/main-layout",
//       phone_number: "+62 858 1564 8255",
//       events: events,
//     });
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     throw error;
//   }
// });

// app.get("/profile-event/:eventId", async (req, res) => {
//   const eventId = Number(req.params.eventId);
//   try {
//     const userEmail = req.session.user;

//     const event = await prisma.event.findUnique({
//       where: {
//         id: eventId,
//       },
//       select: {
//         nama_event: true,
//         deskripsi_event: true,
//         poster_event: true,
//         klasifikasi_divisi: true,
//       },
//     });

//     if (!event) {
//       // Handle the case where the user is not found
//       return res.status(404).send("User not found");
//     }
//     console.log(event);

//     res.render("P_Event/index", {
//       title: "Profile Event",
//       layout: "layouts/main-layout",
//       phone_number: "+62 858 1564 8255",
//       eventId,
//       event: event,
//       // nama_event: event.nama_event,
//       // eventId: eventId,
//       // deskripsi_event: event.deskripsi_event,
//       // klasifikasi_divisi: event.klasifikasi_divisi.split(", "),
//       // user: {
//       //   name: fullName,
//       //   email: user.email,
//       // },
//     });
//   } catch (error) {
//     console.error("Error in /join-event route:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/:eventId/join-event/:divisi", async (req, res) => {
//   try {
//     currentEventId = Number(req.params.eventId);
//     const divisi = req.params.divisi;

//     const eventData = await prisma.event.findUnique({
//       where: {
//         id: currentEventId,
//       },
//       select: {
//         nama_event: true,
//         deskripsi_event: true,
//       },
//     });

//     const userEmail = req.session.user;

//     const user = await prisma.user.findUnique({
//       where: {
//         email: userEmail,
//       },
//       select: {
//         nama_depan: true,
//         nama_belakang: true,
//         email: true,
//       },
//     });

//     const isEventCreator = await prisma.event.findFirst({
//       where: {
//         id: currentEventId,
//         email_event: userEmail,
//       },
//     });

//     const isUserAccepted = await prisma.user_registered.findFirst({
//       where: {
//         user_nim: userEmail,
//         event_id: currentEventId,
//         status: "ACCEPTED",
//       },
//     });

//     if (isUserAccepted) {
//       return res.redirect(`/profile-event/${currentEventId}`);
//     }

//     if (isEventCreator) {
//       return res.redirect(`/profile-event/${currentEventId}`);
//     }

//     res.render("Join_Event/index", {
//       title: "Join Event",
//       layout: "layouts/main-layout",
//       phone_number: "+62 858 1564 8255",
//       eventId: currentEventId,
//       event: eventData,
//       divisi: divisi,
//       user: user,
//     });
//   } catch (error) {
//     console.error("Error in /join-event route:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/:eventId/join-event/:divisi", async (req, res) => {
//   try {
//     const eventId = currentEventId;
//     const { alasan_join, cv, divisi } = req.body;
//     const userEmail = req.session.user;

//     const user = await prisma.user.findUnique({
//       where: {
//         email: userEmail,
//       },
//     });

//     const eventData = await prisma.event.findUnique({
//       where: {
//         id: eventId,
//       },
//       select: {
//         nama_event: true,
//         deskripsi_event: true,
//       },
//     });

//     console.log(divisi);
//     const newUserRegistered = await prisma.user_registered.create({
//       data: {
//         user_nim: user.nim,
//         event_id: eventId,
//         alasan_join,
//         cv,
//         divisi: divisi,
//       },
//     });

//     res.redirect(`/profile-event/${eventId}`);
//   } catch (error) {
//     console.error("Error in /join-event route:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/my-event", async (req, res) => {
//   try {
//     const userEmail = req.session.user;
//     const user = await prisma.user.findUnique({
//       where: {
//         email: userEmail,
//       },
//       select: {
//         nim: true,
//       },
//     });

//     const userEvents = await prisma.user_registered.findMany({
//       where: {
//         user_nim: user.nim,
//       },
//       include: {
//         event: {
//           select: {
//             id: true,
//             nama_event: true,
//             klasifikasi_divisi: true,
//             poster_event: true,
//             email_event: true,
//           },
//         },
//       },
//     });

//     const userCreatedEvents = await prisma.event.findMany({
//       where: {
//         email_event: userEmail,
//       },
//       select: {
//         id: true,
//         nama_event: true,
//         klasifikasi_divisi: true,
//         poster_event: true,
//         email_event: true,
//       },
//     });

//     const allUserEvents = [...userEvents, ...userCreatedEvents];

//     const currentPage = Math.max(1, parseInt(req.query.page, 10)) || 1;
//     const EVENTS_PER_PAGE = 3;
//     const totalEvents = allUserEvents.length;
//     const totalPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);
//     const eventsToShow = allUserEvents.slice(
//       (currentPage - 1) * EVENTS_PER_PAGE,
//       currentPage * EVENTS_PER_PAGE
//     );

//     res.render("MyEvent/index", {
//       title: "My Event",
//       layout: "layouts/main-layout",
//       phone_number: "+62 858 1564 8255",
//       userEvents: eventsToShow,
//       currentPage: currentPage,
//       totalPages: totalPages,
//       EVENTS_PER_PAGE: EVENTS_PER_PAGE,
//     });
//   } catch (error) {
//     console.error("Error in /my-event route:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/buat-event", async (req, res) => {
//   try{
//     const userEmail = req.session.user;

//   }
//   catch(error){
//     console.error("ada masalah, Error: " +  error)

//   }

//     res.render("Buat_Event/index", {
//       title: "Buat Event",
//       layout: "layouts/main-layout",
//       phone_number: "+62 858 1564 8255",
//     });
// });

// app.post("/buat-event", async (req,res)=>{
//   try{
//   const userEmail = req.session.user;

//  console.log(req.session.user)/
//  console.log(req.body)
//  const eventData = {
//  email_event: req.session.user,
//  nama_event: req.body.nama_event,
//  deskripsi_event: req.body.deskripsi_event,
//  penyelenggara_event: req.body.penyelenggara_event,
//  klasifikasi_divisi: req.body.divisi.join(', '),
//  benefit_event: req.body.benefit_event,
//  poster_event: req.body.poster_event,
//  kepanitiaan_mulai: new Date(req.body.kepanitiaan_mulai),
//  kepanitiaan_selesai: new Date(req.body.kepanitiaan_selesai),
//  event_mulai: new Date(req.body.event_mulai),
//  event_selesai: new Date(req.body.event_selesai),
//   }
//      console.log(eventData)
//      // console.log(data);
//      const newEvent = await prisma.event.create({
//        data: eventData
//       })
//      console.log("data baru berasil diinput")
//      res.redirect("/")
//   }
//   catch(error){
//     console.error("ada masalah, Error: " +  error)
//   }
// });

// app.get("/profile-user", async (req, res) => {
//   const userEmail = req.session.user;

//   const user = await prisma.user.findUnique({
//     where: {
//       email: userEmail,
//     },
//     select: {
//       nama_depan: true,
//       nama_belakang: true,
//       email: true,
//       phone: true,
//       gender: true,
//       nim: true,
//       fakultas: true,
//       program_studi: true,
//     },
//   });
//   res.render("Profile/Profile.ejs", {
//     title: "Profile",
//     layout: "layouts/main-layout",
//     user: user,
//     userEmail: userEmail,
//     phone_number: "+62 858 1564 8255",
//   });
// });

// app.get("/sekretaris", async (req, res) => {
//   try {
//     const sekreDash = await prisma.user_registered.findMany();
//     const user = await prisma.user.findMany();
//     console.log(sekreDash);
//     console.log(user);
//     res.render("sekreDash/sekreDash.ejs", {
//       title: "Sekretaris",
//       layout: "layouts/bs-layout",
//       phone_number: "+62 858 1564 8255",
//       sekreDash: sekreDash,
//       user: user,
//     });
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     res.status(500).send("Internal Server Error"); // Handle the error gracefully
//   }
// });

// app.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     res.redirect("/login");
//   });
// });

// app.get("/admin", async (req, res) => {
//   try {
//     const events = await prisma.event.findMany();
//     res.render("adminTventDash/adminSWDash", {
//       title: "Admin",
//       layout: "layouts/main-layout",
//       phone_number: "+62 858 1564 8255",
//       events: events,
//     });
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     throw error;
//   }
// });

// app.post("/verif/:eventId", async (req, res) => {
//   const eventId = parseInt(req.params.eventId);
//   const newStatus = req.body.status;

//   try {
//     const updatedEvent = await prisma.event.update({
//       where: { id: eventId },
//       data: {
//         status: newStatus,
//       },
//     });

//     res.status(401).redirect("/admin");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.post("/verifikasi/:userregisID", async (req, res) => {
//   const userregisID = parseInt(req.params.userregisID);
//   const newStatus = req.body.status;
//   const newjabatan = req.body.jabatan;
//   try {
//     const updateduserregister = await prisma.user_registered.update({
//       where: { id: userregisID },
//       data: {
//         status: newStatus,
//         jabatan: newjabatan,
//       },
//     });
//     console.log(updateduserregister);
//     res.status(401).redirect("/sekretaris");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, Link= http://localhost:${port}/`
  );
});
