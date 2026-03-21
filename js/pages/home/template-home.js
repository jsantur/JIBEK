document.addEventListener('DOMContentLoaded', () => {
	let heroSlider = new Swiper('#hero-slider .swiper', {
		loop: true,
		slidesPerView: 1,
		spaceBetween:0,
		effect: 'slide',
		direction: 'horizontal',
		autoplay: {
			delay: 5000
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		}
	});
})