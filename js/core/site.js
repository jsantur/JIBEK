const rnz = {
	swiperInstances: null,
	init: () => {
		rnz.moveEngine();
		rnz.setup();
		rnz.setupTabs();
		rnz.setupAccordion();
		rnz.setupCounters();
		rnz.setupMSwiper();
		rnz.setupSwiper();
	},
	moveEngine: () => {
		const elements = document.querySelectorAll(".canMove");

		function checkVisibility() {
			elements.forEach((el) => {
				const rect = el.getBoundingClientRect();
				const inView = rect.top < window.innerHeight && rect.bottom > 0;
				const fullyOut = rect.bottom <= 0 || rect.top >= window.innerHeight;

				if (inView) {
					el.classList.add("moveIn");
					el.classList.remove("moveOut");
				} else if (!fullyOut) {
					el.classList.add("moveOut");
					el.classList.remove("moveIn");
				} else {
					el.classList.remove("moveIn", "moveOut");
				}
			});
		}

		window.addEventListener('scroll', checkVisibility);
		checkVisibility();
	},
	setup: () => {
		document.addEventListener('click', evt => {
			if(evt.target.matches('.menu-principal a[href="#"]')){
				evt.preventDefault();
			}
			if(evt.target.matches('.rnz-menu-icon') || evt.target.matches('.rnz-menu-icon span')){
				evt.preventDefault();
				document.getElementById('header').classList.toggle('active');
			}

			const scrollToLink = evt.target.closest?.('[data-action="scrollto"], a.scrollto, li.scrollto > a');
			if(scrollToLink){
				evt.preventDefault();
				let href = scrollToLink.getAttribute('href'), target = false;

				if( href.startsWith('#') ){
					target = href=='#' ? null : document.querySelector(href);
				} else if ( href.includes('#') ){
					const url = new URL(href, window.location.href);
					target = url.hash ? (url.hash=='#' ? null : document.querySelector(url.hash)) : null;
				}

				if( false !== target ){
					try {
						rnz.scrollTo(target)
					} catch (error) {}
				}
			}

			const scrollToTabLink = evt.target.closest?.('[data-action="scrolltotab"], a.scrolltotab, li.scrolltotab > a');
			if(scrollToTabLink){
				evt.preventDefault();
				let href = scrollToTabLink.getAttribute('href'), target = false;

				if( href.startsWith('#') ){
					target = href=='#' ? false : href;
				} else if ( href.includes('#') && rnz.sameUrl(href) ){
					const url = new URL(href);
					if(url.hash) target = url.hash;
				}

				if( target ) target = target.slice(1);

				if( document.querySelector('li[data-tab="' + target + '"]') ){
					let li = document.querySelector('li[data-tab="' + target + '"]');
					
					try{
						li.click();
						rnz.scrollTo(li.closest('.section'));
					} catch(error){};
				}

				console.log(target);
			}

			if(evt.target.matches('.footer-block__title')){
				evt.preventDefault();
				evt.target.closest('.footer-block').classList.toggle('active');
			}

			if(evt.target.matches('.menu-principal li.has-children > a')){
				evt.preventDefault();
				evt.target.closest('li.has-children').classList.toggle('active');
			}
		});

		
	},
	setupTabs: () => {
		document.addEventListener('click', evt => {
			if( evt.target.matches('li[data-tab]') ){
				evt.preventDefault();

				let rel = evt.target.closest('ul.rtabs').getAttribute('rel'), li = evt.target;

				document.querySelectorAll('.rtabs[rel="' + rel + '"] > li[data-tab]').forEach(_li => {
					_li.dataset.tab==li.dataset.tab ? _li.classList.add('active') : _li.classList.remove('active')
				})

				document.querySelectorAll('.rtabs-content[rel="' + rel + '"] > [data-tab]').forEach(_div => {
					_div.dataset.tab==li.dataset.tab ? _div.classList.add('active') : _div.classList.remove('active')
				})
			}
		})
	},
	setupAccordion: () => {
		document.addEventListener('click', evt => {
            if( evt.target.matches('.accordion .accordion-item__title') ){
                evt.preventDefault();
                evt.target.closest('.accordion-item').classList.toggle('active');
            }
        })
	},
	setupCounters: () => {
		const counters = document.querySelectorAll(".item-counter .counter");
		let startedCounters = new Set();

		function isElementInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top < window.innerHeight &&
				rect.bottom > 0
			);
		}

		function startCounter(counter) {
			if (startedCounters.has(counter)) return;
			startedCounters.add(counter);
			
			let startTime = null;
			const duration = 2000; // 2 segundos
			const target = parseInt(counter.getAttribute("data-to"), 10);
			
			function updateCounter(timestamp) {
				if (!startTime) startTime = timestamp;
				const progress = Math.min((timestamp - startTime) / duration, 1);
				const value = Math.floor(progress * target);
				counter.textContent = value;
				
				if (progress < 1) {
					requestAnimationFrame(updateCounter);
				} else {
					counter.textContent = target;
				}
			}

			requestAnimationFrame(updateCounter);
		}

		function checkVisibility() {
			counters.forEach(counter => {
				if (isElementInViewport(counter.parentElement)) {
					startCounter(counter);
				}
			});
		}

		window.addEventListener("scroll", checkVisibility);
    	window.addEventListener("resize", checkVisibility);
    	checkVisibility();
	},
	setupMSwiper: () => {
		let swiperInstances = new Map(); // Almacena las instancias de Swiper
	
		const initSwipers = () => {
			document.querySelectorAll('[data-mswiper]').forEach((swiperContainer) => {
				const config = JSON.parse(swiperContainer.getAttribute('data-mswiper')); // Lee configuración JSON
				const id = swiperContainer.dataset.swiperId || swiperContainer.id; // Identificador único
				const wrapper = swiperContainer.querySelector('.mwrapper');
            	const slides = swiperContainer.querySelectorAll('.mslide');
	
				if (window.matchMedia('(max-width: 767px)').matches) {
					swiperContainer.classList.add('swiper');
                	wrapper?.classList.add('swiper-wrapper');
                	slides.forEach(slide => slide.classList.add('swiper-slide'));

					if (!swiperInstances.has(id)) { // Solo inicializa si no existe
						const swiperInstance = new Swiper(swiperContainer, config);
						swiperInstances.set(id, swiperInstance);
					}
				} else {
					swiperContainer.classList.remove('swiper');
                	wrapper?.classList.remove('swiper-wrapper');
                	slides.forEach(slide => slide.classList.remove('swiper-slide'));

					if (swiperInstances.has(id)) { // Si ya existe en resoluciones mayores, destruirlo
						swiperInstances.get(id).destroy(true, true);
						swiperInstances.delete(id);
					}
				}
			});
		};
	
		initSwipers(); // Ejecutar al cargar la página
		window.addEventListener('resize', initSwipers); // Ejecutar en cambios de tamaño
	},
	setupSwiper: () => {
		rnz.swiperInstances = new Map(); // Almacena las instancias de Swiper
	
		const initSwipers = () => {
			document.querySelectorAll('[data-swiper]').forEach((swiperContainer) => {
				const config = JSON.parse(swiperContainer.getAttribute('data-swiper')); // Lee configuración JSON
				const id = swiperContainer.dataset.swiperId || swiperContainer.id; // Identificador único
				const wrapper = swiperContainer.querySelector('.swiper-wrapper');
            	const slides = swiperContainer.querySelectorAll('.swiper-slide');
	
				swiperContainer.classList.add('swiper');
				wrapper?.classList.add('swiper-wrapper');
				slides.forEach(slide => slide.classList.add('swiper-slide'));

				if (!rnz.swiperInstances.has(id)) { // Solo inicializa si no existe
					const swiperInstance = new Swiper(swiperContainer, config);
					rnz.swiperInstances.set(id, swiperInstance);
				}
			});
		};
	
		initSwipers(); // Ejecutar al cargar la página
	},
	scrollTo: (target, duration = 800) => {
		if( target instanceof String ){
			target = document.querySelector(target);
		}

		let start = window.scrollY || document.documentElement.scrollTop;
		let targetPosition = target ? target.offsetTop : 0;
		let distance = targetPosition - start;
		let startTime = null;
	
		function animation(currentTime) {
			if (!startTime) startTime = currentTime;
			let timeElapsed = currentTime - startTime;
			let progress = Math.min(timeElapsed / duration, 1);
			let ease = easeInOutQuad(progress);
	
			window.scrollTo(0, start + distance * ease);
	
			if (timeElapsed < duration) {
				requestAnimationFrame(animation);
			}
		}
	
		function easeInOutQuad(t) {
			return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
		}
	
		requestAnimationFrame(animation);
	},
	sameUrl: url => {
		const urlActual = window.location.origin + window.location.pathname;
		const urlComparar = new URL(url);
		const baseComparar = urlComparar.origin + urlComparar.pathname;
	  
		return urlActual === baseComparar;
	}
}


document.addEventListener('DOMContentLoaded', () => {
	rnz.init();
})