document.addEventListener('DOMContentLoaded', () => {
	let historiaSlider = new Swiper('#historia .swiper', {
		loop: false,
		slidesPerView: 'auto',
		effect: 'slide',
		direction: 'horizontal',
		spaceBetween: 0,
		autoplay: {
			delay: 8000
		},
        breakpoints: {
			100: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			600: {
				slidesPerView: 2,
				spaceBetween: 0
			},
			900: {
				slidesPerView: 3,
				spaceBetween: 0
			},
            1200: {
				slidesPerView: 4,
				spaceBetween: 0
			},
            1400: {
                slidesPerView: 4,
                spaceBetween: 0
            }
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		}
	});
})