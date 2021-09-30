// Criar rotas usando Express
const router = require("express").Router();

// Modelos
const MeetingModel = require("../models/Meeting.model");

// Autentificações de User
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post(
  "/meeting/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { name, timer } = req.body;
      const { id } = req.params;

      console.log(id);

      const findMeetID = await MeetingModel.findOne({
        meetingID: id,
      });

      if (findMeetID) {
        const response = await MeetingModel.findOneAndUpdate(
          { meetingID: id },
          {
            $push: {
              meetings: {
                name: name,
                timer: timer,
              },
            },
          }
        );
        return res.status(201).json(response);
      } else {
        const response = await MeetingModel.create({
          meetings: {
            name: name,
            timer: timer,
          },
          meetingID: id,
        });
        return res.status(201).json(response);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        msg: "An error occured during your submission. Please, try again.",
      });
    }
  }
);

module.exports = router;
