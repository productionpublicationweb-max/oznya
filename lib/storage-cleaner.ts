// Nettoyage automatique du localStorage corrompu

export function initSafeStorage(): void {
  if (typeof window === 'undefined') return;
  
  const OBSOLETE_KEYS = [
    'nyxia_last_visit_',
    'nyxia_last_visit',
    'nyxia_user'
  ];
  
  OBSOLETE_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });
  
  const settings = localStorage.getItem('nyxia_settings');
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      if (typeof parsed.soundEnabled !== 'boolean' || 
          typeof parsed.reminderEnabled !== 'boolean') {
        localStorage.removeItem('nyxia_settings');
      }
    } catch {
      localStorage.removeItem('nyxia_settings');
    }
  }
}

export function cleanCorruptedStorage(): void {
  initSafeStorage();
}
