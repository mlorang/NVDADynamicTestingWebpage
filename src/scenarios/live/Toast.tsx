import { useState } from 'react';
import { useDelayedAction } from '../../hooks/useDelayedAction';
import { ScenarioProps } from '../types';

const VISIBLE_MS = 6000;

function useToast(delay: number) {
  const [toast, setToast] = useState('');
  const later = useDelayedAction();
  const send = () => {
    later(() => {
      setToast('Message sent');
      later(() => setToast(''), VISIBLE_MS);
    }, delay);
  };
  return { send, toast };
}

function MessageForm({ onSend }: { onSend: () => void }) {
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <label htmlFor="message">Message</label>
      <textarea id="message" rows={3} defaultValue="Hello!" />
      <div>
        <button type="submit" className="btn" data-testid="trigger">
          Send message
        </button>
      </div>
    </form>
  );
}

export function Accessible({ delay }: ScenarioProps) {
  const { send, toast } = useToast(delay);
  return (
    <>
      <MessageForm onSend={send} />
      {/* The live region exists before any toast is placed in it. */}
      <div role="status" className="toast-region" data-testid="toast-region">
        {toast && (
          <div className="toast" data-testid="toast">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

export function Broken({ delay }: ScenarioProps) {
  const { send, toast } = useToast(delay);
  return (
    <>
      <MessageForm onSend={send} />
      <div className="toast-region" data-testid="toast-region">
        {/* The live region is created at the same moment as its content. */}
        {toast && (
          <div role="status" className="toast" data-testid="toast">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
