const mongoose = require("mongoose");

async function connect() {
  try {
    // Não esquecer de criar variável de ambiente com endereço do seu servidor Mongo local em desenvolvimento, e o endereço do cluster do Atlas em produção
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // useCreateIndex: true, --> Não necessario na nova versão do Mongo
      // useFindAndModify: false, --> Não necessario na nova versão do Mongo
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB: ", connection.connection.name);
  } catch (err) {
    console.error("Database connection error: ", err);
  }
}

module.exports = connect;
