import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportResumeToPDF = async (elementId: string, filename = 'resume.pdf'): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Render the element to canvas at high resolution
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Add additional pages if multi-page resume
    while (heightLeft > 5) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: trigger print
    window.print();
    return false;
  }
};

export const triggerPrintResume = (): void => {
  window.print();
};
