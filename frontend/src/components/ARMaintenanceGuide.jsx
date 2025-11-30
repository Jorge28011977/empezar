import React, { useRef, useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    IconButton
} from '@mui/material'
import { Close as CloseIcon, NavigateNext, NavigateBefore } from '@mui/icons-material'

const ARMaintenanceGuide = ({ open, onClose, machineId, maintenanceType }) => {
    const videoRef = useRef()
    const canvasRef = useRef()
    const [stream, setStream] = useState(null)
    const [activeStep, setActiveStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Pasos de mantenimiento según el tipo
    const getMaintenanceSteps = (type) => {
        const steps = {
            'preventive': [
                {
                    title: 'Inspección Visual Inicial',
                    description: 'Verifique el estado general de la máquina. Busque signos de desgaste, fugas o daños.',
                    overlay: 'Inspeccionar carcasa y conexiones',
                    position: { x: 0.3, y: 0.4 }
                },
                {
                    title: 'Verificación de Sensores IoT',
                    description: 'Compruebe que todos los sensores estén conectados y transmitiendo datos correctamente.',
                    overlay: 'Sensores marcados en azul',
                    position: { x: 0.7, y: 0.3 }
                },
                {
                    title: 'Lubricación de Componentes',
                    description: 'Aplique lubricante en los puntos de fricción según el manual del fabricante.',
                    overlay: 'Puntos de lubricación en verde',
                    position: { x: 0.5, y: 0.6 }
                },
                {
                    title: 'Verificación de Conexiones',
                    description: 'Asegúrese de que todas las conexiones eléctricas y mecánicas estén seguras.',
                    overlay: 'Conexiones críticas resaltadas',
                    position: { x: 0.2, y: 0.7 }
                },
                {
                    title: 'Prueba de Funcionamiento',
                    description: 'Ejecute una prueba de funcionamiento para verificar que todo funciona correctamente.',
                    overlay: 'Modo de prueba activado',
                    position: { x: 0.8, y: 0.8 }
                }
            ],
            'corrective': [
                {
                    title: 'Diagnóstico del Problema',
                    description: 'Identifique la causa raíz del fallo reportado por el sistema predictivo.',
                    overlay: 'Área problemática identificada',
                    position: { x: 0.5, y: 0.5 }
                },
                {
                    title: 'Desconexión Segura',
                    description: 'Apague y desconecte la máquina siguiendo los procedimientos de seguridad.',
                    overlay: 'Interruptor principal',
                    position: { x: 0.1, y: 0.2 }
                },
                {
                    title: 'Reemplazo de Componente',
                    description: 'Sustituya el componente defectuoso con una pieza de repuesto certificada.',
                    overlay: 'Componente a reemplazar',
                    position: { x: 0.6, y: 0.4 }
                },
                {
                    title: 'Reconexión y Pruebas',
                    description: 'Vuelva a conectar y realice pruebas exhaustivas de funcionamiento.',
                    overlay: 'Puntos de verificación',
                    position: { x: 0.4, y: 0.6 }
                }
            ],
            'emergency': [
                {
                    title: 'Evaluación de Seguridad',
                    description: 'Verifique que no hay riesgos para personas o equipos antes de proceder.',
                    overlay: 'Zona segura confirmada',
                    position: { x: 0.5, y: 0.3 }
                },
                {
                    title: 'Parada de Emergencia',
                    description: 'Active el sistema de parada de emergencia si no está ya activado.',
                    overlay: 'Botón de emergencia',
                    position: { x: 0.9, y: 0.1 }
                },
                {
                    title: 'Contención del Problema',
                    description: 'Implemente medidas temporales para contener el problema.',
                    overlay: 'Medidas de contención',
                    position: { x: 0.3, y: 0.5 }
                }
            ]
        }
        return steps[type] || steps['preventive']
    }

    const steps = getMaintenanceSteps(maintenanceType)

    useEffect(() => {
        if (open) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => {
            stopCamera()
        }
    }, [open])

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment' // Cámara trasera en móviles
                }
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                setIsPlaying(true)
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
            setIsPlaying(false)
        }
    }

    const drawOverlay = () => {
        if (!canvasRef.current || !videoRef.current || !isPlaying) return

        const canvas = canvasRef.current
        const video = videoRef.current
        const ctx = canvas.getContext('2d')

        // Ajustar tamaño del canvas al video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Dibujar overlay del paso actual
        const step = steps[activeStep]
        if (step) {
            const x = step.position.x * canvas.width
            const y = step.position.y * canvas.height

            // Dibujar círculo indicador
            ctx.beginPath()
            ctx.arc(x, y, 30, 0, 2 * Math.PI)
            ctx.fillStyle = 'rgba(25, 118, 210, 0.7)'
            ctx.fill()
            ctx.strokeStyle = '#1976d2'
            ctx.lineWidth = 3
            ctx.stroke()

            // Dibujar flecha apuntando al área
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, canvas.height / 2)
            ctx.lineTo(x, y)
            ctx.strokeStyle = '#1976d2'
            ctx.lineWidth = 2
            ctx.stroke()

            // Dibujar texto
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 2
            ctx.font = '16px Arial'
            ctx.strokeText(step.overlay, x + 40, y - 10)
            ctx.fillText(step.overlay, x + 40, y - 10)
        }
    }

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(drawOverlay, 100)
            return () => clearInterval(interval)
        }
    }, [isPlaying, activeStep])

    const handleNext = () => {
        setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
    }

    const handleBack = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
    }

    const handleClose = () => {
        stopCamera()
        setActiveStep(0)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth fullScreen>
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white'
            }}>
                <Typography variant="h6">
                    Guía AR de Mantenimiento - {maintenanceType?.toUpperCase()}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, position: 'relative' }}>
                {/* Video de la cámara */}
                <Box sx={{ position: 'relative', width: '100%', height: '70vh', bgcolor: 'black' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none'
                        }}
                    />

                    {/* Overlay con información del paso */}
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                            p: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.95)'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Paso {activeStep + 1} de {steps.length}
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                            {steps[activeStep]?.title}
                        </Typography>
                        <Typography variant="body1">
                            {steps[activeStep]?.description}
                        </Typography>
                    </Paper>
                </Box>

                {/* Stepper de navegación */}
                <Box sx={{ p: 2 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>{step.title}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    startIcon={<NavigateBefore />}
                >
                    Anterior
                </Button>

                <Typography variant="body2" color="text.secondary">
                    Use la cámara para seguir las guías AR
                </Typography>

                <Button
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                    endIcon={<NavigateNext />}
                >
                    Siguiente
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ARMaintenanceGuide