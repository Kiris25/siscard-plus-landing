"use strict";

(function () {
    const COMPONENTS = [
        { id: "sidebar-container", file: "components/sidebar.html" },
        { id: "topbar-container", file: "components/topbar.html" },
        { id: "footer-container", file: "components/footer.html" }
    ];

    async function loadComponent(component) {
        const container = document.getElementById(component.id);
        if (!container) return;

        const response = await fetch(component.file, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${component.file}: ${response.status}`);
        }
        container.innerHTML = await response.text();
    }

    function setActiveNavigation() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll("#sidebar .nav-link[data-page]").forEach((link) => {
            const isActive = link.dataset.page === currentPage;
            link.classList.toggle("active", isActive);
            if (isActive) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    }

    function setPageHeading() {
        const title = document.body.dataset.pageTitle;
        const subtitle = document.body.dataset.pageSubtitle;
        const titleElement = document.getElementById("sharedPageTitle");
        const subtitleElement = document.getElementById("sharedPageSubtitle");
        if (title && titleElement) titleElement.textContent = title;
        if (subtitle && subtitleElement) subtitleElement.textContent = subtitle;
    }

    function initializeSharedInteractions() {
        const sidebar = document.getElementById("sidebar");
        const menuButton = document.getElementById("menuButton");
        const profileButton = document.getElementById("profileButton");
        const profileMenu = document.getElementById("profileMenu");

        if (sidebar && menuButton) {
            menuButton.addEventListener("click", () => {
                const isOpen = sidebar.classList.toggle("open");
                menuButton.setAttribute("aria-expanded", String(isOpen));
            });
        }

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
    }

    async function initializeLayout() {
        try {
            await Promise.all(COMPONENTS.map(loadComponent));
            setActiveNavigation();
            setPageHeading();
            initializeSharedInteractions();
            document.dispatchEvent(new CustomEvent("siscard:layout-ready"));
        } catch (error) {
            console.error("Error al cargar el diseño compartido:", error);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeLayout);
    } else {
        initializeLayout();
    }
})();
