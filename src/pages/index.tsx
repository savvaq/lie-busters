import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Button from '../components/button/button'

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
        <Button text="Create Game" />
        <Button text="Join Game" />
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
