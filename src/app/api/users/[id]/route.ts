import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// CHANGE USER ADMIN STATUS
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const { isAdmin } = await req.json();

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isAdmin: isAdmin,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: `Admin status for user ${id} has been updated!` }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};


// DELETE USER
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: `User ${id} has been deleted!` }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
