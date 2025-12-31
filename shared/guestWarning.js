let hideTimer;

export function showWarning(message) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('guest-warning-toast');
  const toast = existing || document.createElement('div');

  if (!existing) {
    toast.id = 'guest-warning-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1f2937',
      color: '#fff',
      padding: '12px 18px',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
      zIndex: '9999',
      maxWidth: '90%',
      textAlign: 'center'
    });
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = 'block';

  if (hideTimer) {
    clearTimeout(hideTimer);
  }

  hideTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
