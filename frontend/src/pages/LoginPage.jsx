import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FacialAuth from '../components/FacialAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [useBiometric, setUseBiometric] = useState(false);
    const [showFacialAuth, setShowFacialAuth] = useState(false);
    const [userId, setUserId] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData.email, formData.password);

            if (useBiometric) {
                // Si se seleccionó biometría, mostrar verificación facial
                setUserId(response.user?.id || 1); // Simular userId
                setShowFacialAuth(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    const handleFacialAuthSuccess = () => {
        setShowFacialAuth(false);
        navigate('/dashboard');
    };

    const handleFacialAuthClose = () => {
        setShowFacialAuth(false);
        // Volver al estado inicial si se cancela la verificación facial
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Sistema de Gestión de Mantenimiento
                    </Typography>
                    <Typography component="h2" variant="h5" align="center" gutterBottom>
                        Iniciar Sesión
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useBiometric}
                                    onChange={(e) => setUseBiometric(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Usar autenticación biométrica facial (MFA adicional)"
                            sx={{ mt: 1 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Usuario de prueba: admin@mantto.com / admin123
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Modal de autenticación facial */}
            <FacialAuth
                open={showFacialAuth}
                onClose={handleFacialAuthClose}
                onSuccess={handleFacialAuthSuccess}
                userId={userId}
            />
        </Container>
    );
};

export default LoginPage;