import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoginPopup from '../Popup/LoginPopup'
import styles from './RegistrationPage.module.sass'

// Действие для аутентификации пользователя
const loginUserAction = (user, token) => {
	return {
		type: 'USER_LOGGED_IN',
		payload: { user, token },
	}
}
const RegistrationPage = () => {
	const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false)

	// Функция для открытия всплывающего окна входа
	const showLoginPopup = () => {
		setIsLoginPopupVisible(true)
	}

	// Функция для закрытия всплывающего окна входа
	const closeLoginPopup = () => {
		setIsLoginPopupVisible(false)
	}

	const dispatch = useDispatch()
	const [user, setUser] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	const navigate = useNavigate()

	// Обновляем состояние при изменении полей ввода
	const handleChange = e => {
		const { name, value } = e.target
		setUser({ ...user, [name]: value })
	}

	// Обрабатываем отправку формы
	const handleSubmit = async e => {
		e.preventDefault()
		if (user.password !== user.confirmPassword) {
			alert("Passwords don't match!")
			return
		}
		const registerUrl = 'process.env.REACT_APP_HEROKU/api/users/register'

		// Формируем объект данных для отправки на сервер
		const userData = {
			username: user.username,
			email: user.email,
			password: user.password,
		}

		// Отправляем данные на сервер
		try {
			const registerResponse = await fetch(registerUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			})

			const registerData = await registerResponse.json()

			// Проверяем ответ сервера
			if (registerResponse.ok) {
				// Отправляем данные на сервер для входа
				const loginResponse = await fetch(
					'process.env.REACT_APP_HEROKU/api/users/login',
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
				console.log(loginData)
				if (loginResponse.ok) {
					// Сохранить токен в localStorage
					localStorage.setItem('token', loginData.token)
					localStorage.setItem('user', JSON.stringify(loginData.user))

					// Диспатчим действие входа в Redux
					dispatch(loginUserAction(loginData.user, loginData.token))

					// Перенаправляем пользователя
					navigate('/')
				} else {
					throw new Error(loginData.message || 'Login failed')
				}
			} else {
				throw new Error(registerData.message || 'Registration failed')
			}
		} catch (error) {
			console.error('Registration or Login failed:', error)
		}
	}

	return (
		<div className={styles.registrationContainer}>
			<form className={styles.registrationForm} onSubmit={handleSubmit}>
				<h2>Регистрация</h2>
				<input
					type='text'
					name='username'
					placeholder='Имя пользователя'
					value={user.username}
					onChange={handleChange}
					required
				/>
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
				<input
					type='password'
					name='confirmPassword'
					placeholder='Подтвердите пароль'
					value={user.confirmPassword}
					onChange={handleChange}
					required
				/>
				<button type='submit'>Зарегистрироваться</button>
				<div className={styles.loginLink}>
					Уже зарегистрированы?{' '}
					<button
						onClick={showLoginPopup}
						style={{
							cursor: 'pointer',
							color: 'blue',
							textDecoration: 'underline',
						}}
					>
						Войти
					</button>
				</div>
			</form>
			{/* Если isLoginPopupVisible равно true, показываем LoginPopup */}
			{isLoginPopupVisible && <LoginPopup onClose={closeLoginPopup} />}
		</div>
	)
}

export default RegistrationPage
