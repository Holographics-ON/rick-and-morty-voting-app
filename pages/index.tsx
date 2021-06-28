import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { GetServerSideProps, GetStaticPaths } from 'next'
import styles from '../styles/Home.module.css'
import Counter from '../Components/Counter'


export default function Home( { data }) {
  const { info, results: defaultResults = []} = data;
  const [results, updateResults] = useState(defaultResults);
  
  const [page, updatePage] = useState({
    ...info,
    current: 'https://rickandmortyapi.com/api/character',
  });
  const { current } = page;

  useEffect( () => {
    if ( current === 'https://rickandmortyapi.com/api/character') return;
    console.log(page)
    
    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      })

      if ( !nextData.info?.prev ){
        updateResults(nextData.results);
        return;
      }

      updateResults( () => {
        return [
          ...nextData.results
        ]
      });
    }
    request();
  },[current]);

  function handleLoadMore(){
    if(!page?.next){
        return
      }
    updatePage( prev => {
      return {
        ...prev,
        current: page?.next
      }
    })
  }

  function handleLoadPrev(){
    if(!page?.prev){
      return
    }
    updatePage( prev => {
      return {
        ...prev,
        current: page?.prev
      }
    })
  }

  function handleOnSubmitSearch(e){
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field['name'] === 'query');
    const value = fieldQuery['value'] || '';

    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;
    (async function() {
      const res = await fetch(endpoint)
      if(res.status !== 200){
        return
      }
      updatePage({
        current: endpoint
      })

    })().catch(err => {
      console.error(err);
    });
    

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty App</title>
        <meta name="description" content="Rick and Morty Poll app" />
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

          <form className={styles.search} onSubmit={handleOnSubmitSearch}>
              <input name="query" placeholder="Type in your favourite character from the show" type="search" />
              <button className={styles.button}>Search</button>
          </form>

          <div className={styles.pageButtons}>
            <button className= {styles.button} onClick={handleLoadPrev}> &#60; Back to previous</button>
            <button className= {styles.button} onClick={handleLoadMore}> Load more &#62;</button>
          </div>
  
        
        </div>
        <div className={styles.box}>
          {results.map( character =>{
            const {id, name, image } = character;
            return (
            <div className={styles.box} key= {id}>
              <Link href="/character/[id]" as={`/character/${id}`}>
                <img className={styles.card} src={ image } alt= { `${name} Thumbnail` }/>        
              </Link>
              <h5>{ name } 
              <Counter /> </h5>
              
              </div>) 
            })
          } 
        </div>

      </main>
    </div>
  )
}

//https://rickandmortyapi.com/api/character/1,2,3,4,5,244
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://rickandmortyapi.com/api/character',{method: 'GET'})
  const data = await res.json()

   if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props:{
        data
    }
  }
}