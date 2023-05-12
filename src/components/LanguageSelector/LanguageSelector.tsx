import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styles from './LanguageSelector.module.scss';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const languages = {
    en: 'English',
    ru: 'Русский',
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;

    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <select onChange={onChange} className={styles.select} value={i18n.language}>
      {Object.entries(languages).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
