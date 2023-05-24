import { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { sigmar } from '../lib/fonts';
import Button from '@/components/Button/Button';
import styles from '@/styles/Home.module.css';
import CreateGameModal from '@/components/Modals/CreateGameModal';
import JoinGameModal from '@/components/Modals/JoinGameModal';
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector';
import { GetServerSideProps } from 'next';
import { motion } from "framer-motion"

export default function Home() {
  const { t } = useTranslation();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  return (
    <>
      <Head>
        <title>Lying Game</title>
        <meta name="description" content="Win by lying!" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles['game-wrapper']}>
        <LanguageSelector />

        <h1 className={styles.title + ' ' + sigmar.className}>Lie Busters</h1>
        <p className={styles.description}>{t('game_subtitle')}</p>
        <div className={styles['button-wrapper']}>
          <Button
            text={t('create_game')}
            onClick={() => setShowCreateGameModal(true)}
          />
          <Button
            text={t('join_game')}
            onClick={() => setShowJoinGameModal(true)}
          />
        </div>
      </div>
      <div 
        className={styles.modal}>
          <CreateGameModal
            isOpen={showCreateGameModal}
            onClose={() => setShowCreateGameModal(false)}
          />

          <JoinGameModal
            isOpen={showJoinGameModal}
            onClose={() => setShowJoinGameModal(false)}
          />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'zod'])),
    },
  };
};
