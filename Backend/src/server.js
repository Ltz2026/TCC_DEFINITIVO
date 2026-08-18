const express = require("express");
const cors = require("cors");

const connectDatabase = require("./database/connection.js");

const produtoRoutes = require("./routes/produtoRoutes.js");
const usuarioRoutes = require("./routes/usuarioRoutes.js");

const app = express();

const PORT = 3001;

app.use(cors());

app.use(express.json());

connectDatabase();

console.log("Rotas carregadas");

app.use("/produtos", produtoRoutes);

app.use("/usuarios", usuarioRoutes);

app.get("/", (req, res) => {

    res.json({
        mensagem: "API da Loja funcionando!",
        status: "online"
    });

});

app.get("/teste", (req, res) => {

    res.json({
        mensagem: "Servidor de teste funcionando!"
    });

});

app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

    console.log(
        `http://localhost:${PORT}`
    );

});