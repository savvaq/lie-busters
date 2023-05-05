import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Button from '../components/button/button.jsx'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
        <Button text="Create Game" />
        <Button text="Join Game" />
        <div className={styles.rules}>
          <h2>Rules</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nisl nisl eget nisl.</p>        
        </div>
      </div>
    </>
    // First button on click shows a modal to enter your name
    // button to create a game
    // on click it goes to another "Lobby" page

    // Second button on click shows a modal to enter the code for the game
    // two fields - one for name and one for code
    // and submit button
  )
}
