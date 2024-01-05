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

const showSekreJabatan =  async (req, res) => {
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

// const eventSekre = async (req, res) => {
//   const eventSekreid = parseInt(req.params.eventSekreid);
//   try {
//     const sekreDash = await prisma.user_registered.findMany();
//     const user = await prisma.user.findMany();
//     const event = await prisma.event.findUnique({
//       where:{
//         id: eventSekreid,
//       },
//       select:{
//         nama_event: true,
//       },
//     });
//     console.log(event);
//     res.render("sekreDash/sekreDash.ejs", {
//       title: "Sekretaris",
//       layout: "layouts/bs-layout",
//       phone_number: "+62 858 1564 8255",
//       sekreDash: sekreDash,
//       user: user,
//       event : event,
//     });
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     res.status(500).send("Internal Server Error"); 
//   }
// };

module.exports = {
  showSekre,
  showSekreJabatan,
  // eventSekre,
};
