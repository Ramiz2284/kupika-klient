import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './Componets/distr/bootstrap.min.css'

import Contacts from './Componets/Pages/Contacts/Contacts'
import Header from './Componets/Pages/Header/Header'
import Home from './Componets/Pages/Home/Home'
import ListpageLink from './Componets/Pages/ListpageLink/ListpageLink'
import MyListsPage from './Componets/Pages/MyListsPage/MyListsPage'
import RegistrationPage from './Componets/Pages/Registration/RegistrationPage'
import SelectedItemsPage from './Componets/Pages/SelectedItemsPage/SelectedItemsPage'
import AboutUs from './Componets/Pages/aboutUs/aboutUs'
import CreateListPage from './Componets/Pages/СreateList/CreateList'
import './Styles/main.sass'

function App() {
	return (
		<Router>
			<div className='app-container'>
				<div className='app'>
					<Header />
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/create-list' element={<CreateListPage />} />
						<Route path='/register' element={<RegistrationPage />} />
						<Route path='/my-list' element={<MyListsPage />} />
						<Route path='/list/:listId' element={<ListpageLink />} />
						<Route
							path='/selected-items/:itemIds'
							element={<SelectedItemsPage />}
						/>
						<Route path='/aboutus' element={<AboutUs />} />
						<Route path='/contacts' element={<Contacts />} />
					</Routes>
				</div>
			</div>
		</Router>
	)
}

export default App
