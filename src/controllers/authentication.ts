import express from 'express';
import { createUser, getUserByEmail } from 'models/users';
import sanitize from 'mongo-sanitize';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const email = sanitize(req.body.email);
        const username = sanitize(req.body.username);
        const password = sanitize(req.body.password);
        const address = sanitize(req.body.address);

        if (!username || !email || !password) {
            return res.status(400).send('All fields are required');
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        // const user = await createUser({
        //     username,
        //     email,
        //     password
        // });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
