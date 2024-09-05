import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/libs/dbs/init.mongo";
import PostsModel from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	if (!isValidObjectId(params.id)) {
		return NextResponse.json({ message: "Not found" }, { status: 400 });
	}
	const post = await PostsModel.findOne({ _id: params.id });
	if (!post) {
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: post }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	const auth = req.headers.get("x-auth-uid");
	if (auth !== process.env.AUTH_ADMIN) {
		return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
	}
	await dbConnect();
	try {
		const body = await req.json();
		const { data } = body;
		if (!isValidObjectId(params.id)) {
			return NextResponse.json({ message: "Not found" }, { status: 400 });
		}
		if (!data) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		const post = await PostsModel.findOneAndUpdate(
			{ _id: params.id },
			{ data },
			{
				new: true,
			},
		);
		return NextResponse.json({ data: post }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Error" }, { status: 400 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	const auth = req.headers.get("x-auth-uid");
	if (auth !== process.env.AUTH_ADMIN) {
		return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
	}
	const post = await PostsModel.deleteOne({ _id: params.id });
	if (post) {
		return NextResponse.json({ message: "Delete success" }, { status: 200 });
	}
	return NextResponse.json({ message: "Delete fail" }, { status: 400 });
}
