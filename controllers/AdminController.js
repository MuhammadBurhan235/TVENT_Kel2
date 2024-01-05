// const Event = require("../models/EventModel.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAdminPage = async (req, res) => {
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
};

const verifEvent = async (req, res) => {
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
};

module.exports = {
  verifEvent,

  getAdminPage,
};
