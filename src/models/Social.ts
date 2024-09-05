import mongoose, { Schema, Document } from "mongoose";
/**
 * {
      "id": "sDGIU1zfDc2GKNf8LNLD",
      "icon": "https://firebasestorage.googleapis.com/v0/b/ldtruongproject.appspot.com/o/images%2Fzalo.png?alt=media&token=a2637f7a-0d77-496c-82a5-f4e6125fdfac",
      "name": "0367560468",
      "type": "default",
      "href": "https://zalo.me/0367560468",
      "backgroundColor": "#22c55e"
    }
 */
export interface ISocialType extends Document {
	_id?: string;
	icon: string;
	name: string;
	type: string;
	href: string;
	backgroundColor: string;
}
const socialSchema: Schema = new mongoose.Schema<ISocialType>(
	{
		icon: { type: String, required: true },
		name: { type: String, required: true },
		type: { type: String, default: "default" },
		href: { type: String, required: true },
		backgroundColor: { type: String, required: true },
	},
	{ timestamps: true },
);

const SocialModel = mongoose.models.socials || mongoose.model<ISocialType>("socials", socialSchema);

export default SocialModel;
