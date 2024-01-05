// const Event = require("../models/EventModel.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const showSekre = async (req, res) => {
  try {
    const sekreDash = await prisma.user_registered.findMany();
    const user = await prisma.user.findMany();
    console.log(sekreDash);
    console.log(user);
    res.render("sekreDash/sekreDash.ejs", {
      title: "Sekretaris",
      layout: "layouts/bs-layout",
      phone_number: "+62 858 1564 8255",
      sekreDash: sekreDash,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
};

const profileUser = async (req, res) => {
  const userEmail = req.session.user;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      nama_depan: true,
      nama_belakang: true,
      email: true,
      phone: true,
      gender: true,
      nim: true,
      fakultas: true,
      program_studi: true,
    },
  });
  res.render("Profile/Profile.ejs", {
    title: "Profile",
    layout: "layouts/main-layout",
    user: user,
    userEmail: userEmail,
    phone_number: "+62 858 1564 8255",
  });
};

const verifPanitia = async (req, res) => {
  const userregisID = parseInt(req.params.userregisID);
  const newStatus = req.body.status;
  const newjabatan = req.body.jabatan;
  try {
    const updateduserregister = await prisma.user_registered.update({
      where: { id: userregisID },
      data: {
        status: newStatus,
        jabatan: newjabatan,
      },
    });
    console.log(updateduserregister);
    res.status(401).redirect("/sekretaris");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMainPage = async (req, res) => {
  res.render("Main_Page/index", {
    phone_number: "+62 858 1564 8255",
    title: "Main Page",
    layout: "layouts/main-layout",
  });
};

const gallery = async (req, res) => {
  res.render("Main_Page/Gallery", {
    title: "Galery Page",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
};

module.exports = {
  showSekre,
  profileUser,
  verifPanitia,
  gallery,

  getMainPage,
};
