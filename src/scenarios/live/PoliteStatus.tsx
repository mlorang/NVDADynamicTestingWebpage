import { useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

function useCart(delay: number) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const later = useDelayedAction();
  const add = () => {
    const next = count + 1;
    setCount(next);
    later(() => setMessage(`Item added to cart. ${next} ${next === 1 ? 'item' : 'items'} in cart.`), delay);
  };
  return { add, message };
}

export function Accessible({ delay }: ScenarioProps) {
  const { add, message } = useCart(delay);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={add}>
        Add to cart
      </button>
      <div role="status" className="status" data-testid="status">
        {message && <span data-testid="status-text">{message}</span>}
      </div>
    </>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const { add, message } = useCart(delay);
  return (
    <>
      <button type="button" className="btn" data-testid="trigger" onClick={add}>
        Add to cart
      </button>
      <div className="status" data-testid="status">
        {message && <span data-testid="status-text">{message}</span>}
      </div>
    </>
  );
}
