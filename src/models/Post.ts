import mongoose, { Schema, Document } from "mongoose";

export interface IPostType extends Document {
	_id?: string;
	author?: string;
	data: Object;
	countReaders: number;
}
const postsSchema: Schema = new mongoose.Schema<IPostType>(
	{
		author: { type: String, default: "Lê Đình Trường" },
		data: { type: Object, required: true },
		countReaders: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const PostsModel = mongoose.models.posts || mongoose.model<IPostType>("posts", postsSchema);

export default PostsModel;
