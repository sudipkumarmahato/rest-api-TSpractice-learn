import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    authentication: {
        password: {
            type: String,
            required: true,
            select: false
        },
        salt: {
            type: String,
            required: true,
            select: false
        },
        sessionToken: {
            type: String,
            required: true,
            select: false
        }
    }
});

export const User = mongoose.model('User', userSchema);
