import puppeteer from "puppeteer";

export const POST = async (req) => {
  const { html } = await req.json();

  if (!html) {
    return new Response("HTML content is required", { status: 400 });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForSelector('body');

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
