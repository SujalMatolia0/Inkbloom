"use client";

interface StatusSelectProps {
  id: string;
  defaultValue: string;
  action: (formData: FormData) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function StatusSelect({ id, defaultValue, action, options, className }: StatusSelectProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={defaultValue}
        className={className || "bg-deep border border-linen/20 text-linen text-[11px] font-bold uppercase tracking-[0.1em] px-2 py-1 outline-none focus:border-terra cursor-pointer"}
        onChange={(e) => e.target.form?.requestSubmit()}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}
