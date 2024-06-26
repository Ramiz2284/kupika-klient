import React, { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ChatbotPopup from '../Popup/ChatBotPopup'
import styles from './Home.module.sass'

const Home = () => {
	const [isChatbotOpen, setIsChatbotOpen] = useState(false)
	const [deferredPrompt, setDeferredPrompt] = useState(null)
	const [isInstallable, setIsInstallable] = useState(false)

	const openChatbot = () => setIsChatbotOpen(true)
	const closeChatbot = () => setIsChatbotOpen(false)

	useEffect(() => {
		const handler = e => {
			e.preventDefault()
			setDeferredPrompt(e)
			setIsInstallable(true)
		}

		window.addEventListener('beforeinstallprompt', handler)

		return () => {
			window.removeEventListener('beforeinstallprompt', handler)
		}
	}, [])

	const handleInstallClick = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt()
			const { outcome } = await deferredPrompt.userChoice
			if (outcome === 'accepted') {
				console.log('User accepted the install prompt')
			} else {
				console.log('User dismissed the install prompt')
			}
			setDeferredPrompt(null)
			setIsInstallable(false)
		}
	}

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
			{isInstallable && (
				<button className={styles.button} onClick={handleInstallClick}>
					Установить приложение
				</button>
			)}
		</div>
	)
}

export default Home
