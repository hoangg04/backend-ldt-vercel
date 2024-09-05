import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryType extends Document {
	_id?: string;
	name: string;
}
const categoriesSchema: Schema = new mongoose.Schema<ICategoryType>(
	{
		name: { type: String, required: true },
	},
	{ timestamps: true },
);

const CategoriesModel =
	mongoose.models.categories || mongoose.model<ICategoryType>("categories", categoriesSchema);

export default CategoriesModel;
