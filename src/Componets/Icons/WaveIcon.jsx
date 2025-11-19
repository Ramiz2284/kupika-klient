const WaveIcon = ({ width = '100%', height = 24, className = '' }) => (
	<svg
		className={className}
		width={width}
		height={height}
		viewBox='0 0 1440 320'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		aria-hidden='true'
		focusable='false'
	>
		<path
			d='M0 128C80 96 160 64 240 74.7C320 85 400 139 480 165.3C560 192 640 192 720 170.7C800 149 880 107 960 106.7C1040 107 1120 149 1200 165.3C1280 181 1360 171 1440 160V320H0V128Z'
			fill='#e8fbfb'
			opacity='0.9'
		/>
	</svg>
)

export default WaveIcon
