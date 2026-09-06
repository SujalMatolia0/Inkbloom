import { prisma } from "@/lib/prisma";
import { AdminTestimonialsManager, TestimonialItem } from "@/components/admin/AdminTestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  let testimonials: TestimonialItem[] = [];

  try {
    const data = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    testimonials = data as unknown as TestimonialItem[];
  } catch (e) {
    console.error("Failed to load Testimonials for admin", e);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <AdminTestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
