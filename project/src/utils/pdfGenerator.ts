import jsPDF from 'jspdf';
import { User } from '../types';
import { getFullLocationPath } from '../services/api';

export const generateRegistrationPDF = async (user: User): Promise<string> => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('Registration Certificate', 20, 30);
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(107, 114, 128); // Gray color
    doc.text('User Registration Confirmation', 20, 45);
    
    // Line separator
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 55, 190, 55);
    
    // User Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    
    const yStart = 70;
    const lineHeight = 15;
    let currentY = yStart;
    
    // User details
    doc.setFont('helvetica', 'bold');
    doc.text('User Information:', 20, currentY);
    currentY += lineHeight;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`User Code: ${user.codUser}`, 30, currentY);
    currentY += lineHeight;
    
    doc.text(`Full Name: ${user.nombre} ${user.apellido}`, 30, currentY);
    currentY += lineHeight;
    
    const genderText = user.genero === 'M' ? 'Male' : user.genero === 'F' ? 'Female' : 'Other';
    doc.text(`Gender: ${genderText}`, 30, currentY);
    currentY += lineHeight;
    
    doc.text(`Email: ${user.email}`, 30, currentY);
    currentY += lineHeight;
    
    doc.text(`Phone: ${user.celular}`, 30, currentY);
    currentY += lineHeight;
    
    // Enhanced location display with full path
    const locationPath = getFullLocationPath(user.codUbica);
    doc.text(`Location: ${locationPath}`, 30, currentY);
    currentY += lineHeight;
    
    doc.text(`Registration Date: ${user.fechaRegistro}`, 30, currentY);
    currentY += lineHeight * 2;
    
    // Status
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green color
    doc.text('✓ Email Validated', 30, currentY);
    currentY += lineHeight;
    
    doc.setTextColor(34, 197, 94);
    doc.text('✓ Registration Complete', 30, currentY);
    currentY += lineHeight;
    
    doc.setTextColor(34, 197, 94);
    doc.text('✓ Location Verified', 30, currentY);
    currentY += lineHeight * 2;
    
    // Location Details Section with descTipoUbica format
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Location Hierarchy (descTipoUbica Format):', 20, currentY);
    currentY += 8;
    doc.text(`Complete Address: ${locationPath}`, 30, currentY);
    currentY += 8;
    doc.text(`Location Code: ${user.codUbica}`, 30, currentY);
    currentY += 8;
    doc.text('Location Types: País > Departamento/Provincia > Ciudad > Area', 30, currentY);
    currentY += lineHeight;
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('This document certifies the successful registration with complete location hierarchy.', 20, currentY);
    currentY += 10;
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, currentY);
    
    // Generate blob URL
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadPDF = (pdfUrl: string, fileName: string): void => {
  try {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after download
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF. Please try again.');
  }
};