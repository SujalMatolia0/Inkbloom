import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // IDOR Protection: Customers can ONLY access their own orders
  if (order.user?.email !== session.user.email && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: You are not authorized to view this order." },
      { status: 403 }
    );
  }

  return NextResponse.json({ order });
}
