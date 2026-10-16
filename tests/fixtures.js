// A real two-page PDF with selectable text and a red square on page one.
// Constructed locally so browser tests never depend on an external sample.
export function samplePDF() {
  const stream1 =
    "q 0.9 0.15 0.1 rg 45 450 200 180 re f Q BT /F1 28 Tf 45 700 Td (ACTUAL FIRST PAGE) Tj ET BT /F1 18 Tf 45 410 Td (CRUSHR PDF TEST) Tj ET";
  const stream2 = "BT /F1 28 Tf 45 700 Td (SECOND PAGE NOT PREVIEWED) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream1.length} >>\nstream\n${stream1}\nendstream`,
    `<< /Length ${stream2.length} >>\nstream\n${stream2}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}
