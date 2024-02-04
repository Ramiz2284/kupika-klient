// HomePage.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ChatbotPopup from '../Popup/ChatBotPopup'
import styles from './Home.module.sass'

const Home = () => {
	const [isChatbotOpen, setIsChatbotOpen] = useState(false)

	const openChatbot = () => setIsChatbotOpen(true)
	const closeChatbot = () => setIsChatbotOpen(false)

	return (
		<div className={styles.container}>
			<Link className={styles.Linkbutton} to='/create-list'>
				<button className={styles.button}>Создать список</button>
			</Link>
			<Link className={styles.Linkbutton} to='/my-list'>
				<button className={styles.button}>Ваши списки</button>
			</Link>

			<button className={styles.button} onClick={openChatbot}>
				Спросить у бота
			</button>
			<ChatbotPopup isOpen={isChatbotOpen} onClose={closeChatbot} />
		</div>
	)
}

export default Home
