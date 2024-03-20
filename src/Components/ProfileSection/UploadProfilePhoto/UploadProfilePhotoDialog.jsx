import React, { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from '../CropImage'
import './UploadProfilePhotoDialog.css'

export default function UploadProfilePhotoDialog(props) {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [imageSrc, setImageSrc] = useState(null)
    const [imageDataURL, setImageDataURL] = useState('')
    const PROFILE_PHOTO_KEY = 'ProfilePhoto'

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const showCroppedImage = async () => {
        try {
            if(!imageSrc) return
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    const onClose = () => {
        setCroppedImage(null)
    }

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                const image = new Image();
                image.src = imageDataUrl
                setImageDataURL(imageDataUrl)
                image.onload = () => {
                    setImageSrc(image)
                };
            };
        }
    }

    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const base64ToFile = (base64DataUrl, filename) => {
        const blob = dataURLtoBlob(base64DataUrl);
        return new File([blob], filename, { type: blob.type });
    }

    const handleUpload = () => {
        if (!croppedImage) {
            console.log('Cropped Image not in HandleUpload Function :(')
            return
        }
        const imageFile = base64ToFile(croppedImage, 'MyPhoto')
        props.uploadToS3Bucket(imageFile, PROFILE_PHOTO_KEY)
        toggleProfilePhotoDialogState()
    }

    const toggleProfilePhotoDialogState = () => {
        props.toggleProfilePhotoDialogState()
    }

    useEffect(() => {
        if(imageDataURL) showCroppedImage()
    }, [croppedAreaPixels])

    return (
        <div className='upload-profile-photo-dialog-container'>
            <div>
                <div className='upload-profile-photo-dialog'>
                    <h3>Crop & Update Your Photo</h3>
                    <div>
                        <input type="file" pattern='image/*' onChange={handleChange} />
                    </div>
                    <div>
                        {
                            imageDataURL &&
                            <div className='crop-container'>
                                <Cropper
                                    image={imageDataURL}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={1 / 1}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        }
                    </div>

                    {/* This is to check cropped Image, with useEffect */}
                    {
                        croppedImage &&
                        <div className='cropped-image-container'>
                            <h5>Cropped Image</h5>
                            <img id='cropped-image' src={croppedImage} />
                        </div>

                    }

                    <div className='btn-container'> 
                        <button onClick={toggleProfilePhotoDialogState}>Cancel</button>
                        <button
                            onClick={handleUpload}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
