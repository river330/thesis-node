const { jsPDF } = window.jspdf;
import { convoContent } from "./script.js";

let convoTitle = "This is my title";

export function generatePDF() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    m = checkTime(m);
    s = checkTime(s);

    function checkTime(i) {
        if (i < 10) {
             i = "0" + i
        } return i;
    }

    console.log(today);

    let mth = today.getMonth() + 1;
    mth = checkTime(mth);
    let day = today.getDate()
    day = checkTime(day);
    let yr = today.getFullYear();

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [80, 609.6],
        lineHeight: 1.2,
    });

    let userName = "Rand";
    let theDate = mth + "/" + day + "/" + yr;
    let theTime = h + ":" + m + ":" + s;

    console.log(doc.getFontList());
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'OCR-B', fontStyle: 'normal', halign: 'center' },
        margin: { left: 4.7625, right: 4.7625, top: 4.7625, bottom: 1 },
        bodyStyles: { fontSize: 5, cellPadding: 0 },
        body: [[convoTitle.toUpperCase()]],
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'OCR-B', fontStyle: 'normal' },
        columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' } },
        margin: { left: 4.8625, right: 4.8625, top: 1, bottom: 1 },
        bodyStyles: { fontSize: 3, cellPadding: 0 },
        body: [["HUMAN: " + userName, "DATE: " + theDate, "TIME: " + theTime]],
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'OCR-B', fontStyle: 'normal' },
        margin: { left: 4.5625, right: 4.5625, top: 1, bottom: 1 },
        bodyStyles: { fontSize: 3, cellPadding: 0.5 },
        body: convoContent,
    });
    return doc.save(`test.pdf`);
}