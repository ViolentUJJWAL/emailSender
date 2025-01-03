import React, { useState } from "react";
// import emailjs from "emailjs-com";
// import * as ExcelJS from "exceljs";
// import { useDropzone } from "react-dropzone";
import ManualSend from "./manualSend";
import JsonSend from "./JsonSend";
import Excelsend from "./ExcelSend";

function EmailSender({ selectedTab }) {
  // const [emailContent, setEmailContent] = useState("");
  // const [htmlContent, setHtmlContent] = useState(""); // New state for HTML content
  // const [emails, setEmails] = useState([]);
  // const [manualEmail, setManualEmail] = useState("");
  // const [subject, setSubject] = useState(""); // Subject state for manual, JSON, and Excel formats
  // const [totalEmailsSent, setTotalEmailsSent] = useState(0);


  // // Handle file upload (for Excel files)
  // const onDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (event) => {
  //       const data = event.target.result;
  //       const workbook = new ExcelJS.Workbook();
  //       await workbook.xlsx.load(data);
  //       const worksheet = workbook.getWorksheet(1);
  //       const jsonData = [];
  //       worksheet.eachRow((row, rowNumber) => {
  //         if (rowNumber > 1) {
  //           jsonData.push({
  //             email: row.getCell(1).text,
  //             username: row.getCell(2).text,
  //           });
  //         }
  //       });
  //       setEmails(jsonData);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };

  // const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.xlsx, .xls' });

  // Function to send email using emailjs
  // const sendEmail = (email, username) => {
  //   const templateParams = {
  //     to_email: email,
  //     to_name: username,
  //     message: emailContent, // Plain text content
  //     html_message: htmlContent, // HTML content
  //     subject: subject, // Subject to be added
  //   };

  //   emailjs
  //     .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams, "YOUR_USER_ID")
  //     .then((response) => {
  //       console.log("Email sent successfully!", response);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to send email", err);
  //     });
  // };

  // // Send emails for JSON format
  // const handleSendEmailForJSON = () => {
  //   emails.forEach(({ email, username }) => {
  //     sendEmail(email, username);
  //   });
  // };

  // Send email manually
  // const handleSendEmailForManual = () => {
  //   sendEmail(manualEmail, username);
  // };

  return (
    <div>
      {selectedTab === "manual" && (
        // <div className="container">
        //   <div className="container-1">
        //     <h2>Manual Email</h2>
        //     <input
        //       type="email"
        //       placeholder="To"
        //       value={manualEmail}
        //       onChange={(e) => setManualEmail(e.target.value)}
        //     />
        //     <input
        //       type="text"
        //       placeholder="Subject"
        //       value={subject}
        //       onChange={(e) => setSubject(e.target.value)}
        //     />

        //     <textarea
        //       placeholder="Text Content"
        //       value={emailContent}
        //       onChange={(e) => setEmailContent(e.target.value)}
        //     />
        //     <textarea
        //       placeholder="HTML Content"
        //       value={htmlContent}
        //       onChange={(e) => setHtmlContent(e.target.value)} // Update HTML content
        //     />
        //     <button onClick={handleSendEmailForManual}>Send Email</button>
        //   </div>
        //   <div className="container-2">
        //   </div>
        // </div>
        <ManualSend/>
      )}

      {selectedTab === "json" && (
        // <div className="container">
        //   <div className="container-1">
        //     <h2>JSON Format</h2>
        //     {/* <textarea
        //     placeholder="Paste JSON file"
        //     value={JSON.stringify(emails, null, 2)}
        //     onChange={(e) => setEmails(JSON.parse(e.target.value))}
        //   /> */}
        //     <textarea name="" id="" placeholder="Paste json data" />
        //     <input
        //       type="text"
        //       placeholder="Subject"
        //       value={subject}
        //       onChange={(e) => setSubject(e.target.value)} // Subject input for JSON
        //     />
        //     <textarea
        //       placeholder="Email Content"
        //       value={emailContent}
        //       onChange={(e) => setEmailContent(e.target.value)}
        //     />
        //     <textarea
        //       placeholder="HTML Content"
        //       value={htmlContent}
        //       onChange={(e) => setHtmlContent(e.target.value)} // Update HTML content
        //     />
        //     <button onClick={handleSendEmailForJSON}>Send Emails</button>
        //   </div>
        //   <div className="container-2">
        //   </div>
        // </div>
        <JsonSend/>
      )}

      {selectedTab === "excel" && (
        // <div className="container">
        //   <div className="container-1">
        //     <h2>Excel Format</h2>
        //     {/* <div {...getRootProps()}>
        //     <input {...getInputProps()} />
        //     <p>Drag & drop an Excel file here, or click to select one</p>
        //   </div> */}
        //     <input type="file" title="Excel file" />
        //     <input
        //       type="text"
        //       placeholder="Subject"
        //       value={subject}
        //       onChange={(e) => setSubject(e.target.value)} // Subject input for Excel
        //     />
        //     <textarea
        //       placeholder="Email Content"
        //       value={emailContent}
        //       onChange={(e) => setEmailContent(e.target.value)}
        //     />
        //     <textarea
        //       placeholder="HTML Content"
        //       value={htmlContent}
        //       onChange={(e) => setHtmlContent(e.target.value)} // Update HTML content
        //     />
        //     <button onClick={handleSendEmailForJSON}>Send Emails</button>
        //   </div>
        //   <div className="container-2">
        //     <a href="/assets/sample.xlsx" download="sample.xlsx">
        //       <button>Download Sample Excel File</button>
        //     </a>
        //     <p>Total Emails Sent: {totalEmailsSent}</p>
        //   </div>
        // </div>
        <Excelsend/>
      )}
    </div>
  );
}

export default EmailSender;
