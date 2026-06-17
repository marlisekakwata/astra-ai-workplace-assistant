import jsPDF from "jspdf";

export function exportTextAsPdf(title: string, body: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, margin, margin);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(body, maxWidth);
  let y = margin + 28;
  const lineHeight = 16;
  for (const line of lines as string[]) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  const safe = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "document";
  doc.save(`${safe}.pdf`);
}
