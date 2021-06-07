import React, {useState, useEffect} from 'react'
import styles from '../styles/Home.module.css'


export default function Counter() {
    const [count, setCount] = useState(0)
    return (
        <div>
            
            <button className= {styles.button} onClick={()=> setCount( count + 1) }>
                VOTE 
            </button>
             + {count}  
        </div>
    )
}


