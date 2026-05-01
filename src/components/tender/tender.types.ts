import { TENDER_DOC_COUNT } from './tenderDocs';
import { TENDER_ITEM_COUNT } from './tenderItems';
import { TENDER_SUPPLIER_COUNT } from './tenderSuppliers';

export type TenderStepStatus = 'complete' | 'nextUp' | 'incomplete';

export type TenderStepKey = 'plan' | 'items' | 'source' | 'evaluate' | 'award';

export interface TenderStep {
  key: TenderStepKey;
  status: TenderStepStatus;
  /** Numeric count of items/documents/suppliers/bids for this step. 0 when
   *  the step is incomplete (no real data yet). The `award` step has no
   *  natural count, so it stays at 0 and the panel hides the label. */
  count: number;
}

const STEP_ORDER: TenderStepKey[] = ['plan', 'items', 'source', 'evaluate', 'award'];

const STATUS_TO_NEXT_UP_INDEX: Record<string, number> = {
  Planning: 0,    // plan is nextUp
  Advertised: 2,  // source is nextUp
  Evaluation: 3,  // evaluate is nextUp
  Award: 4,       // award is nextUp
  Finalised: -1,  // all complete
};

const MOCK_COUNTS: Record<TenderStepKey, number> = {
  // Sum of internal + procurement documents shown on the Plan view, so the
  // panel badge stays in sync with the actual seed data.
  plan: TENDER_DOC_COUNT,
  items: TENDER_ITEM_COUNT,
  source: TENDER_SUPPLIER_COUNT,
  evaluate: 8,
  award: 0,
};

/**
 * i18n key used to render the count label for a given step. The matching
 * value strings live in each locale's `tenderState` block and use a
 * `{{count}}` interpolation. `award` returns null because it has no count
 * label in the design.
 */
const COUNT_LABEL_KEYS: Record<TenderStepKey, string | null> = {
  plan: 'tenderState.countDocuments',
  items: 'tenderState.countItems',
  source: 'tenderState.countSuppliers',
  evaluate: 'tenderState.countBidsEvaluated',
  award: null,
};

export function getCountLabelKey(stepKey: TenderStepKey): string | null {
  return COUNT_LABEL_KEYS[stepKey];
}

export function getTenderSteps(tenderStatus: string): TenderStep[] {
  const nextUpIndex = STATUS_TO_NEXT_UP_INDEX[tenderStatus] ?? 0;

  return STEP_ORDER.map((key, i) => {
    let status: TenderStepStatus;
    if (nextUpIndex === -1) {
      status = 'complete';
    } else if (i < nextUpIndex) {
      status = 'complete';
    } else if (i === nextUpIndex) {
      status = 'nextUp';
    } else {
      status = 'incomplete';
    }

    return {
      key,
      status,
      count: status === 'incomplete' ? 0 : MOCK_COUNTS[key],
    };
  });
}
