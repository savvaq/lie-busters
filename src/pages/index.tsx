import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Button from '../components/button/button.jsx'
import { useState } from 'react'

export default function Home() {
  
  const [showCreateGameModal, setShowCreateGameModal] = useState(false)
  const [showJoinGameModal, setShowJoinGameModal] = useState(false)
  
  const handleCreateGameClick = () => {
    setShowCreateGameModal(true)
    console.log(showCreateGameModal)
  }

  const handleJoinGameClick = () => {
    setShowJoinGameModal(true)
    console.log(showJoinGameModal)
  }

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
        <Button text="Create Game" onclick={handleCreateGameClick} />
        <Button text="Join Game" onclick={handleJoinGameClick} />
        <div className={styles.rules}>
          <h2>Rules</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nisl nisl eget nisl.</p>        
        </div>
        {
          showCreateGameModal === true ?
            <div className={styles['create-game-modal']}>
              <h2>Create Game</h2>
              <form>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" />
                <Button text="Submit" />
              </form>
            </div>
          : null
        }
        {
          showJoinGameModal === true ?
            <div className={styles['join-game-modal']}>
              <h2>Join Game</h2>
              <form>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" />
                <label htmlFor="code">Code</label>
                <input type="text" id="code" name="code" />
                <Button text="Submit" />
              </form>
            </div>
          : null
        }
      </div>
    </>
  )
}
