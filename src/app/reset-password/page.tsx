import { Suspense } from "react";
import ResetPasswordForm from "./form";

import { CreativeLoader } from "@/components/ui/CreativeLoader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <CreativeLoader size="lg" />
        </div>
      </div>
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
