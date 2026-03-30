// ==========================================
// 1. Variáveis & Seletores
// ==========================================
const root = document.documentElement;
const colorInputs = document.querySelectorAll(".color__slot input");
const tabContainer = document.getElementById("tabContainer");
const previewWindows = document.querySelectorAll(".preview__window");
const topbarIndicator = document.getElementById("topbarIndicator");

// Botões
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const sidebar = document.getElementById("sidebar");

// Modais
const exportModal = document.getElementById("exportModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const copyCodeBtn = document.getElementById("copyCodeBtn");
const cssCodeBlock = document.getElementById("cssCodeBlock");

const palettesModal = document.getElementById("palettesModal");
const closePalettesBtn = document.getElementById("closePalettesBtn");
const paletteStripBtn = document.getElementById("paletteStripBtn");
const presetsGrid = document.getElementById("presetsGrid");

// Upload Logo
const logoInput = document.getElementById("logo");
const logoGrid = document.getElementById("logoGrid");
let currentLogoUrl = null;

// Valores Default
const defaultColors = {
    "--pal-primary": "#2a2eff",
    "--pal-secondary": "#6097fd",
    "--pal-accent": "#ff5252",
    "--pal-light": "#f5f1f1",
    "--pal-dark": "#070303"
};

// Paletas Prontas (Presets)
const presetPalettes = [
    { primary: "#6200ea", secondary: "#b388ff", accent: "#03dac6", light: "#fafafa", dark: "#121212" }, // Roxo M3
    { primary: "#2e7d32", secondary: "#81c784", accent: "#ffb300", light: "#f1f8e9", dark: "#1b5e20" }, // Natureza
    { primary: "#d32f2f", secondary: "#ff8a80", accent: "#448aff", light: "#ffebee", dark: "#212121" }, // Crimson
    { primary: "#00838f", secondary: "#4dd0e1", accent: "#ff6e40", light: "#e0f7fa", dark: "#006064" }, // Ocean
    { primary: "#ea4335", secondary: "#fbbc05", accent: "#34a853", light: "#ffffff", dark: "#202124" }  // Google Vibe
];

// ==========================================
// 2. Funções Handlers e Lógica
// ==========================================

// Atualiza Cor Individual
function updateColorHandler(inputElement) {
    const colorVar = inputElement.dataset.color;
    const value = inputElement.value;
    
    root.style.setProperty(colorVar, value);
    
    const textElement = inputElement.parentElement.querySelector(".color__value");
    if(textElement) textElement.textContent = value;
    
    localStorage.setItem(colorVar, value);
}

// Atualiza Indicador Animado da Topbar
function updateIndicatorHandler(activeTabElement) {
    if(!topbarIndicator || !activeTabElement) return;
    topbarIndicator.style.width = `${activeTabElement.offsetWidth}px`;
    topbarIndicator.style.left = `${activeTabElement.offsetLeft}px`;
}

// Troca de Abas
function tabClickHandler(e) {
    const clickedTab = e.target.closest('.topbar__item');
    if (!clickedTab) return;

    document.querySelectorAll('.topbar__item').forEach(t => t.classList.remove('active'));
    previewWindows.forEach(p => p.classList.remove('active'));

    clickedTab.classList.add('active');
    updateIndicatorHandler(clickedTab);
    
    const targetId = clickedTab.dataset.target;
    document.getElementById(targetId).classList.add('active');

    localStorage.setItem('activeTab', targetId);
}

// Conversão HSL para Hexadecimal
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Gera uma paleta baseada em teoria das cores
function generateSmartPalette() {
    const h = Math.floor(Math.random() * 360); // Hue Principal Aleatório
    return {
        "--pal-primary": hslToHex(h, 80, 50),
        "--pal-secondary": hslToHex((h + 40) % 360, 60, 60), // Análogo
        "--pal-accent": hslToHex((h + 180) % 360, 90, 50),   // Complementar
        "--pal-light": hslToHex(h, 20, 96),                  // Muito Claro e Tinted
        "--pal-dark": hslToHex(h, 30, 10)                    // Muito Escuro e Tinted
    };
}

// Função do Botão Randomize
function randomizeColorsHandler() {
    const newPalette = generateSmartPalette();
    
    colorInputs.forEach(input => {
        const varName = input.dataset.color;
        input.value = newPalette[varName];
        updateColorHandler(input);
    });

    // Animação de cor e scale no botão Randomize
    const originalBg = ""; // Deixa o css lidar na volta
    randomBtn.style.backgroundColor = newPalette["--pal-primary"];
    randomBtn.style.transform = "scale(0.9)";
    
    setTimeout(() => {
        randomBtn.style.backgroundColor = originalBg;
        randomBtn.style.transform = "scale(1)";
    }, 300);
}

// Reset para Cores Iniciais
function resetColorsHandler() {
    colorInputs.forEach(input => {
        const colorVar = input.dataset.color;
        input.value = defaultColors[colorVar];
        updateColorHandler(input);
    });
}

// Menu Responsivo
function toggleSidebarHandler() { 
    sidebar.classList.toggle('is-open'); 
}

// Lógica de Exportação
function generateCSSExport() {
    let cssString = `:root {\n`;
    colorInputs.forEach(input => cssString += `  ${input.dataset.color}: ${input.value};\n`);
    cssString += `}`;
    return cssString;
}

function openExportModalHandler() {
    cssCodeBlock.textContent = generateCSSExport();
    exportModal.showModal();
}

function copyCodeHandler() {
    navigator.clipboard.writeText(cssCodeBlock.textContent).then(() => {
        const originalText = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = `<i class="ri-check-line"></i> Copied!`;
        setTimeout(() => copyCodeBtn.innerHTML = originalText, 2000);
    });
}

// Lógica das Paletas Prontas
function renderPresets() {
    presetsGrid.innerHTML = presetPalettes.map((p, index) => `
        <div class="preset-row" data-index="${index}" tabindex="0">
            <div style="background:${p.primary}"></div>
            <div style="background:${p.secondary}"></div>
            <div style="background:${p.accent}"></div>
            <div style="background:${p.light}"></div>
            <div style="background:${p.dark}"></div>
        </div>
    `).join('');

    presetsGrid.querySelectorAll('.preset-row').forEach(row => {
        row.addEventListener('click', (e) => {
            const preset = presetPalettes[e.currentTarget.dataset.index];
            document.getElementById('color-primary').value = preset.primary;
            document.getElementById('color-secondary').value = preset.secondary;
            document.getElementById('color-accent').value = preset.accent;
            document.getElementById('color-light').value = preset.light;
            document.getElementById('color-dark').value = preset.dark;
            
            colorInputs.forEach(input => updateColorHandler(input));
            palettesModal.close();
        });
    });
}

function openPalettesModalHandler() { 
    palettesModal.showModal(); 
}

// Upload de Logotipo e Máscaras
function logoUploadHandler(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        currentLogoUrl = event.target.result;
        renderLogoGridHandler();
        
        const websiteLogo = document.querySelector('.website__logo-placeholder');
        if(websiteLogo) {
            websiteLogo.innerHTML = `<div style="width:100px; height:40px; background:currentColor; -webkit-mask: url('${currentLogoUrl}') center/contain no-repeat; mask: url('${currentLogoUrl}') center/contain no-repeat;"></div>`;
        }
    };
    reader.readAsDataURL(file);
}

function renderLogoGridHandler() {
    if(!currentLogoUrl) return;

    const combos = [
        ['var(--pal-light)', 'var(--pal-primary)'],
        ['var(--pal-light)', 'var(--pal-secondary)'],
        ['var(--pal-dark)', 'var(--pal-light)'],
        ['var(--pal-primary)', 'var(--pal-light)'],
        ['var(--pal-light)', 'var(--pal-dark)'],
        ['var(--pal-dark)', '#ffffff']
    ];

    logoGrid.innerHTML = combos.map(combo => `
        <div class="logo-card" style="background-color: ${combo[0]}; color: ${combo[1]};">
            <div class="logo-mask" style="-webkit-mask-image: url('${currentLogoUrl}'); mask-image: url('${currentLogoUrl}');"></div>
        </div>
    `).join('');
}


// ==========================================
// 3. Inicialização e Event Listeners
// ==========================================

function init() {
    // 1. Inicializa Cores
    colorInputs.forEach(input => {
        const savedColor = localStorage.getItem(input.dataset.color);
        if (savedColor) input.value = savedColor;
        updateColorHandler(input);
        input.addEventListener("input", () => updateColorHandler(input));
    });

    // 2. Inicializa Abas Salvas e Renderiza Indicador
    const savedTab = localStorage.getItem('activeTab') || 'logotipo';
    const tabToActivate = document.querySelector(`.topbar__item[data-target="${savedTab}"]`);
    if(tabToActivate) {
        tabToActivate.classList.add('active');
        document.getElementById(savedTab).classList.add('active');
        // Pequeno atraso para garantir que o elemento foi renderizado e tem largura antes de mover a barra
        setTimeout(() => updateIndicatorHandler(tabToActivate), 50);
    }

    // 3. Event Listeners Globais
    tabContainer.addEventListener("click", tabClickHandler);
    
    // Atualiza a barra azul de baixo ao redimensionar a tela
    window.addEventListener("resize", () => {
        updateIndicatorHandler(document.querySelector('.topbar__item.active'));
    });

    randomBtn.addEventListener("click", randomizeColorsHandler);
    resetBtn.addEventListener("click", resetColorsHandler);
    toggleSidebarBtn.addEventListener("click", toggleSidebarHandler);
    
    exportBtn.addEventListener("click", openExportModalHandler);
    closeModalBtn.addEventListener("click", () => exportModal.close());
    copyCodeBtn.addEventListener("click", copyCodeHandler);
    
    paletteStripBtn.addEventListener("click", openPalettesModalHandler);
    closePalettesBtn.addEventListener("click", () => palettesModal.close());

    // Fechar modais ao clicar no fundo escuro (backdrop)
    exportModal.addEventListener("click", (e) => { if (e.target === exportModal) exportModal.close(); });
    palettesModal.addEventListener("click", (e) => { if (e.target === palettesModal) palettesModal.close(); });

    logoInput.addEventListener("change", logoUploadHandler);
    
    // 4. Renderiza as grades de paletas prontas no modal
    renderPresets();
}

// Roda o app!
init();