"use strict";

(function ()
{
    const components =
    [
        {
            id: "sidebar-container",
            file: "components/sidebar.html"
        },
        {
            id: "topbar-container",
            file: "components/topbar.html"
        },
        {
            id: "footer-container",
            file: "components/footer.html"
        }
    ];

    async function loadComponent(component)
    {
        const container = document.getElementById(
            component.id
        );

        if (!container)
        {
            return;
        }

        const response = await fetch(
            component.file,
            {
                cache: "no-cache"
            }
        );

        if (!response.ok)
        {
            throw new Error(
                `No se pudo cargar ${component.file}`
            );
        }

        container.innerHTML = await response.text();
    }

    function setActiveNavigation()
    {
        const currentPage =
            window.location.pathname.split("/").pop() ||
            "index.html";

        document
            .querySelectorAll(
                "#sidebar .nav-link[data-page]"
            )
            .forEach(
                function(link)
                {
                    const isActive =
                        link.dataset.page === currentPage;

                    link.classList.toggle(
                        "active",
                        isActive
                    );

                    if (isActive)
                    {
                        link.setAttribute(
                            "aria-current",
                            "page"
                        );
                    }
                    else
                    {
                        link.removeAttribute(
                            "aria-current"
                        );
                    }
                }
            );
    }

    function setPageHeading()
    {
        const titleElement =
            document.getElementById(
                "sharedPageTitle"
            );

        const subtitleElement =
            document.getElementById(
                "sharedPageSubtitle"
            );

        if (
            titleElement &&
            document.body.dataset.pageTitle
        )
        {
            titleElement.textContent =
                document.body.dataset.pageTitle;
        }

        if (
            subtitleElement &&
            document.body.dataset.pageSubtitle
        )
        {
            subtitleElement.textContent =
                document.body.dataset.pageSubtitle;
        }
    }

    function initializeMenu()
    {
        const menuButton =
            document.getElementById(
                "menuButton"
            );

        const sidebar =
            document.getElementById(
                "sidebar"
            );

        if (!menuButton || !sidebar)
        {
            return;
        }

        menuButton.addEventListener(
            "click",
            function()
            {
                const isOpen =
                    sidebar.classList.toggle(
                        "open"
                    );

                menuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );
    }

    function initializeProfile()
    {
        const profileButton =
            document.getElementById(
                "profileButton"
            );

        const profileMenu =
            document.getElementById(
                "profileMenu"
            );

        if (!profileButton || !profileMenu)
        {
            return;
        }

        profileButton.addEventListener(
            "click",
            function()
            {
                profileMenu.hidden =
                    !profileMenu.hidden;

                profileButton.setAttribute(
                    "aria-expanded",
                    String(!profileMenu.hidden)
                );
            }
        );
    }

    async function initializeLayout()
    {
        await Promise.all(
            components.map(
                loadComponent
            )
        );

        setActiveNavigation();
        setPageHeading();
        initializeMenu();
        initializeProfile();

        document.dispatchEvent(
            new CustomEvent(
                "siscard:layout-ready"
            )
        );
    }

    function handleLayoutError(error)
    {
        console.error(
            "Error al cargar el diseño compartido:",
            error
        );
    }

    if (document.readyState === "loading")
    {
        document.addEventListener(
            "DOMContentLoaded",
            function()
            {
                initializeLayout().catch(
                    handleLayoutError
                );
            }
        );
    }
    else
    {
        initializeLayout().catch(
            handleLayoutError
        );
    }
})();
