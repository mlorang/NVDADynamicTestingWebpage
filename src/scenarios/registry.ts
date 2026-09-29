import { SCENARIOS, ScenarioMeta } from './registry.data';
import { ScenarioVariants } from './types';
import * as PoliteStatus from './live/PoliteStatus';
import * as ErrorAlert from './live/ErrorAlert';
import * as Toast from './live/Toast';
import * as Loading from './live/Loading';
import * as Accordion from './disclosure/Accordion';
import * as Dialog from './disclosure/Dialog';
import * as Tabs from './disclosure/Tabs';
import * as MenuButton from './disclosure/MenuButton';
import * as InlineValidation from './forms/InlineValidation';
import * as ErrorSummary from './forms/ErrorSummary';
import * as Labels from './forms/Labels';
import * as Success from './forms/Success';
import * as Combobox from './dynamic/Combobox';
import * as LoadMore from './dynamic/LoadMore';
import * as SortableTable from './dynamic/SortableTable';
import * as DelayedContent from './dynamic/DelayedContent';

const COMPONENTS: Record<string, ScenarioVariants> = {
  'live-polite': PoliteStatus,
  'live-alert': ErrorAlert,
  'live-toast': Toast,
  'live-loading': Loading,
  'disclosure-accordion': Accordion,
  'disclosure-dialog': Dialog,
  'disclosure-tabs': Tabs,
  'disclosure-menu': MenuButton,
  'forms-inline': InlineValidation,
  'forms-summary': ErrorSummary,
  'forms-labels': Labels,
  'forms-success': Success,
  'dynamic-combobox': Combobox,
  'dynamic-load-more': LoadMore,
  'dynamic-sort-table': SortableTable,
  'dynamic-inject': DelayedContent,
};

export type Scenario = ScenarioMeta & ScenarioVariants;

export const REGISTRY: Scenario[] = SCENARIOS.map((meta) => {
  const components = COMPONENTS[meta.id];
  if (!components) throw new Error(`No components registered for scenario "${meta.id}"`);
  return { ...meta, ...components };
});
