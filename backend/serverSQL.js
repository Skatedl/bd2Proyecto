const express = require("express");
const mysql = require("mysql2");
const { createClient } = require("redis");
const cors = require("cors");
const {v4: uuidv4} = require("uuid");

const app = express(); //Inicializacion de mysql
const client = createClient(); //Inicializacion de redis
app.use(express.json()); // inicializacion de cors

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

//Conexion a redis usamos funcion asincronica, porque no estamos usando esm
client.on("error", (err) => console.log("Redis error de conexión", err));

(async () => { 
    await client.connect();
    console.log("Conectado a Redis");
})();

//Conexion a la BD SQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
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

    connection.query(sql, [cedula], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0 && password == result[0].COD_USER) {
            const usuario = result[0];
            const token = uuidv4();

            try {
                await client.set(token, JSON.stringify(usuario), {
                    expiration: {
                        type: 'EX',
                        value: 3600
                    }
                });
                res.json({
                    login: true,
                    token: token,
                    usuario: usuario
                });

                console.log(`Token guardado en redis para ${cedula}`);
            } catch (redisError) {
                console.error("Error guardando en Redis:", redisErr);
                res.status(500).send("Error al crear la sesión");
            }

        } else {
            res.json({ login: false, message: "Credenciales inválidas" });
        }
    });
});

app.post("/logout", async (req, res) => {
    const token = req.body.token

    try{
        if (token && typeof token === 'string') {
            await client.del(token); // <-- PASAMOS EL STRING DIRECTO
            console.log("Sesión eliminada de Redis con éxito");
            return res.json({ logout: true });
        } else {
            console.log("Token no válido o no recibido:", token);
            return res.status(400).json({ error: "Token inválido" });
        }
    } catch(error){
        console.error('Error al borrar de redis:', error);
        res.status(500).json({logout: false, error: 'Error en el servidor'})   
    }
})

//Siempre luego de los endpoiont
app.listen(3001, () => {
    console.log("Servidor corriendo en puerto 3001");
});