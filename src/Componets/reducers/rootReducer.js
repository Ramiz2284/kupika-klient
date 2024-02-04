// rootReducer.js
import { combineReducers } from 'redux'
import authReducer from './authReducer'

const rootReducer = combineReducers({
	auth: authReducer,
	// Здесь могут быть и другие редьюсеры
})

export default rootReducer
