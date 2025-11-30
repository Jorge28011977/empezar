import React, { useState, useRef, useEffect } from 'react'
import {
    Fab,
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Avatar,
    Paper,
    IconButton
} from '@mui/material'
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material'

const Chatbot = () => {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: '¡Hola! Soy tu asistente virtual 24/7. ¿En qué puedo ayudarte hoy?',
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return

        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsTyping(true)

        // Simular respuesta del bot
        setTimeout(() => {
            const botResponse = generateBotResponse(inputMessage)
            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1000 + Math.random() * 2000) // Respuesta entre 1-3 segundos
    }

    const generateBotResponse = (userInput) => {
        const input = userInput.toLowerCase()

        // Respuestas basadas en palabras clave
        if (input.includes('mantenimiento') || input.includes('maintenance')) {
            return {
                id: messages.length + 2,
                text: 'Para consultas sobre mantenimiento, puedo ayudarte con:\n• Estado de máquinas\n• Programación de mantenimientos\n• Reportes de técnicos\n• Inventario de repuestos\n\n¿Sobre qué específicamente necesitas información?',
                sender: 'bot',
                timestamp: new Date()
            }
        }

        if (input.includes('ia') || input.includes('predictiv') || input.includes('predicción')) {
            return {
                id: messages.length + 2,
                text: '¡Excelente pregunta sobre IA predictiva! Nuestro sistema utiliza machine learning para:\n• Predecir fallos antes de que ocurran\n• Optimizar mantenimiento preventivo\n• Reducir downtime en un 50%\n• Ahorrar costos de inventario\n\n¿Quieres ver las predicciones de alguna máquina específica?',
                sender: 'bot',
                timestamp: new Date()
            }
        }

        if (input.includes('cumplimiento') || input.includes('compliance') || input.includes('normativ')) {
            return {
                id: messages.length + 2,
                text: 'Sobre cumplimiento normativo, estamos certificados en:\n• PCI DSS: 95% compliance\n• GDPR: 88% compliance\n• SOX: 92% compliance\n\nTodos los logs están en blockchain para integridad. ¿Necesitas algún reporte específico?',
                sender: 'bot',
                timestamp: new Date()
            }
        }

        if (input.includes('sla') || input.includes('servicio')) {
            return {
                id: messages.length + 2,
                text: 'Nuestras métricas SLA actuales:\n• Cumplimiento general: 94.2%\n• Respuesta promedio: 1.8 horas\n• Uptime: 99.95%\n• MTTR: 45 minutos\n\n¿Quieres ver métricas de algún cliente específico?',
                sender: 'bot',
                timestamp: new Date()
            }
        }

        if (input.includes('ayuda') || input.includes('help') || input.includes('soporte')) {
            return {
                id: messages.length + 2,
                text: 'Estoy aquí para ayudarte con:\n\n📊 **Dashboards**: IA predictiva, cumplimiento, SLA, core banking\n🔧 **Mantenimiento**: Máquinas, técnicos, repuestos, calendarios\n📋 **Reportes**: Generación automática de reportes\n👥 **Usuarios**: Gestión de roles y permisos\n\n¿Qué necesitas exactamente?',
                sender: 'bot',
                timestamp: new Date()
            }
        }

        if (input.includes('hola') || input.includes('hello') || input.includes('hi')) {
            return {
                id: messages.length + 2,
                text: '¡Hola! 👋 Bienvenido al Sistema de Gestión de Mantenimiento Bancario. Soy tu asistente IA 24/7.\n\n¿En qué puedo ayudarte hoy? Puedo asistirte con consultas sobre mantenimiento, IA predictiva, cumplimiento normativo, métricas SLA, o cualquier otra funcionalidad del sistema.',
                sender: 'bot',
                timestamp: new Date()
            }
        }

        // Respuesta por defecto
        return {
            id: messages.length + 2,
            text: 'Entiendo tu consulta. Para darte una respuesta más precisa, ¿podrías proporcionar más detalles sobre lo que necesitas? También puedo ayudarte con:\n\n• Estado del sistema\n• Consultas de mantenimiento\n• Información de cumplimiento\n• Métricas SLA\n• Soporte técnico',
            sender: 'bot',
            timestamp: new Date()
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <>
            {/* Botón flotante del chatbot */}
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
                onClick={() => setOpen(true)}
            >
                <ChatIcon />
            </Fab>

            {/* Modal del chatbot */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        height: '600px',
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'white'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                            🤖
                        </Avatar>
                        <Typography variant="h6">
                            Asistente IA 24/7
                        </Typography>
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Área de mensajes */}
                    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                        <List>
                            {messages.map((message) => (
                                <ListItem
                                    key={message.id}
                                    sx={{
                                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                        mb: 1
                                    }}
                                >
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 1.5,
                                            maxWidth: '70%',
                                            bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                                            color: message.sender === 'user' ? 'white' : 'text.primary'
                                        }}
                                    >
                                        <ListItemText
                                            primary={message.text}
                                            secondary={
                                                <Typography variant="caption" sx={{
                                                    color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                                                }}>
                                                    {message.timestamp.toLocaleTimeString()}
                                                </Typography>
                                            }
                                        />
                                    </Paper>
                                </ListItem>
                            ))}

                            {isTyping && (
                                <ListItem sx={{ justifyContent: 'flex-start' }}>
                                    <Paper elevation={1} sx={{ p: 1.5, bgcolor: 'grey.100' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Escribiendo...
                                        </Typography>
                                    </Paper>
                                </ListItem>
                            )}
                        </List>
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Área de input */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Escribe tu mensaje..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isTyping}
                                size="small"
                            />
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                            >
                                Enviar
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Chatbot