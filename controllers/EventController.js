// const Event = require("../models/EventModel.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createEvent = async (req, res) => {
  try {
    const userEmail = req.session.user;
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        nim: true,
      },
    });

    console.log(req.session.user) / console.log(req.body);
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
    };
    console.log(eventData);

    const newEvent = await prisma.event.create({
      data: {
        ...eventData,
        user_registered: {
          create: {
            user_nim: user.nim,
            divisi: "Inti",
            jabatan: "Ketua Pelaksana",
          },
        },
      },
    });

    console.log("data baru berhasil diinput");
    res.redirect("/");
  } catch (error) {
    console.error("ada masalah, Error: " + error);
  }
};

const listEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "ACCEPTED",
      },
      select: {
        id: true,
        nama_event: true,
        deskripsi_event: true,
        kepanitiaan_mulai: true,
      },
    });
    res.render("List_Event_Page/index", {
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error;
  }
};

module.exports = {
  createEvent,
  listEvents,
};
// const getEvents = async (req, res) => {
//   try {
//     const response = await Event.findAll();
//     res.status(200).json(response);
//   } catch {
//     console.log(error.message);
//   }
// };

// module.exports = getEvents;

// const getEventById = async (req, res) => {
//   try {
//     const response = await Event.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json(response);
//   } catch {
//     console.log(error.message);
//   }
// };

// module.exports = getEventById;

// EventController.js

// const updateEvent = async (req, res) => {
//   try {
//     await Event.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json({ msg: "Event Updated" });
//   } catch {
//     console.log(error.message);
//   }
// };

// module.exports = updateEvent;

// const deleteEvent = async (req, res) => {
//   try {
//     await Event.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json({ msg: "Event Deleted" });
//   } catch {
//     console.log(error.message);
//   }
// };

// module.exports = deleteEvent;
