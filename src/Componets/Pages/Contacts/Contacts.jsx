import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Contacts.sass'

const Contacts = () => {
	return (
		<Container className='contacts mt-5'>
			<Row className='justify-content-center'>
				<Col lg={11}>
					<h1 className='contacts-title'>Контакты</h1>
					<p className='contacts-text'>
						Телефон: <a href='tel:+905444558407'>+90 544 455 84 07</a>
					</p>
					<p className='contacts-text'>
						WhatsApp: <a href='https://wa.me/905444558407'>+90 544 455 84 07</a>
					</p>
				</Col>
			</Row>
			<Row className='justify-content-center mt-4'>
				<Col lg={10}>
					<iframe
						title='myFrame'
						src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12767.816679392743!2d30.75534391131737!3d36.86751580564457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39b7d637dbfc5%3A0xe8c93904039d32cb!2zU21va2VkIEZpc2ggQW50YWx5YSDQmtC-0L_Rh9C10L3QsNGPINGA0YvQsdCwINCyINCQ0L3RgtCw0LvQuNC4!5e0!3m2!1sru!2str!4v1717164723681!5m2!1sru!2str" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
						width='100%'
						height='450'
						frameborder='0'
						style={{ border: 0 }}
						allowfullscreen=''
						aria-hidden='false'
						tabindex='0'
						className='contacts-map'
					></iframe>
				</Col>
			</Row>
		</Container>
	)
}

export default Contacts
