import api from './api';

export const sendEmails = async ({ recipients, subject, textMessage, htmlMessage, sendingSpeed, file }) => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);
      formData.append('textMessage', textMessage);
      formData.append('htmlMessage', htmlMessage || '');
      formData.append('sendingSpeed', sendingSpeed || 30000);

      // Use fetch with the complete URL from your api configuration
      const response = await fetch(`${api.defaults.baseURL}/send-emails`, {
        method: 'POST',
        body: formData,
        // Important: Don't set Content-Type header, let the browser set it with boundary
      });
      return response;
    } else {
      // For JSON data
      const response = await fetch(`${api.defaults.baseURL}/send-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          subject,
          textMessage,
          htmlMessage: htmlMessage || '',
          sendingSpeed: sendingSpeed || 30000
        }),
      });
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};