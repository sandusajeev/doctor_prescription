import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PreviewPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const stored = sessionStorage.getItem("prescriptionData");
    if (!stored) {
      navigate("/dashboard");
    } else {
      setData(JSON.parse(stored));
    }
  }, [navigate]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Doctor's Prescription", 70, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 30, null, null, 'right');
    doc.text(`Doctor: ${data.doctorName}`, 14, 40);
    doc.text(`Patient: ${data.patientName}`, 14, 50);
    doc.text(`Age: ${data.patientAge}`, 14, 60);
    doc.text(`Gender: ${data.gender}`, 14, 70);
    doc.text(`Symptoms: ${data.symptoms}`, 14, 80);
    doc.text(`Diagnosis: ${data.diagnosis}`, 14, 90);
    doc.text(`Advice: ${data.advice}`, 14, 100);

    autoTable(doc, {
      startY: 110,
      head: [["Medicines"]],
      body: data.medicines.map((m) => [m]),
    });

    doc.save("prescription.pdf");
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=600");

    win.document.open();
    win.document.write(`
      <html>
        <head>
          <title>Prescription Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h2 { text-align: center; color: #0056b3; margin-bottom: 5px; }
            .date-right { text-align: right; font-size: 14px; color: #555; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; color: #333; margin-top: 20px; }
            .info-row { margin: 4px 0; font-size: 14px; }
            ul { padding-left: 20px; font-size: 14px; }
            .footer-note { text-align: right; margin-top: 40px; color: #888; font-size: 13px; }
            .box { border: 1px solid #ccc; border-radius: 10px; padding: 25px; background: #fff; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();

    win.onload = () => {
      setTimeout(() => {
        win.focus();
        win.print();
        win.close();
      }, 500);
    };
  };


  if (!data) return <p className="text-center mt-4">Loading prescription...</p>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <Link to="/dashborad">
        <button className="btn btn-outline-secondary">
          <i class="fa-solid fa-arrow-left"></i> Back
        </button></Link>   
        <div>
          <button className="btn btn-outline-primary me-2" onClick={handlePrint}>
            Print
          </button>
          <button className="btn btn-outline-success" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>

      <div ref={printRef} className="box shadow-sm w-50">
        <div className="text-center mb-1 pt-2">
          <h2>Doctor's Prescription</h2>
        </div>
        <hr />
        <div className="container ps-5">
          <div className="date-right m-1"><strong>Date:</strong> {new Date().toLocaleDateString()}</div>

          <div className="info-row m-1"><strong>Doctor:</strong> {data.doctorName}</div>
          <div className="info-row m-1"><strong>Patient Name:</strong> {data.patientName}</div>
          <div className="info-row m-1"><strong>Age:</strong> {data.patientAge}</div>
          <div className="info-row m-1"><strong>Gender:</strong> {data.gender}</div>

          <div className="section-title m-1"><strong>Symptoms:</strong></div>
          <div className="info-row">{data.symptoms}</div>

          <div className="section-title m-1"><strong>Diagnosis:</strong> </div>
          <div className="info-row">{data.diagnosis}</div>

          <div className="section-title m-1"><strong>Advice:</strong></div>
          <div className="info-row">{data.advice}</div>

          <div className="section-title m-1"><strong>Medicines:</strong> </div>
          <ul>
            {data.medicines.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>

          <div className="footer-note">Prescribed by: Dr. {data.doctorName}</div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
