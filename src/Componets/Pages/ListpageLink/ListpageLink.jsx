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
					`https://f14e-157-230-27-197.ngrok-free.app:5000/api/list/id/${listId}`
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
									src={`https://f14e-157-230-27-197.ngrok-free.app:5000/${item.photo}`}
									alt='Preview'
									className={styles.photoPreview}
								/>
							</div>
							<div className={styles.createListPageInputWrap}>
								<div className={styles.createListPageInputSpanWrap}>
									<span>Название или описание</span>
									<input
										type='text'
										placeholder='Название или описание'
										value={item.name}
										readOnly
									/>
								</div>
								<div className={styles.createListPageInputSpanWrap}>
									<span>Количество</span>
									<input
										type='number'
										placeholder='Количество'
										value={item.quantity}
										readOnly
									/>
								</div>
								<div className={styles.createListPageInputSpanWrap}>
									<span>Цена</span>
									<input
										type='number'
										placeholder='Цена'
										value={item.price}
										readOnly
									/>
								</div>
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
