import services from "@/src/services";

export const POST = async (req, res) => {
  const { html } = await req.json();

  if (!html) {
    return new Response("HTML content is required", { status: 400 });
  }

  try {
    const backendResponse = await services.post('generate-pdf', { html }, process.env.BE_BASE_URL);

    if (backendResponse?.status === 200) {
      const backendData = backendResponse.data;

      const byteValues = Object.values(backendData);
      const pdfBuffer = new Uint8Array(byteValues);

      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=Heart-Risk-Survey-Guide.pdf",
        },
      });
    } else {
      return new Response(error, { status: 500, message: 'Error generating PDF on backend' });
    }
  } catch (error) {
    console.error('Error in Next.js API:', error);
    return new Response(error, { status: 500, message: 'Error generating PDF on backend' });
  }
};
