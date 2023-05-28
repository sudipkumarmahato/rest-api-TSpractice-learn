import express from 'express';
import { createUser, getUserByEmail } from 'models/users';
import sanitize from 'mongo-sanitize';
import { authentication, random } from "../utils/helper"

export const register = async (req: express.Request, res: express.Response) => {
    try {
        // const { email, password, username } = req.body;

        const email = sanitize(req.body.email);
        const username = sanitize(req.body.username);
        const password = sanitize(req.body.password);

        if (!email || !password || !username) {
            return res.status(400).send('All fields are required');
        }

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

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        // const { username, email } = req.body
        const username = sanitize(req.body.username);
        const email = sanitize(req.body.email);

        if (!username || !email) {
            return res.status(400).send('All fields are required');
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if (!user) {
            return res.status(400).send('User does not exist');
        }



    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}



// export const login = async (req: express.Request, res: express.Response) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.sendStatus(400);
//         }

//         const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

//         if (!user) {
//             return res.sendStatus(400);
//         }

//         const expectedHash = authentication(user.authentication.salt, password);

//         if (user.authentication.password != expectedHash) {
//             return res.sendStatus(403);
//         }

//         const salt = random();
//         user.authentication.sessionToken = authentication(salt, user._id.toString());

//         await user.save();

//         res.cookie('ANTONIO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

//         return res.status(200).json(user).end();
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// };