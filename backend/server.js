const express = require("express");
const formidable = require("express-formidable");
const db = require("./db");
const session = require("express-session");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const { emit } = require("process");
const { writeFile, readFile } = require("fs");

const app = express();
const middlware = session({
    resave: false,
    saveUninitialized: false,
    secret: "secretPsswrd",
});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser("secretPsswrd"));

app.use(middlware);

const server = createServer(app);

app.get("/sign_up", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
    res.json({ auth: false });
    return;
});

app.get("/sign_in", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
    res.json({ auth: false });
    return;
});

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
            `SELECT * from clientslist WHERE phone='${req.fields.phone}' or email='${req.fields.email}'`
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
        await db.query(
            `INSERT INTO clientslist(email, userName, password, phone, img , lastVisit) VALUES ('${
                req.fields.email
            }','${req.fields.name}','${req.fields.password}','${
                req.fields.phone
            }','${req.fields.img}','${new Date().toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })}')`
        );
        req.session.auth = true;
        req.session.phone = req.fields.phone;

        const clientId = await db.query(
            `SELECT user_id, username, img from clientslist WHERE phone='${req.session.phone}'`
        );

        await db.query(
            `INSERT INTO chats(first_user) VALUES ('${clientId.rows[0].user_id}')`
        );
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
    res.json({ auth: true });
    return;
});

app.delete("/log_out", async (req, res) => {
    delete req.session.auth;
    req.session.destroy();
    res.json({ auth: false });
});

const io = new Server(server, {
    maxHttpBufferSize: 5e7,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
let localSocket = null;
io.engine.use(middlware);

io.on("connect", (socket) => {
    const req = socket.request;

    socket.on("get_dialogs", async (data) => {
        if (!req.session.auth) {
            return;
        }

        try {
            const clientId = await db.query(
                `SELECT user_id, username, img, phone from clientslist WHERE phone='${req.session.phone}'`
            );
            req.session.uuid = clientId.rows[0].user_id;
            const clientChats = await db.query(
                `SELECT * from chats WHERE first_user='${req.session.uuid}' or second_user='${req.session.uuid}'`
            );

            let data = await Promise.all(
                clientChats.rows.map(async (el) => {
                    let friendName = {},
                        lastMessage;

                    lastMessage = await db.query(
                        `SELECT message, file_name from messages WHERE chat_id='${el.chat_id}'`
                    );
                    if (
                        el.second_user != req.session.uuid &&
                        typeof el.second_user != typeof {} &&
                        el.second_user != "null" &&
                        el.second_user != "undefined"
                    ) {
                        friendName = await db.query(
                            `SELECT username, img, phone, user_id from clientslist WHERE user_id='${el.second_user}'`
                        );
                        friendName = friendName.rows[0];
                    } else if (
                        el.first_user != req.session.uuid &&
                        typeof el.first_user != typeof {} &&
                        el.first_user != "null" &&
                        el.first_user != "undefined"
                    ) {
                        friendName = await db.query(
                            `SELECT username, img, phone, user_id from clientslist WHERE user_id='${el.first_user}'`
                        );
                        friendName = friendName.rows[0];
                    } else {
                        friendName = clientId.rows[0];
                    }

                    friendName.message =
                        lastMessage.rows[lastMessage.rows.length - 1]?.message;
                    friendName.file_name =
                        lastMessage.rows[
                            lastMessage.rows.length - 1
                        ]?.file_name;

                    return friendName;
                })
            );
            socket.emit("got_dialogs", JSON.stringify(data));
        } catch (err) {
            console.error(err);
            es.status(500).send("Internal Server Error");
        }
    });
    
    socket.on("me", () => {
        socket.emit("me",socket.id)
    });

    socket.on("send_file", async (data, mainFile) => {
        if (!data[3]) {
            await db.query(
                `INSERT INTO messages(sender_id, chat_id, file_id, file_name) values ('${data[0]}', '${data[1]}', '${data[2]}', '${data[4]}');`
            );
        } else if (!data[1]) {
            await db.query(
                `INSERT INTO chats(first_user, second_user) values ('${data[0]}', '${data[4]}');`
            );
            let chatId = await db.query(
                `select chat_id from chats where first_user='${data[0]}' and second_user='${data[4]}'`
            );
            await db.query(
                `INSERT INTO messages(sender_id, chat_id, file_id, file_name) values ('${data[0]}', '${chatId}', '${data[2]}', '${data[4]}');`
            );
            let messId = await db.query(
                `select uuid, chat_id from messages where sender_id='${data[0]}' and chat_id='${data[1]}' and message =chat_id='${data[2]}'`
            );
            data.push(messId.rows[0]);
        } else {
            await db.query(
                `INSERT INTO messages(sender_id, chat_id, file_id, file_name) values ('${data[0]}', '${data[1]}', '${data[2]}', '${data[4]}');`
            );

            let messId = await db.query(
                `select uuid, chat_id from messages where sender_id='${data[0]}' and chat_id='${data[1]}' and message='${data[2]}'`
            );
            data.push(messId.rows[0]);
        }
        writeFile(`./files/${data[2]}`, mainFile, (err) => {
            console.log(err);
        });

        if (data[3]) {
            let userName = await db.query(
                `select username from clientslist where user_id='${data[0]}'`
            );
            data[4].username = userName.rows[0].username;
            socket.broadcast.emit(`${data[3]}_file`, JSON.stringify(data));
        }
    });

    socket.on("send_message", async (data) => {
        if (!data[3]) {
            await db.query(
                `INSERT INTO messages(sender_id, chat_id, message) values ('${data[0]}', '${data[1]}', '${data[2]}');`
            );
            return;
        } else if (!data[1]) {
            await db.query(
                `INSERT INTO chats(first_user, second_user) values ('${data[0]}', '${data[4]}');`
            );
            let chatId = await db.query(
                `select chat_id from chats where first_user='${data[0]}' and second_user='${data[4]}'`
            );
            await db.query(
                `INSERT INTO messages(sender_id, chat_id, message) values ('${data[0]}', '${chatId}', '${data[2]}');`
            );
            let messId = await db.query(
                `select uuid, chat_id from messages where sender_id='${data[0]}' and chat_id='${data[1]}' and message =chat_id='${data[2]}'`
            );
            data.push(messId.rows[0]);
        } else {
            await db.query(
                `INSERT INTO messages(sender_id, chat_id, message) values ('${data[0]}', '${data[1]}', '${data[2]}');`
            );

            let messId = await db.query(
                `select uuid, chat_id from messages where sender_id='${data[0]}' and chat_id='${data[1]}' and message='${data[2]}'`
            );
            data.push(messId.rows[0]);
        }
        if (data[3]) {
            let userName = await db.query(
                `select username from clientslist where user_id='${data[0]}'`
            );
            data[4].username = userName.rows[0].username;
            socket.broadcast.emit(data[3], JSON.stringify(data));
        }
    });

    socket.on("get_favs", async () => {
        if (!req.session.auth) {
            return;
        }
        const clientId = await db.query(
            `SELECT username, img, user_id from clientslist where phone='${req.session.phone}'`
        );

        req.session.uuid = clientId.rows[0].user_id;
        const clientChats = await db.query(
            `SELECT chat_id, second_user from chats WHERE first_user='${req.session.uuid}' and (second_user is null)`
        );
        const messages = await db.query(
            `SELECT message, uuid, sender_id, file_id, file_name from messages WHERE chat_id='${clientChats.rows[0].chat_id}'`
        );
        let data = [...clientId.rows, messages.rows, clientChats.rows[0]];
        socket.emit("got_favs", JSON.stringify(data));
    });

    socket.on("get_contacts", async () => {
        if (!req.session.auth) {
            return;
        }

        try {
            const clientId = await db.query(
                `SELECT username, img, phone, user_id from clientslist where phone!='${req.session.phone}'`
            );
            socket.emit("got_contacts", JSON.stringify(clientId.rows));
        } catch (err) {
            console.error(err);
            es.status(500).send("Internal Server Error");
        }
    });

    socket.on("get_user_data", async (dataJSON) => {
        if (!req.session.auth) {
            return;
        }

        let dataParsed = JSON.parse(dataJSON);
        if (dataParsed[0] == dataParsed[1]) {
            const clientId = await db.query(
                `SELECT username, img, user_id from clientslist where user_id='${dataParsed[0]}'`
            );

            let clientChats = await db.query(
                `SELECT chat_id, second_user, first_user  from chats WHERE (first_user='${dataParsed[0]}' and second_user is null)`
            );

            const messages = await db.query(
                `SELECT message, uuid, sender_id, file_id, file_name  from messages WHERE chat_id='${clientChats.rows[0].chat_id}'`
            );

            let data = [
                ...clientId.rows,
                messages.rows,
                clientChats.rows[0],
                ...clientId.rows,
            ];
            socket.emit("got_user_data", JSON.stringify(data));
            return;
        }
        const clientId = await db.query(
            `SELECT username, img, user_id from clientslist where user_id='${dataParsed[0]}'`
        );
        let clientChats = await db.query(
            `SELECT chat_id, second_user, first_user  from chats WHERE (first_user='${dataParsed[0]}' and second_user='${dataParsed[1]}') or (second_user='${dataParsed[0]}' and first_user='${dataParsed[1]}')`
        );
        if (clientChats.rows.length < 1) {
            await db.query(
                `INSERT INTO chats(first_user, second_user) values ('${dataParsed[0]}', '${dataParsed[1]}');`
            );
            clientChats = await db.query(
                `select chat_id, first_user, second_user  from chats where first_user='${dataParsed[0]}' and second_user='${dataParsed[1]}'`
            );
        } else {
            if (clientId.rows[0].user_id == clientChats.rows[0].first_user) {
            } else if (
                clientId.rows[0].user_id == clientChats.rows[0].second_user
            ) {
                clientChats.rows[0].second_user =
                    clientChats.rows[0].first_user;
                clientChats.rows[0].first_user = clientId.rows[0].user_id;
            }
        }
        const messages = await db.query(
            `SELECT message, uuid, sender_id, file_id, file_name  from messages WHERE chat_id='${clientChats.rows[0].chat_id}'`
        );

        const user = await db.query(
            `SELECT username, img, user_id from clientslist where user_id='${dataParsed[1]}'`
        );

        let data = [
            ...clientId.rows,
            messages.rows,
            clientChats.rows[0],
            ...user.rows,
        ];
        socket.emit("got_user_data", JSON.stringify(data));
    });

    socket.on("get_file", async (data) => {
        if (!req.session.auth) {
            return;
        }
        let messages = await db.query(
            `SELECT file_name from messages WHERE file_id='${data[0]}'`
        );
        readFile(`./files/${data[0]}`, (err, file) => {
            if (err) {
                console.error(err);
                return;
            }
            socket.emit("got_file", file, messages.rows[0].file_name);
        });
    });

    socket.on("call_user", (data) => {
        console.log(socket.id)
        io.to(data.userToCall).emit("call_user", {
            signal: data.signalData,
            from: data.from,
            name: data.name
        })
    });
    socket.on("answer_call", (data) => {
        io.to(data.to).emit("call_accepted", data.signal)
    });

    socket.on("change_message", () => {});

    socket.on("delete_message", () => {});
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
            second_user varchar,
            createdate  TIMESTAMPTZ
        )
        `);

        await db.query(`
        CREATE TABLE IF NOT EXISTS messages(
            id SERIAL PRIMARY KEY,
            uuid UUID DEFAULT Uuid_generate_v4 (),
            sender_id varchar not null,
            chat_id varchar not null,
            message varchar ,
            file_id varchar ,
            file_name varchar ,
            senddate  TIMESTAMPTZ
        )
        `);
    } catch (err) {
        console.error(err);
        //res.status(500).send("Internal Server Error");
        return;
    }
});
