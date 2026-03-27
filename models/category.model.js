import mongoose from 'mongoose';

const COLLECTION_NAME = 'categories';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        }
    }
)

const CategoryModel = mongoose.model(COLLECTION_NAME, categorySchema);

const findBySlug = async (slug) => {
    return await CategoryModel.findOne({slug});
}

const getAll = async () =>
{
    return await CategoryModel.find();
}
const findById = async (id) => {
    return await CategoryModel.findById(id);
}

export const categoryModel = {
    findBySlug,
    getAll,
    findById
}