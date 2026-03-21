const rnzForms = {
  init: () => {
    rnzForms.setInputs();
  },
  setInputs: () => {
    document.addEventListener("input", function (event) {
      let target = event.target;

      // Validar dinero (números con hasta 2 decimales)
      if (target.dataset.input === "money") {
        target.value = target.value
          .replace(/[^0-9.]/g, "") // Permite solo números y punto
          .replace(/(\..*)\./g, "$1") // Evita más de un punto decimal
          .replace(/^0+(\d)/, "$1") // Evita ceros al inicio
          .replace(/^(\d*\.?\d{0,2}).*$/, "$1"); // Máximo 2 decimales
      }

      // Validar nombres (solo letras y espacios)
      if (target.dataset.input === "name") {
        target.value = target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ' -]/g, "");
      }

      if (target.dataset.input === "celular") {
        target.value = target.value.replace(/\D/g, "").slice(0, 9);
      }

      if (target.dataset.input === "dni") {
        target.value = target.value.replace(/\D/g, "").slice(0, 8);
      }

      if (target.dataset.input === "ruc") {
        target.value = target.value.replace(/\D/g, "").slice(0, 11);
      }

      // Validar emails
      if (target.dataset.input === "email" || target.type === "email") {
        let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(target.value)) {
          target.setCustomValidity("Ingrese un email válido");
        } else {
          target.setCustomValidity("");
        }
      }
    });

    document.addEventListener("change", (evt) => {
      if (evt.target.matches(".form-checklist input")) {
        let label = evt.target.nextElementSibling;

        if (label.classList.contains("error") && evt.target.checked == true) {
          label.classList.remove("error");
        }
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  rnzForms.init();
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".hero-form form").forEach((form) => {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitForm = async (token = "") => {
        if (document.getElementById("terminos") !== null) {
          let checkbox = document.getElementById("terminos"),
            label = checkbox.nextElementSibling;

          if (!checkbox.checked) {
            label.classList.add("error");
            return false;
          } else {
            label.classList.remove("error");
          }
        }

        if (document.getElementById("informacion") !== null) {
          let checkbox = document.getElementById("informacion"),
            label = checkbox.nextElementSibling;

          if (!checkbox.checked) {
            label.classList.add("error");
            return false;
          } else {
            label.classList.remove("error");
          }
        }

        let formData = new FormData(form);
        let data = {};

        // Convertir FormData a JSON
        formData.forEach((value, key) => {
          data[key] = value;
        });

        let requestData = {
          form_name: form.getAttribute("data-form-name") || "default_form",
          email: data.email || "", // Si hay un campo email
          data: data,
          origin_url: window.location.href,
          user_agent: navigator.userAgent,
          recaptcha_token: token,
        };

        try {
          let response = await fetch("/wp-json/chapacash/v1/save_form/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          let result = await response.json();

          if (response.ok) {
            document.querySelectorAll(".form-step.active").forEach((step) => {
              step.classList.remove("active");
            });

            let thanksStep = document.querySelector(".form-step.thanks");
            if (thanksStep) {
              thanksStep.classList.add("active");
            }
          } else {
            alert(result.message);
            //console.error("Error en la respuesta:", result);
          }
        } catch (error) {
          console.error("Error al enviar el formulario:", error);
        }
      };

      if (
        typeof grecaptcha !== "undefined" &&
        typeof rnz_forms !== "undefined" &&
        rnz_forms.recaptcha_key
      ) {
        grecaptcha.ready(() => {
          grecaptcha
            .execute(rnz_forms.recaptcha_key, { action: "submit" })
            .then((token) => submitForm(token))
            .catch((error) => {
              console.error("Error al ejecutar reCAPTCHA:", error);
              submitForm();
            });
        });
      } else {
        submitForm();
      }
    });
  });
});
