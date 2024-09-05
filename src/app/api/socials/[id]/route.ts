import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/libs/dbs/init.mongo";
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import SocialModel from "@/models/Social";
import { isValidObjectId } from "mongoose";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	if (!isValidObjectId(params.id)) {
		return NextResponse.json({ message: "Not found" }, { status: 400 });
	}
	const social = await SocialModel.findOne({ _id: params.id });

	if (!social) {
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: social }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	try {
		const body = await req.json();
		const auth = req.headers.get("x-auth-uid");
		if (auth !== process.env.AUTH_ADMIN) {
			return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
		}
		if (!isValidObjectId(params.id)) {
			return NextResponse.json({ message: "Not found" }, { status: 400 });
		}
		const { icon, name, href, backgroundColor } = body;
		if (!icon || !name || !href || !backgroundColor) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		const social = await SocialModel.findOneAndUpdate(
			{ _id: params.id },
			{ icon, name, href, backgroundColor },
			{
				new: true,
			},
		);
		return NextResponse.json({ data: social }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Error" }, { status: 400 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	const auth = req.headers.get("x-auth-uid")
	if(auth !== process.env.AUTH_ADMIN){
		return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
	}
	const social = await SocialModel.deleteOne({ _id: params.id });
	if (social) {
		return NextResponse.json({ message: "Delete success" }, { status: 200 });
	}
	return NextResponse.json({ message: "Delete fail" }, { status: 400 });
}
