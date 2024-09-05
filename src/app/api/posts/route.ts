import dbConnect from "@/libs/dbs/init.mongo";
import PostsModel from "@/models/Post";

import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
	await dbConnect();
	const posts= await PostsModel.find();
	if(!posts){
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: posts }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const auth = req.headers.get("x-auth-uid")
	if(auth !== process.env.AUTH_ADMIN){
		return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
	}
	await dbConnect();
	try {
		const body = await req.json();
		const { data } = body;
		if (!data) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		const post = await PostsModel.create({ data });
		return NextResponse.json({ data: post }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Error" }, { status: 400 });
	}
}
