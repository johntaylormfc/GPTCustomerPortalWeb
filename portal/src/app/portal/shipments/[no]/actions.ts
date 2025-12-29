"use server";

import { createReturnOrder } from '@/lib/bc';
import { revalidatePath } from 'next/cache';

type ReturnLine = {
  lineNo: number;
  quantity: number;
};

type Payload = {
  shipmentNo: string;
  lines: ReturnLine[];
};

export async function createReturnOrderAction(payload: Payload) {
  try {
    await createReturnOrder({
      shipmentNo: payload.shipmentNo,
      linesJson: JSON.stringify(payload.lines),
    });
    revalidatePath(`/portal/shipments/${payload.shipmentNo}`);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create return order';
    throw new Error(message);
  }
}
