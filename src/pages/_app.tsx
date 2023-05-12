import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { rubik } from '../app/fonts';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <main className={rubik.className}>
      <Component {...pageProps} />
    </main>
  );
};

export default appWithTranslation(App);
