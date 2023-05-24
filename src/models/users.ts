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

export const UserModel = mongoose.model('User', userSchema);

export const getUser = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySesssionToken = (sessionToken: string) =>
    UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserByID = (id: string) => UserModel.findById(id);

export const createUser = () => (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());
export const deleteUserByID = (id: string) =>
    UserModel.findOneAndDelete({ _id: id });

export const updateUserByID = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate({ id, values });
