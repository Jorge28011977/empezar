import React, { useState } from 'react';
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
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { Mic, MicOff, Help } from '@mui/icons-material';
import useVoiceControl from '../hooks/useVoiceControl';

const VoiceControl = ({ onCommand, disabled = false }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const [commandStatus, setCommandStatus] = useState(null);

    const {
        isListening,
        transcript,
        isSupported,
        startListening,
        stopListening,
        getAvailableCommands
    } = useVoiceControl((result) => {
        if (result.type === 'COMMAND_EXECUTED') {
            setLastCommand(result.command);
            setCommandStatus({ success: true, message: `Comando ejecutado: ${result.command}` });
            setShowDialog(true);
            onCommand?.(result);
        } else if (result.type === 'COMMAND_NOT_RECOGNIZED') {
            setLastCommand(result.command);
            setCommandStatus({ success: false, message: `Comando no reconocido: ${result.command}` });
            setShowDialog(true);
        } else if (result.type === 'OPEN_CHATBOT') {
            onCommand?.({ type: 'OPEN_CHATBOT' });
        } else if (result.type === 'SHOW_HELP') {
            setShowHelp(true);
        } else if (result.type === 'SHOW_COMMANDS') {
            setShowHelp(true);
        }
    });

    const handleCloseDialog = () => {
        setShowDialog(false);
        setLastCommand('');
        setCommandStatus(null);
    };

    const handleShowHelp = () => {
        setShowHelp(true);
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
            {/* Botones flotantes para control de voz */}
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Botón principal de voz */}
                <Fab
                    color={isListening ? "error" : "primary"}
                    aria-label="control por voz"
                    onClick={isListening ? stopListening : startListening}
                    disabled={disabled || !isSupported}
                    size="medium"
                >
                    {isListening ? <MicOff /> : <Mic />}
                </Fab>

                {/* Botón de ayuda */}
                <Fab
                    color="secondary"
                    aria-label="ayuda comandos voz"
                    onClick={handleShowHelp}
                    disabled={disabled}
                    size="small"
                >
                    <Help />
                </Fab>
            </Box>

            {/* Diálogo de confirmación de comando */}
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Comando de Voz {commandStatus?.success ? 'Ejecutado' : 'No Reconocido'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Escuché: <strong>"{lastCommand}"</strong>
                        </Typography>
                        <Alert
                            severity={commandStatus?.success ? "success" : "warning"}
                            sx={{ mt: 1 }}
                        >
                            {commandStatus?.message}
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de ayuda con comandos */}
            <Dialog
                open={showHelp}
                onClose={() => setShowHelp(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Comandos de Voz Disponibles
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Di cualquiera de estos comandos cuando el micrófono esté activo:
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="Navegación"
                                secondary={
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        <Chip label="ir al dashboard" size="small" />
                                        <Chip label="ir a máquinas" size="small" />
                                        <Chip label="ir a técnicos" size="small" />
                                        <Chip label="ir a mantenimientos" size="small" />
                                        <Chip label="ir a calendario" size="small" />
                                        <Chip label="ir a reportes" size="small" />
                                        <Chip label="ir a ia predictiva" size="small" />
                                        <Chip label="ir a cumplimiento" size="small" />
                                        <Chip label="ir a métricas sla" size="small" />
                                        <Chip label="ir a core banking" size="small" />
                                    </Box>
                                }
                            />
                        </ListItem>
                        <Divider />

                        <ListItem>
                            <ListItemText
                                primary="Acciones"
                                secondary={
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        <Chip label="nuevo mantenimiento" size="small" />
                                        <Chip label="nueva máquina" size="small" />
                                        <Chip label="nuevo técnico" size="small" />
                                        <Chip label="actualizar datos" size="small" />
                                        <Chip label="abrir chatbot" size="small" />
                                    </Box>
                                }
                            />
                        </ListItem>
                        <Divider />

                        <ListItem>
                            <ListItemText
                                primary="Control"
                                secondary={
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        <Chip label="detener escucha" size="small" />
                                        <Chip label="ayuda" size="small" />
                                        <Chip label="comandos disponibles" size="small" />
                                    </Box>
                                }
                            />
                        </ListItem>
                    </List>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Consejos:</strong> Habla claro y natural. Los comandos funcionan en español.
                            Puedes usar variaciones como "mostrar" en lugar de "ir a".
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowHelp(false)}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Indicador de listening */}
            {isListening && (
                <Alert
                    severity="info"
                    sx={{
                        position: 'fixed',
                        bottom: 140,
                        right: 16,
                        zIndex: 1000,
                        maxWidth: 300
                    }}
                >
                    🎤 Escuchando... Di un comando de voz
                </Alert>
            )}

            {/* Indicador de no soportado */}
            {!isSupported && (
                <Alert
                    severity="warning"
                    sx={{
                        position: 'fixed',
                        bottom: 140,
                        right: 16,
                        zIndex: 1000,
                        maxWidth: 300
                    }}
                >
                    Control por voz no disponible en este navegador
                </Alert>
            )}
        </>
    );
};

export default VoiceControl;