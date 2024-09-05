import dbConnect from "@/libs/dbs/init.mongo";
import CategoriesModel from "@/models/Category";

import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
	await dbConnect();
	const cates = await CategoriesModel.find();
	if(!cates) {
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: cates }, { status: 200 });
}

export async function POST(req: NextRequest) {
	await dbConnect();
	const auth = req.headers.get("x-auth-uid")
	if(auth !== process.env.AUTH_ADMIN){
		return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { id, name } = body;
		if (!name) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		const cate = await CategoriesModel.create({ _id: id, name });
		return NextResponse.json({ data: cate }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Error" }, { status: 400 });
	}
}
