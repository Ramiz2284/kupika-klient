import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './MyListsPage.module.sass'

const MyListsPage = () => {
	const fileInputRefs = useRef({})
	const [lists, setLists] = useState([])
	const { user } = useSelector(state => state.auth)
	const userEmail = user?.email
	const [openedListId, setOpenedListId] = useState(null)
	const [selectedItems, setSelectedItems] = useState({})
	// Добавляем состояние для отслеживания редактируемого элемента
	const [isEditing, setIsEditing] = useState(null)
	const [editingItem, setEditingItem] = useState({})

	useEffect(() => {
		const fetchLists = async () => {
			try {
				const response = await fetch(
					`https://marketlistem.site/api/list/${userEmail}`
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
			`https://marketlistem.site/api/list/items?${params}`
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
					`https://marketlistem.site/api/list/${listId}`,
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

	const handleSelectItem = (event, itemId) => {
		setSelectedItems({
			...selectedItems,
			[itemId]: event.target.checked,
		})
	}

	const handleSendToWhatsApp = async listId => {
		// Эта функция отправляет весь список
		const listViewUrl = `https://kupika-klient.vercel.app/list/${listId}`
		const message = `Посмотрите список товаров: ${listViewUrl}`
		const whatsappMessageUrl = `https://wa.me/?text=${encodeURIComponent(
			message
		)}`
		window.open(whatsappMessageUrl, '_blank')
	}

	const handleSendSelectedToWhatsApp = async () => {
		// Эта функция отправляет только выбранные товары
		const selectedIds = Object.keys(selectedItems).filter(
			id => selectedItems[id]
		)
		if (selectedIds.length > 0) {
			const selectedItemsUrl = `https://kupika-klient.vercel.app/selected-items/${selectedIds.join(
				','
			)}`
			const message = `Посмотрите выбранные товары: ${selectedItemsUrl}`
			const whatsappMessageUrl = `https://wa.me/?text=${encodeURIComponent(
				message
			)}`
			window.open(whatsappMessageUrl, '_blank')
		} else {
			console.error('Нет выделенных товаров для отправки')
		}
	}

	// Обновленная функция для сохранения изменений элемента
	const handleSaveChanges = async itemId => {
		// Включите все изменения, включая новую ссылку на фото
		const itemToSave = { ...editingItem, photo: editingItem.photo }

		try {
			const response = await fetch(
				`https://marketlistem.site/api/item/update/${itemId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(itemToSave),
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			// Здесь можно обновить состояние списка элементов
			setLists(prevLists => {
				return prevLists.map(list => {
					if (list._id === openedListId) {
						return {
							...list,
							items: list.items.map(item =>
								item._id === itemId ? { ...item, ...itemToSave } : item
							),
						}
					}
					return list
				})
			})

			setIsEditing(null)
			setEditingItem({})
		} catch (error) {
			console.error('Ошибка при сохранении изменений:', error)
		}
	}

	// Функция для сохранения изменений элемента
	const handleSaveClick = async itemId => {
		await handleSaveChanges(itemId)
		setIsEditing(null) // Закончить редактирование после сохранения
	}
	// Обновленная функция для изменения фото
	const handlePhotoChange = async (event, itemId) => {
		const file = event.target.files[0]
		const formData = new FormData()
		formData.append('photo', file)

		try {
			const response = await fetch(
				`https://marketlistem.site/api/items/upload`,
				{
					method: 'POST',
					body: formData,
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const { photoUrl } = await response.json()

			// Обновляем состояние редактируемого элемента с новой фотографией
			setEditingItem(prev => ({ ...prev, photo: photoUrl }))
		} catch (error) {
			console.error('Ошибка при изменении фотографии:', error)
		}
	}

	const handleInputChange = (e, field) => {
		setEditingItem(prevState => ({
			...prevState,
			[field]: e.target.value,
		}))
	}

	// Функция для начала редактирования элемента
	const handleEditClick = itemId => {
		const itemToEdit = lists
			.find(list => list._id === openedListId)
			.items.find(item => item._id === itemId)
		setIsEditing(itemId)
		setEditingItem(itemToEdit)
	}

	const handleAddItemToList = listId => {
		setLists(
			lists.map(list => {
				if (list._id === listId) {
					return {
						...list,
						items: [
							...list.items,
							{ name: '', quantity: '', price: '', photo: '' }, // Новый пустой товар
						],
					}
				}
				return list
			})
		)
	}

	const handleSaveListChanges = async listId => {
		const listToSave = lists.find(list => list._id === listId)

		// Фильтруем только новые товары, которые еще не были сохранены (не имеют _id)
		const newItems = listToSave.items.filter(item => !item._id)
		console.log(newItems)

		// Если есть новые товары для сохранения
		if (newItems.length > 0) {
			for (let item of newItems) {
				try {
					// Сохраняем каждый новый товар
					const newItemId = await saveItem(userEmail)
					if (newItemId) {
						console.log(newItemId)
						// Если товар успешно сохранен, обновляем его _id в состоянии
						item._id = newItemId
						// Добавляем _id в массив ID товаров списка
						listToSave.itemIds.push(newItemId)
						console.log(listToSave)
					} else {
						// Обработка ошибок, если _id не был получен
						console.error('Ошибка при сохранении нового товара')
					}
				} catch (error) {
					console.error('Ошибка при сохранении товара:', error)
				}
			}
		}

		// Обновляем список с новыми _id товаров
		try {
			const response = await fetch(
				`https://marketlistem.site/api/list/update/${listId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						itemIds: listToSave.itemIds,
					}),
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			// Получаем обновленный список и обновляем состояние
			const updatedList = await response.json()
			setLists(prevLists =>
				prevLists.map(list => (list._id === listId ? updatedList : list))
			)
		} catch (error) {
			console.error('Ошибка при обновлении списка:', error)
		}
	}

	// Эта функция сохраняет один товар, используя данные товара и email пользователя.
	const saveItem = async userEmail => {
		// Проверяем, все ли необходимые данные указаны
		if (
			!userEmail ||
			!editingItem.name ||
			!editingItem.quantity ||
			!editingItem.price ||
			!editingItem.photo
		) {
			console.error(
				'Не все данные товара указаны или пользователь не идентифицирован'
			)
			alert('Не все данные товара указаны или пользователь не идентифицирован')
			return null
		}

		const formData = new FormData()
		formData.append('userEmail', userEmail)
		formData.append('name', editingItem.name)
		formData.append('quantity', editingItem.quantity)
		formData.append('price', editingItem.price)
		formData.append('photo', editingItem.photo)

		try {
			const response = await fetch(
				'https://marketlistem.site/api/item/newitem',
				{
					method: 'POST',
					body: formData,
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			// Теперь возвращаем _id нового товара для использования в дальнейшем

			return result._id
		} catch (error) {
			console.error('Ошибка при сохранении товара:', error)
			return null
		}
	}

	const triggerFileInput = index => {
		// Программно вызываем событие click на соответствующем элементе input
		fileInputRefs.current[index].click()
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
							</div>
							{openedListId === list._id && list.items && (
								<div className={styles.itemsContainer}>
									<button
										className='btn'
										onClick={() => handleSendToWhatsApp(list._id)}
									>
										Отправить весь список в WhatsApp
									</button>
									<button
										className='btn'
										onClick={handleSendSelectedToWhatsApp}
									>
										Отправить выбранные в WhatsApp
									</button>
									{list.items.map((item, itemIndex) => (
										<div key={itemIndex} className={styles.itemEntry}>
											<input
												type='checkbox'
												checked={selectedItems[item._id] || false}
												onChange={e => handleSelectItem(e, item._id)}
											/>

											{isEditing === item._id ? (
												<>
													<div className={styles.createListPagePhotoWrap}>
														<input
															type='file'
															ref={el => (fileInputRefs.current[item._id] = el)} // Ссылка на input для программного вызова
															onChange={e => handlePhotoChange(e, item._id)} // Вызов handlePhotoChange при изменении
															style={{ display: 'none' }} // Скрытие input элемента
														/>
														<div
															onClick={() => triggerFileInput(item._id)} // Вызов triggerFileInput при клике на div
															style={{ cursor: 'pointer' }} // Опционально, чтобы показать что элемент кликабельный
														>
															{editingItem.photo ? (
																<img
																	src={`https://marketlistem.site${editingItem.photo}`}
																	alt='Preview'
																	className={styles.photoPreview}
																/>
															) : (
																<div>
																	<span>Выберите изображение </span>
																	<span>+</span>
																</div>
															)}
														</div>
													</div>
												</>
											) : (
												<div className={styles.createListPagePhotoWrap}>
													<div>
														<img
															src={`https://marketlistem.site${item.photo}`}
															alt='Preview'
															className={styles.photoPreview}
														/>
													</div>
												</div>
											)}
											<div>
												<div className={styles.createListPageInputEditWrap}>
													{isEditing === item._id ? (
														<div className={styles.createListPageInputWrap}>
															<div
																className={styles.createListPageInputSpanWrap}
															>
																<span>Название или описание</span>
																<input
																	type='text'
																	placeholder='Название или описание'
																	value={editingItem.name || ''}
																	onChange={e => handleInputChange(e, 'name')}
																/>
															</div>
															<div
																className={styles.createListPageInputSpanWrap}
															>
																<span>Количество</span>
																<input
																	type='number'
																	placeholder='Количество'
																	value={editingItem.quantity || ''}
																	onChange={e =>
																		handleInputChange(e, 'quantity')
																	}
																/>
															</div>
															<div
																className={styles.createListPageInputSpanWrap}
															>
																<span>Цена</span>
																<input
																	type='number'
																	placeholder='Цена'
																	value={editingItem.price || ''}
																	onChange={e => handleInputChange(e, 'price')}
																/>
															</div>
														</div>
													) : (
														<div className={styles.createListPageInputWrap}>
															<div
																className={styles.createListPageInputSpanWrap}
															>
																<span>Название или описание</span>
																<input
																	type='text'
																	placeholder='Название или описание'
																	value={item.name}
																	readOnly
																/>
															</div>
															<div
																className={styles.createListPageInputSpanWrap}
															>
																<span>Количество</span>
																<input
																	type='number'
																	placeholder='Количество'
																	value={item.quantity}
																	readOnly
																/>
															</div>
															<div
																className={styles.createListPageInputSpanWrap}
															>
																<span>Цена</span>
																<input
																	type='number'
																	placeholder='Цена'
																	value={item.price}
																	readOnly
																/>
															</div>
														</div>
													)}
												</div>

												<div className={styles.editBtnWrap}>
													{isEditing === item._id ? (
														<>
															<button
																className='btn'
																onClick={() => handleSaveClick(item._id)}
															>
																Сохранить
															</button>
															<button
																className='btn'
																onClick={() => setIsEditing(null)}
															>
																Отмена
															</button>
														</>
													) : (
														<button
															className='btn'
															onClick={() => handleEditClick(item._id)}
														>
															Редактировать
														</button>
													)}
												</div>
											</div>
											<button
												className='btn handleAddItemToListBtn'
												onClick={() => handleAddItemToList(list._id)}
											>
												Добавить
											</button>
											<button
												className='btn handleAddItemToListBtnSave'
												onClick={() => handleSaveListChanges(list._id)}
											>
												Сохранить
											</button>
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
