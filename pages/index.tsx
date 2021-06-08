import Head from 'next/head'
import { GetServerSideProps, GetStaticPaths } from 'next'
import styles from '../styles/Home.module.css'
import Counter from '../Components/Counter'


export default function Home( { characters }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <h1 className={styles.title}>
            Welcome to Rick & Morty api 
          </h1>

          <p className={styles.description}>
            
            <code className={styles.code}>Get started by voting for your favourite characters from the show !! </code>
          </p>
        </div>
        <div className={styles.box}>
          {characters.map( (character) => 
            <div className={styles.box} key= {character.id}>
              <img className={styles.card} src={ character.image } alt= {character.name}/>        
              <h5>{character.name} 
              <Counter /> </h5>
              
            </div> )} 
        </div>

      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`https://rickandmortyapi.com/api/character/[1,2,3,4,5,244]`)
  const data = await res.json()

  return {
    props:{
      characters: data
    }
  }
}