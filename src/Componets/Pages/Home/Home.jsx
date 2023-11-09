// HomePage.js
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.sass'

const Home = () => {
	return (
		<div className={styles.container}>
			<Link className={styles.Linkbutton} to='/create-list'>
				<button className={styles.button}>Создать список</button>
			</Link>
			<Link className={styles.Linkbutton} to='/my-list'>
				<button className={styles.button}>Ваши списки</button>
			</Link>

			<button className={styles.button}>Спросить у бота</button>
		</div>
	)
}

export default Home
