import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import aboutImg from '../../img/_c9874879-e673-48db-a791-432048928984.jpeg'
import './aboutUs.sass' // Импорт файла стилей

const AboutUs = () => {
	return (
		<Container className='about-us mt-5'>
			<Row className='justify-content-center'>
				<Col lg={10}>
					<h1 className='about-us-title'>О нас</h1>
					<p className='about-us-text'>
						Наш сайт создан для того, чтобы упростить процесс создания списка
						продуктов. Мы предлагаем удобный инструмент, который позволяет вам
						легко составлять, редактировать и дополнять списки покупок, а также
						прикреплять фотографии товаров.
					</p>
					<p className='about-us-text'>
						Вы можете отправить готовый список продуктов на WhatsApp своему
						супругу или друзьям, чтобы они знали, что нужно купить. Кроме того,
						у нас есть помощник ИИ, который расскажет вам всё о здоровом питании
						или о выбранном вами продукте.
					</p>
					<p className='about-us-text'>
						На нашем сайте вы также найдете наш маркет, где мы продаем копченую
						рыбу, колбасу и рулеты высокого качества.
					</p>
					<p className='about-us-text'>
						Мы стремимся сделать ваши покупки проще и удобнее!
					</p>
				</Col>
			</Row>
			<Row className='justify-content-center mt-4'>
				<Col md={6}>
					<Image src={aboutImg} rounded fluid className='about-us-image' />
				</Col>
			</Row>
		</Container>
	)
}

export default AboutUs
