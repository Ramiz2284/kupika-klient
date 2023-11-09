http://localhost:5000/
https://kupika-server-d3637da1ab88.herokuapp.com
https://kupika-klient-g8ga0xv19-ramiz2284.vercel.app

const handleSendToWhatsApp = async listId => {
if (listId) {
const listViewUrl = `https://kupika-klient.vercel.app/list/${listId}`
const message = `Посмотрите список товаров: ${listViewUrl}`
const whatsappMessageUrl = `https://wa.me/?text=${encodeURIComponent(
				message
			)}`
window.open(whatsappMessageUrl, '\_blank')
} else {
console.error('Ошибка при сохранении списка')
}
}

const handleSendToWhatsApp = () => {
const selectedIds = Object.entries(selectedItems)
.filter(([_, isSelected]) => isSelected)
.map(([id]) => id)

    	if (selectedIds.length > 0) {
    		const listViewUrl = `https://kupika-klient.vercel.app/selected/${selectedIds.join(
    			','
    		)}`
    		const message = `Посмотрите мои выделенные товары: ${listViewUrl}`
    		const whatsappMessageUrl = `https://wa.me/?text=${encodeURIComponent(
    			message
    		)}`
    		window.open(whatsappMessageUrl, '_blank')
    	} else {
    		console.error('Ошибка: нет выделенных товаров для отправки')
    	}
    }
