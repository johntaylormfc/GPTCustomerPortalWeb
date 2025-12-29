export interface CustomerSummary {
  id: string;
  no: string;
  name: string;
  balance: number;
  balanceDueLcy: number;
  salesLcy: number;
}

export interface CompanyInfo {
  id: string;
  name: string;
  address?: string;
  address2?: string;
  city?: string;
  postCode?: string;
  countryRegionCode?: string;
  phoneNo?: string;
  vatRegistrationNo?: string;
  logoBase64?: string;
}

export interface CustomerDetail {
  id: string;
  no: string;
  name: string;
  address: string;
  address2?: string;
  city?: string;
  postCode?: string;
  countryRegionCode?: string;
  phoneNo?: string;
  email?: string;
  contact?: string;
  etag?: string;
}

export interface SalesInvoice {
  id: string;
  no: string;
  customerNo: string;
  customerName: string;
  postingDate: string;
  dueDate: string;
  currencyCode?: string;
  amount: number;
  amountIncludingVAT: number;
  externalDocumentNo?: string;
}

export interface SalesOrder {
  id: string;
  no: string;
  customerNo: string;
  customerName: string;
  orderDate: string;
  requestedDeliveryDate?: string;
  status: string;
  currencyCode?: string;
  amount: number;
  amountIncludingVAT: number;
  outstandingQuantity?: number;
}

export interface SalesReturnOrder {
  id: string;
  no: string;
  customerNo: string;
  customerName: string;
  returnDate: string;
  currencyCode?: string;
  amount: number;
  amountIncludingVAT: number;
}

export interface SalesCreditMemo {
  id: string;
  no: string;
  customerNo: string;
  customerName: string;
  postingDate: string;
  currencyCode?: string;
  amount: number;
  amountIncludingVAT: number;
}

export interface SalesShipment {
  id: string;
  no: string;
  customerNo: string;
  customerName: string;
  postingDate: string;
  locationCode?: string;
  externalDocumentNo?: string;
}

export interface SalesShipmentLine {
  id: string;
  documentNo: string;
  lineNo: number;
  type: string;
  itemNo: string;
  description?: string;
  quantity: number;
  quantityInvoiced: number;
  quantityShipped: number;
  unitOfMeasure?: string;
}

export interface CustomerLedgerEntry {
  id: string;
  entryNo: number;
  customerNo: string;
  postingDate: string;
  documentType: string;
  documentNo: string;
  description?: string;
  dueDate?: string;
  currencyCode?: string;
  amount: number;
  remainingAmount: number;
}

export interface WorksOrder {
  id: string;
  worksOrderNo: string;
  customerNo: string;
  customerRepairNo?: string;
  issueDate?: string;
  responseDate?: string;
  completionDate?: string;
  completionTime?: string;
  status?: string;
  jobType?: string;
  recalledDate?: string;
  rectifiedDate?: string;
  invoiceNo?: string;
  released?: boolean;
  paid?: boolean;
  tenantName?: string;
  tenantAddress?: string;
  tenantAddress2?: string;
  tenantCity?: string;
  tenantPostcode?: string;
  phoneNo?: string;
  email?: string;
  contractorCode?: string;
  total?: number;
  totalInclVat?: number;
  totalCost?: number;
}

export interface WorksOrderLine {
  id: string;
  worksOrderNo: string;
  customerNo: string;
  lineNo: number;
  type?: string;
  sorCode?: string;
  description?: string;
  description2?: string;
  quantity?: number;
  trade?: number;
  materials?: number;
  total?: number;
  totalInclVat?: number;
  cost?: number;
  totalCost?: number;
  vatCode?: string;
  location?: string;
  variationCompleteDate?: string;
  issueDate?: string;
  authorisedBy?: string;
  authorisationDate?: string;
  addedToInvoice?: boolean;
}

export interface WorksOrderEvent {
  id: string;
  entryNo: number;
  jobNo: string;
  customerJobNo?: string;
  direction?: string;
  eventType?: string;
  detail?: string;
  eventDate?: string;
  eventTime?: string;
  attention?: string;
  requiresAttention?: boolean;
  stage?: string;
  appointmentTime?: string;
  extraText?: string;
  sent?: string;
  userId?: string;
}
