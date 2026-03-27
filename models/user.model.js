import mongoose from 'mongoose';

const COLLECTION_NAME = 'users';
const USER_ROLES = {
    CUSTOMER:'CUSTOMER',
    ADMIN: 'ADMIN',

};
const authProviderSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['LOCAL', 'GOOGLE'],
            required: true,
        },
        email: {
            type: String,
        },
        passwordHash: {
            type: String,
        },
    },
    { _id: false },
);

const userSchema = new mongoose.Schema(
    {
        authProviders: {
            type: [authProviderSchema],
            required: true,
            validate: [(v) => v.length > 0, 'authProviders is required'],
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            required: true,
            default: USER_ROLES.CUSTOMER,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE', 'ORTHER'],
        },
        _destroy: {
            type: Boolean,
            default: false,
            required: true,
        },

    },
    {
        timestamps: true,
        versionKey: false,
    },
)

userSchema.index({ 'authProviders.email': 1 }, { unique: true, sparse: true });
const UserModel = mongoose.model(COLLECTION_NAME, userSchema);

const createNew = async (data) => {
    return await UserModel.create(data);
};

const findByEmail = async (email) => {
    return await UserModel.findOne({
        'authProviders.email': email,
    });
};

const findById = async (id) => {
    return await UserModel.findById({_id:id});
};

const update = async (id,data) => {
    return await UserModel.updateOne({_id:id}, data);
}

export const userModel = {
    USER_ROLES,
    createNew,
    findByEmail,
    findById,
    update
}