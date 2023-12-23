import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL USERS AS ADMIN
export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (session && session.user.isAdmin) {
    try {
      const users = await prisma.user.findMany({
        include: {
          accounts: true,
          sessions: true,
          Order: true,
        },
      });

      return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "You are not authorized!" }),
      { status: 403 }
    );
  }
};
