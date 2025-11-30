import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import {
    getMachinesReportData,
    getMaintenanceReportData,
    getCostReportData,
    getInventoryReportData
} from '../services/apiReports'

// Función para descargar archivo
const downloadFile = (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

// Generar reporte de máquinas
export const generateMachinesReport = async (format, filters) => {
    const data = await getMachinesReportData(filters)

    if (format === 'pdf') {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Reporte de Máquinas', 20, 20)

        doc.setFontSize(12)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 35)

        let y = 50
        data.forEach((machine, index) => {
            if (y > 270) {
                doc.addPage()
                y = 20
            }
            doc.text(`${index + 1}. ${machine.name} - ${machine.model || 'N/A'} - ${machine.status}`, 20, y)
            y += 10
        })

        const pdfData = doc.output('blob')
        downloadFile(pdfData, 'reporte_maquinas.pdf', 'application/pdf')
    } else if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Máquinas')
        const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        downloadFile(excelData, 'reporte_maquinas.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
}

// Generar reporte de mantenimientos
export const generateMaintenanceReport = async (format, filters) => {
    const data = await getMaintenanceReportData(filters)

    if (format === 'pdf') {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Reporte de Mantenimientos', 20, 20)

        doc.setFontSize(12)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 35)

        let y = 50
        data.forEach((maintenance, index) => {
            if (y > 270) {
                doc.addPage()
                y = 20
            }
            doc.text(`${index + 1}. ${maintenance.description} - ${maintenance.status} - ${new Date(maintenance.scheduled_date).toLocaleDateString()}`, 20, y)
            y += 10
        })

        const pdfData = doc.output('blob')
        downloadFile(pdfData, 'reporte_mantenimientos.pdf', 'application/pdf')
    } else if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Mantenimientos')
        const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        downloadFile(excelData, 'reporte_mantenimientos.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
}

// Generar reporte de costos
export const generateCostReport = async (format, filters) => {
    const data = await getCostReportData()

    if (format === 'pdf') {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Reporte de Costos', 20, 20)

        doc.setFontSize(12)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 35)
        doc.text(`Costo Total: ${data.total}`, 20, 50)

        let y = 65
        data.monthly.forEach((month) => {
            doc.text(`${month.month}: ${month.cost}`, 20, y)
            y += 10
        })

        const pdfData = doc.output('blob')
        downloadFile(pdfData, 'reporte_costos.pdf', 'application/pdf')
    } else if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(data.monthly)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Costos')
        const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        downloadFile(excelData, 'reporte_costos.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
}

// Generar reporte de inventario
export const generateInventoryReport = async (format, filters) => {
    const data = await getInventoryReportData(filters)

    if (format === 'pdf') {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Reporte de Inventario', 20, 20)

        doc.setFontSize(12)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 35)

        let y = 50
        data.forEach((item, index) => {
            if (y > 270) {
                doc.addPage()
                y = 20
            }
            doc.text(`${index + 1}. ${item.name} - Cantidad: ${item.quantity} - ${item.status}`, 20, y)
            y += 10
        })

        const pdfData = doc.output('blob')
        downloadFile(pdfData, 'reporte_inventario.pdf', 'application/pdf')
    } else if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario')
        const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        downloadFile(excelData, 'reporte_inventario.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
}