document.addEventListener('DOMContentLoaded', () => {
	let historiaSlider = new Swiper('#historia .swiper', {
		loop: false,
		slidesPerView: 4,
		effect: 'slide',
		direction: 'horizontal',
		autoplay: {
			delay: 5000
		},
        breakpoints: {
			100: {
				slidesPerView: 1
			},
			600: {
				slidesPerView: 2
			},
            1100: {
				slidesPerView: 3
			},
            1400: {
                slidesPerView: 4
            }
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		}
	});
})