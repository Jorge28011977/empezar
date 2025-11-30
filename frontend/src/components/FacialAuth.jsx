import React, { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    LinearProgress,
    Alert
} from '@mui/material'

const FacialAuth = ({ open, onClose, onSuccess, userId }) => {
    const videoRef = useRef()
    const canvasRef = useRef()
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [faceDetected, setFaceDetected] = useState(false)
    const [verificationStep, setVerificationStep] = useState('loading') // loading, ready, verifying, success, failed

    useEffect(() => {
        if (open) {
            loadModels()
        }
    }, [open])

    const loadModels = async () => {
        try {
            setVerificationStep('loading')
            setError(null)

            // Cargar modelos de face-api.js
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models')
            ])

            setModelsLoaded(true)
            setVerificationStep('ready')
            startVideo()
        } catch (err) {
            console.error('Error loading face models:', err)
            setError('Error al cargar modelos de reconocimiento facial')
            setVerificationStep('failed')
        }
    }

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('Error al acceder a la cámara')
            setVerificationStep('failed')
        }
    }

    const detectFace = async () => {
        if (!modelsLoaded || !videoRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current

        if (video.readyState === 4) {
            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptors()

            if (detections.length > 0) {
                setFaceDetected(true)
                setVerificationStep('verifying')

                // Simular verificación (en producción comparar con rostro registrado)
                setTimeout(() => {
                    setVerificationStep('success')
                    onSuccess()
                    stopVideo()
                }, 2000)
            } else {
                setFaceDetected(false)
            }

            // Dibujar detecciones en canvas
            if (canvas) {
                const displaySize = { width: video.width, height: video.height }
                faceapi.matchDimensions(canvas, displaySize)

                const resizedDetections = faceapi.resizeResults(detections, displaySize)
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resizedDetections)
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            }
        }
    }

    useEffect(() => {
        if (modelsLoaded && verificationStep === 'ready') {
            const interval = setInterval(detectFace, 100)
            return () => clearInterval(interval)
        }
    }, [modelsLoaded, verificationStep])

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            const tracks = stream.getTracks()
            tracks.forEach(track => track.stop())
        }
    }

    const handleClose = () => {
        stopVideo()
        onClose()
    }

    const getStatusMessage = () => {
        switch (verificationStep) {
            case 'loading':
                return 'Cargando modelos de reconocimiento facial...'
            case 'ready':
                return 'Coloque su rostro frente a la cámara'
            case 'verifying':
                return 'Verificando identidad...'
            case 'success':
                return 'Verificación exitosa'
            case 'failed':
                return 'Error en verificación'
            default:
                return ''
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Autenticación Biométrica Facial
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {getStatusMessage()}
                    </Typography>

                    {verificationStep === 'loading' && (
                        <LinearProgress sx={{ mt: 2 }} />
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>

                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{
                            width: '100%',
                            maxWidth: '640px',
                            border: '2px solid #ccc',
                            borderRadius: '8px'
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            maxWidth: '640px'
                        }}
                    />
                </Box>

                {faceDetected && verificationStep === 'ready' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Rostro detectado. Verificando...
                    </Alert>
                )}

                {!faceDetected && verificationStep === 'ready' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No se detecta rostro. Asegúrese de estar bien iluminado y mire directamente a la cámara.
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={verificationStep === 'verifying'}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FacialAuth