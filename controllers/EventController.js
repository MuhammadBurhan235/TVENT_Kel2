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
      klasifikasi_divisi: req.body.divisi.join(", "),
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
      title: "List Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error;
  }
};
const getBuatEvent = async (req, res) => {
  try {
    const userEmail = req.session.user;
  } catch (error) {
    console.error("ada masalah, Error: " + error);
  }

  res.render("Buat_Event/index", {
    title: "Buat Event",
    layout: "layouts/main-layout",
    phone_number: "+62 858 1564 8255",
  });
};

const profileEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);
  try {
    const userEmail = req.session.user;

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        nama_event: true,
        deskripsi_event: true,
        poster_event: true,
        klasifikasi_divisi: true,
      },
    });

    if (!event) {
      // Handle the case where the user is not found
      return res.status(404).send("User not found");
    }
    console.log(event);

    res.render("P_Event/index", {
      title: "Profile Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      eventId,
      event: event,
    });
  } catch (error) {
    console.error("Error in /join-event route:", error);
    res.status(500).send("Internal Server Error");
  }
};

let currentEventId;
const getJoinEvent = async (req, res) => {
  try {
    currentEventId = Number(req.params.eventId);
    const divisi = req.params.divisi;

    const eventData = await prisma.event.findUnique({
      where: {
        id: currentEventId,
      },
      select: {
        nama_event: true,
        deskripsi_event: true,
      },
    });

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

    const isEventCreator = await prisma.event.findFirst({
      where: {
        id: currentEventId,
        email_event: userEmail,
      },
    });

    const isUserAccepted = await prisma.user_registered.findFirst({
      where: {
        user_nim: userEmail,
        event_id: currentEventId,
        status: "ACCEPTED",
      },
    });

    if (isUserAccepted) {
      return res.redirect(`/profile-event/${currentEventId}`);
    }

    if (isEventCreator) {
      return res.redirect(`/profile-event/${currentEventId}`);
    }

    res.render("Join_Event/index", {
      title: "Join Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      eventId: currentEventId,
      event: eventData,
      divisi: divisi,
      user: user,
    });
  } catch (error) {
    console.error("Error in /join-event route:", error);
    res.status(500).send("Internal Server Error");
  }
};

const joinEvent = async (req, res) => {
  try {
    const eventId = currentEventId;
    const { alasan_join, cv, divisi } = req.body;
    const userEmail = req.session.user;

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    const eventData = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        nama_event: true,
        deskripsi_event: true,
      },
    });

    console.log(divisi);
    const newUserRegistered = await prisma.user_registered.create({
      data: {
        user_nim: user.nim,
        event_id: eventId,
        alasan_join,
        cv,
        divisi: divisi,
      },
    });

    res.redirect(`/profile-event/${eventId}`);
  } catch (error) {
    console.error("Error in /join-event route:", error);
    res.status(500).send("Internal Server Error");
  }
};

const myEvent = async (req, res) => {
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

    const userEvents = await prisma.user_registered.findMany({
      where: {
        user_nim: user.nim,
      },
      include: {
        event: {
          select: {
            id: true,
            nama_event: true,
            klasifikasi_divisi: true,
            poster_event: true,
            email_event: true,
          },
        },
      },
    });

    const userCreatedEvents = await prisma.event.findMany({
      where: {
        email_event: userEmail,
      },
      select: {
        id: true,
        nama_event: true,
        klasifikasi_divisi: true,
        poster_event: true,
        email_event: true,
      },
    });

    const allUserEvents = [...userEvents, ...userCreatedEvents];

    const currentPage = Math.max(1, parseInt(req.query.page, 10)) || 1;
    const EVENTS_PER_PAGE = 3;
    const totalEvents = allUserEvents.length;
    const totalPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);
    const eventsToShow = allUserEvents.slice(
      (currentPage - 1) * EVENTS_PER_PAGE,
      currentPage * EVENTS_PER_PAGE
    );

    res.render("MyEvent/index", {
      title: "My Event",
      layout: "layouts/main-layout",
      phone_number: "+62 858 1564 8255",
      userEvents: eventsToShow,
      currentPage: currentPage,
      totalPages: totalPages,
      EVENTS_PER_PAGE: EVENTS_PER_PAGE,
    });
  } catch (error) {
    console.error("Error in /my-event route:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  profileEvent,
  myEvent,
  listEvents,

  createEvent,
  getBuatEvent,
  joinEvent,
  getJoinEvent,
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
