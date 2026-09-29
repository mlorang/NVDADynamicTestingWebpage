import { useSearchParams } from 'react-router-dom';
import { Variant } from '../scenarios/registry.data';

/** Reads the `?variant=` and `?delay=` query params that drive every scenario. */
export function useScenarioParams(defaultDelay: number): { variant: Variant; delay: number } {
  const [params] = useSearchParams();
  const variant: Variant = params.get('variant') === 'broken' ? 'broken' : 'accessible';
  const raw = params.get('delay');
  const parsed = raw === null ? NaN : Number(raw);
  const delay = Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultDelay;
  return { variant, delay };
}
