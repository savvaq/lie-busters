import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { rubik } from '../app/fonts';
import { ToastContainer } from 'react-toastify';

const App = ({ Component, pageProps }: AppProps) => {
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
