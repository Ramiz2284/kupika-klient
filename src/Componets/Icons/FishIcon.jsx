const FishIcon = ({ width = 20, height = 20, className = '' }) => (
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
		<path d='M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z' fill='#2bb7b9' />
		<circle cx='10.5' cy='10.5' r='1.2' fill='#fff' opacity='0.9' />
		<path
			d='M14 8c1 0 1.5 1 2 1.5'
			stroke='#fff'
			strokeWidth='0.8'
			strokeLinecap='round'
			strokeLinejoin='round'
			opacity='0.6'
		/>
	</svg>
)

export default FishIcon
