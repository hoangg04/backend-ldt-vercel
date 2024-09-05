import dbConnect from "@/libs/dbs/init.mongo";
import SocialModel from "@/models/Social";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
	await dbConnect();
	const socials = await SocialModel.find();
	if (!socials) {
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: socials }, { status: 200 });
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		const auth = req.headers.get("x-auth-uid");
		if (auth !== process.env.AUTH_ADMIN) {
			return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
		}
		const { icon, name, href, type, backgroundColor } = body;

		if (!icon || !name || !href || !backgroundColor) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		const product = await SocialModel.create({
			icon,
			name,
			href,
			type: type ? type : "default",
			backgroundColor,
		});
		return NextResponse.json({ data: product }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Error" }, { status: 400 });
	}
}
