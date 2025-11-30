import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Snackbar, Alert } from '@mui/material'
import MachineForm from '../components/MachineForm'
import { getMachineById, createMachine, updateMachine } from '../services/apiMachines'

const MachineFormPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id
    const [machine, setMachine] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    useEffect(() => {
        if (isEdit) {
            const loadMachine = async () => {
                try {
                    setLoading(true)
                    const data = await getMachineById(id)
                    setMachine(data)
                } catch (err) {
                    setError(err)
                } finally {
                    setLoading(false)
                }
            }
            loadMachine()
        }
    }, [id, isEdit])

    const handleSubmit = async (formData) => {
        try {
            setLoading(true)
            setError(null)
            if (isEdit) {
                await updateMachine(id, formData)
                setSnackbar({ open: true, message: 'Máquina actualizada exitosamente', severity: 'success' })
            } else {
                await createMachine(formData)
                setSnackbar({ open: true, message: 'Máquina creada exitosamente', severity: 'success' })
            }
            // Redirigir después de un breve delay para mostrar el snackbar
            setTimeout(() => {
                navigate('/machines')
            }, 1500)
        } catch (err) {
            setError(err)
            setSnackbar({ open: true, message: 'Error al guardar la máquina', severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/machines')
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <MachineForm
                machine={machine}
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

export default MachineFormPage