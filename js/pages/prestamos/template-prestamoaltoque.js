const patForm = {
    init: () => {
        document.querySelector('#monto').addEventListener('input', evt => {
            document.querySelector('.ranges-labels span').innerHTML = 'S/' + evt.target.value;
            patForm.refreshTipo(evt.target.value);
            document.querySelector('#tipo-cuota').dispatchEvent(new Event('change'));
            patForm.refreshResultado();
        })

        document.querySelector('#tipo-cuota').addEventListener('change', evt => {
            patForm.refreshCuotas(document.querySelector('#monto').value, evt.target.value);
            patForm.refreshResultado();
            patForm.updateFechaPago();

            // También disparar actualización cuando cambia el monto
            document.querySelector('#monto').addEventListener('input', () => {
                patForm.updateFechaPago();
            });
        })
    },
    setBase: (monto, tipo) => {
        document.querySelector('#monto').value = monto;
        document.querySelector('#monto').dispatchEvent(new Event('input'));

        document.querySelector('#tipo-cuota').value = tipo;
        document.querySelector('#tipo-cuota').dispatchEvent(new Event('change'));
    },
    refreshTipo: (monto) => {
        if(!patdata[monto]) return;

        // Only show Mensual payment option
        let tipos = ['Mensual'], select = document.querySelector('#tipo-cuota');
        document.querySelectorAll('#tipo-cuota option:not(:first-child)').forEach(option => option.remove());

        tipos.forEach(op => {
            let option = document.createElement('option');
            option.value = op;
            option.text = 'Pago ' + op;

            select.appendChild(option);
        })
    },
    refreshCuotas: (monto, tipo) => {
        if( !patdata[monto] || !patdata[monto][tipo] ) return;

        let tipos = Object.keys(patdata[monto][tipo]), select = document.querySelector('#numero-cuota');
        document.querySelectorAll('#numero-cuota option:not(:first-child)').forEach(option => option.remove());

        tipos.forEach(op => {
            let option = document.createElement('option');
            option.value = op;
            option.text = op + (parseInt(op, 10)==1 ? ' cuota' : ' cuotas');

            select.appendChild(option);
        })
    },
    refreshResultado: () => {
        const monto = parseFloat(document.querySelector('#monto').value),
            tipo = document.querySelector('#tipo-cuota').value;

        // Use fixed 2 installments since dropdown was removed
        const numero = 2;

        if (!monto || !tipo) {
            document.querySelector('.results b').textContent = '-';
            return;
        }

        // Calculate using 7.9% interest rate
        const tasaInteres = 0.079; // 7.9%
        const montoConInteres = monto * (1 + tasaInteres);
        const cuotaMensual = montoConInteres / numero;

        document.querySelector('.results b').textContent = 'S/ ' + cuotaMensual.toFixed(2);
    },

    updateFechaPago: () => {
        const fechaPagoSpan = document.getElementById('fecha-pago');
        const tipoCuota = document.querySelector('#tipo-cuota').value;

        if (!fechaPagoSpan) return;

        const fecha = new Date();
        
        // Siempre mostrar fecha para pago mensual (que es lo único que permitimos)
        if (tipoCuota === "Mensual") {
            fecha.setMonth(fecha.getMonth() + 1); // Sumar 1 mes
            
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            
            fechaPagoSpan.textContent = `${dia}/${mes}/${anio}`;
            console.log(`📅 Fecha de pago actualizada: ${dia}/${mes}/${anio}`);
        } else {
            // Si no hay tipo de cuota seleccionado, mostrar fecha de todos modos
            fecha.setMonth(fecha.getMonth() + 1);
            
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            
            fechaPagoSpan.textContent = `${dia}/${mes}/${anio}`;
            console.log(`📅 Fecha de pago por defecto: ${dia}/${mes}/${anio}`);
        }
    }
}

window.addEventListener("message", function (event) {
    console.log(event);
    if (event.data.redirigir && event.data.url) {
      window.location.href = event.data.url;
    }
})

document.addEventListener('DOMContentLoaded', () => {
    patForm.init();
    patForm.setBase(200, 'Mensual');
    patForm.updateFechaPago(); // Calcular fecha inicial

    const scrollToIdWithOffset = (id) => {
        const target = document.getElementById(id);
        if (!target) return;

        const header = document.getElementById('header');
        const headerOffset = header ? header.getBoundingClientRect().height : 0;
        const y = window.scrollY + target.getBoundingClientRect().top - headerOffset - 12;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    };

    const activateDetailsTab = (tabName) => {
        if (!tabName) return;
        const tab = document.querySelector(`.rtabs[rel="details"] li[data-tab="${tabName}"]`);
        if (tab) tab.click();
    };

    document.addEventListener('click', evt => {
        if( evt.target.matches('.form-submit') ){
            evt.preventDefault();

            /*document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            document.querySelector('#hero').style.zIndex = 10;
            document.querySelector('.iframe-form').classList.toggle('active');*/

            document.location.href = evt.target.dataset.url;
        }

        if( evt.target.matches('.pasos-lista li') ){
            evt.preventDefault();

            if( rnz.swiperInstances.has('pasos-slider') ){
                let slider = rnz.swiperInstances.get('pasos-slider');
                slider.slideToLoop(parseInt(evt.target.dataset.slide, 10));
            }
        }

        const menuLink = evt.target.closest?.('#menu-principal-container a[href^="#"]');
        if (menuLink) {
            evt.preventDefault();

            const hash = menuLink.getAttribute('href') || '';
            const id = hash.replace('#', '').trim();
            if (id) scrollToIdWithOffset(id);

            const detailsTab = menuLink.getAttribute('data-details-tab');
            if (id === 'details' && detailsTab) {
                activateDetailsTab(detailsTab);
            }

            document.getElementById('header')?.classList.toggle('active');
        }
    })

    if( rnz.swiperInstances.has('pasos-slider') ){
        let slider = rnz.swiperInstances.get('pasos-slider');
        slider.on('slideChange', () => {
            document.querySelectorAll('.pasos-lista li').forEach(li => {
                (li.dataset.slide == slider.realIndex) ? li.classList.add('active') : li.classList.remove('active');
            })
        });
    }

    
})

