const config = {
  STEPS: 3,
  STEP_NEXT: 1,
  STEP_PREV: -1,
  currentStep: 1,
  btnNext: document.querySelector("#btn-next"),
  btnPrev: document.querySelector("#btn-prev"),
  indicator: document.querySelectorAll("[data-indicator]"),
  step1: document.querySelector("#step-1"),
  stepMargin: 25,
};

function initApp() {
  const stepHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    //Controllo se il click è sul pulsante prev
    if (e.target.dataset.steptype === "prev") {
      return aggiornaForm(config.STEP_PREV);
    }

    //Se siamo all'ultimo step inviamo il form
    if (config.currentStep === config.STEPS) {
      inviaForm();
    }

    //Controllo correttezza campi
    if (validaCampi()) {
      aggiornaForm(config.STEP_NEXT);
    }
  };
  config.btnNext.addEventListener("click", stepHandler);
  config.btnPrev.addEventListener("click", stepHandler);
}

function aggiornaRiepilogo() {
  // Seleziona tutti gli input del form
  const inputs = document.querySelectorAll("#steps input");

  // Per ogni input, trova il corrispondente <span> nel riepilogo e aggiornalo
  inputs.forEach((input) => {
    const idInput = input.id;
    const spanRiepilogo = document.getElementById(`riepilogo-${idInput}`);

    if (spanRiepilogo) {
      spanRiepilogo.textContent = input.value;
    }
  });
}

function inviaForm() {
  document.querySelector("#form-btn-control").style.display = "none";
  document.querySelector(".step-status.inviato").style.display = "grid";
}

function isEmailValid(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isPasswordStrong(password) {
  // La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

function validaCampi() {
  let result = true;
  getCampi().forEach((formElem) => {
    const fieldValue = formElem.value;
    reimpostaClassi(formElem.parentElement, "", "has-error");

    if (formElem.required && fieldValue.trim() === "") {
      reimpostaClassi(formElem.parentElement, "has-error");
      result = false;
    }

    if (formElem.type === "email" && !isEmailValid(fieldValue)) {
      reimpostaClassi(formElem.parentElement, "has-error");
      result = false;
    }

    if (formElem.type === "password" && formElem.id === "password") {
      result = checkPassword(formElem, fieldValue);
    }
  });
  return result;
}

function checkPassword(formElem, fieldValue) {
  const confirm = document.querySelector("#password-confirm").value;

  if (!isPasswordStrong(fieldValue) || fieldValue !== confirm) {
    reimpostaClassi(formElem.parentElement, "has-error");
    return false;
  }
  reimpostaClassi(formElem.parentElement, "", "has-error");
  return true;
}

function getCampi() {
  const idStepWrapper = "step-" + config.currentStep,
    selettore = `#${idStepWrapper} :is(input, textarea)`,
    formFields = document.querySelectorAll(selettore);

  return formFields;
}

function aggiornaForm(newStep) {
  config.currentStep += newStep;
  aggionaPulsanti();
  aggiornaIndicatori();
  aggiornaCampiMostrati();

  if (config.currentStep === config.STEPS) {
    aggiornaRiepilogo();
  }
}

function aggionaPulsanti() {
  let { STEPS, currentStep, btnNext, btnPrev } = config;
  btnPrev.style.display = currentStep > 1 ? "initial" : "none";
  btnNext.textContent = currentStep === STEPS ? "Invia" : "Successivo";
}

function aggiornaIndicatori() {
  config.indicator.forEach((elem, index) => {
    if (index < config.currentStep - 1) {
      reimpostaClassi(elem, "success", "next", "current");
    } else if (index === config.currentStep - 1) {
      reimpostaClassi(elem, "current", "success", "next");
    } else {
      reimpostaClassi(elem, "next", "success", "current");
    }
  });
}

function reimpostaClassi(elemento, daAggiungere, ...daRimuovere) {
  if (daAggiungere) elemento.classList.add(daAggiungere);
  elemento.classList.remove(...daRimuovere);
}

function aggiornaCampiMostrati() {
  const marginValue = config.stepMargin * (config.currentStep - 1);
  config.step1.style.marginLeft = "-" + marginValue + "%";
}

initApp();
