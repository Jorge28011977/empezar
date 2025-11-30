import React, { useState, useEffect, useRef } from 'react';
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';

const VoiceControl = ({ onCommand, disabled = false }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const [error, setError] = useState('');

    const recognitionRef = useRef(null);

    useEffect(() => {
        // Verificar soporte de Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'es-ES'; // Español

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setError('');
            };

            recognitionRef.current.onresult = (event) => {
                const result = event.results[0][0].transcript.toLowerCase();
                setTranscript(result);
                processCommand(result);
            };

            recognitionRef.current.onerror = (event) => {
                setError(`Error de reconocimiento: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSupported(false);
            setError('Web Speech API no soportada en este navegador');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const processCommand = (command) => {
        setLastCommand(command);
        setShowDialog(true);

        // Procesar comandos de voz
        let action = null;

        if (command.includes('mostrar') && command.includes('mantenimiento')) {
            if (command.includes('hoy')) {
                action = { type: 'SHOW_MAINTENANCES_TODAY' };
            } else if (command.includes('semana')) {
                action = { type: 'SHOW_MAINTENANCES_WEEK' };
            } else if (command.includes('mes')) {
                action = { type: 'SHOW_MAINTENANCES_MONTH' };
            } else {
                action = { type: 'SHOW_MAINTENANCES' };
            }
        } else if (command.includes('dashboard') || command.includes('inicio')) {
            action = { type: 'SHOW_DASHBOARD' };
        } else if (command.includes('máquina') || command.includes('maquina')) {
            if (command.includes('lista')) {
                action = { type: 'SHOW_MACHINES' };
            } else {
                action = { type: 'SHOW_MACHINE_DETAILS' };
            }
        } else if (command.includes('técnico') || command.includes('tecnico')) {
            action = { type: 'SHOW_TECHNICIANS' };
        } else if (command.includes('calendario')) {
            action = { type: 'SHOW_CALENDAR' };
        } else if (command.includes('reporte') || command.includes('informe')) {
            action = { type: 'SHOW_REPORTS' };
        } else if (command.includes('ayuda')) {
            action = { type: 'SHOW_HELP' };
        } else {
            action = { type: 'UNKNOWN_COMMAND', command };
        }

        // Ejecutar acción después de un breve delay para mostrar el diálogo
        setTimeout(() => {
            if (onCommand) {
                onCommand(action);
            }
        }, 1500);
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setError('');
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setTranscript('');
        setLastCommand('');
    };

    if (!isSupported) {
        return (
            <Alert severity="warning" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
                Control por voz no disponible en este navegador
            </Alert>
        );
    }

    return (
        <>
            {/* Botón flotante para activar voz */}
            <Fab
                color={isListening ? "error" : "primary"}
                aria-label="control por voz"
                onClick={isListening ? stopListening : startListening}
                disabled={disabled}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
            >
                {isListening ? <MicOff /> : <Mic />}
            </Fab>

            {/* Diálogo de confirmación de comando */}
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Comando de Voz Reconocido
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Escuché: <strong>"{lastCommand}"</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Procesando comando...
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Comandos disponibles:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip label="mostrar mantenimientos de hoy" size="small" />
                            <Chip label="mostrar dashboard" size="small" />
                            <Chip label="mostrar máquinas" size="small" />
                            <Chip label="mostrar calendario" size="small" />
                            <Chip label="mostrar reportes" size="small" />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Indicador de error */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        right: 16,
                        zIndex: 1000,
                        maxWidth: 300
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Indicador de listening */}
            {isListening && (
                <Alert
                    severity="info"
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        right: 16,
                        zIndex: 1000,
                        maxWidth: 300
                    }}
                >
                    Escuchando... Di un comando
                </Alert>
            )}
        </>
    );
};

export default VoiceControl;