import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Cherche la ligne la plus proche de `targetY` (en remontant jusqu'à `scanRange` px)
 * qui soit entièrement composée de pixels clairs (fond blanc/gris clair).
 * Évite ainsi de couper en plein milieu d'un élément de texte.
 */
function findSafeSplitY(canvas: HTMLCanvasElement, targetY: number, scanRange = 60): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return targetY;

  for (let y = targetY; y >= targetY - scanRange; y--) {
    const pixels = ctx.getImageData(0, y, canvas.width, 1).data;
    let isLight = true;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] < 230 || pixels[i + 1] < 230 || pixels[i + 2] < 230) {
        isLight = false;
        break;
      }
    }
    if (isLight) return y;
  }

  return targetY;
}

export async function exportToPdfBlob(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = pageWidth / canvas.width;
  const pageHeightInCanvas = pageHeight / ratio;

  let sourceY = 0;
  let firstPage = true;

  while (sourceY < canvas.height) {
    const idealSplitY = sourceY + pageHeightInCanvas;
    const actualSplitY = idealSplitY >= canvas.height
      ? canvas.height
      : findSafeSplitY(canvas, Math.floor(idealSplitY));

    const sliceHeight = actualSplitY - sourceY;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    if (!firstPage) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, sliceHeight * ratio);

    firstPage = false;
    sourceY = actualSplitY;
  }

  return pdf.output('bloburl') as unknown as string;
}
