/** Renders the store name with the last word in the brand accent colour. */
export function BrandName({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop()! : "";
  return (
    <>
      {parts.join(" ")}
      {last ? " " : ""}
      <span className="text-brand-600">{last}</span>
    </>
  );
}
