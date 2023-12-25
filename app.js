const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const session = require("express-session");
const dotenv = require("dotenv")
const bcrypt = require('bcrypt');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userAuthMiddleware = require("./middleware/userAuthMiddleware")

dotenv.config()

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const port = 3253;
const expressLayouts = require("express-ejs-layouts");

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 604800000,
  }
}))
const notLoggedInMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static("public"));



app.use("/login", (req,res,next) => {

  if(req.session && req.session.user) {
    res.redirect("/");
  } else {
    next();
  }

});

app.get("/login", (req, res) => {
  res.render("Login_Register/login_register", {
    title: "Login",
    layout: "layouts/bs-layout",
  });
});



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user)

    if (!user) {
      return res.status(401).redirect("/login");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = email;
      res.redirect("/");
    } else {
      res.status(401).redirect("/login");
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).redirect("/login");
  }
});


app.get('/signup', notLoggedInMiddleware, (req, res) => {
  res.render("Signup/signup", {
    title: "Sign Up",
    layout: "layouts/bs-layout",
  });
});

app.post('/signup', notLoggedInMiddleware, async (req, res) => {
  try {
    const { email, password, nama_depan, nama_belakang, phone, gender, nim, fakultas, program_studi } = req.body;

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan data pengguna ke dalam database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nama_depan,
        nama_belakang,
        phone,
        gender,
        nim,
        fakultas,
        program_studi,
      },
    });

    req.session.user = email;
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


app.use("/", (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
})

app.get("/", (req, res) => {
  res.render("Main_Page/index", {
    phone_number: "+62 858 1564 8255",
    title: "Main Page",
    layout: "layouts/main-layout",
  });
});

app.get("/gallery", (req, res) => {
  res.render("Main_Page/Gallery", {
    title: "Galery Page",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
});

app.get("/list-event", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.render("List_Event_Page/index", {
      title: "List Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error;
  }
});

app.get("/my-event", async (req, res) => {
  try {
    const dummyEvents = [
      {
        id: 1,
        nama_event: "Islah 2023",
        klasifikasi_divisi: "Divisi Acara",
        imagePath: "/img/tu1.jpg",
      },
      {
        id: 2,
        nama_event: "Ecafest",
        klasifikasi_divisi: "Divisi Humas",
        imagePath: "/img/event.jpeg",
      },
      {
        id: 3,
        nama_event: "Abogoboga",
        klasifikasi_divisi: "Divisi Keamanan",
        imagePath: "/img/tu3.jpg",
      },
      {
        id: 4,
        nama_event: "Asidiai",
        klasifikasi_divisi: "Divisi HSE",
        imagePath: "/img/tu3.jpg",
      },
      {
        id: 5,
        nama_event: "Ululu",
        klasifikasi_divisi: "Divisi Acaca",
        imagePath: "/img/download.jpeg",
      },
    ];
    const EVENTS_PER_PAGE = 3;

    // Get the current page from the query parameters
    const currentPage = parseInt(req.query.page) || 1;

    // Calculate the total number of pages
    const totalPages = Math.ceil(dummyEvents.length / EVENTS_PER_PAGE);

    // Slice the events array based on the current page
    const eventsToShow = dummyEvents.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE);

    res.render("MyEvent/index", {
      title: "My Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      events: eventsToShow,
      currentPage: currentPage,
      totalPages: totalPages,
      EVENTS_PER_PAGE: EVENTS_PER_PAGE,
    });
  } catch (error) {
    console.error("Error in /my-event route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/profile-event", (req, res) => {
  res.render("P_Event/index", {
    title: "Provile Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
    // mengambil isi data dari event yang dipilih (berdasarkan id)
    // ubah klasifikasi event dari string menjadi array
    // kirim semua data yang sudah diambil ke frontend
  });
});

app.get("/join-event", async (req, res) => {
  try {
    const userEmail = req.session.user;

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        nama_depan: true,
        nama_belakang: true,
        email: true,
      },
    });

    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).send("User not found");
    }

    const eventData = {
      nama_event: "ISLAH 2023",
      klasifikasi_divisi: "ACARA",
    };

    const fullName = `${user.nama_depan} ${user.nama_belakang}`;

    res.render("Join_Event/index", {
      title: "Join Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      nama_event: eventData.nama_event,
      klasifikasi_divisi: eventData.klasifikasi_divisi,
      user: {
        name: fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in /join-event route:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/buat-event", async (req, res) => {
  try{
    const userEmail = req.session.user;
    
  }
  catch(error){
    console.error("ada masalah, Error: " +  error)
  
  
  }
  
  
    res.render("Buat_Event/index", {
      title: "Buat Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
    });
  });

  
app.post("/buat-event", async (req,res)=>{
  try{
    const userEmail = req.session.user;

  console.log(req.session.user)/
    console.log(req.body)
    const eventData = {
      email_event: req.session.user,
      nama_event: req.body.nama_event,
      deskripsi_event: req.body.deskripsi_event,
      penyelenggara_event: req.body.penyelenggara_event,
      klasifikasi_divisi: req.body.divisi.join(', '),
      benefit_event: req.body.benefit_event,
      poster_event: req.body.poster_event,
      kepanitiaan_mulai: new Date(req.body.kepanitiaan_mulai),
      kepanitiaan_selesai: new Date(req.body.kepanitiaan_selesai),
      event_mulai: new Date(req.body.event_mulai),
      event_selesai: new Date(req.body.event_selesai),
    }
    console.log(eventData)
    // console.log(data);
    const newEvent = await prisma.event.create({
      data: eventData
     })
    console.log("data baru berasil diinput")
    res.redirect("/")

  }
  catch(error){
    console.error("ada masalah, Error: " +  error)
  
  
  }

})
app.get("/profile", (req, res) => {
  res.render("Profile/Profile.ejs", {
    title: "Profile",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
});
app.get("/sekretaris", (req, res) => {
  res.render("sekreDash/sekreDash.ejs", {
    title: "Sekretaris ",
    layout: "layouts/bs-layout",
    phone_number: "+62 858 1564 8255",
  });
});

app.post("/logout", (req,res) => {

  req.session.destroy((err) => {
    res.redirect("/login")
  })

});

app.get("/admin", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.render("adminTventDash/adminSWDash", {
      title: "Admin",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error;
  }
});

app.post("/verif/:eventId", async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const newStatus = req.body.status;

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: newStatus,
      },
    });

    res.status(401).redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, Link= http://localhost:${port}/`
  );
});
