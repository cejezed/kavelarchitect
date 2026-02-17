import "@/styles/guides.css";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="guide-page">{children}</div>;
}
