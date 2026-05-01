export interface TenderItem {
  itemNumber: string;
  itemCode: string;
  itemName: string;
  numberOfPacks: number;
  packSize: number;
  totalQuantity: number;
  unitType: number;
  productSpecifications: string;
  conditions: string;
}

export const TENDER_ITEMS: TenderItem[] = [
  { itemNumber: '101', itemCode: 'M-002523', itemName: 'Acipimox - Cap 250 mg', numberOfPacks: 10, packSize: 50, totalQuantity: 500, unitType: 28, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '102', itemCode: 'M-003841', itemName: 'Ajmaline - Inj 5 mg per ml, 10 ml ampoule', numberOfPacks: 20, packSize: 25, totalQuantity: 500, unitType: 14, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '103', itemCode: 'M-001297', itemName: 'Atorvastatin - Tab 10 mg', numberOfPacks: 15, packSize: 100, totalQuantity: 1500, unitType: 30, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '104', itemCode: 'M-004510', itemName: 'Cilazapril - Tab 5 mg', numberOfPacks: 8, packSize: 30, totalQuantity: 240, unitType: 28, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '105', itemCode: 'M-002198', itemName: 'Clonidine hydrochloride - Tab 25 mcg', numberOfPacks: 12, packSize: 60, totalQuantity: 720, unitType: 56, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '106', itemCode: 'M-003672', itemName: 'Isosorbide mononitrate - Tab 20 mg', numberOfPacks: 25, packSize: 28, totalQuantity: 700, unitType: 30, productSpecifications: 'Abc', conditions: 'Abc' },
  { itemNumber: '107', itemCode: 'M-005034', itemName: 'Omeprazole powder for oral suspension 2 mg per mL', numberOfPacks: 5, packSize: 90, totalQuantity: 450, unitType: 7, productSpecifications: 'Abc', conditions: 'Abc' },
];

export const TENDER_ITEM_COUNT = TENDER_ITEMS.length;
