import { initSafeStorage } from '@/lib/storage-cleaner';

// Et au début du composant, ajoute :
useEffect(() => {
  initSafeStorage();
}, []);
