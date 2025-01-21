'use client';

import { useState } from 'react';

import { pdf } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import styles from './pdfPage.module.css';

const GeneratePDF = () => {
    const [loading, setIsLoading] = useState<boolean>(false);

    const processBlob = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        setIsLoading(false)
    }

    const handleDownloadPDF = () => {
        setIsLoading(true)
        const blob = pdf(<PdfDocument />).toBlob();
        blob.then((pdfBlob) => {
            processBlob(pdfBlob, 'health-risk-screening[react-pdf]');
        }).catch((error) => {
            console.log(error)
            alert("Failed to generate PDF");
            setIsLoading(false)
        });
    };

    const handleGenerateHTMLPDF = async () => {
        setIsLoading(true)
        const response = await fetch("/api/generate-pdf", {
            method: "POST",
        });

        if (response.ok) {
            const blob = await response.blob();
            processBlob(blob, 'health-risk-screening[puppeteer]');
        } else {
            alert("Failed to generate PDF");
            setIsLoading(false)
        }
    };

    return (
        <div className={styles.buttonsContainer}>
            <button onClick={handleDownloadPDF} className={styles.button} disabled={loading}>
                Download 'react-pdf' PDF - Built using 'react-pdf' elements{loading ? '...' : ''}
            </button>
            <button onClick={handleGenerateHTMLPDF} className={styles.button}>
                Download 'puppeteer' PDF - Built using HTML and CSS{loading ? '...' : ''}
            </button>
        </div>
    );
};

export default GeneratePDF;
