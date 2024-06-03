// HomePage.js
import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ChatbotPopup from '../Popup/ChatBotPopup'
import styles from './Home.module.sass'

const Home = () => {
	const [isChatbotOpen, setIsChatbotOpen] = useState(false)

	const openChatbot = () => setIsChatbotOpen(true)
	const closeChatbot = () => setIsChatbotOpen(false)

	return (
		<div className={styles.container}>
			<h1 className={styles.homeH1}>Список покупок для магазина</h1>
			<Link className={styles.Linkbutton} to='/create-list'>
				<button className={styles.button}>Создать список</button>
			</Link>
			<Link className={styles.Linkbutton} to='/my-list'>
				<button className={styles.button}>Ваши списки</button>
			</Link>

			<button className={styles.button} onClick={openChatbot}>
				Спросить у ChatGPT
			</button>
			<ChatbotPopup isOpen={isChatbotOpen} onClose={closeChatbot} />
			<a
				className={styles.Linkbutton}
				href='https://wa.me/+905444558407'
				target='_blank'
				rel='noopener noreferrer'
			>
				<button className={styles.button}>
					<FaWhatsapp /> Копченная рыба и колбаса в Анталии
				</button>
			</a>
			<p className={styles.explanation}>
				Нажмите на эту кнопку, чтобы перейти в WhatsApp и просмотреть наш
				ассортимент, узнать цены и сделать заказ.
			</p>
		</div>
	)
}

export default Home
