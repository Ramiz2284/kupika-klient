import React, { useState } from 'react'
import styles from './ChatBotPopup.module.sass' // Импорт стилей

const ChatbotPopup = ({ isOpen, onClose }) => {
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')

	const handleNewMessageChange = event => {
		setNewMessage(event.target.value)
	}

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return

		// Добавляем сообщение пользователя в список сообщений
		setMessages([...messages, { sender: 'user', text: newMessage }])

		try {
			const response = await fetch(
				'https://marketlistem.site/api/chatbot/question',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ message: newMessage }),
				}
			)

			if (!response.ok) {
				throw new Error('Error communicating with the server')
			}

			const { replies } = await response.json()
			setMessages(messages => [...messages, { sender: 'bot', text: replies }])
		} catch (error) {
			console.error('Error:', error)
		}

		setNewMessage('') // Очищаем поле ввода после отправки
	}

	if (!isOpen) return null

	return (
		<div className={styles.popupContainer}>
			<div className={styles.popupContent}>
				<button onClick={onClose} className={styles.closeButton}>
					X
				</button>
				<div className={styles.chatArea}>
					{messages.map((message, index) => (
						<div
							key={index}
							className={`${styles.message} ${
								message.sender === 'user'
									? styles.userMessage
									: styles.botMessage
							}`}
						>
							{message.text}
						</div>
					))}
				</div>
				<div className={styles.messageInputContainer}>
					<input
						type='text'
						className={styles.messageInput}
						value={newMessage}
						onChange={handleNewMessageChange}
						placeholder='Введите ваше сообщение...'
					/>
					<button
						onClick={handleSendMessage}
						className='btn messageInputContainerBtn'
					>
						Отправить
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatbotPopup
