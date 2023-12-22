const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const session = require("express-session");
const dotenv = require("dotenv")

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

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (user && password == user.password) {
    req.session.user = email;
    res.redirect("/");
  } else {
    res.redirect("/login");
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

app.get("/list-event", (req, res) => {
  res.render("List_Event_Page/index", {
    title: "List Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
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

app.get("/buat-event", (req, res) => {
  res.render("Buat_Event/index", {
    title: "Buat Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
});
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

app.get("/admin", (req, res) => {
  res.render("adminTventDash/adminSWDash.ejs", {
    title: "Admin ",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
});
app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, Link= http://localhost:${port}/`
  );
});
