// .env
require("dotenv").config();


// Express
const express = require("express");
const app = express();
app.use(express.json());


// sempre depois de executar o express devemos criar a configuração do cors antes da execução dos "ROUTERS"!!
// Configuração Cors
const cors = require("cors");
app.use(cors({ origin: process.env.REACT_APP_URL }));


// Configuração e execução MongoDB
require("./config/db.config")();


// Routers
const userRouter = require( "./router/user.routes" )
app.use( "/", userRouter );


const meetingRouter = require( "./router/meeting.routes" )
app.use( "/", meetingRouter );


// Executando Server
app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
