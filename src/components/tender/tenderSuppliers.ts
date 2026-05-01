import type { Supplier } from './SupplierSidebar';

export const TENDER_SUPPLIERS: Supplier[] = [
  { code: 'CC', name: "Chloe's Consumables", performance: 100, dateSent: '12/02/2026', dateResponded: '18/02/2026', totalBid: '514.00', tenderValue: 489.30, totalOnPO: 372.50, checked: true, pastBids: 14, tendersWon: 5, deliveryOnTime: 100, comment: "Chloe's have been great to deal with. They were responsive when we had questions about delivery and suppliers were well packed and arrived on time." },
  { code: 'KS2', name: "Luna's Apothecary Consumable Supplies", performance: 100, dateSent: '14/02/2026', dateResponded: '25/02/2026', totalBid: '1,247.80', tenderValue: 1105.60, totalOnPO: 863.20, checked: true, pastBids: 14, tendersWon: 5, deliveryOnTime: 100, comment: "Luna's have been great to deal with. They were responsive when we had questions about delivery and suppliers were well packed and arrived on time." },
  { code: 'X454', name: 'Kahn Medical Equipment', performance: 89, dateSent: '12/02/2026', dateResponded: '03/03/2026', totalBid: '782.50', tenderValue: 695.00, totalOnPO: 410.75, checked: false, pastBids: 8, tendersWon: 2, deliveryOnTime: 89, comment: '' },
  { code: 'LPOC', name: "Lorenzo's POC Solutions", performance: 87, dateSent: '15/02/2026', dateResponded: '22/02/2026', totalBid: '623.40', tenderValue: 580.15, totalOnPO: 290.00, checked: true, pastBids: 11, tendersWon: 4, deliveryOnTime: 87, comment: '' },
  { code: 'TSS', name: 'The Supply Shack', performance: 64, dateSent: '12/02/2026', dateResponded: '10/03/2026', totalBid: '1,890.00', tenderValue: 1742.25, totalOnPO: 526.40, checked: false, pastBids: 6, tendersWon: 1, deliveryOnTime: 64, comment: '' },
];

export const TENDER_SUPPLIER_COUNT = TENDER_SUPPLIERS.length;
