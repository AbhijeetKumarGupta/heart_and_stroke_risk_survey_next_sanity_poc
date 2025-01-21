import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        fontFamily: 'Helvetica',
        padding: 40,
    },
    topBar: {
        backgroundColor: 'black',
        color: 'white',
        padding: 10,
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    riskSection: {
        marginBottom: 20,
    },
    riskContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    riskItem: {
        width: '48%',
        marginBottom: 20,
    },
    riskFlagContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    riskFlag: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        marginRight: 5,
    },
    riskTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    riskDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    learnMore: {
        fontSize: 12,
        color: '#D32F2F',
        marginTop: 5,
        textDecoration: 'underline',
    },
    legend: {
        backgroundColor: '#F9F9F9',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    legendItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
    },
    footer: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
});

const PdfDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.topBar}>Health Risk Screening Guide</Text>
            <Text style={styles.header}>Your Risk Factors</Text>
            <Text style={styles.subHeader}>
                These are the opportunities to enhance your health and build a stronger, healthier you!
            </Text>
            <View style={styles.riskContainer}>
                <View style={styles.riskItem}>
                    <View style={styles.riskFlagContainer}>
                        <View style={[styles.riskFlag, { backgroundColor: '#D32F2F' }]} />
                        <Text style={styles.riskTitle}>Diet</Text>
                    </View>
                    <Text style={styles.riskDescription}>
                        Eating poorly can significantly impact your health. It’s important to maintain a balanced diet to improve
                        your overall well-being.
                    </Text>
                    <Link style={styles.learnMore} src="https://www.google.com">Learn More</Link>
                </View>
                <View style={styles.riskItem}>
                    <View style={styles.riskFlagContainer}>
                        <View style={[styles.riskFlag, { backgroundColor: '#D32F2F' }]} />
                        <Text style={styles.riskTitle}>Exercise</Text>
                    </View>
                    <Text style={styles.riskDescription}>
                        Regular physical activity is essential for a healthy lifestyle. Make time for at least 30 minutes of
                        exercise each day.
                    </Text>
                    <Link style={styles.learnMore} src="https://www.google.com">Learn More</Link>
                </View>
                <View style={styles.riskItem}>
                    <View style={styles.riskFlagContainer}>
                        <View style={[styles.riskFlag, { backgroundColor: '#D32F2F' }]} />
                        <Text style={styles.riskTitle}>Smoking</Text>
                    </View>
                    <Text style={styles.riskDescription}>
                        Smoking can raise your risk of heart disease by 30%. Quitting smoking is one of the best choices for your
                        health.
                    </Text>
                    <Link style={styles.learnMore} src="https://www.google.com">Learn More</Link>
                </View>
                <View style={styles.riskItem}>
                    <View style={styles.riskFlagContainer}>
                        <View style={[styles.riskFlag, { backgroundColor: '#D32F2F' }]} />
                        <Text style={styles.riskTitle}>Heart</Text>
                    </View>
                    <Text style={styles.riskDescription}>
                        Monitor your heart health regularly and maintain a healthy lifestyle to reduce the risk of heart disease.
                    </Text>
                    <Link style={styles.learnMore} src="https://www.google.com">Learn More</Link>
                </View>
            </View>
            <View style={styles.legend}>
                <Text style={styles.legendTitle}>Learn What The Flags Mean</Text>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#D32F2F' }]} />
                    <Text style={styles.legendText}>Might put you at considerable risk</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FFEB3B' }]} />
                    <Text style={styles.legendText}>Might put you at moderate risk</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.legendText}>No significant risk at this time</Text>
                </View>
            </View>
            <Text style={styles.footer}>Copyright Heart&Stroke, 2025</Text>
        </Page>
    </Document>
);

export default PdfDocument