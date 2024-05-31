import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import HeaderLogo from '../../img/HeaderLogo.png'
import LoginPopup from '../Popup/LoginPopup'
import styles from './Header.module.sass'

const Header = () => {
	// Действие для восстановления сессии пользователя
	const restoreUserSession = (user, token) => {
		return {
			type: 'USER_LOGGED_IN',
			payload: { user, token },
		}
	}

	// В вашем корневом компоненте или компоненте, где вы используете Redux
	const dispatch = useDispatch()
	useEffect(() => {
		const savedToken = localStorage.getItem('token')
		const savedUser = localStorage.getItem('user')

		if (savedToken && savedUser) {
			const user = JSON.parse(savedUser)
			dispatch(restoreUserSession(user, savedToken))
		}
	}, [dispatch])

	const { user } = useSelector(state => state.auth)
	const userEmail = user?.email // Используем optional chaining для безопасного доступа к email

	const [isNavVisible, setIsNavVisible] = useState(false)
	const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false)

	const toggleNav = () => {
		setIsNavVisible(!isNavVisible)
	}
	const handleLogoutClick = () => {
		// Проверяем, залогинен ли пользователь
		if (user) {
			// Запрашиваем подтверждение на выход
			if (window.confirm('Вы хотите выйти?')) {
				// Здесь должна быть ваша логика выхода из системы
				// Например, удаление токена из localStorage и очистка состояния пользователя
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				dispatch({ type: 'USER_LOGGED_OUT' }) // Ваше действие для выхода из системы
			}
		} else {
			// Если пользователь не залогинен, показываем попап входа
			setIsLoginPopupVisible(true)
		}
	}

	const popupCloseRegister = () => {
		setIsLoginPopupVisible(false)
	}

	return (
		<>
			<header className={styles.header}>
				<div className={styles.logo}>
					<Link to='/'>
						<img src={HeaderLogo} alt='Logo' />
					</Link>
				</div>
				<button
					onClick={toggleNav}
					className={`${styles.menuButton} ${
						isNavVisible ? styles.menuButtonActive : ''
					}`}
				>
					<span className={styles.menuIcon}></span>
				</button>
				<nav
					className={`${styles.navigation} ${
						isNavVisible ? styles.navVisible : ''
					}`}
				>
					<ul className={styles.navList}>
						<Link to='/'>
							<li className={styles.navItem}>Главная</li>
						</Link>
						<Link to='/aboutus'>
							<li className={styles.navItem}>О нас</li>
						</Link>
						<Link to='/contacts'>
							<li className={styles.navItem}>Контакты</li>
						</Link>
					</ul>
				</nav>
				<button className={styles.profileButton} onClick={handleLogoutClick}>
					{userEmail || 'Личный кабинет'}
				</button>
			</header>
			{isLoginPopupVisible && <LoginPopup onClose={popupCloseRegister} />}
		</>
	)
}

export default Header
