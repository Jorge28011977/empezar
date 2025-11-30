import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import MachineDetails from '../components/MachineDetails'
import ARMaintenanceGuide from '../components/ARMaintenanceGuide'
import { getMachineById } from '../services/apiMachines'

const MachineDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [machine, setMachine] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadMachine = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getMachineById(id)
                setMachine(data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        loadMachine()
    }, [id])

    const handleEdit = (machine) => {
        navigate(`/machines/${machine.id}/edit`)
    }

    const handleBack = () => {
        navigate('/machines')
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <MachineDetails
                machine={machine}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onBack={handleBack}
            />

            {/* Guía AR de Mantenimiento */}
            <Box sx={{ mt: 4 }}>
                <ARMaintenanceGuide
                    machine={machine}
                    maintenance={null} // Placeholder - se puede pasar un mantenimiento específico
                />
            </Box>
        </Container>
    )
}

export default MachineDetailsPage