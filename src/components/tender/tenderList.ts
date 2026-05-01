import type { TenderRow } from '../../views/TendersView';

/** Seed data for the active tenders list. Held as the initial value of
 *  `tenders` state in App so edits made on a tender's detail/plan views
 *  flow back into this list. */
export const INITIAL_TENDERS: TenderRow[] = [
  { serial: 'TN-0047', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Total Parental Nutrition (TPN)', reference: 'RFQ - 2025/009', created: '15/3/2025', advertised: '2/4/2025', deadline: '30/4/2025', expires: '15/3/2027' },
  { serial: 'TN-0046', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Drug Eluting Stents', reference: 'RFQ - 2025/012', created: '22/4/2025', advertised: '10/5/2025', deadline: '7/6/2025', expires: '22/4/2027' },
  { serial: 'TN-0045', status: 'Advertised', method: 'RFQ', type: 'Supplies', description: 'Various Dental Burs', reference: 'RFQ - 2025/008', created: '3/2/2025', advertised: '18/2/2025', deadline: '18/3/2025', expires: '3/2/2027' },
  { serial: 'TN-0044', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Surgical Instruments', reference: 'RFT - 2025/003', created: '10/1/2025', advertised: '25/1/2025', deadline: '22/2/2025', expires: '10/1/2027' },
  { serial: 'TN-0043', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Various HIV Medicines', reference: 'RFT - 2025/004', created: '28/1/2025', advertised: '14/2/2025', deadline: '14/3/2025', expires: '28/1/2027' },
  { serial: 'TN-0042', status: 'Award', method: 'RFQ', type: 'Supplies', description: 'Intravenous Infusion Pumps…', reference: 'RFQ - 2025/006', created: '5/12/2024', advertised: '20/12/2024', deadline: '20/1/2025', expires: '5/12/2026' },
];
