import { prisma } from "@/lib/prisma";
import { AdminFaqsManager, FaqItem } from "@/components/admin/AdminFaqsManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  let faqs: FaqItem[] = [];

  try {
    const data = await prisma.faq.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    faqs = data as unknown as FaqItem[];
  } catch (e) {
    console.error("Failed to load FAQs for admin", e);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <AdminFaqsManager initialFaqs={faqs} />
    </div>
  );
}
