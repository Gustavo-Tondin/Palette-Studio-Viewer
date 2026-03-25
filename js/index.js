// preview window change -------------------------------------------------------------
const windowSelector = document.querySelectorAll('.topbar__item')
const previewWindow = document.querySelectorAll('.preview__window')

windowSelector.forEach((window, i) => {
    window.addEventListener('click', () => {
        windowSelector.forEach((s) => { s.classList.remove('active') })
        previewWindow.forEach((p) => { p.classList.remove('active') })

        previewWindow[i].classList.add('active')
        windowSelector[i].classList.add('active')
    })
})

// Color picker -------------------------------------------------------------

const root = document.documentElement;

const palPrimary = getComputedStyle(root).getPropertyValue('--pal-primary');
const palSecondary = getComputedStyle(root).getPropertyValue('--pal-secondary');
const palAccent = getComputedStyle(root).getPropertyValue('--pal-accent');
const palLight = getComputedStyle(root).getPropertyValue('--pal-light');
const palDark = getComputedStyle(root).getPropertyValue('--pal-dark');

color__slot

document.querySelectorAll('.color__slot input').forEach((input, i) => {
    input.addEventListener('input', () => {
      palPrimary.set... = input.value;
      textDiv.textContent = input.value;
      colorDiv.style.color = getContrastColor(input.value);
    });
});

console.log(palPrimary, palSecondary, palAccent, palPrimary)