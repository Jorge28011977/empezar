import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const useVoiceControl = (onCommand) => {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [isSupported, setIsSupported] = useState(false)
    const recognitionRef = useRef(null)
    const navigate = useNavigate()

    // Comandos de voz disponibles
    const voiceCommands = {
        // Navegación
        'ir al dashboard': () => navigate('/dashboard'),
        'mostrar dashboard': () => navigate('/dashboard'),
        'ir a máquinas': () => navigate('/machines'),
        'mostrar máquinas': () => navigate('/machines'),
        'ir a técnicos': () => navigate('/technicians'),
        'mostrar técnicos': () => navigate('/technicians'),
        'ir a mantenimientos': () => navigate('/maintenances'),
        'mostrar mantenimientos': () => navigate('/maintenances'),
        'ir a calendario': () => navigate('/calendar'),
        'mostrar calendario': () => navigate('/calendar'),
        'ir a reportes': () => navigate('/reports'),
        'mostrar reportes': () => navigate('/reports'),
        'ir a ia predictiva': () => navigate('/predictive-maintenance'),
        'mostrar ia predictiva': () => navigate('/predictive-maintenance'),
        'ir a cumplimiento': () => navigate('/compliance-dashboard'),
        'mostrar cumplimiento': () => navigate('/compliance-dashboard'),
        'ir a métricas sla': () => navigate('/sla-metrics'),
        'mostrar métricas sla': () => navigate('/sla-metrics'),
        'ir a core banking': () => navigate('/core-banking'),
        'mostrar core banking': () => navigate('/core-banking'),

        // Acciones del dashboard
        'mostrar alertas': () => onCommand?.({ type: 'SHOW_ALERTS' }),
        'ver estadísticas': () => onCommand?.({ type: 'SHOW_STATS' }),
        'actualizar datos': () => onCommand?.({ type: 'REFRESH_DATA' }),

        // Acciones de mantenimiento
        'nuevo mantenimiento': () => navigate('/maintenances/new'),
        'crear mantenimiento': () => navigate('/maintenances/new'),
        'nueva máquina': () => navigate('/machines/new'),
        'crear máquina': () => navigate('/machines/new'),
        'nuevo técnico': () => navigate('/technicians/new'),
        'crear técnico': () => navigate('/technicians/new'),

        // Consultas
        'ayuda': () => onCommand?.({ type: 'SHOW_HELP' }),
        'mostrar ayuda': () => onCommand?.({ type: 'SHOW_HELP' }),
        'qué puedo hacer': () => onCommand?.({ type: 'SHOW_HELP' }),
        'comandos disponibles': () => onCommand?.({ type: 'SHOW_COMMANDS' }),

        // Control de voz
        'detener escucha': () => stopListening(),
        'parar escucha': () => stopListening(),
        'dejar de escuchar': () => stopListening(),

        // Chatbot
        'abrir chatbot': () => onCommand?.({ type: 'OPEN_CHATBOT' }),
        'hablar con asistente': () => onCommand?.({ type: 'OPEN_CHATBOT' }),
        'ayuda ia': () => onCommand?.({ type: 'OPEN_CHATBOT' })
    }

    // Inicializar reconocimiento de voz
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true)

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()

            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'es-ES' // Español

            recognitionRef.current.onstart = () => {
                setIsListening(true)
                console.log('Voice recognition started')
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
                console.log('Voice recognition ended')
            }

            recognitionRef.current.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1]
                if (lastResult.isFinal) {
                    const command = lastResult[0].transcript.toLowerCase().trim()
                    setTranscript(command)
                    processCommand(command)
                }
            }

            recognitionRef.current.onerror = (event) => {
                console.error('Voice recognition error:', event.error)
                setIsListening(false)
            }
        } else {
            setIsSupported(false)
            console.warn('Voice recognition not supported in this browser')
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    const processCommand = useCallback((command) => {
        console.log('Processing voice command:', command)

        // Buscar comando exacto
        if (voiceCommands[command]) {
            voiceCommands[command]()
            onCommand?.({ type: 'COMMAND_EXECUTED', command, success: true })
            return
        }

        // Buscar comandos similares (contienen la frase)
        for (const [key, action] of Object.entries(voiceCommands)) {
            if (command.includes(key) || key.includes(command)) {
                action()
                onCommand?.({ type: 'COMMAND_EXECUTED', command: key, success: true })
                return
            }
        }

        // Comando no reconocido
        onCommand?.({ type: 'COMMAND_NOT_RECOGNIZED', command, success: false })
        console.log('Command not recognized:', command)
    }, [navigate, onCommand])

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start()
            } catch (error) {
                console.error('Error starting voice recognition:', error)
            }
        }
    }, [isListening])

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }, [isListening])

    // Función para obtener lista de comandos disponibles
    const getAvailableCommands = useCallback(() => {
        return Object.keys(voiceCommands)
    }, [])

    return {
        isListening,
        transcript,
        isSupported,
        startListening,
        stopListening,
        getAvailableCommands
    }
}

export default useVoiceControl