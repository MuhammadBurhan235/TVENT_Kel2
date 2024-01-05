const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const logIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user);

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
    console.error("Login error:", error);
    res.status(500).redirect("/login");
  }
};

const getLogIn = async (req, res) => {
  res.render("Login_Register/login_register", {
    title: "Login",
    layout: "layouts/bs-layout",
  });
};

const notLoggedInMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

const getSignUp = async (req, res) => {
  res.render("Signup/signup", {
    title: "Sign Up",
    layout: "layouts/bs-layout",
  });
};

const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      nama_depan,
      nama_belakang,
      phone,
      gender,
      nim,
      fakultas,
      program_studi,
    } = req.body;

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

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const logOut = async (req, res) => {
  res.render("Login_Register/login_register", {
    title: "Login",
    layout: "layouts/bs-layout",
  });
};

module.exports = {
  logOut,

  logIn,
  signUp,
  getLogIn,
  getSignUp,
  notLoggedInMiddleware,
};
