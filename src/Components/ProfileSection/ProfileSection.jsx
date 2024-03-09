import React, { useState } from 'react';
import './ProfileSection.css';
import client from '../../apolloClient';
import { useQuery, useMutation, gql } from '@apollo/client'
function ProfileSection() {

    const [uploadURL, setUploadURL] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)

    const QUERY_TO_GET_PRESIGNED_URL = gql`
    mutation Mutation($fileName: String!, $fileType: String!) {
        getProfilePhotoPresignedUploadURL(file_name: $fileName, file_type: $fileType) {
            file_name
            file_type
            uploadURL
        }
    }
    `
  
    const handleFileChange = async (event) => {
        const file = event.target.files[0]

        // Update state variable to hold selected file by user
        setSelectedFile(file)
        
        // Get presigned url to upload the image to s3 bucket from backend
        const { data } = await client.mutate(
                {
                mutation: QUERY_TO_GET_PRESIGNED_URL,
                variables: {
                    "fileName": file.name,
                    "fileType": file.type
                }
            }
        )
        setUploadURL(data.getProfilePhotoPresignedUploadURL.uploadURL)
    };


    const handleUpload = async () => {
        // Upload the file to S3 using the pre-signed URL
        fetch(uploadURL, {
            method: 'PUT',
            body: selectedFile,
            headers: {
                'Content-Type': selectedFile.type,
            }
        }).then((res) => {
            console.log('File Uploaded Successfully :)')
        }).catch((err) => {
            console.log('Had he bc ab to chalja, abhi to chala tha :(')
            console.log(err)
        })
    };

    return (
        <div className='ProfileSection'>
            <h2>Image Uploader</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>
            {
                selectedFile ? <div>{selectedFile.name}</div> : <div style={{color: 'red'}}>No File Selected!</div>
            }
            {
                uploadURL ? <div>{uploadURL}</div> : <div style={{color: 'red'}}>No Upload URL!</div>
            }
        </div>
    )
}

export default ProfileSection