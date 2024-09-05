import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/libs/dbs/init.mongo";
import ProductsModel from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	if (!isValidObjectId(params.id)) {
		return NextResponse.json({ message: "Not found" }, { status: 400 });
	}
	const album = await ProductsModel.findOne({ _id: params.id });
	if (!album) {
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: album }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	await dbConnect();
	try {
		const body = await req.json();
		const { category, namePackage, price, thumbnail } = body;
		const auth = req.headers.get("x-auth-uid");
		if (auth !== process.env.AUTH_ADMIN) {
			return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
		}
		if (!category || !namePackage || !price || !thumbnail) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		if (!isValidObjectId(params.id)) {
			return NextResponse.json({ message: "Not found" }, { status: 400 });
		}
		const product = await ProductsModel.findOneAndUpdate(
			{ _id: params.id },
			{ category, namePackage, price, thumbnail },
			{
				new: true,
			},
		);
		return NextResponse.json({ data: product }, { status: 200 });
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
	const product = await ProductsModel.deleteOne({ _id: params.id });
	if (product) {
		return NextResponse.json({ message: "Delete success" }, { status: 200 });
	}
	return NextResponse.json({ message: "Delete fail" }, { status: 400 });
}
