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

        const result = await MeetingModel.findOne({
          meetingID: id,
        });

        return res.status(201).json(result);
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

router.get(
  "/allmeeting",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const response = await MeetingModel.find({});

      return res.status(200).json(response);
    } catch (err) {
      console.log(err);
      return res.status.json({ msg: "There is no meeting to show." });
    }
  }
);

router.delete(
  "/delete/meeting/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const response = await MeetingModel.deleteOne({
        _id: id,
      });

      if (response.n === 0) {
        return res.status(404).json({ msg: "Post not found" });
      }

      return res.status(200).json({});
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Meeting not found." });
    }
  }
);

router.delete(
  "/delete/:id/assignation/:assignation",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id, assignation } = req.params;

      const response = await MeetingModel.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            meetings: {
              _id: assignation,
            },
          },
        }
      );

      const result = await MeetingModel.findById({
        _id: id,
      });

      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Asignation not found." });
    }
  }
);

module.exports = router;
