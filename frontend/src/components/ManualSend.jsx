import React, { useState } from 'react'
import { sendEmails } from '../service/sendEmail'

function ManualSend() {
  const [manualEmail, setManualEmail] = useState("")
  const [username, setUsername] = useState("")
  const [subject, setSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [status, setStatus] = useState({
    isSending: false,
    sent: 0,
    total: 0,
    lastSent: null,
    error: null
  })

  const handleSendEmailForManual = async() => {
    // Reset status
    setStatus({
      isSending: true,
      sent: 0,
      total: 1,
      lastSent: null,
      error: null
    });

    // Validate required fields
    if (!manualEmail.trim()) {
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: "Email is required"
      }));
      return;
    }

    if (!username.trim()) {
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: "Username is required"
      }));
      return;
    }

    if (!subject.trim()) {
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: "Subject is required"
      }));
      return;
    }

    if (!emailContent.trim()) {
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: "Text content is required"
      }));
      return;
    }

    try {
      const data = {
        subject,
        textMessage: emailContent,
        htmlMessage: htmlContent,
        recipients: [{
          email: manualEmail.trim(),
          username: username.trim()
        }]
      };

      const response = await sendEmails(data);
      
      if (response.error) {
        setStatus(prev => ({
          ...prev,
          isSending: false,
          error: response.error
        }));
        return;
      }

      setStatus(prev => ({
        ...prev,
        isSending: false,
        sent: 1,
        status: 'completed'
      }));

      // Clear form after successful send
      setManualEmail("");
      setUsername("");
      setSubject("");
      setEmailContent("");
      setHtmlContent("");

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isSending: false,
        error: error.message
      }));
    }
  }

  return (
    <div className="container">
      <div className="container-1">
        <h2>Manual Email</h2>
        <input
          type="email"
          placeholder="To"
          value={manualEmail}
          onChange={(e) => setManualEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          placeholder="Text Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          required
        />
        <textarea
          placeholder="HTML Content"
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
        />
        <button 
          onClick={handleSendEmailForManual}
          disabled={status.isSending}
        >
          {status.isSending ? 'Sending...' : 'Send Email'}
        </button>

        {/* Error Display */}
        {status.error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Error: {status.error}
          </div>
        )}

        {/* Success Display */}
        {!status.isSending && status.sent > 0 && status.status === 'completed' && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            Email sent successfully!
          </div>
        )}
      </div>
      <div className="container-2">
      </div>
    </div>
  )
}

export default ManualSend