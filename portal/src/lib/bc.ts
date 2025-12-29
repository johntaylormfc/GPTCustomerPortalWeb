import 'server-only';

import { CompanyInfo, CustomerDetail, CustomerLedgerEntry, CustomerSummary, SalesCreditMemo, SalesInvoice, SalesOrder, SalesReturnOrder, SalesShipment, SalesShipmentLine } from './types';

const requiredEnv = ['BC_TENANT_ID', 'BC_ENVIRONMENT', 'BC_CLIENT_ID', 'BC_CLIENT_SECRET', 'BC_COMPANY_ID'] as const;

type RequiredEnvKey = (typeof requiredEnv)[number];

type TokenCache = {
  accessToken: string;
  expiresAt: number;
} | null;

let tokenCache: TokenCache = null;

function getEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
}

function getBaseUrl(): string {
  const tenant = getEnv('BC_TENANT_ID');
  const environment = getEnv('BC_ENVIRONMENT');
  const companyId = getEnv('BC_COMPANY_ID');
  return `https://api.businesscentral.dynamics.com/v2.0/${tenant}/${environment}/api/bcDev/portal/v1.0/companies(${companyId})`;
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.accessToken;
  }

  const form = new URLSearchParams();
  form.append('grant_type', 'client_credentials');
  form.append('client_id', getEnv('BC_CLIENT_ID'));
  form.append('client_secret', getEnv('BC_CLIENT_SECRET'));
  form.append('scope', 'https://api.businesscentral.dynamics.com/.default');

  const tenantId = getEnv('BC_TENANT_ID');
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to acquire BC token (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    accessToken: payload.access_token,
    expiresAt: now + payload.expires_in * 1000,
  };

  return tokenCache.accessToken;
}

type BcRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  searchParams?: Record<string, string>;
  body?: unknown;
  revalidateSeconds?: number;
  headers?: Record<string, string>;
};

async function callBcApi<T>(path: string, options: BcRequestOptions = {}, allowRetry = true): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/${path}`);

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const token = await getAccessToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
    next: options.revalidateSeconds ? { revalidate: options.revalidateSeconds } : undefined,
  });

  if (!response.ok) {
    // If BC rejects the token, clear cache and retry once with a fresh token.
    if (response.status === 401 && allowRetry) {
      tokenCache = null;
      return callBcApi<T>(path, options, false);
    }

    const detail = await response.text();
    throw new Error(`BC API error ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
}

export async function getCustomerSummary(customerNo: string): Promise<CustomerSummary | null> {
  const payload = await callBcApi<{ value: CustomerSummary[] }>('customerSummaries', {
    searchParams: { '$filter': `no eq '${customerNo}'` },
    revalidateSeconds: 300,
  });
  return payload.value[0] ?? null;
}

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const payload = await callBcApi<{ value: CompanyInfo[] }>('companyInfos', {
    searchParams: { '$top': '1' },
    revalidateSeconds: 3600,
  });
  return payload.value[0] ?? null;
}

export async function getCustomerDetail(customerNo: string): Promise<CustomerDetail | null> {
  const payload = await callBcApi<{ value: CustomerDetail[] }>('customerDetails', {
    searchParams: { '$filter': `no eq '${customerNo}'` },
  });
  const record = payload.value[0];
  if (!record) return null;
  return { ...record, etag: (record as Record<string, unknown>)['@odata.etag'] as string | undefined };
}

export async function updateCustomerDetail(systemId: string, detail: Partial<CustomerDetail>, etag?: string): Promise<CustomerDetail> {
  return callBcApi<CustomerDetail>(`customerDetails(${systemId})`, {
    method: 'PATCH',
    body: detail,
    headers: {
      'If-Match': etag || '*',
    },
  });
}

export async function getInvoices(customerNo?: string): Promise<SalesInvoice[]> {
  const searchParams: Record<string, string> = {};
  if (customerNo) {
    searchParams['$filter'] = `customerNo eq '${customerNo}'`;
  }
  const payload = await callBcApi<{ value: SalesInvoice[] }>('salesInvoices', { searchParams });
  return payload.value;
}

export async function getOrders(customerNo?: string): Promise<SalesOrder[]> {
  const searchParams: Record<string, string> = {};
  if (customerNo) searchParams['$filter'] = `customerNo eq '${customerNo}'`;
  const payload = await callBcApi<{ value: SalesOrder[] }>('salesOrders', { searchParams });
  return payload.value;
}

export async function getOutstandingOrders(customerNo?: string): Promise<SalesOrder[]> {
  const searchParams: Record<string, string> = {};
  const outstandingFilter = 'outstandingQuantity gt 0';
  if (customerNo) {
    searchParams['$filter'] = `customerNo eq '${customerNo}' and ${outstandingFilter}`;
  } else {
    searchParams['$filter'] = outstandingFilter;
  }

  const payload = await callBcApi<{ value: SalesOrder[] }>('salesOrders', { searchParams });
  return payload.value;
}

export async function getReturnOrders(customerNo?: string): Promise<SalesReturnOrder[]> {
  const searchParams: Record<string, string> = {};
  if (customerNo) searchParams['$filter'] = `customerNo eq '${customerNo}'`;
  const payload = await callBcApi<{ value: SalesReturnOrder[] }>('salesReturnOrders', { searchParams });
  return payload.value;
}

export async function getCreditMemos(customerNo?: string): Promise<SalesCreditMemo[]> {
  const searchParams: Record<string, string> = {};
  if (customerNo) searchParams['$filter'] = `customerNo eq '${customerNo}'`;
  const payload = await callBcApi<{ value: SalesCreditMemo[] }>('salesCreditMemos', { searchParams });
  return payload.value;
}

export async function getShipments(customerNo?: string): Promise<SalesShipment[]> {
  const searchParams: Record<string, string> = {};
  if (customerNo) searchParams['$filter'] = `customerNo eq '${customerNo}'`;
  const payload = await callBcApi<{ value: SalesShipment[] }>('salesShipments', { searchParams });
  return payload.value;
}

export async function getShipment(no: string): Promise<SalesShipment | null> {
  const payload = await callBcApi<{ value: SalesShipment[] }>('salesShipments', {
    searchParams: { '$filter': `no eq '${no}'` },
  });
  return payload.value[0] ?? null;
}

export async function getShipmentLines(shipmentNo: string): Promise<SalesShipmentLine[]> {
  const payload = await callBcApi<{ value: SalesShipmentLine[] }>('salesShipmentLines', {
    searchParams: { '$filter': `documentNo eq '${shipmentNo}'` },
  });
  return payload.value;
}

export async function getOpenCustomerLedger(customerNo?: string): Promise<CustomerLedgerEntry[]> {
  const searchParams: Record<string, string> = {};
  if (customerNo) searchParams['$filter'] = `customerNo eq '${customerNo}'`;
  const payload = await callBcApi<{ value: CustomerLedgerEntry[] }>('openCustomerLedgerEntries', { searchParams });
  return payload.value;
}

async function getPdfFromApi(entitySetName: string, documentNo: string): Promise<string> {
  const payload = await callBcApi<{ value: { pdfBase64: string }[] }>(entitySetName, {
    searchParams: { '$filter': `no eq '${documentNo}'` },
  });
  return payload.value?.[0]?.pdfBase64 ?? '';
}

export function getInvoicePdf(documentNo: string) {
  return getPdfFromApi('salesInvoicePdfs', documentNo);
}

export function getOrderPdf(documentNo: string) {
  return getPdfFromApi('salesOrderPdfs', documentNo);
}

export function getCreditMemoPdf(documentNo: string) {
  return getPdfFromApi('salesCreditMemoPdfs', documentNo);
}

export function getStatementPdf(customerNo: string) {
  return getPdfFromApi('customerStatementPdfs', customerNo);
}

export async function createReturnOrder(payload: unknown) {
  return callBcApi('returnFromShipments', { method: 'POST', body: payload });
}
