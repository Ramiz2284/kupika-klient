import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './MyListsPage.module.sass'

const MyListsPage = () => {
	const [lists, setLists] = useState([])
	const { user } = useSelector(state => state.auth)
	const userEmail = user?.email
	const [openedListId, setOpenedListId] = useState(null)

	useEffect(() => {
		const fetchLists = async () => {
			try {
				const response = await fetch(
					`process.env.REACT_APP_HEROKU/api/list/${userEmail}`
				)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const data = await response.json()
				setLists(data)
			} catch (error) {
				console.error('Ошибка при загрузке списков:', error)
			}
		}

		if (userEmail) {
			fetchLists()
		}
	}, [userEmail])

	const fetchItems = async itemIds => {
		const params = new URLSearchParams({ ids: itemIds.join(',') })

		const response = await fetch(
			`process.env.REACT_APP_HEROKU/api/list/items?${params}`
		)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return await response.json()
	}

	const handleViewList = async list => {
		try {
			if (openedListId === list._id) {
				// Если нажимаем на уже открытый список, закрываем его
				setOpenedListId(null)
				setLists(
					lists.map(l => (l._id === list._id ? { ...l, items: undefined } : l))
				)
			} else {
				// Если открываем новый список, загружаем его детали
				const itemsDetails = await fetchItems(list.itemIds)
				setOpenedListId(list._id)
				setLists(
					lists.map(l =>
						l._id === list._id ? { ...l, items: itemsDetails } : l
					)
				)
			}
		} catch (error) {
			console.error('Ошибка при загрузке товаров списка:', error)
		}
	}

	const handleDeleteList = async listId => {
		// Запрашиваем подтверждение у пользователя
		const isConfirmed = window.confirm(
			'Вы уверены, что хотите удалить этот список?'
		)

		// Продолжаем только если пользователь подтвердил действие
		if (isConfirmed) {
			try {
				const response = await fetch(
					`process.env.REACT_APP_HEROKU/api/list/${listId}`,
					{
						method: 'DELETE',
					}
				)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				// Обновляем состояние, удаляя список из списка
				setLists(lists.filter(list => list._id !== listId))
			} catch (error) {
				console.error('Ошибка при удалении списка:', error)
			}
		}
	}

	return (
		<div className={styles.myListsPage}>
			<h1 className={styles.myListsTitle}>Мои списки</h1>
			<div className={styles.listsContainer}>
				{lists.length > 0 ? (
					lists.map(list => (
						<div key={list._id} className={styles.listEntry}>
							<div className={styles.listEntryTitleWrap}>
								<button className='btn' onClick={() => handleViewList(list)}>
									{openedListId === list._id ? 'Скрыть' : <h3>{list.name}</h3>}
								</button>
								<button
									className={styles.FontAwesomeIcon}
									onClick={() => handleDeleteList(list._id)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</button>
								{/* Кнопка для редактирования списка */}
								{/* <button onClick={() => navigateToEditPage(list._id)}>
                Редактировать
              </button> */}
							</div>
							{openedListId === list._id && list.items && (
								<div className={styles.itemsContainer}>
									{list.items.map((item, itemIndex) => (
										<div key={itemIndex} className={styles.itemEntry}>
											<div className={styles.createListPagePhotoWrap}>
												<div>
													<img
														src={`process.env.REACT_APP_HEROKU${item.photo}`}
														alt='Preview'
														className={styles.photoPreview}
													/>
												</div>
											</div>

											<div className={styles.createListPageInputWrap}>
												<input
													type='text'
													placeholder='Название или описание'
													value={item.name}
													readOnly
												/>
												<input
													type='number'
													placeholder='Количество'
													value={item.quantity}
													readOnly
												/>
												<input
													type='number'
													placeholder='Цена'
													value={item.price}
													readOnly
												/>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					))
				) : (
					<p>Списков пока нет.</p>
				)}
			</div>
		</div>
	)
}

export default MyListsPage
