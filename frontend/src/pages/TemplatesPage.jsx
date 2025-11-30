import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TemplateList from '../components/TemplateList';
import apiTemplates from '../services/apiTemplates';

const TemplatesPage = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const response = await apiTemplates.getAll();
            setTemplates(response.data);
        } catch (err) {
            setError('Error al cargar las plantillas');
            console.error('Error loading templates:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Plantillas de Mantenimiento
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/templates/new')}
                    >
                        Nueva Plantilla
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <TemplateList
                    templates={templates}
                    loading={loading}
                    onRefresh={loadTemplates}
                />
            </Box>
        </Container>
    );
};

export default TemplatesPage;