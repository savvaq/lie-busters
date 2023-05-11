import { useState } from 'react';
import Head from 'next/head';
import { sigmar } from '../app/fonts';
import Button from '../components/Button/Button';
import styles from '@/styles/Home.module.css';
import CreateGameModal from '@/components/Modals/CreateGameModal';
import JoinGameModal from '@/components/Modals/JoinGameModal';

export default function Home() {
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  return (
    <>
      <Head>
        <title>Lying Game</title>
        <meta name="description" content="Win by lying!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles['game-wrapper']}>
        <h1 className={styles.title + ' ' + sigmar.className}>Lie Busters</h1>
        <p className={styles.description}>Game where you can win by lying!</p>
        <div className={styles['button-wrapper']}>
          <Button
            text="Create Game"
            onClick={() => setShowCreateGameModal(true)}
          />
          <Button text="Join Game" onClick={() => setShowJoinGameModal(true)} />
        </div>
      </div>
      <div className={styles.modal}>
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
