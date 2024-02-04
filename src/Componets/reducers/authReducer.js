// authReducer.js
import {
	USER_LOGGED_IN,
	USER_LOGGED_OUT,
	USER_REGISTERED,
} from '../actions/types'
import initialState from './initialState'

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_REGISTERED:
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
			}
		case USER_LOGGED_IN:
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				token: action.payload.token,
			}
		case USER_LOGGED_OUT:
			return {
				...state,
				user: null,
				isAuthenticated: false,
				token: null,
			}
		default:
			return state
	}
}

export default authReducer
