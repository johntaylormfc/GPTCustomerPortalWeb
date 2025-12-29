import { NextRequest, NextResponse } from 'next/server';
import { getInvoicePdf } from '@/lib/bc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { no: string } }) {
  try {
    const pdfBase64 = await getInvoicePdf(params.no);
    if (!pdfBase64) {
      return NextResponse.json({ message: 'Invoice PDF not found' }, { status: 404 });
    }

    const buffer = Buffer.from(pdfBase64, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${params.no}.pdf"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error fetching invoice PDF';
    return NextResponse.json({ message }, { status: 500 });
  }
}
