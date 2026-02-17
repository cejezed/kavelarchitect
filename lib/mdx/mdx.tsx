export async function renderMdx(source: string) {
  return <div dangerouslySetInnerHTML={{ __html: source }} />;
}
