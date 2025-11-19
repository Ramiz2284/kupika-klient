const BasketIcon = ({ width = 18, height = 18, className = '' }) => (
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
		<path d='M3 6h18v2H3V6z' fill='#0f738f' opacity='0.9' />
		<path
			d='M7 8l1.5 9h7L17 8'
			stroke='#0f738f'
			strokeWidth='1.2'
			strokeLinecap='round'
			strokeLinejoin='round'
			fill='none'
		/>
		<path
			d='M10 4c0 1-1 2-2 2s-2-1-2-2'
			stroke='#0f738f'
			strokeWidth='1.2'
			strokeLinecap='round'
			strokeLinejoin='round'
			fill='none'
			opacity='0.9'
		/>
	</svg>
)

export default BasketIcon
