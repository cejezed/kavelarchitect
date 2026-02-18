'use client';

import { useState } from 'react';
import KavelAlertForm from './KavelAlertForm';

type KavelAlertOverlayProps = {
  buttonText: string;
  className?: string;
  onOpen?: () => void;
};

export default function KavelAlertOverlay({ buttonText, className, onOpen }: KavelAlertOverlayProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        title="Activeer KavelAlert"
        aria-label="Activeer KavelAlert voor nieuwe bouwkavels"
        className={className}
      >
        {buttonText}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <KavelAlertForm onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
