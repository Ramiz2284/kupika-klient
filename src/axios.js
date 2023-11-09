import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://kupika-server-d3637da1ab88.herokuapp.com/',
})

instance.interceptors.request.use(config => {
	config.headers.Authorization = window.localStorage.getItem('token')
	return config
})

export default instance
