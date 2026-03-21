const rnzForms = {
	init: () => {
		rnzForms.setInputs();
	},
	setInputs: () => {
		document.addEventListener("input", (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			if (!target.dataset) return;

			// Validar dinero (números con hasta 2 decimales)
			if (target.dataset.input === "money") {
				target.value = target.value
					.replace(/[^0-9.]/g, '')
					.replace(/(\..*)\./g, '$1')
					.replace(/^0+(\d)/, '$1')
					.replace(/^(\d*\.?\d{0,2}).*$/, '$1');
			}

			// Validar nombres (solo letras y espacios)
			if (target.dataset.input === "name") {
				target.value = target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ' -]/g, '');
			}

			if (target.dataset.input === "celular" || target.dataset.input === "tel") {
				target.value = target.value.replace(/\D/g, '').slice(0, 9);
			}

			if (target.dataset.input === "dni") {
				target.value = target.value.replace(/\D/g, '').slice(0, 8);
			}

			if (target.dataset.input === "ruc") {
				target.value = target.value.replace(/\D/g, '').slice(0, 11);
			}

			// Validar emails
			if (target.dataset.input === "email" || target.getAttribute?.("type") === "email") {
				const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				if (!regexEmail.test(String(target.value || ""))) {
					target.setCustomValidity("Ingrese un email válido");
				} else {
					target.setCustomValidity("");
				}
			}
		});

		document.addEventListener('change', (evt) => {
			const target = evt.target;
			if (!(target instanceof HTMLElement)) return;
			if (target.matches('.form-checklist input')) {
				const label = target.nextElementSibling;
				if (label?.classList?.contains('error') && target.checked === true) {
					label.classList.remove('error');
				}
			}
		});
	}
};

function setDateAndTime() {
	const fecha = document.getElementById('fecha');
	const hora = document.getElementById('hora');
	if (!(fecha instanceof HTMLInputElement) || !(hora instanceof HTMLInputElement)) return;

	const fechaLima = new Date().toLocaleDateString("es-PE", {
		timeZone: "America/Lima",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
	const horaLima = new Date().toLocaleTimeString("es-PE", {
		timeZone: "America/Lima",
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});

	fecha.value = fechaLima;
	hora.value = horaLima;
}

function generateClaimNumber() {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	const rnd = String(Math.floor(Math.random() * 9000) + 1000);
	return `LR-${y}${m}${d}-${rnd}`;
}

function setClaimNumber() {
	const input = document.getElementById("numero-reclamo-container");
	if (!(input instanceof HTMLInputElement)) return;
	if (input.value && input.value.trim().length > 0) return;
	input.value = generateClaimNumber();
}

function setupTipoReclamoDescription() {
	const tipoReclamo = document.getElementById("tipo_reclamo");
	const description = document.getElementById("description");
	if (!(tipoReclamo instanceof HTMLSelectElement) || !(description instanceof HTMLElement)) return;

	function updateDescription() {
		const selectedOption = tipoReclamo.options[tipoReclamo.selectedIndex];
		const desc = selectedOption?.getAttribute("data-description") || "";
		description.textContent = desc;
	}

	tipoReclamo.addEventListener("change", updateDescription);
	updateDescription();
}

function setupFormSubmit() {
	let submitted = false;
	let message = '';

	document.querySelectorAll(".reclamaciones form").forEach((form) => {
		form.addEventListener("submit", (event) => {
			event.preventDefault();

			if (submitted) {
				alert(`Su reclamo ya fue enviado con el código: ${message}`);
				return;
			}

			const checkbox = document.getElementById('declaracion_reclamo');
			if (checkbox instanceof HTMLInputElement) {
				const label = checkbox.nextElementSibling;
				if (!checkbox.checked) {
					label?.classList?.add('error');
					checkbox.focus();
					return;
				}
				label?.classList?.remove('error');
			}

			message = (document.getElementById("numero-reclamo-container") instanceof HTMLInputElement)
				? document.getElementById("numero-reclamo-container").value
				: generateClaimNumber();

			alert(`Gracias por su reclamo. Código: ${message}`);
			submitted = true;

			try {
				form.reset();
				setDateAndTime();
				setClaimNumber();
				setupTipoReclamoDescription();
			} catch (_) {}
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	rnzForms.init();
	setDateAndTime();
	setClaimNumber();
	setupTipoReclamoDescription();
	setupFormSubmit();
});