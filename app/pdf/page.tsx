'use client';

import { useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import { pdf } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import styles from './pdfPage.module.css';
import Header from '@/components/PDF/Header';
import Body from '@/components/PDF/Body';
import Footer from '@/components/PDF/Footer';

const GeneratePDF = () => {
    const [loading, setIsLoading] = useState<boolean>(false);
    

    const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
          </head>
          <body>
            <Header />
            <Body />
            <Footer />
          </body>
        </html>
      );

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

    const handleDownloadHTMLPDF = async () => {
        setIsLoading(true)
        const response = await fetch("/api/generate-pdf", {
            method: "POST",
        });
        console.log({response})
        if (response.ok) {
            const blob = await response.blob();
            processBlob(blob, 'health-risk-screening[puppeteer]');
        } else {
            alert("Failed to generate PDF");
            setIsLoading(false)
        }
    };

    const handleDownloadComponentPDF = async () => {
        setIsLoading(true)
        const response = await fetch('/api/generate-component-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html: `<!DOCTYPE html>${htmlContent}` }),
        });
        if (response.ok) {
            const pdfBlob = await response.blob();
            processBlob(pdfBlob, 'health-risk-screening[puppeteer-BE]');
            setIsLoading(false)
        }else {
            alert("Failed to generate PDF");
            setIsLoading(false)
        }
      };

    return (
        <div className={styles.buttonsContainer}>
            <button onClick={handleDownloadPDF} className={styles.button} disabled={loading}>
                Download 'react-pdf' PDF - Built using 'react-pdf' elements{loading ? '...' : ''}
            </button>
            <button onClick={handleDownloadHTMLPDF} className={styles.button}>
                Download 'puppeteer' PDF - Built using HTML and CSS{loading ? '...' : ''}
            </button>
            <button onClick={handleDownloadComponentPDF} className={styles.button}>
                Download 'puppeteer' PDF - Built using Components{loading ? '...' : ''}
            </button>
        </div>
    );
};

export default GeneratePDF;
