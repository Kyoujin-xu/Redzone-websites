/* =========================================
   REDZONE SHARED WEBSITE FUNCTIONS
========================================= */

// Background video
const BACKGROUND_VIDEO = "assets/lv_0_20261029100105.mp4";

/* =========================================
   REDZONE POPUPS, PROFILE AND LOGOUT
========================================= */

function createRedzonePopup() {
    let overlay = document.getElementById("redzonePopup");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "redzonePopup";
    overlay.className = "redzone-modal";
    overlay.innerHTML = `
        <div class="redzone-modal-box" role="dialog" aria-modal="true" aria-labelledby="redzonePopupTitle">
            <p class="eyebrow">REDZONE SYSTEM</p>
            <h2 id="redzonePopupTitle">WELCOME</h2>
            <p id="redzonePopupMessage"></p>
            <div class="redzone-modal-actions" id="redzonePopupActions"></div>
        </div>`;
    document.body.appendChild(overlay);
    return overlay;
}

function showRedzonePopup(title, message, buttons) {
    const overlay = createRedzonePopup();
    overlay.querySelector("#redzonePopupTitle").textContent = title;
    overlay.querySelector("#redzonePopupMessage").textContent = message;

    const actions = overlay.querySelector("#redzonePopupActions");
    actions.replaceChildren();

    buttons.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = item.className || "btn";
        button.textContent = item.label;
        button.addEventListener("click", item.action);
        actions.appendChild(button);
    });

    overlay.classList.add("show");
}

function hideRedzonePopup() {
    document.getElementById("redzonePopup")?.classList.remove("show");
}

function showLogoutConfirmation() {
    showRedzonePopup(
        "LOG OUT?",
        "Are you sure you want to leave the REDZONE?",
        [
            { label: "CANCEL", className: "btn btn-outline", action: hideRedzonePopup },
            {
                label: "LOG OUT",
                className: "btn",
                action: () => {
                    showRedzonePopup(
                        "THANK YOU!",
                        "Thanks for visiting REDZONE. See you on your next run!",
                        [{
                            label: "EXIT",
                            className: "btn",
                            action: () => {
                                localStorage.removeItem("gamingLoggedIn");
                                localStorage.removeItem("gamingUsername");
                                window.location.href = "login.html";
                            }
                        }]
                    );
                }
            }
        ]
    );
}

function setupHomeProfile() {
    const upload = document.getElementById("profileUpload");
    const preview = document.getElementById("profilePreview");
    const placeholder = document.getElementById("profilePlaceholder");
    const usernameLabel = document.getElementById("profileUsername");
    if (!upload || !preview) return;

    const username = localStorage.getItem("gamingUsername") || "PLAYER";
    const storageKey = "redzoneProfile_" + username;
    if (usernameLabel) usernameLabel.textContent = username.toUpperCase();

    const savedPicture = localStorage.getItem(storageKey);
    if (savedPicture) {
        preview.src = savedPicture;
        preview.style.display = "block";
        if (placeholder) placeholder.style.display = "none";
    }

    upload.addEventListener("change", () => {
        const file = upload.files && upload.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file.");
            upload.value = "";
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            alert("Please choose an image smaller than 3 MB.");
            upload.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            try {
                localStorage.setItem(storageKey, reader.result);
                preview.src = reader.result;
                preview.style.display = "block";
                if (placeholder) placeholder.style.display = "none";
            } catch {
                alert("The image could not be saved. Try a smaller image.");
            }
        };
        reader.readAsDataURL(file);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // Background video
    const backgroundVideo = document.getElementById("backgroundVideo");

    if (backgroundVideo) {
        backgroundVideo.src = BACKGROUND_VIDEO;
        backgroundVideo.load();
        backgroundVideo.play().catch(() => {});
    }

    // Logout confirmation and thank-you popup
    document.querySelectorAll("[data-logout]").forEach(button => {
        button.addEventListener("click", showLogoutConfirmation);
    });

    // Home profile picture upload
    setupHomeProfile();

    // Welcome popup after login or account creation
    if (sessionStorage.getItem("redzoneWelcome") === "true") {
        sessionStorage.removeItem("redzoneWelcome");
        const username = localStorage.getItem("gamingUsername") || "PLAYER";
        showRedzonePopup(
            "WELCOME TO REDZONE",
            "Good to have you here, " + username + ". Get ready to level up!",
            [{ label: "LET'S GO", className: "btn", action: hideRedzonePopup }]
        );
    }

    // Flip cards
    document.querySelectorAll(".flip-card").forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
        });
    });

    // Goal details
    document.querySelectorAll(".goal-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const details = button.nextElementSibling;
            if (!details) return;

            details.classList.toggle("open");

            button.setAttribute(
                "aria-expanded",
                details.classList.contains("open")
            );
        });
    });

    // Tabs
    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.tab;

            document.querySelectorAll(".tab-button").forEach(item => {
                item.classList.remove("active");
            });

            document.querySelectorAll(".tab-content").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            document.getElementById(target)?.classList.add("active");
        });
    });

    // Contact form
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const status = document.getElementById("contactStatus");

            if (status) {
                status.textContent =
                    "Form validated. Connect a server or email service to send messages.";
            }

            contactForm.reset();
        });
    }

    // Login / sign-up switch
    const switchButton = document.getElementById("switchButton");

    if (switchButton) {
        switchButton.addEventListener("click", () => {
            const authForm = document.getElementById("authForm");
            const mode = authForm?.dataset.mode || "login";

            switchForm(mode === "login" ? "signup" : "login");
        });
    }

    // 3D image movement
    const image3DScene = document.getElementById("image3DScene");

    if (image3DScene) {
        image3DScene.addEventListener("mousemove", event => {
            const image = document.getElementById("viewerImage");

            if (!image || image.hidden) return;

            const rect = image3DScene.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * 18;
            const rotateX = (0.5 - y) * 18;

            image.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        });

        image3DScene.addEventListener("mouseleave", () => {
            const image = document.getElementById("viewerImage");

            if (image) {
                image.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
            }
        });
    }

    // Gallery viewer
    setupGalleryViewer();

    // Page entrance animations
    document.querySelectorAll(
        ".card, .skill-card, .goal-card, .gallery-item, .flip-card"
    ).forEach((item, index) => {
        item.style.setProperty("--animation-delay", `${index * 80}ms`);
        item.classList.add("redzone-animate");
    });

});


/* =========================================
   LOGIN AND SIGN-UP SYSTEM
========================================= */

function switchForm(mode) {
    const authForm = document.getElementById("authForm");
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const confirmGroup = document.getElementById("confirmGroup");
    const confirmPassword = document.getElementById("confirmPassword");
    const authButton = document.getElementById("authButton");
    const switchText = document.getElementById("switchText");
    const switchButton = document.getElementById("switchButton");
    const formMessage = document.getElementById("formMessage");

    if (!authForm) return;

    authForm.dataset.mode = mode;

    if (formMessage) {
        formMessage.textContent = "";
    }

    if (mode === "signup") {
        if (formTitle) formTitle.textContent = "CREATE ACCOUNT";
        if (formSubtitle) formSubtitle.textContent = "Join the battlefield.";
        if (confirmGroup) confirmGroup.style.display = "block";
        if (confirmPassword) confirmPassword.required = true;
        if (authButton) authButton.textContent = "SIGN UP";
        if (switchText) switchText.textContent = "Already have an account?";
        if (switchButton) switchButton.textContent = "LOGIN";
    } else {
        if (formTitle) formTitle.textContent = "WELCOME BACK";
        if (formSubtitle) formSubtitle.textContent = "Enter the game. Own the battlefield.";
        if (confirmGroup) confirmGroup.style.display = "none";
        if (confirmPassword) {
            confirmPassword.required = false;
            confirmPassword.value = "";
        }
        if (authButton) authButton.textContent = "LOGIN";
        if (switchText) switchText.textContent = "Don't have an account?";
        if (switchButton) switchButton.textContent = "SIGN UP";
    }
}

function handleAuth(event) {
    event.preventDefault();

    const authForm = document.getElementById("authForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const formMessage = document.getElementById("formMessage");

    if (!authForm || !usernameInput || !passwordInput) return;

    const mode = authForm.dataset.mode || "login";
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const accounts = JSON.parse(localStorage.getItem("gamingAccounts") || "{}");

    const showMessage = (message, success = false) => {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.style.color = success ? "#55ff88" : "#ff4b4b";
        }
    };

    if (!username || !password) {
        showMessage("Please complete all required fields.");
        return;
    }

    if (mode === "signup") {
        if (!confirmPassword || password !== confirmPassword.value) {
            showMessage("Passwords do not match.");
            return;
        }

        if (accounts[username]) {
            showMessage("This username is already registered.");
            return;
        }

        accounts[username] = password;
        localStorage.setItem("gamingAccounts", JSON.stringify(accounts));

        localStorage.setItem("gamingLoggedIn", "true");
        localStorage.setItem("gamingUsername", username);
        sessionStorage.setItem("redzoneWelcome", "true");

        showMessage("Account created successfully!", true);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);

    } else {
        if (!accounts[username] || accounts[username] !== password) {
            showMessage("Incorrect username or password.");
            return;
        }

        localStorage.setItem("gamingLoggedIn", "true");
        localStorage.setItem("gamingUsername", username);
        sessionStorage.setItem("redzoneWelcome", "true");

        showMessage("Login successful!", true);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    }
}


/* =========================================
   PASSWORD VISIBILITY
========================================= */

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        if (button) button.textContent = "HIDE";
    } else {
        input.type = "password";
        if (button) button.textContent = "SHOW";
    }
}


/* =========================================
   GALLERY SYSTEM
========================================= */

const galleryMedia = [
    {
        image: "images/game1.jpg",
        title: "GAME 01",
        status: "ACTIVE",
        hp: 85,
        speed: 120,
        definition: "A featured gaming moment representing focus and performance."
    },
    {
        image: "images/game2.jpg",
        title: "GAME 02",
        status: "UNLOCKED",
        hp: 100,
        speed: 180,
        definition: "A completed level with maximum health and high speed."
    },
    {
        image: "images/game3.jpg",
        title: "GAME 03",
        status: "IN PROGRESS",
        hp: 65,
        speed: 95,
        definition: "A mission currently in progress. Keep improving."
    },
    {
        image: "images/game4.jpg",
        title: "GAME 04",
        status: "COMPLETED",
        hp: 100,
        speed: 150,
        definition: "A completed challenge and another achievement."
    },
    {
        image: "images/game5.jpg",
        title: "GAME 05",
        status: "AVAILABLE",
        hp: 75,
        speed: 110,
        definition: "An available challenge waiting to be explored."
    },
    {
        image: "images/game6.jpg",
        title: "GAME 06",
        status: "FEATURED",
        hp: 95,
        speed: 200,
        definition: "A featured selection with excellent performance."
    }
];

let currentGalleryIndex = 0;

function setupGalleryViewer() {
    const gallery = document.getElementById("galleryGrid");
    const viewer = document.getElementById("imageViewer");

    if (!gallery || !viewer) return;

    const image = document.getElementById("viewerImage");
    const title = document.getElementById("viewerTitle");
    const status = document.getElementById("viewerStatus");
    const definition = document.getElementById("viewerDefinition");
    const hpBar = document.getElementById("hpBar");
    const speedBar = document.getElementById("speedBar");
    const hpValue = document.getElementById("hpValue");
    const speedValue = document.getElementById("speedValue");

    function openViewer(index) {
        currentGalleryIndex = index;
        const item = galleryMedia[index];

        if (!item) return;

        image.src = item.image;
        image.hidden = false;

        if (title) title.textContent = item.title;
        if (status) status.textContent = item.status;
        if (definition) definition.textContent = item.definition;

        if (hpBar) hpBar.style.width = `${item.hp}%`;
        if (speedBar) speedBar.style.width = `${(item.speed / 200) * 100}%`;

        if (hpValue) hpValue.textContent = `${item.hp}%`;
        if (speedValue) speedValue.textContent = `${item.speed} KM/H`;

        viewer.classList.add("show");
        document.body.classList.add("viewer-open");
    }

    function closeViewer() {
        viewer.classList.remove("show");
        document.body.classList.remove("viewer-open");
    }

    gallery.querySelectorAll(".gallery-item").forEach((item, index) => {
        item.addEventListener("click", () => openViewer(index));
    });

    document.querySelectorAll("[data-viewer-close]").forEach(button => {
        button.addEventListener("click", closeViewer);
    });

    const previous = document.getElementById("viewerPrevious");
    const next = document.getElementById("viewerNext");

    if (previous) {
        previous.addEventListener("click", () => {
            openViewer(
                (currentGalleryIndex - 1 + galleryMedia.length) % galleryMedia.length
            );
        });
    }

    if (next) {
        next.addEventListener("click", () => {
            openViewer((currentGalleryIndex + 1) % galleryMedia.length);
        });
    }

    document.addEventListener("keydown", event => {
        if (!viewer.classList.contains("show")) return;

        if (event.key === "Escape") closeViewer();

        if (event.key === "ArrowLeft") {
            openViewer(
                (currentGalleryIndex - 1 + galleryMedia.length) % galleryMedia.length
            );
        }

        if (event.key === "ArrowRight") {
            openViewer((currentGalleryIndex + 1) % galleryMedia.length);
        }
    });

    viewer.addEventListener("click", event => {
        if (event.target === viewer) closeViewer();
    });
}


/* =========================================
   NAVIGATION ACTIVE STATE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});