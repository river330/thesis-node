const { jsPDF } = window.jspdf;
import { convoContent, playerInfo, number } from "./script.js";

import { img } from "./image.js";



export function generatePDF() {
    //grabbing user-provided title for conversation title
    let convoTitle = playerInfo.title;


    //finding the time
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

    //finding the date
    let mth = today.getMonth() + 1;
    mth = checkTime(mth);
    let day = today.getDate()
    day = checkTime(day);
    let yr = today.getFullYear();

    //creating new jsPDF doc
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [71.88, 609.6],
        lineHeight: 1.2,
    });

    //receipt info
    let userName = playerInfo.name;
    let theDate = mth + "/" + day + "/" + yr;
    let theTime = h + ":" + m + ":" + s;

    console.log(doc.getFontList());


    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal', halign: 'center' },
        columnStyles: { 0: { halign: 'left', cellWidth: 'auto' }, 1: { halign: 'right', cellWidth: 'auto'  } },
        margin: { left: 4.8625, right: 4.8625, top: 1, bottom: 0},
        bodyStyles: { fontSize: 8, cellPadding: 0 },
        body: [["INDEX REF.","Reciept No."+"00"+number]]
    })
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal' },
        columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' } },
        margin: { left: 4.8625, right: 4.8625, top: 1, bottom: 1 },
        bodyStyles: { fontSize: 6, cellPadding: 0 },
        body: [["HUMAN: " + userName, "DATE: " + theDate, "TIME: " + theTime]],
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal', halign: 'center' },
        margin: { left: 4.7625, right: 4.7625, top: 4.7625, bottom: 2 },
        bodyStyles: { fontSize: 7, cellPadding: 0, top: 1, bottom: 1 },
        body: [["***************************************"]],
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal', halign: 'center' },
        margin: { left: 4.7625, right: 4.7625, top: 4.7625, bottom: 2 },
        bodyStyles: { fontSize: 8, cellPadding: 0 },
        body: [[convoTitle.toUpperCase()]],
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal' },
        margin: { left: 4.5625, right: 4.5625, top: 3, bottom: 1 },
        bodyStyles: { fontSize: 5.5, cellPadding: 0.5 },
        body: convoContent,
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal', halign: 'center' },
        margin: { left: 4.7625, right: 4.7625, top: 4.7625, bottom: 2 },
        bodyStyles: { fontSize: 7, cellPadding: 0, top: 1, bottom: 1 },
        body: [["***************************************"]],
    });
    doc.autoTable({
        theme: 'plain',
        styles: { font: 'InputMono-Light', fontStyle: 'normal', halign: 'center' },
        margin: { left: 4.7625, right: 4.7625, top: 4.7625, bottom: 2 },
        bodyStyles: { fontSize: 8, cellPadding: 0 },
        body: [["Conversation Closed"]],
    });
    doc.addPage([71.88, 609.6], 'p');
    doc.addImage(img, 'JPEG', 1, 1, 71.88, 241.3);
    // doc.addPage([71.88, 609.6], 'p');
    return doc.save(`test.pdf`);
}