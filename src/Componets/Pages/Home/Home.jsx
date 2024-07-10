import React, { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ChatbotPopup from '../Popup/ChatBotPopup'
import styles from './Home.module.sass'

// Importing local images
import image3 from '../../img/dorado.jpg'
import image2 from '../../img/mackerel.jpg'
import image1 from '../../img/somon.jpg'

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

	const images = [
		{
			src: image1,
			caption: 'Лосось',
			orderText:
				'Приветствую, я хочу заказать лосось малосольный холодного копчения',
		},
		{
			src: image2,
			caption: 'Скумбрия',
			orderText: 'Приветствую, я хочу заказать скумбрию холодного копчения',
		},
		{
			src: image3,
			caption: 'Дорадо',
			orderText: 'Приветствую, я хочу заказать дорадо горячего копчения',
		},
	]

	const handleImageClick = orderText => {
		const whatsappUrl = `https://wa.me/+905444558407?text=${encodeURIComponent(
			orderText
		)}`
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
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
			<h2 className={styles.homeH2}>Копченая рыба в Анталии</h2>
			<div className={styles.homeImages}>
				{images.map((image, index) => (
					<div key={index} className={styles.imageContainer}>
						<img
							src={image.src}
							alt={image.caption}
							onClick={() => handleImageClick(image.orderText)}
							style={{ cursor: 'pointer' }}
						/>
						<p>{image.caption}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Home
