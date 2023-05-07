import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Button from '../components/Button/Button';
import { useState, MouseEventHandler } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router.js';
import { sigmar } from '../app/fonts'

export default function Home() {
  const router = useRouter();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreateGameClick: MouseEventHandler = (e) => {
    e.preventDefault();

    axios
      .post('/api/games/create', {
        name: name,
      })
      .then((res) => {
        router.push(`/game/${res.data.code}`);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleJoinGameClick: MouseEventHandler = (e) => {
    e.preventDefault();

    axios
      .post('/api/games/join', {
        name: name,
        code: code,
      })
      .then((res) => {
        router.push(`/game/${res.data.code}`);
      })
      .catch((err) => {
        console.log(err.response);
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
      <div className={styles.gamewrapper}>
        <h1 className={styles.title + ' ' + sigmar.className}>Lying Game</h1>
        <p className={styles.description}>Game where you can win by lying!</p>
        <div className={styles['button-wrapper']}>
          <Button text="Create Game" onclick={() => setShowCreateGameModal(true)} />
          <Button text="Join Game" onclick={() => setShowJoinGameModal(true)} />
        </div>
        {showCreateGameModal === true ? (
          <div className={styles['create-game-modal']}>
            <h2>Create New Game</h2>
            <form className={styles['create-game-form']}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </form>
            <Button text="Start Game" onclick={handleCreateGameClick} />
          </div>
        ) : null}
        {showJoinGameModal === true ? (
          <div className={styles['join-game-modal']}>
            <h2>Join Game</h2>
            <form>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="code">Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button text="Submit" onclick={handleJoinGameClick} />
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
}
