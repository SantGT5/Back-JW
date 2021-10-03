// Criar rotas usando Express
const router = require("express").Router();
// Criptografar PassWord
const bcrypt = require("bcryptjs");
const salt_rounds = 10;
// Modelos
const UserModel = require("../models/User.model");
// const PostModel = require("../models/Post.model");
// Gerar token para User logado
const generateToken = require("../config/jwt.config");
// Autentificações de User
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
// const uploader = require("../config/cloudinary.config");

router.post("/signup", async (req, res) => {
  try {
    const { password, email, name } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }

    if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm)) {
      return res.status(400).json({
        msg: "Invalid E-mail",
      });
    }

    const userEmail = await UserModel.findOne({ email });

    if (userEmail) {
      return res.status(404).json({ msg: "E-mail already exists" });
    }

    // Gera o salt
    const salt = await bcrypt.genSalt(salt_rounds);

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro

    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    // Responder o usuário recém-criado no banco para o cliente (solicitante). O status 201 significa Created
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // O status 500 signifca Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Extraindo o email e senha do corpo da requisição
    const { email, password } = req.body;

    // Pesquisar esse usuário no banco pelo email
    const user = await UserModel.findOne({ email });

    // Se o usuário não foi encontrado, significa que ele não é cadastrado

    if (
      !email ||
      !user ||
      !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm)
    ) {
      return res.status(400).json({
        msg: "La dirección de correo o la contraseña no son correctas.",
      });
    }

    if (!password) {
      return res.status(400).json({
        msg: "Wrong password or email",
      });
    }

    // Verificar se a senha do usuário pesquisado bate com a senha recebida pelo formulário

    if (await bcrypt.compare(password, user.passwordHash)) {
      // Gerando o JWT com os dados do usuário que acabou de logar
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
        token,
      });
    } else {
      return res.status(401).json({
        msg: "Sorry, your password or email password was incorrect.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.put(
  "/edite/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const formData = req.body;
      const { email, name } = req.body;
      const loggedInUser = req.currentUser;

      if (email.length <= 0) {
        return res.status(404).json({ msg: "Field E-mail is required." });
      }

      if (name.length <= 0) {
        return res.status(404).json({ msg: "Field name is required." });
      }

      if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm)) {
        return res.status(400).json({
          msg: "Please use a valid email address",
        });
      }

      const foundEmail = await UserModel.findOne({ email: email });

      if (foundEmail === null || foundEmail.email === loggedInUser.email) {
        const response = await UserModel.findByIdAndUpdate(
          { _id: id },
          { ...formData },
          { new: true }
        );
        return res.status(200).json(response);
      }

      if (foundEmail.email && foundEmail.email != loggedInUser.email) {
        return res.status(400).json({
          msg: "E-mail already exists.",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(404).json({ msg: "Error Page" });
    }
  }
);

router.post("/search", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const { name } = req.body;

    const response = await UserModel.find({
      name: {
        $regex: name.toLowerCase(),
        $options: "i",
      },
    });
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "User not found" });
  }
});

router.get("/alluser", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const response = await UserModel.find({});

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "No user registered" });
  }
});

// router.post("/uploaduser", uploader.single("imgUser"), (req, res) => {
//   if (!req.file) {
//     return res.status(500).json({ msg: "Please, add available image" });
//   }
//   return res.status(201).json({ url: req.file.path });
// });

// router.post(
//   "/profile/:name",
//   isAuthenticated,
//   attachCurrentUser,
//   async (req, res) => {
//     try {
//       const { name } = req.params;

//       const response = await UserModel.findOne({
//         name: name,
//       });

//       return res.status(200).json(response);
//     } catch (err) {
//       console.log(err.response);
//     }
//   }
// );

module.exports = router;
