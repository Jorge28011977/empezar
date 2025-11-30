import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Snackbar, Alert } from '@mui/material'
import TechnicianForm from '../components/TechnicianForm'
import { getTechnicianById, createTechnician, updateTechnician } from '../services/apiTechnicians'

const TechnicianFormPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id
    const [technician, setTechnician] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    useEffect(() => {
        if (isEdit) {
            const loadTechnician = async () => {
                try {
                    setLoading(true)
                    const data = await getTechnicianById(id)
                    setTechnician(data)
                } catch (err) {
                    setError(err)
                } finally {
                    setLoading(false)
                }
            }
            loadTechnician()
        }
    }, [id, isEdit])

    const handleSubmit = async (formData) => {
        try {
            setLoading(true)
            setError(null)
            if (isEdit) {
                await updateTechnician(id, formData)
                setSnackbar({ open: true, message: 'Técnico actualizado exitosamente', severity: 'success' })
            } else {
                await createTechnician(formData)
                setSnackbar({ open: true, message: 'Técnico creado exitosamente', severity: 'success' })
            }
            // Redirigir después de un breve delay para mostrar el snackbar
            setTimeout(() => {
                navigate('/technicians')
            }, 1500)
        } catch (err) {
            setError(err)
            setSnackbar({ open: true, message: 'Error al guardar el técnico', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/technicians')
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <TechnicianForm
                technician={technician}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                error={error}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default TechnicianFormPage