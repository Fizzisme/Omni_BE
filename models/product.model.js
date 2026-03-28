import mongoose from 'mongoose';
const { Schema } = mongoose;

const COLLECTION_NAME = 'productions';

const productSchema = new mongoose.Schema(
    {
        categoryId:
            {
                type: Schema.Types.ObjectId,
            },
        name:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        rating:{
            type: Number,
            required: true
        },
        image:{
            type: String,
            required: true
        }

    }
)

const ProductModel = mongoose.model(COLLECTION_NAME,productSchema);

const findByCategoryId = async (categoryId) => {
    return await ProductModel.find({categoryId});
}

const getAll = async () =>{
    return await ProductModel.find();
}


export const productModel = {
    findByCategoryId,
    getAll
}