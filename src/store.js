import { createStore } from 'redux'
import rootReducer from './Componets/reducers/rootReducer'

const store = createStore(
	rootReducer,
	// Добавьте поддержку Redux DevTools, если это необходимо
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
