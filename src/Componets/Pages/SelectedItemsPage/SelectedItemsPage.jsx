import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './MyListsPage.module.sass'

const SelectedItemsPage = () => {
	const [items, setItems] = useState([])
	const { itemIds } = useParams() // Extract itemIds from URL params

	useEffect(() => {
		const fetchItems = async ids => {
			const params = new URLSearchParams({ ids: ids.join(',') })
			const response = await fetch(
				`https://kupika-server-d3637da1ab88.herokuapp.com/api/list/items?${params}`
			)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			return await response.json()
		}

		// Split the itemIds from URL and convert to array
		const idsArray = itemIds.split(',')

		if (idsArray.length > 0) {
			fetchItems(idsArray).then(setItems).catch(console.error)
		}
	}, [itemIds])

	return (
		<div className={styles.myListsPage}>
			<h1 className={styles.myListsTitle}>Выбранные товары</h1>
			<div className={styles.listsContainer}>
				{items.length > 0 ? (
					items.map((item, index) => (
						<div key={index} className={styles.itemEntry}>
							<div className={styles.createListPagePhotoWrap}>
								<img
									src={`https://kupika-server-d3637da1ab88.herokuapp.com${item.photo}`}
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
					<p>Выделенные товары отсутствуют.</p>
				)}
			</div>
		</div>
	)
}

export default SelectedItemsPage
