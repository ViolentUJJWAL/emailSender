import React, { useState, useRef } from 'react';
import './JsonSend.css';
import { sendEmails } from '../service/sendEmail';

const ExcelSend = () => {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");
    const [emailContent, setEmailContent] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [sendingSpeed, setSendingSpeed] = useState(30);
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check if file is an Excel file
            if (!selectedFile.name.match(/\.(xlsx|xls|xlsm|csv|xltx|xltm|xlsb|xml)$/)) {
                setError('Please upload an Excel file (.xlsx or .xls)');
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
        }
    };

    const resetForm = () => {
        setFile(null);
        setProgress(0);
        setStatus(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendEmails = async () => {
        try {
            if (!file) {
                throw new Error("Please select an Excel file");
            }
            if (!subject.trim()) {
                throw new Error("Subject is required");
            }
            if (!emailContent.trim()) {
                throw new Error("Email content is required");
            }
            if (sendingSpeed < 0) {
                throw new Error("Delay time must be positive");
            }

            setSending(true);
            setError(null);
            setProgress(0);

            const response = await sendEmails({
                file: file,
                subject: subject.trim(),
                textMessage: emailContent.trim(),
                htmlMessage: htmlContent.trim(),
                sendingSpeed: sendingSpeed * 1000,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send emails');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        
                        if (data.status === 'completed') {
                            setStatus({
                                sent: data.sent,
                                total: data.total
                            });
                            setSending(false);
                            resetForm(); // Reset form after successful send
                            break;
                        } else {
                            setProgress((data.sent / data.total) * 100);
                            setStatus({
                                sent: data.sent,
                                total: data.total,
                                lastSent: data.lastSent
                            });
                        }
                    } catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                }
            }
        } catch (err) {
            setError(err.message);
            setSending(false);
        }
    };

    return (
        <div className="container">
            <div>
            <h2>Excel Format</h2>
            <a href="/assets/sample.xlsx" download="sample.xlsx" style={{float:'right'}}> 
                    Download Sample Excel File
            </a> <br/>
               </div>
                
                <div className="form-container">
                    <div className="file-input-container">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".xlsx,.xls,.xlsm,.csv,.xltx,.xltm,.xlsb,.xml"
                            className="file-input"
                            disabled={sending}
                            ref={fileInputRef}
                        />
                        {file && (
                            <p className="file-name">Selected file: {file.name}</p>
                        )}
                    </div>

                    <input
                        type="text"
                        className="subject-input"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={sending}
                    />

                    <textarea
                        className="email-content"
                        placeholder="Email Content"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        disabled={sending}
                    />

                    <textarea
                        className="html-content"
                        placeholder="HTML Content (optional)"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        disabled={sending}
                    />

                    <input
                        type="number"
                        className="delay-input"
                        placeholder="Delay Time in seconds"
                        value={sendingSpeed}
                        onChange={(e) => setSendingSpeed(Number(e.target.value))}
                        min="0"
                        disabled={sending}
                        required
                    />

                    {(sending || status) && (
                        <div className="progress-container">
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="status-text">
                                {status ? `Sent ${status.sent} of ${status.total} emails` : 'Preparing to send...'}
                            </p>

                            {status?.lastSent && (
                                <p className="status-text">
                                    Last sent to: {status.lastSent.email}
                                    <span className={`status-badge ${status.lastSent.status}`}>
                                        ({status.lastSent.status})
                                    </span>
                                </p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        className="send-button"
                        onClick={handleSendEmails}
                        disabled={sending || !file || !subject || !emailContent}
                    >
                        {sending ? 'Sending...' : 'Send Emails'}
                    </button>
                </div>
        </div>
    );
};

export default ExcelSend;