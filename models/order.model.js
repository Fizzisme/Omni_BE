import mongoose from 'mongoose';
const { Schema } = mongoose;

const STATUS = {
    PENDING: 'PENDING',
    APPROVE: 'APPROVE',
    REJECTED: 'REJECTED',

};

const COLLECTION_NAME = 'orders';


const customerSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
});

const aiAnalystSchema = new Schema({
    fraud: {
        type: Number,
        enum: [0,1],
        required: true,
    },
    probability: {
        type: Number,
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
    },
    risk: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        required: true,
    }
})

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        customer: {
            type: customerSchema,
            required: true,
        },

        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(STATUS),
            required: true,
            default: STATUS.PENDING,
        },
        paymentMethod: {
            type: String,
        },
        items: {
            type: Array,
        },

        aiAnalyst: {
            type: aiAnalystSchema,
            required: true,
        }

    },
{
        timestamps: true,
        versionKey: false,
    },
)

export const OrderModel = mongoose.model(COLLECTION_NAME, orderSchema);

const createNew = async (data) => {
    return await OrderModel.create(data);
}

const getAll = async () => {
    return await OrderModel.aggregate([
        {
            $addFields: {
                statusOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$status", "PENDING"] }, then: 1 },
                            { case: { $eq: ["$status", "APPROVE"] }, then: 2 },
                            { case: { $eq: ["$status", "REJECTED"] }, then: 3 },
                        ],
                        default: 4
                    }
                }
            }
        },
        {
            $sort: { statusOrder: 1 }
        }
    ]);
}

const getById = async (id) => {
    return await OrderModel.findOne({_id: id});
}

const update = async (id,data) => {
    return await OrderModel.updateOne({_id: id},{$set: data});
}

const getMyOrders = async (id) => {
    return await OrderModel.find({
        userId: id
    })
}

const getMyOrder = async (userId,id) => {
    return await OrderModel.findOne({
        userId: userId,
        _id: id,
    });
}

export const orderModel = {
    createNew,
    getAll,
    getById,
    update,
    getMyOrders,
    getMyOrder
}