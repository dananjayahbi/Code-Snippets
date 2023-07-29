import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (files) => {
    setSelectedFile(files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      // Replace 'http://localhost:8060/uploadFile' with the actual backend endpoint for file upload
      await axios.post('http://localhost:8060/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // File uploaded successfully, you can add any additional logic here if needed
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        File Upload Example
      </Typography>
      <DropzoneArea
        acceptedFiles={['.txt', '.pdf', '.doc', '.docx']} // Specify the file types you want to accept
        dropzoneText="Drag & Drop or Click to Upload File"
        filesLimit={1}
        onChange={handleFileChange}
      />
      <Button variant="contained" color="primary" onClick={handleFileUpload}>
        Upload File
      </Button>
    </Container>
  );
}

export default App;
