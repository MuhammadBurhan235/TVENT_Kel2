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

app.get("/my-event", (req, res) => {
  res.render("MyEvent/index", {
    title: "My Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
});

app.get("/profile-event", (req, res) => {
  res.render("P_Event/index", {
    title: "Provile Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
});

app.get("/join-event", (req, res) => {
  res.render("Join_Event/index", {
    title: "Join Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
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
