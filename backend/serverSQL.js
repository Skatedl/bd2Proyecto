const express = require("express");
const mysql = require("mysql2");
const { createClient } = require("redis");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis error de conexión:", err));

const dbConfig = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "12345",
    database: "matriculaSanJose"
};

const connection = mysql.createConnection(dbConfig);

const startServer = () => {
    app.listen(3001, () => {
        console.log("Servidor corriendo en puerto 3001");
    });
};

const connectDatabase = () => {
    connection.connect((err) => {
        if (err) {
            console.error("Error de conexión a MySQL:", err);
            process.exit(1);
        }

        console.log("Conectado a la BD");
        startServer();
    });
};

(async () => {
    try {
        await redisClient.connect();
        console.log("Conectado a Redis");
    } catch (err) {
        console.error("No se pudo conectar a Redis:", err);
    }

    connectDatabase();
})();

app.post("/usuarios", (req, res) => {
    const { nombre, fechaNacimiento, correo } = req.body;

    if (!nombre || !fechaNacimiento || !correo) {
        return res.status(400).json({ error: "Faltan datos obligatorios para crear el usuario." });
    }

    const sql = "INSERT INTO USUARIO (NOMBRE, FECHA_NAC, CORREO) VALUES (?, ?, ?)";
    connection.query(sql, [nombre, fechaNacimiento, correo], (err, result) => {
        if (err) {
            console.error("Error insertando usuario:", err);
            return res.status(500).json({ error: "Error del servidor al crear el usuario." });
        }

        res.status(201).json({ message: "Usuario creado con éxito", insertId: result.insertId });
    });
});

app.post("/login", (req, res) => {
    const { cedula, password } = req.body;
    const sql = "SELECT * FROM USUARIO WHERE COD_USER = ?";

    connection.query(sql, [cedula], async (err, result) => {
        if (err) {
            console.error("Error en login SQL:", err);
            return res.status(500).json({ error: "Error al verificar credenciales." });
        }

        if (result.length > 0 && password == result[0].COD_USER) {
            const usuario = result[0];
            const token = uuidv4();

            try {
                await redisClient.set(token, JSON.stringify(usuario), {
                    expiration: { type: "EX", value: 3600 }
                });
                return res.json({ login: true, token, usuario });
            } catch (redisError) {
                console.error("Error guardando en Redis:", redisError);
                return res.status(500).json({ error: "Error al crear la sesión." });
            }
        }

        return res.json({ login: false, message: "Credenciales inválidas" });
    });
});

app.post("/logout", async (req, res) => {
    const token = req.body.token;

    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Token inválido" });
    }

    try {
        await redisClient.del(token);
        return res.json({ logout: true });
    } catch (error) {
        console.error("Error al borrar sesión de Redis:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
});

app.get("/perfil", async (req, res) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ error: "No se recibió token" });
    }

    try {
        const sesion = await redisClient.get(token);
        if (!sesion) {
            return res.status(401).json({ error: "Sesión expirada" });
        }

        const usuarioRedis = JSON.parse(sesion);
        const sql = `
            SELECT u.*, r.NOMBRE_TIPO as ROL
            FROM USUARIO u
            JOIN USUARIO_ROL ur ON u.COD_USER = ur.USUARIO_COD_USER
            JOIN ROL r ON ur.ROL_COD_TIPO = r.COD_TIPO
            WHERE u.COD_USER = ?`;

        connection.query(sql, [usuarioRedis.COD_USER], (err, results) => {
            if (err) {
                console.error("Error SQL perfil:", err);
                return res.status(500).json({ error: "Error al consultar perfil." });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const datosCompletos = results[0];
            datosCompletos.esAdmin = datosCompletos.ROL === "ADMINISTRADOR";
            return res.json(datosCompletos);
        });
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
});