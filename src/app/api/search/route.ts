import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new NextResponse(
      JSON.stringify({ message: "Missing search query" }),
      { status: 400 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        },
      },
    });
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};