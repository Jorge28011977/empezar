import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from '@mui/material'
import TechnicianDetails from '../components/TechnicianDetails'
import { getTechnicianById } from '../services/apiTechnicians'

const TechnicianDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [technician, setTechnician] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadTechnician = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getTechnicianById(id)
                setTechnician(data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        loadTechnician()
    }, [id])

    const handleEdit = (technician) => {
        navigate(`/technicians/${technician.id}/edit`)
    }

    const handleBack = () => {
        navigate('/technicians')
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <TechnicianDetails
                technician={technician}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onBack={handleBack}
            />
        </Container>
    )
}

export default TechnicianDetailsPage