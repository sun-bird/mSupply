import type { TenderDocument } from './DocumentList';

function randomDate(): string {
  const day = Math.floor(Math.random() * 28) + 1;
  const month = Math.floor(Math.random() * 3) + 1;
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.2025`;
}

export const INITIAL_INTERNAL_DOCS: TenderDocument[] = [
  { id: '1', name: 'Budget Allocation.xlsx', uploadDate: randomDate() },
  { id: '2', name: 'Business Case.docx', uploadDate: randomDate() },
  { id: '3', name: 'Confidentiality Agreements.pdf', uploadDate: randomDate() },
  { id: '4', name: 'Evaluation Criteria.docx', uploadDate: randomDate() },
  { id: '5', name: 'Procurement Plan.pdf', uploadDate: randomDate() },
  { id: '6', name: 'Risk Register.xlsx', uploadDate: randomDate() },
];

export const INITIAL_PROCUREMENT_DOCS: TenderDocument[] = [
  { id: '7', name: 'RFx document.pdf', uploadDate: randomDate() },
  { id: '8', name: 'Supplier Guidance Document.pdf', uploadDate: randomDate() },
  { id: '9', name: 'Terms and Conditions.pdf', uploadDate: randomDate() },
];

export const TENDER_DOC_COUNT =
  INITIAL_INTERNAL_DOCS.length + INITIAL_PROCUREMENT_DOCS.length;
