// authActions.js
import { USER_LOGGED_IN, USER_LOGGED_OUT, USER_REGISTERED } from './types'

// Действие для регистрации пользователя
export const registerUser = userData => {
	return {
		type: USER_REGISTERED,
		payload: userData,
	}
}

// Действие для входа пользователя
export const loginUser = userData => {
	return {
		type: USER_LOGGED_IN,
		payload: userData,
	}
}

// Действие для выхода пользователя
export const logoutUser = () => {
	return {
		type: USER_LOGGED_OUT,
	}
}
