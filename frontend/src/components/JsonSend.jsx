import React, { useState } from 'react';
import './JsonSend.css';
import { sendEmails } from '../service/sendEmail';

const JsonSend = () => {
    const [jsondata, setJsondata] = useState("");
    const [subject, setSubject] = useState("");
    const [emailContent, setEmailContent] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [sendingSpeed, setSendingSpeed] = useState(30)
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSendEmailForJSON = async () => {
        try {
            setSending(true);
            setError(null);
            setProgress(0);

            const recipientsData = JSON.parse(jsondata);

            if (!Array.isArray(recipientsData)) {
                throw new Error("JSON data must be an array of recipients");
            }

            if (sendingSpeed < 0) {
                setStatus(prev => ({
                    ...prev,
                    isSending: false,
                    error: "delay time is required"
                }));
                return;
            }

            const response = await sendEmails({
                recipients: recipientsData,
                subject,
                textMessage: emailContent,
                htmlMessage: htmlContent,
                sendingSpeed: sendingSpeed * 1000,
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                lines.forEach(line => {
                    try {
                        const data = JSON.parse(line);

                        if (data.status === 'completed') {
                            setStatus({
                                sent: data.sent,
                                total: data.total
                            });
                            setSending(false);
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
                });
            }
        } catch (err) {
            setError(err.message);
            setSending(false);
        }
    };

    return (
        <div className="container">
                <h2>JSON Format Email Sender</h2>

                <div className="form-container">
                    <textarea
                        placeholder="Paste JSON text (array of {email, username} objects)"
                        value={jsondata}
                        onChange={(e) => setJsondata(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <textarea
                        placeholder="Email Content"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                    />

                    <textarea
                        placeholder="HTML Content"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Delay Time in seconds"
                        value={sendingSpeed}
                        onChange={(e) => setSendingSpeed(e.target.value)}
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
                        onClick={handleSendEmailForJSON}
                        disabled={sending || !jsondata || !subject || !emailContent}
                    >
                        {sending ? 'Sending...' : 'Send Emails'}
                    </button>
                </div>
        </div>
    );
};

export default JsonSend;