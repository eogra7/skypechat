import secret from './config';

import jwt from 'jsonwebtoken';
import {
    Connection
} from './connection';
export function getToken(req) {
    let token = req.cookies.token;
    // let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    return token;
}

export function checkToken(req, res, next) {
    const token = getToken(req);
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'No auth token'
        });
        // return res.redirect('/login')
    }
}

export function isAdmin(token, callback) {
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) callback(false);
            const username = decoded.username;
            Connection.connectToMongo().then((db) => {
                db.collection('users').findOne({
                    username: username
                }, (err, user) => {
                    if(user) {
                        const perm = user.permissions;
                        if (perm === 'admin') {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    } else {
                        callback(false);
                    }
                });
            })
        });
    } else {
        callback(false);
    }
}

export function checkAdmin(req, res, next) {
    isAdmin(getToken(req), (result) => {
        if (result) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Forbidden'
            })
        }
    });
}