import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api"

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
            const response = await fetch(`${API_BASE_URL}/send-emails`, {
                method: 'POST',
                body: formData,
                // Important: Don't set Content-Type header, let the browser set it with boundary
            });
            return response;
        } else {
            // For JSON data
            const response = await fetch(`${API_BASE_URL}/send-emails`, {
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

export const downloadFile = async (fileName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/download`, {
            responseType: 'blob', // Important for downloading files
        });

        // Create a URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Filename for the downloaded file
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading the file:', error);
        throw new Error('Failed to download file');
    }
}