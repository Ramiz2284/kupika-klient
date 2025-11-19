const ChatIcon = ({ width = 18, height = 18, className = '' }) => (
	<svg
		className={className}
		width={width}
		height={height}
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		aria-hidden='true'
		focusable='false'
	>
		<path
			d='M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z'
			fill='#178fa6'
			opacity='0.95'
		/>
		<circle cx='9' cy='10' r='1' fill='#fff' />
		<circle cx='13' cy='10' r='1' fill='#fff' />
		<circle cx='17' cy='10' r='1' fill='#fff' />
	</svg>
)

export default ChatIcon
