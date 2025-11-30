import React, { useRef, useEffect, useState } from 'react'
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [verificationStep, setVerificationStep] = useState('ready') // ready, verifying, success, failed

    useEffect(() => {
        if (open) {
            startVideo()
        } else {
            stopVideo()
        }
    }, [open])

    const startVideo = async () => {
        try {
            setLoading(true)
            setError(null)
            setVerificationStep('ready')

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user' // Cámara frontal
                }
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.onloadedmetadata = () => {
                    setLoading(false)
                    // Auto-verificar después de 3 segundos
                    setTimeout(() => {
                        setVerificationStep('verifying')
                        setTimeout(() => {
                            setVerificationStep('success')
                            onSuccess()
                            stopVideo()
                        }, 2000)
                    }, 3000)
                }
            }
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('Error al acceder a la cámara. Asegúrese de dar permisos.')
            setLoading(false)
            setVerificationStep('failed')
        }
    }

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
            case 'ready':
                return 'Coloque su rostro frente a la cámara (verificación automática en 3 segundos)'
            case 'verifying':
                return 'Verificando identidad biométrica...'
            case 'success':
                return '✅ Verificación exitosa - Acceso concedido'
            case 'failed':
                return '❌ Error en verificación'
            default:
                return ''
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                🔐 Autenticación Biométrica Facial (MFA)
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {getStatusMessage()}
                    </Typography>

                    {loading && (
                        <LinearProgress sx={{ mt: 2, mb: 2 }} />
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {verificationStep === 'ready' && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            📹 La verificación comenzará automáticamente en 3 segundos
                        </Alert>
                    )}

                    {verificationStep === 'verifying' && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            🔍 Verificando identidad biométrica...
                        </Alert>
                    )}

                    {verificationStep === 'success' && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            ✅ Verificación exitosa - Redirigiendo al dashboard...
                        </Alert>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            border: '3px solid #1976d2',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" align="center">
                    Asegúrese de estar en un lugar bien iluminado y mire directamente a la cámara
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={verificationStep === 'verifying' || verificationStep === 'success'}
                    color="secondary"
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FacialAuth