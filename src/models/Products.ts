import mongoose, { Schema, Document } from "mongoose";

export interface IProductType extends Document {
	_id?: string;
	namePackage: string;
	category: string;
	thumbnail: string;
	price: number;
}
const productsSchema: Schema = new mongoose.Schema<IProductType>(
	{
		namePackage: { type: String, required: true },
		category: { type: String, required: true },
		thumbnail: { type: String, required: true },
		price: { type: Number, required: true },
	},
	{ timestamps: true },
);

const ProductsModel =
	mongoose.models.products || mongoose.model<IProductType>("products", productsSchema);

export default ProductsModel;
