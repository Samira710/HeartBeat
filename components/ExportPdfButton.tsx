"use client";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export const ExportPdfButton = ({ appointment }: { appointment: any }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const patient = appointment.patient;

    // --- 1. HEADER SECTION ---
    // Top Accent Bar
    doc.setFillColor(36, 174, 124); // HeartBeat Green
    doc.rect(0, 0, 210, 8, "F");

    doc.setFontSize(20);
    doc.setTextColor(36, 174, 124);
    doc.setFont("helvetica", "bold");
    doc.text("HEARTBEAT MEDICAL", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Official Patient Clinical Dossier", 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 130, 28);

    // Horizontal Rule
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 196, 32);

    let currentY = 38;

    // Helper function for styling section headers
    const addSectionHeader = (title: string, yPos: number) => {
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(50, 50, 50); // Dark Gray Header
      doc.rect(14, yPos - 5, 182, 7, "F");
      doc.text(title, 16, yPos);
    };

    // --- 2. APPOINTMENT DETAILS ---
    addSectionHeader("APPOINTMENT DETAILS", currentY);
    autoTable(doc, {
      startY: currentY + 4,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 35 },
        2: { fontStyle: "bold", cellWidth: 35 },
      },
      body: [
        [
          "Doctor:",
          appointment.primaryPhysician || "N/A",
          "Status:",
          appointment.status.toUpperCase(),
        ],
        [
          "Scheduled:",
          new Date(appointment.schedule).toLocaleString(),
          "Reason:",
          appointment.reason || "N/A",
        ],
        ["Notes:", appointment.note || "None", "", ""],
      ],
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // --- 3. PATIENT DEMOGRAPHICS & CONTACT ---
    addSectionHeader("DEMOGRAPHICS & CONTACT", currentY);
    autoTable(doc, {
      startY: currentY + 4,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, lineColor: [220, 220, 220] },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [245, 245, 245], cellWidth: 35 },
        2: { fontStyle: "bold", fillColor: [245, 245, 245], cellWidth: 35 },
      },
      body: [
        [
          "Full Name",
          patient.name,
          "Date of Birth",
          patient.birthDate
            ? new Date(patient.birthDate).toLocaleDateString()
            : "N/A",
        ],
        [
          "Gender",
          patient.gender || "N/A",
          "Occupation",
          patient.occupation || "N/A",
        ],
        ["Phone", patient.phone || "N/A", "Email", patient.email || "N/A"],
        ["Address", { content: patient.address || "N/A", colSpan: 3 }],
        [
          "Emergency Contact",
          patient.emergencyContactName || "N/A",
          "Emergency Phone",
          patient.emergencyContactNumber || "N/A",
        ],
      ],
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // --- 4. CLINICAL HISTORY ---
    addSectionHeader("CLINICAL HISTORY", currentY);
    autoTable(doc, {
      startY: currentY + 4,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4, lineColor: [220, 220, 220] },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [245, 245, 245], cellWidth: 50 },
      },
      body: [
        ["Allergies", patient.allergies || "None reported"],
        ["Current Medication", patient.currentMedication || "None reported"],
        ["Past Medical History", patient.pastMedicalHistory || "None reported"],
        [
          "Family Medical History",
          patient.familyMedicalHistory || "None reported",
        ],
      ],
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Check if we need a new page for the last sections
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    // --- 5. INSURANCE & ADMINISTRATIVE ---
    addSectionHeader("INSURANCE & ADMINISTRATIVE", currentY);
    autoTable(doc, {
      startY: currentY + 4,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, lineColor: [220, 220, 220] },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [245, 245, 245], cellWidth: 40 },
        2: { fontStyle: "bold", fillColor: [245, 245, 245], cellWidth: 40 },
      },
      body: [
        [
          "Insurance Provider",
          patient.insuranceProvider || "N/A",
          "Policy Number",
          patient.insurancePolicyNumber || "N/A",
        ],
        [
          "ID Type",
          patient.identificationType || "N/A",
          "ID Number",
          patient.identificationNumber || "N/A",
        ],
        [
          "ID Document",
          patient.identificationDocument
            ? "Scanned Copy on File"
            : "Not Provided",
          "Privacy Consent",
          patient.privacyConsent ? "Signed & Agreed" : "Pending",
        ],
        ["System User ID", { content: patient.userId || "N/A", colSpan: 3 }],
      ],
    });

    // --- 6. FOOTER ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | HeartBeat Secure Clinical System`,
        14,
        290
      );
    }

    // Download the file
    doc.save(`${patient.name.replace(/\s+/g, "_")}_Clinical_Dossier.pdf`);
  };

  return (
    <button
      onClick={handleExport}
      className="text-14-medium text-blue-500 hover:text-blue-400 hover:underline px-2"
    >
      PDF
    </button>
  );
};
