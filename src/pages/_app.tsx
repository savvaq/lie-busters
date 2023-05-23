import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { rubik } from '../lib/fonts';
import { ToastContainer } from 'react-toastify';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

const App = ({ Component, pageProps }: AppProps) => {
  const { t } = useTranslation();
  z.setErrorMap(makeZodI18nMap({ t, ns: ['zod', 'custom'] }));

  return (
    <main className={rubik.className}>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </main>
  );
};

export default appWithTranslation(App);
