/*jshint esversion: 6 */
import {
    equal,
    rejects
} from 'assert';
import {
    compareSync,
    hashSync
} from 'bcrypt';
import {
    urlencoded,
    json
} from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import {
    sign,
    verify
} from 'jsonwebtoken';
import {
    ObjectID
} from 'mongodb';
import path from 'path';

import {
    Connection
} from './connection';
import secret from './config';
import {
    checkToken,
    checkAdmin,
    getToken,
    isAdmin
} from './middleware';
import {handleMessage, handleEvent} from './skype';
import { Api, connect, events } from "skype-http";
import sleep from 'sleep';
import DataChannel from './data-channel';
require('dotenv').config();

const app = express();
// app.set('views', path.join(__dirname, 'dist'));

const port = process.env.PORT || 5000;
let db;
/** @type Api */
let skype;


class HandlerGenerator {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        console.log(username);
        console.log(password);
        if (username && password) {
            db.collection('users').findOne({
                username: username
            }, (err, dbUser) => {
                const fail = {
                    errors: [{
                        message: 'Bad username or password'
                    }]
                };
                if (!dbUser) {
                    res.status(401).json(fail);
                } else if (username === dbUser.username && compareSync(password, dbUser.password)) {
                    const token = sign({
                        id: dbUser._id,
                        username: username
                    }, secret, {
                            expiresIn: '24h'
                        });
                    res.status(200).cookie('token', token).json({
                        success: true,
                        message: "Authentication success",
                        token: token
                    });
                    // res.cookie('token', token).redirect('/');
                    // res.cookie('token', token).status(200).end();
                } else {
                    console.log('hash comparison failed');
                    console.log(`username: ${username}`);
                    console.log(dbUser);
                    console.log(compareSync(password, dbUser.password));
                    res.status(401).json(fail);
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Bad request1'
            });
        }
    }
}


function getUserId(token) {
    let decoded = verify(token, secret);
    return JSON.parse(JSON.stringify(decoded)).id;
}

const urlencodedParser = urlencoded({
    extended: false
});
const handlers = new HandlerGenerator();
const jsonParser = json();

app.use(cookieParser());
app.use(jsonParser);
app.use(urlencodedParser);


/* Public routes */
app.post('/api/login', handlers.login);

app.get('/', function (req, res) {
    const token = getToken(req);
    if (token) {
        verify(token, secret, (err, decoded) => {
            if (err) {
                return res.redirect('/login.html')
            } else {
                return res.redirect('/index.html')
            }
        });
    } else {
        // return res.json({
        //     success: false,
        //     message: 'No auth token'
        // });
        return res.redirect('/login.html')
    }
});

app.get('/login', function (req, res) {
    // res.sendFile('/login.html', {
    //     root: __dirname
    // });
    res.redirect('/login.html')
});

/* Authenticated routes */

// app.get('/', function (req, res) {
//     // res.sendFile('/index.html', {
//     //     root: __dirname
//     // });
// });


app.get('/api/is-admin', checkToken, function (req, res) { //TODO change to JSON:API
    isAdmin(getToken(req), (result) => {
        res.json({
            admin: result
        });
    });
});

app.get('/api/skype/username', checkToken, async (req, res) => {

    const username = await new Promise((resolve, reject) => {
        while(!skype) {
            sleep.msleep(100);
        }
        resolve(skype.context.username);
    })
    res.json({
        data: {
            username: username
        }
    });
});

app.get('/api/chats', checkToken, async (req, res) => {
    const userId = getUserId(getToken(req));
    let admin = await new Promise((resolve, reject) => {
        isAdmin(getToken(req), (result) => resolve(result));
    });
    let query = admin ? {} : {
        'assignedUsers': userId
    };

    const options = {
        'sort': [
            ['timestamp', 1]
        ]
    };

    (await Connection.connectToMongo()).collection('chats')
        .find(query, options).toArray()
        .then((arr) => {
            res.json({
                data: arr
            });
        })
        .catch((rejects) => res.status(500).json({
            errors: [{
                code: 500,
                message: rejects
            }]
        }));

});

app.get('/api/chat/:chatId', checkToken, async (req, res) => {
    const userId = getUserId(getToken(req));
    const query = {
        '_id': new ObjectID(req.params.chatId)
    };
    (await Connection.connectToMongo()).collection('chats')
        .findOne(query)
        .then((chat) => {
            console.log(chat);
            res.json({
                data: chat
            })
        });
})

app.post('/api/send-message', checkToken, async (req, res) => {
    skype.sendMessage({ textContent: req.body.message}, req.body.cid)
        .then(result => {
            res.json({data: result})
        }).catch(error => {
            res.status(500).json({errors: [error]});
        })
})

app.get('/api/get-replies', checkToken, async (req, res) => {
    let r = await db.collection('replies').find({});
    res.json({data: await r.toArray()});
})

/* Admin-only routes */



app.post('/api/createUser', checkToken, checkAdmin, function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        db.collection('users').find({
            username: req.body.username
        }).limit(1).count((err, count) => {
            if (count == 0) {
                const newUser = {
                    name: req.body.name,
                    username: username,
                    password: hashSync(password, 10),
                    permissions: req.body.permissions
                };
                db.collection('users').insertOne(newUser, (err, r) => {
                    if (r.insertedCount == 1) {
                        res.json({
                            success: true,
                            message: `Successfully created user ${username}`
                        });
                    }
                });
            } else {
                res.json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        });
    } else {
        res.json({
            success: false,
            message: 'Username and password required'
        });
    }
});


app.get('/api/list-users', checkToken, checkAdmin, function (req, res) {
    db.collection('users')
        .find({})
        .sort({
            permissions: 1
        })
        .project({
            password: 0
        })
        .toArray((err, users) => {
            equal(err, null);
            res.json({
                users: users
            });
        });
});

app.post('/api/delete-user', checkToken, checkAdmin, function (req, res) {
    db.collection('users')
        .deleteOne({
            username: req.body.username
        }, (err, result) => {
            equal(err, null);
            if (result.deletedCount == 1) {
                res.json({
                    success: true
                });
            } else {
                res.json({
                    success: false
                });
            }
        });
});

app.post('/api/delete-user/id', checkToken, checkAdmin, (req, res) => {
    console.log({
        req: req.body.id,
        oid: new ObjectID(req.body.id)
    });
    db.collection('users')
        .deleteOne({
            _id: new ObjectID(req.body.id)
        }, (err, result) => {
            equal(err, null);
            if (result.deletedCount == 1) {
                res.json({
                    success: true
                });
            } else {
                res.json({
                    success: false,
                    message: result
                });
            }
        });
});

app.get('/api/assign/:userId/:chatId', checkToken, checkAdmin, async function (req, res) {
    const userId = req.params.userId;
    const chatId = req.params.chatId;
    const db = await Connection.connectToMongo();
    db.collection('chats')
        .findOneAndUpdate({
            _id: new ObjectID(chatId)
        }, {
                '$addToSet': {
                    'assignedUsers': userId
                }
            })
        .then((r) => {
            if (r.ok) {
                res.status(200).json({
                    data: {
                        'code': 200,
                        result: r
                    }
                });
            } else {
                res.status(400).json({
                    data: {
                        code: 400,
                        result: r
                    }
                })
            }
        })
        .catch((rejects) => {
            res.status(500).json({
                errors: [rejects]
            });
        });
});

app.post('/api/add-reply', checkToken, checkAdmin, async (req, res) => {
    const payload = {
        content: req.body.content
    }
    let r = await db.collection('replies').insertOne(payload);
    if(r.insertedCount == 1) {
        res.status(200).end();
    } else {
        res.status(400).json({errors: [r]})
    }
})


console.log("Running as: " + process.env.ENVIRONMENT);
if(process.env.ENVIRONMENT !== 'prod') {
    console.log("Dev environment detected, not serving any static files.");
} else {
    app.use(express.static(path.join(__dirname, 'backend/build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'backend/build', 'index.html'));
    });
}

const runApp = async () => {
    console.log('Connecting to database...');
    db = await Connection.connectToMongo();
    console.log('Connecting to Skype...');
    const skypeConnectionSettings = {
        credentials: {
            username: process.env.SKYPE_USERNAME,
            password: process.env.SKYPE_PASSWORD
        },
        verbose: false
    };
    skype = await connect(skypeConnectionSettings);
    console.log('Connected to Skype!');

    // Log every event
    // skype.on("event", (ev) => {
    //     console.log(JSON.stringify(ev, null, 2));
    // });

    // Log every error
    skype.on("error", (err) => {
        console.error("An error was detected:");
        console.error(err);
    });

    await skype.listen();
    await skype.setStatus('Online');

    // skype.on("Text", handleMessage);
    // skype.on("RichText", handleMessage);
    skype.addListener('event', handleEvent);
    console.log('Listening for new skype messages...');

    // Start Express server
    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
}

runApp();