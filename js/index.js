// preview window change -------------------------------------------------------------
const windowSelector = document.querySelectorAll(".topbar__item");
const previewWindow = document.querySelectorAll(".preview__window");

windowSelector.forEach((window, i) => {
    window.addEventListener("click", () => {
        windowSelector.forEach((s) => {
            s.classList.remove("active");
        });
        previewWindow.forEach((p) => {
            p.classList.remove("active");
        });
        
        window.classList.add("active");
        previewWindow[i].classList.add("active");
    });
});



// Color picker -------------------------------------------------------------

const root = document.documentElement;
const colorInputs = document.querySelectorAll(".color__slot input");
const colorValue = document.querySelectorAll(".color__value");

colorInputs.forEach((input, i) => {
    const setColor = () => {
        root.style.setProperty(input.dataset.color, input.value);
        colorValue[i].textContent = localStorage.getItem(input.dataset.color);
        localStorage.setItem(input.dataset.color, input.value);
    }
    input.addEventListener("input", setColor);

    if (localStorage.getItem(input.dataset.color)) {
        input.value = localStorage.getItem(input.dataset.color);
        setColor();
    }
});

// logo upload -------------------------------------------------------------
