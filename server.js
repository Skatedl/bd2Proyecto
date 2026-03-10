const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "matriculasanjose"
});

connection.connect((err) => {
    if (err) {
        console.log("Error de conexión " + err);
        return;
    }
    console.log("Conectado a la BD");
});

app.post("/login", (req, res) => {

    const { cedula, password } = req.body;

    const sql = "SELECT * FROM usuario WHERE COD_USER = ?";

    connection.query(sql, [cedula], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0 && password == result[0].COD_USER) {

            res.json({
                login: true,
                usuario: result[0]
            });

        } else {

            res.json({
                login: false
            });

        }

    });

});

app.listen(3001, () => {
    console.log("Servidor corriendo en puerto 3001");
});