import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LoginPopup.module.sass'

// Действие для аутентификации пользователя
const loginUserAction = (user, token) => {
	return {
		type: 'USER_LOGGED_IN',
		payload: { user, token },
	}
}

const LoginPopup = ({ onClose }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleRegisterLink = () => {
		onClose() // Закрываем попап
		navigate('/register') // Перенаправляем пользователя на страницу регистрации
	}

	const [user, setUser] = useState({
		email: '',
		password: '',
	})

	const handleChange = e => {
		const { name, value } = e.target
		setUser({ ...user, [name]: value })
	}

	// Обрабатываем отправку формы

	const handleSubmit = async e => {
		e.preventDefault()

		try {
			// Отправляем данные на сервер для входа
			const loginResponse = await fetch(
				'https://f14e-157-230-27-197.ngrok-free.app:5000/api/users/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: user.email,
						password: user.password,
					}),
				}
			)

			const loginData = await loginResponse.json()

			if (loginResponse.ok) {
				// Сохранить токен в localStorage
				localStorage.setItem('token', loginData.token)
				localStorage.setItem('user', JSON.stringify(loginData.user))

				// Диспатчим действие входа в Redux
				dispatch(loginUserAction(loginData.user, loginData.token))

				// Перенаправляем пользователя
				onClose()
			} else {
				window.confirm('Ошибка ЛОГИН или ПАРОЛЯ')
			}
		} catch (error) {
			console.error('Registration or Login failed:', error)
		}
	}

	return (
		<div className={styles.popupOverlay}>
			<div className={styles.popup}>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>
				<form className={styles.loginForm} onSubmit={handleSubmit}>
					<input
						type='email'
						name='email'
						placeholder='Электронная почта'
						value={user.email}
						onChange={handleChange}
						required
					/>
					<input
						type='password'
						name='password'
						placeholder='Пароль'
						value={user.password}
						onChange={handleChange}
						required
					/>
					<button type='submit'>Войти</button>
				</form>
				<div className={styles.registerLink}>
					Не зарегистрированы?{' '}
					<Link onClick={handleRegisterLink} to='/register'>
						Создать аккаунт
					</Link>
				</div>
			</div>
		</div>
	)
}

export default LoginPopup
