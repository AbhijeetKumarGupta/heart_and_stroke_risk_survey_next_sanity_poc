import puppeteer, { executablePath } from "puppeteer";
import { PageContent } from "./components/PageContent";

const riskData = {
  "Risk to Manage": [
    { name: "Diet", description: "Unhealthy eating habits increase health risks." },
    { name: "Smoking", description: "Smoking contributes to heart and lung diseases." },
    { name: "Stress", description: "Chronic stress impacts overall health negatively." },
  ],
  "Risk to be Aware of": [
    { name: "Exercise", description: "Regular exercise can improve heart health." },
    { name: "Alcohol", description: "Excessive alcohol consumption raises health risks." },
    { name: "Cholesterol", description: "High cholesterol levels may lead to heart issues." },
  ],
  "Keep it Up": [
    { name: "Sleep", description: "Adequate sleep supports overall well-being." },
    { name: "Hydration", description: "Drinking water is vital for body functions." },
    { name: "Heart Checkups", description: "Routine checkups can prevent major health problems." },
  ],
};

const generateHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heart Risk Survey Guide</title>
    <style>
        @page {
            size: A4;
            margin: 80px 40px;
        }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: #000;
            color: #fff;
            text-align: center;
            line-height: 60px;
            font-size: 18px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: #f0f0f0;
            text-align: center;
            line-height: 40px;
            font-size: 12px;
            color: #555;
        }
        .section {
            margin-top: 20px;
        }
        .section h1 {
            font-size: 24px;
            color: #D32F2F;
            margin-bottom: 20px;
        }
        .section h2 {
            font-size: 22px;
            color: #D32F2F;
            margin-bottom: 15px;
        }
        .risk-factor {
            border: 1px solid #ccc;
            margin-bottom: 20px;
            padding: 10px;
            border-radius: 5px;
        }
        .risk-factor h3 {
            font-size: 18px;
            color: #000;
            margin-bottom: 5px;
        }
        .risk-factor p {
            font-size: 14px;
            margin: 10px 0;
        }
        a {
            color: #D32F2F;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
   <div class="header">Heart Risk Survey Guide</div>
    ${PageContent(riskData)}
    <div class="footer">Copyright Heart&Stroke, 2025</div>
</body>
</html>
`;

export const POST = async (req) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: executablePath(),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    const html = generateHtml();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=Heart-Risk-Survey-Guide.pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
