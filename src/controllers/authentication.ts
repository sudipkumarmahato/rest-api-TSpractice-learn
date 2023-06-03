import express from 'express';
import { createUser, getUserByEmail } from '../models/users';
import sanitize from 'mongo-sanitize';
import { authentication, random } from "../utils/helper"
import { validateEmail, validatePassword, validateUsername, validateName } from "../utils/validation"


export const register = async (req: express.Request, res: express.Response) => {
    try {
        // const { email, password, username } = req.body;

        const email = sanitize(req.body.email);
        const username = sanitize(req.body.username);
        const password = sanitize(req.body.password);

        if (!email || !password || !username) {
            return res.status(400).send('All fields are required');
        }

        if (username.length <= 6 || username.length > 15)
            return res.status(400).json({
                msg: "Username's character must be between 6 and 15 !",
            });

        if (!validateUsername(username))
            return res.status(400).json({
                msg: 'Username should be alphanumeric and not contain special characters !',
            });

        if (!validateEmail(email))
            return res
                .status(400)
                .json({ msg: 'Email address should be valid!' });
        if (!validatePassword(password))
            return res.status(400).json({
                msg: 'Password must contain one uppercase, symbol, number, and atleast 8 characters !',
            });


        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },

        });

        console.log("User registred", user)

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        // const { username, email } = req.body
        const email = sanitize(req.body.email);
        const password = sanitize(req.body.password);

        if (!password || !email) {
            return res.status(400).send('All fields are required');
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if (!user) {
            return res.status(400).send('User does not exist');
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedHash) {
            return res.status(403).send('Incorrect password');
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('COOKIE', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
        console.log("User logged", user)

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}


