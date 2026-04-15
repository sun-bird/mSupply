export type TenderStepStatus = 'complete' | 'nextUp' | 'incomplete';

export type TenderStepKey = 'plan' | 'items' | 'source' | 'evaluate' | 'award';

export interface TenderStep {
  key: TenderStepKey;
  status: TenderStepStatus;
  countLabel: string;
}

const STEP_ORDER: TenderStepKey[] = ['plan', 'items', 'source', 'evaluate', 'award'];

const STATUS_TO_NEXT_UP_INDEX: Record<string, number> = {
  Planning: 0,    // plan is nextUp
  Advertised: 2,  // source is nextUp
  Evaluation: 3,  // evaluate is nextUp
  Award: 4,       // award is nextUp
  Finalised: -1,  // all complete
};

const MOCK_COUNTS: Record<TenderStepKey, string> = {
  plan: '9 documents.',
  items: '23 items.',
  source: '4 suppliers.',
  evaluate: '8 bids evaluated.',
  award: '',
};

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
      countLabel: MOCK_COUNTS[key],
    };
  });
}
