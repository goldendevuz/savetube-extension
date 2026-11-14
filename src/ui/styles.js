// Self-contained styles for the Shadow DOM. No YouTube or SaveTube CSS is imported.
export const STYLES = `
:host { all: initial; }
* { box-sizing: border-box; font-family: "Roboto", system-ui, -apple-system, sans-serif; }

.savetube-row { display: inline-flex; gap: 8px; align-items: center; }
.savetube-watchbar { display: flex; gap: 8px; align-items: center; padding: 12px 0; }

.savetube-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 14px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
  color: #f1f1f1;
  font-size: 14px; font-weight: 500; line-height: 1;
  cursor: pointer; white-space: nowrap;
  transition: background .15s ease, border-color .15s ease;
}
.savetube-btn:hover { background: rgba(255,255,255,0.16); }
.savetube-btn:active { transform: translateY(1px); }
.savetube-btn:focus-visible { outline: 2px solid #34d399; outline-offset: 2px; }
.savetube-btn--primary { background: #10b981; border-color: transparent; color: #fff; }
.savetube-btn--primary:hover { background: #0d946a; }
.savetube-btn--icon { height: 30px; width: 30px; padding: 0; border-radius: 50%; justify-content: center; }
.savetube-btn__icon { display: inline-flex; }
.savetube-btn__label:empty { display: none; }

.savetube-overlay {
  position: fixed; top: 0; left: 0;
  display: none; gap: 6px; padding: 4px;
  border-radius: 21px; background: rgba(15,15,17,0.86);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  pointer-events: auto;
}
.savetube-overlay.is-visible { display: inline-flex; }
.savetube-overlay .savetube-btn {
  color: #fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.12);
}
.savetube-overlay .savetube-btn:hover { background: rgba(255,255,255,0.24); }

.savetube-toasts {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  pointer-events: none;
}
.savetube-toast {
  display: inline-flex; align-items: center; gap: 12px;
  max-width: 90vw; padding: 10px 16px;
  border-radius: 10px;
  background: #1f1f22; color: #f1f1f1;
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.4);
  opacity: 0; transform: translateY(8px);
  transition: opacity .2s ease, transform .2s ease;
  pointer-events: auto;
}
.savetube-toast.is-visible { opacity: 1; transform: translateY(0); }
.savetube-toast--error { border-color: rgba(255,99,99,0.5); }
.savetube-toast--success { border-color: rgba(88,214,141,0.45); }
.savetube-toast__msg { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.savetube-toast__cta {
  flex: none; border: 0; border-radius: 6px; padding: 6px 12px;
  background: #10b981; color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
}
.savetube-toast__cta:hover { background: #0d946a; }

@media (prefers-color-scheme: light) {
  .savetube-btn { color: #0f0f0f; border-color: rgba(0,0,0,0.15); background: rgba(0,0,0,0.05); }
  .savetube-btn:hover { background: rgba(0,0,0,0.1); }
  .savetube-btn--primary { color: #fff; }
}
`;
