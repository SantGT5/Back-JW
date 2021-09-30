// Criar rotas usando Express
const router = require("express").Router();

// Modelos
const MeetingModel = require("../models/Meeting.model");

// Autentificações de User
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post(
  "/meeting",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { name, timer } = req.body;
      console.log(name, timer);
      const response = await MeetingModel.create({
        meetings: [
          {
            name: name,
            timer: timer,
          },
        ],
      });

      console.log(response);
      return res.status(201).json(response);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        msg: "An error occured during your submission. Please, try again.",
      });
    }
  }
);

module.exports = router;
