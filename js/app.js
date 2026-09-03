"use strict";

const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");
const toast = document.getElementById("toast");
const searchForm = document.getElementById("globalSearch");
const searchInput = document.getElementById("searchInput");
const searchFeedback = document.getElementById("searchFeedback");
const serviceCards = [...document.querySelectorAll(".service-card")];
const countryFilter = document.getElementById("countryFilter");
const productFilter = document.getElementById("productFilter");
const footerContext = document.getElementById("footerContext");
const aiForm = document.getElementById("aiForm");
const aiInput = document.getElementById("aiInput");

let toastTimer;

function showToast(message) {
    if (!toast) {
        return;
    }

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");

    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
        toast.setAttribute("aria-hidden", "true");
    }, 3200);
}

function normaliseText(value) {
    return value
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function closeMobileMenu() {
    if (!sidebar || !menuButton) {
        return;
    }

    sidebar.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
}

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 760) {
            closeMobileMenu();
        }
    });
});

if (profileButton && profileMenu) {
    profileButton.addEventListener("click", () => {
        const willOpen = profileMenu.hidden;
        profileMenu.hidden = !willOpen;
        profileButton.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", (event) => {
        if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.hidden = true;
            profileButton.setAttribute("aria-expanded", "false");
        }
    });
}

document.querySelectorAll("[data-coming-soon]").forEach((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        const moduleName = element.dataset.comingSoon;
        showToast(`${moduleName}: acceso preparado para la siguiente integración.`);
    });
});

function runSearch(query) {
    const cleanQuery = normaliseText(query);

    serviceCards.forEach((card) => {
        card.classList.remove("search-match");
    });

    if (!cleanQuery) {
        searchFeedback.textContent = "Escriba una palabra para realizar la búsqueda.";
        searchInput.focus();
        return;
    }

    const matches = serviceCards.filter((card) => {
        const searchableText = `${card.textContent} ${card.dataset.search || ""}`;
        return normaliseText(searchableText).includes(cleanQuery);
    });

    if (matches.length === 0) {
        searchFeedback.textContent = `No se encontraron accesos directos para “${query}”.`;
        showToast("No se encontraron coincidencias en los servicios disponibles.");
        return;
    }

    matches.forEach((card) => {
        card.classList.add("search-match");
    });

    searchFeedback.textContent = `${matches.length} servicio(s) relacionado(s) encontrado(s).`;
    matches[0].scrollIntoView({ behavior: "smooth", block: "center" });
}

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        runSearch(searchInput.value);
    });
}

function updatePortalContext() {
    const country = countryFilter?.value || "Costa Rica";
    const product = productFilter?.value || "Todos";
    const productText = product === "Todos" ? "Todos los productos" : product;

    if (footerContext) {
        footerContext.textContent = `${country} · ${productText}`;
    }

    localStorage.setItem("siscardPortalCountry", country);
    localStorage.setItem("siscardPortalProduct", product);
}

if (countryFilter && productFilter) {
    const savedCountry = localStorage.getItem("siscardPortalCountry");
    const savedProduct = localStorage.getItem("siscardPortalProduct");

    if (savedCountry && [...countryFilter.options].some((option) => option.value === savedCountry)) {
        countryFilter.value = savedCountry;
    }

    if (savedProduct && [...productFilter.options].some((option) => option.value === savedProduct)) {
        productFilter.value = savedProduct;
    }

    countryFilter.addEventListener("change", updatePortalContext);
    productFilter.addEventListener("change", updatePortalContext);
    updatePortalContext();
}

document.querySelectorAll(".suggestion-list button").forEach((button) => {
    button.addEventListener("click", () => {
        aiInput.value = button.textContent.trim();
        aiInput.focus();
    });
});

if (aiForm && aiInput) {
    aiForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = aiInput.value.trim();

        if (!query) {
            showToast("Escriba una consulta para continuar.");
            aiInput.focus();
            return;
        }

        localStorage.setItem("siscardLastAiQuery", query);
        showToast("Consulta registrada. La integración del asistente se encuentra preparada para una siguiente fase.");
    });
}

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();

        if (profileMenu) {
            profileMenu.hidden = true;
        }
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput?.focus();
    }
});

console.log("Landing Siscard+ iniciado correctamente.");
