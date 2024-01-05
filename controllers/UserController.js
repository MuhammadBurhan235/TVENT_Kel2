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
module.exports = {
  showSekre,
};
