import { ComponentType } from 'react';

export interface ScenarioProps {
  /** Milliseconds before async updates happen (from `?delay=` or the scenario default). */
  delay: number;
}

export interface ScenarioVariants {
  Accessible: ComponentType<ScenarioProps>;
  Broken: ComponentType<ScenarioProps>;
}
