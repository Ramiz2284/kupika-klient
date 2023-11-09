import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './MyListsPage.module.sass'

const ListpageLink = () => {
	const [list, setList] = useState(null)
	const { listId } = useParams() // Получаем listId из URL

	useEffect(() => {
		const fetchList = async () => {
			try {
				// Загружаем список по ID
				const response = await fetch(
					`http://localhost:5000/api/list/id/${listId}`
				)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const listData = await response.json()
				setList(listData.itemIds)
			} catch (error) {
				console.error('Ошибка при загрузке списка:', error)
			}
		}

		fetchList()
	}, [listId])

	return (
		<div className={styles.myListsPage}>
			<h1 className={styles.myListsTitle}>Просмотр списка</h1>
			<div className={styles.listsContainer}>
				{list ? (
					list.map((item, index) => (
						<div key={index} className={styles.itemEntry}>
							{/* Отображение информации о товаре */}
							<div className={styles.createListPagePhotoWrap}>
								<img
									src={`http://localhost:5000${item.photo}`}
									alt='Preview'
									className={styles.photoPreview}
								/>
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
					))
				) : (
					<p>Список товаров пуст или список не найден.</p>
				)}
			</div>
		</div>
	)
}

export default ListpageLink
