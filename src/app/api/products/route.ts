import dbConnect from "@/libs/dbs/init.mongo";
import ProductsModel from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
	await dbConnect();
	const products = await ProductsModel.find();
	if (!products) {
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
	return NextResponse.json({ data: products }, { status: 200 });
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		const auth = req.headers.get("x-auth-uid");
		if (auth !== process.env.AUTH_ADMIN) {
			return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
		}
		const { category, namePackage, price, thumbnail } = body;
		if (!category || !namePackage || !price || !thumbnail) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}
		const product = await ProductsModel.create({ category, namePackage, price, thumbnail });
		return NextResponse.json({ data: product }, { status: 200 });
	} catch (e) {
		return NextResponse.json({ message: "Error" }, { status: 400 });
	}
}
