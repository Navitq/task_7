const express = require("express");
const formidable = require("express-formidable");
const db = require("./db");
const session = require("express-session");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser("secretPsswrd"));

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "secretPsswrd",
    })
);

const server = createServer(app);

app.get("/sign_up", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
})

app.get("/sign_in", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
})

app.post("/sign_in", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }

    try {
        const result = await db.query(
            `SELECT * from clientslist WHERE phone='${req.fields.phone}' and password='${req.fields.password}'`
        );
        if (result.rowCount < 1) {
            res.status(401).send("Login or password error!");
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
    req.session.auth = true;
    req.session.phone = req.fields.phone;
    res.json({ auth: true });
    return;
});

app.post("/sign_up", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }

    try {
        const result = await db.query(
            `SELECT * from clientslist WHERE phone='${req.fields.phone}'`
        );
        if (result.rowCount >= 1) {
            res.json({ auth: "This user is already registered" });
            return;
        }
    } catch (err) {
        console.error(err);
        es.status(500).send("Internal Server Error");
    }
    try {
        const result = await db.query(
            `INSERT INTO clientslist(email, userName, password, phone, img , lastVisit) VALUES ('${req.fields.email}','${req.fields.name}','${req.fields.password}','${req.fields.phone}','${req.fields.img}','${(new Date()).toLocaleDateString('ru-RU', {year: 'numeric',month: '2-digit',day: '2-digit'})}')`
        );
        req.session.auth = true;
        req.session.email = req.fields.phone;
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
    res.json({ auth: true });
    return;
});

app.delete('/log_out', async (req, res) => { 
    delete req.session.auth;
    req.session.destroy();
})

const io = new Server(server, {
    maxHttpBufferSize: 5e7,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connect", (socket) => {
    socket.on("get_chats", () => {});

    socket.on("get_messages", () => {});

    socket.on("change_message", () => {});

    socket.on("delete_message", () => {});

    socket.on("send_message", () => {});
});





server.listen(4000, async (req, res) => {
    try {
        await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await db.query(`
        CREATE TABLE IF NOT EXISTS clientslist(
            id SERIAL PRIMARY KEY,
            user_id UUID DEFAULT Uuid_generate_v4 (),
            email  varchar not null UNIQUE,
            userName varchar not null,
            phone varchar not null UNIQUE,
            img varchar not null,
            regDate  TIMESTAMPTZ,
            lastVisit varchar(64) not null,
            password varchar not null
         )
        `);

        await db.query(`
        CREATE TABLE IF NOT EXISTS chats(
            id SERIAL PRIMARY KEY,
            chat_id UUID DEFAULT Uuid_generate_v4 (),
            first_user varchar not null,
            second_user varchar not null,
            createdate  TIMESTAMPTZ
        )
        `);

        await db.query(`
        CREATE TABLE IF NOT EXISTS messages(
            id SERIAL PRIMARY KEY,
            chat_id varchar not null,
            message varchar ,
            file_id varchar ,
            senddate  TIMESTAMPTZ
        )
        `);
    } catch (err) {
        console.error(err);
        //res.status(500).send("Internal Server Error");
        return;
    }
});
