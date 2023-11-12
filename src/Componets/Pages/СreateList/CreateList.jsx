import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './CreateList.module.sass'

const CreateListPage = () => {
	const fileInputRefs = useRef({})
	const [items, setItems] = useState([
		{ photo: '', name: '', quantity: '', price: '', photoPreview: '' },
	])
	const [total, setTotal] = useState(0)
	const [listName, setListName] = useState('')
	const { user } = useSelector(state => state.auth)
	const endOfListRef = useRef(null)
	const userEmail = user?.email
	const [createListOk, setCreateListOk] = useState(false)

	useEffect(() => {
		const totalSum = items.reduce(
			(sum, item) => sum + (item.price * item.quantity || 0),
			0
		)
		setTotal(totalSum)
	}, [items])

	const handleItemChange = (index, field, value) => {
		const newItems = [...items]
		if (field === 'photo') {
			const reader = new FileReader()
			reader.onloadend = () => {
				newItems[index]['photoPreview'] = reader.result
				newItems[index]['photoFile'] = value
				setItems(newItems)
			}
			reader.readAsDataURL(value)
		} else {
			newItems[index][field] = value
			setItems(newItems)
		}
	}

	const addItem = () => {
		setItems([
			...items,
			{ photo: '', name: '', quantity: '', price: '', photoPreview: '' },
		])
		endOfListRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	const uploadPhoto = async file => {
		const formData = new FormData()
		formData.append('photo', file)

		try {
			const response = await fetch(
				'http://157.230.27.197:5000/api/items/upload',
				{
					method: 'POST',
					body: formData,
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			return result.photoUrl
		} catch (error) {
			console.error('Ошибка при загрузке фото:', error)
		}
	}

	const saveItem = async index => {
		const itemData = items[index]
		if (!userEmail || !itemData.name || !itemData.quantity || !itemData.price) {
			console.error(
				'Не все данные товара указаны или пользователь не идентифицирован'
			)
			window.confirm(
				'Не все данные товара указаны или пользователь не идентифицирован'
			)
			return null
		}

		let photoUrl = ''
		if (itemData.photoFile) {
			photoUrl = await uploadPhoto(itemData.photoFile)
		}
		if (!photoUrl) {
			console.error('Не удалось загрузить фото')
			window.confirm('Не удалось загрузить фото')
			return null
		}

		const formData = new FormData()
		formData.append('userEmail', userEmail)
		formData.append('name', itemData.name)
		formData.append('quantity', itemData.quantity)
		formData.append('price', itemData.price)
		formData.append('photo', photoUrl)

		try {
			const response = await fetch(
				'http://157.230.27.197:5000/api/item/newitem',
				{
					method: 'POST',
					body: formData,
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			const newItems = [...items]
			newItems[index].saved = true
			newItems[index].id = result._id
			setItems(newItems)
			return result._id
		} catch (error) {
			console.error('Ошибка при сохранении товара:', error)
			return null
		}
	}

	const handleCreateList = async () => {
		if (!listName.trim()) {
			alert('Пожалуйста, введите название списка.')
			return
		}
		const itemIds = await Promise.all(
			items.map((item, index) => {
				if (!item.saved) {
					return saveItem(index)
				}
				return Promise.resolve(item.id)
			})
		)

		if (itemIds.some(id => id === null)) {
			console.error('Не все товары были сохранены')
			return
		}

		const listId = await createList(listName, itemIds)
		if (!listId) {
			console.error('Не удалось создать список')
			window.confirm(
				'Не удалось создать список. Проверьте все ли поля заполнены!'
			)
			return null // Возвращаем null, если список не был создан
		}
		return listId // Возвращаем listId для последующего использования
	}

	const createList = async (name, itemIds) => {
		const listData = {
			userEmail: user?.email,
			name,
			itemIds,
		}

		try {
			const response = await fetch(
				'http://157.230.27.197:5000/api/list/listsave',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(listData),
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			console.log('Список создан:', result._id)
			setCreateListOk(true)
			return result._id
		} catch (error) {
			console.error('Ошибка при создании списка:', error)
			return null
		}
	}

	const handleSendToWhatsApp = async () => {
		const listId = await handleCreateList() // Получаем listId прямо здесь
		if (listId) {
			const listViewUrl = `https://kupika-klient.vercel.app/list/${listId}`
			const message = `Посмотрите список товаров: ${listViewUrl}`
			const whatsappMessageUrl = `https://wa.me/?text=${encodeURIComponent(
				message
			)}`
			window.open(whatsappMessageUrl, '_blank')
		} else {
			console.error('Ошибка при сохранении списка')
		}
	}
	const triggerFileInput = index => {
		// Программно вызываем событие click на соответствующем элементе input
		fileInputRefs.current[index].click()
	}

	const removeItem = async index => {
		const item = items[index]
		if (item.saved && item.id) {
			await deleteItemFromServer(item.id)
		}
		setItems(items.filter((_, i) => i !== index))
	}
	const deleteItemFromServer = async itemId => {
		try {
			const response = await fetch(
				`http://157.230.27.197:5000/api/item/${itemId}`,
				{
					method: 'DELETE', // Используйте метод DELETE для удаления
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			console.log('Товар удален:', itemId)
		} catch (error) {
			console.error('Ошибка при удалении товара:', error)
		}
	}

	return (
		<div className={styles.createListPage}>
			<h1 className={styles.createListTitle}>Создать список продуктов</h1>
			<input
				type='text'
				placeholder='Название списка'
				value={listName}
				onChange={e => setListName(e.target.value)}
				required
			/>

			<div className={styles.itemsContainer}>
				{items.map((item, index) => (
					<div key={index} className={styles.itemEntry}>
						<div className={styles.createListPagePhotoWrap}>
							<input
								type='file'
								ref={el => (fileInputRefs.current[index] = el)} // Сохраняем ссылку на элемент ввода файла
								className={styles.fileInput}
								onChange={e =>
									handleItemChange(index, 'photo', e.target.files[0])
								}
							/>
							<div
								className={styles.createListPagePhotoWrap}
								onClick={() => triggerFileInput(index)} // При клике на photoPreview вызываем выбор файла
							>
								{item.photoPreview ? (
									<img
										src={item.photoPreview}
										alt='Preview'
										className={styles.photoPreview}
									/>
								) : (
									<div>
										<span>Выберите изображение </span>
										<span>+</span>
									</div>
									// Вставьте текст или иконку для стандартного состояния
								)}
							</div>
						</div>

						<div className={styles.createListPageInputWrap}>
							<input
								type='text'
								placeholder='Название или описание'
								value={item.name}
								onChange={e => handleItemChange(index, 'name', e.target.value)}
							/>
							<input
								type='number'
								placeholder='Количество'
								value={item.quantity}
								onChange={e =>
									handleItemChange(index, 'quantity', e.target.value)
								}
							/>
							<input
								type='number'
								placeholder='Цена'
								value={item.price}
								onChange={e => handleItemChange(index, 'price', e.target.value)}
							/>
							<button
								className={styles.FontAwesomeIcon}
								onClick={() => removeItem(index)}
							>
								<FontAwesomeIcon icon={faTrash} />
							</button>
							<button
								className={
									item.saved
										? 'createListPageInputSaveGreen'
										: 'createListPageInputSave'
								}
								onClick={() => saveItem(index)}
							>
								{item.saved ? 'Готово' : 'Сохранить'}
							</button>
							<div ref={endOfListRef} />
						</div>
					</div>
				))}
			</div>
			<div className={styles.total}>Общая сумма: {total}</div>
			<div className={styles.addButtonWrap}>
				<button className='addButton' onClick={addItem}>
					Добавить новый товар
				</button>

				<button
					className={createListOk ? 'addButtonGreen' : 'addButton'}
					onClick={handleCreateList}
				>
					{createListOk ? 'Список сохранен' : 'Сохранить список'}
				</button>
			</div>
			<button className='addButton' onClick={handleSendToWhatsApp}>
				Отправить в WhatsApp
			</button>
		</div>
	)
}

export default CreateListPage
