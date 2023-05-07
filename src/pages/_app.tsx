import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { rubik } from '../app/fonts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={rubik.className}>
      <Component {...pageProps} />;
    </main>
  )
}
