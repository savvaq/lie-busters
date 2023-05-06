import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Button from '../components/button/button';
import { useState, MouseEventHandler } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router.js';

export default function Home() {
  const router = useRouter();
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreateGameModal = () => {
    setShowCreateGameModal(true);
  };

  const handleCreateGameClick: MouseEventHandler = (e) => {
    e.preventDefault();

    axios
      .post('/api/games/create', {
        name: name,
      })
      .then((res) => {
        // res.data; => Context
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

  const handleJoinGameModalClick = () => {
    setShowJoinGameModal(true);
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
        <h1 className={styles.title}>Lying Game</h1>
        <p className={styles.description}>Play with your friends!</p>
        <Button text="Create Game" onclick={handleCreateGameModal} />
        <Button text="Join Game" onclick={handleJoinGameModalClick} />
        <div className={styles.rules}>
          <h2>Rules</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, nec
            ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies
            ultricies, nunc nisl ultricies nunc, nec ultricies nisl nisl eget
            nisl.
          </p>
        </div>
        {showCreateGameModal === true ? (
          <div className={styles['create-game-modal']}>
            <h2>Create Game</h2>
            <form>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button text="Submit" onclick={handleCreateGameClick} />
            </form>
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
