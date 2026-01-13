import { useApp, Language } from '@/contexts/AppContext';
import { t as translate } from '@/lib/i18n';

export const useTranslation = () => {
  const { language } = useApp();
  
  const t = (key: Parameters<typeof translate>[0]) => translate(key, language);
  
  return { t, language };
};
