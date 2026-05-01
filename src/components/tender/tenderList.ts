import type { TenderRow } from '../../views/TendersView';

/** Seed data for the active tenders list. Held as the initial value of
 *  `tenders` state in App so edits made on a tender's detail/plan views
 *  flow back into this list. */
// Date relationships per tender row (today is around 2026-05-01):
//   - deadline: within 5 months of today (so the deadline UI shows an
//     upcoming countdown rather than "overdue").
//   - advertised: at least 6 months prior to the deadline.
//   - created: no more than 3 months prior to the advertised date.
export const INITIAL_TENDERS: TenderRow[] = [
  { serial: 'TN-0047', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Total Parental Nutrition (TPN)', reference: 'RFQ - 2025/009', created: '22/9/2025', advertised: '8/11/2025', deadline: '12/6/2026', expires: '15/3/2027' },
  { serial: 'TN-0046', status: 'Planning', method: 'RFQ', type: 'Supplies', description: 'Drug Eluting Stents', reference: 'RFQ - 2025/012', created: '14/11/2025', advertised: '5/1/2026', deadline: '23/8/2026', expires: '22/4/2027' },
  { serial: 'TN-0045', status: 'Advertised', method: 'RFQ', type: 'Supplies', description: 'Various Dental Burs', reference: 'RFQ - 2025/008', created: '6/9/2025', advertised: '18/10/2025', deadline: '29/5/2026', expires: '3/2/2027' },
  { serial: 'TN-0044', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Surgical Instruments', reference: 'RFT - 2025/003', created: '19/12/2025', advertised: '4/2/2026', deadline: '4/4/2026', expires: '10/1/2027' },
  { serial: 'TN-0043', status: 'Evaluation', method: 'RFT', type: 'Supplies', description: 'Various HIV Medicines', reference: 'RFT - 2025/004', created: '10/10/2025', advertised: '21/11/2025', deadline: '4/7/2026', expires: '28/1/2027' },
  { serial: 'TN-0042', status: 'Award', method: 'RFQ', type: 'Supplies', description: 'Intravenous Infusion Pumps…', reference: 'RFQ - 2025/006', created: '28/1/2026', advertised: '12/3/2026', deadline: '30/9/2026', expires: '5/12/2026' },
];
