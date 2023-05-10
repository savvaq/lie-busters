import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Button from '../components/Button/Button';
import { useState, MouseEventHandler } from 'react';
import { useRouter } from 'next/router.js';
import { sigmar } from '../app/fonts';
import Modal from '../components/Modal/Modal';
import { createGameApi, joinGameApi } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const [gameWrapperStyle, setGameWrapperStyle] = useState(
    styles['game-wrapper']
  );

  const blurGamewrapper = () => {
    setGameWrapperStyle(styles['game-wrapper-blur']);
  };

  const unblurGamewrapper = () => {
    setGameWrapperStyle(styles['game-wrapper']);
  };

  const handleCreateGameClick: MouseEventHandler = (e) => {
    e.preventDefault();

    createGameApi(name).then((res) => {
      router.push(`/game/${res.data.code}`);
    });
  };

  const handleJoinGameClick: MouseEventHandler = (e) => {
    e.preventDefault();

    joinGameApi(code, name).then((res) => {
      router.push(`/game/${res.data.code}`);
    });
  };

  return (
    <>
      <Head>
        <title>Lying Game</title>
        <meta name="description" content="Win by lying!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={gameWrapperStyle}>
        <h1 className={styles.title + ' ' + sigmar.className}>Lie Busters</h1>
        <p className={styles.description}>Game where you can win by lying!</p>
        <div className={styles['button-wrapper']}>
          <Button
            text="Create Game"
            onclick={() => {
              setShowCreateGameModal(true);
              blurGamewrapper();
            }}
          />
          <Button
            text="Join Game"
            onclick={() => {
              setShowJoinGameModal(true);
              blurGamewrapper();
            }}
          />
        </div>
      </div>
      <div className={styles.modal}>
        {showCreateGameModal === true ? (
          <Modal
            handleClick={handleCreateGameClick}
            title="Create New Game"
            type="create"
            onClose={() => setShowCreateGameModal(false)}
            fields={[{ title: 'Your Name', name: 'name', id: 1 }]}
            button="Start Game"
            name={name}
            setName={setName}
            code={code}
            setCode={setCode}
            closeModal={() => {
              setShowCreateGameModal(false);
              unblurGamewrapper();
            }}
          />
        ) : null}
        {showJoinGameModal === true ? (
          <Modal
            handleClick={handleJoinGameClick}
            title="Join Game"
            type="join"
            onClose={() => setShowCreateGameModal(false)}
            fields={[
              { title: 'Your Name', name: 'name', id: 1 },
              { title: 'Game Code', name: 'code', id: 2 },
            ]}
            button="Join Game"
            name={name}
            setName={setName}
            code={code}
            setCode={setCode}
            closeModal={() => {
              setShowJoinGameModal(false);
              unblurGamewrapper();
            }}
          />
        ) : null}
      </div>
    </>
  );
}
