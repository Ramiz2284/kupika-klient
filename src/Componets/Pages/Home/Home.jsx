import { useEffect, useState } from 'react'
// icons removed — using plain text buttons for clean layout
import { Link } from 'react-router-dom'
// FishIcon removed
import ChatbotPopup from '../Popup/ChatBotPopup'
import styles from './Home.module.sass'

// Importing local images
import image3 from '../../img/kvas.jpg'
import image2 from '../../img/nor-somon.jpg'
import image1 from '../../img/tr-somon.jpg'

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
			caption: 'Турецкий лосось 1300 лир/кг',
			orderText:
				'Приветствую, я хочу заказать турецкий лосось (форель) малосольный холодного копчения',
		},
		{
			src: image2,
			caption: 'Норвежский лосось 11600 лир/кг',
			orderText:
				'Приветствую, я хочу заказать норвежский лосось холодного копчения',
		},
		{
			src: image3,
			caption: 'Квас медовый 1,5 л 120 лир',
			orderText: 'Приветствую, я хочу заказать квас медовый',
		},
	]

	const handleImageClick = orderText => {
		const whatsappUrl = `https://wa.me/905444558407?text=${encodeURIComponent(
			orderText
		)}`
		window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.homeH1}>Список покупок для магазина</h1>
			<div className={styles.actions}>
				<Link
					to='/create-list'
					role='button'
					className={`${styles.button} ${styles.primary}`}
				>
					Создать список
				</Link>
				<Link
					to='/my-list'
					role='button'
					className={`${styles.button} ${styles.secondary}`}
				>
					Ваши списки
				</Link>
			</div>

			<button
				className={`${styles.button} ${styles.chatButton}`}
				onClick={openChatbot}
			>
				Спросить у ChatGPT
			</button>
			<ChatbotPopup isOpen={isChatbotOpen} onClose={closeChatbot} />
			<a
				href='https://wa.me/905444558407'
				target='_blank'
				rel='noopener noreferrer'
				role='button'
				className={`${styles.button} ${styles.whatsapp}`}
			>
				Копченная рыба и колбаса в Анталии
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
							loading='lazy'
							onClick={() => handleImageClick(image.orderText)}
							style={{ cursor: 'pointer' }}
							onError={e => {
								e.currentTarget.src =
									'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
							}}
						/>
						<p>{image.caption}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Home
