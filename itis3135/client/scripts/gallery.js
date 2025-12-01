function initGalleryLightbox() {
    const grid = document.getElementById("galleryGrid");
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    // controls within the lightbox
    const prev = lightbox ? lightbox.querySelector('[aria-label="Previous image"]') : null;
    const next = lightbox ? lightbox.querySelector('[aria-label="Next image"]') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.close') : null;
    const count = document.getElementById("lbCount");
    if (!grid || !lightbox || !lbImg) return;
    if (lightbox.dataset.bound === "true") return;

    let imgs = Array.from(grid.querySelectorAll("img"));
    let index = 0;

    function refreshIndex() {
        // always read from DOM so ordering changes are reflected
        imgs = Array.from(grid.querySelectorAll("img"));
    }

    function open(i) {
        refreshIndex();
        index = i;
        lbImg.src = imgs[index].src;
        lbImg.alt = imgs[index].alt;
        if (count) count.textContent = (index + 1) + " of " + imgs.length;
        lightbox.classList.add("lightbox-open");
        lightbox.setAttribute("aria-hidden", "false");
    }
    function close() {
        lightbox.classList.remove("lightbox-open");
        lightbox.setAttribute("aria-hidden", "true");
    }
    function move(delta) {
        refreshIndex();
        index = (index + delta + imgs.length) % imgs.length;
        lbImg.src = imgs[index].src;
        lbImg.alt = imgs[index].alt;
        if (count) count.textContent = (index + 1) + " of " + imgs.length;
    }

    // delegate click from grid to open the clicked image
    grid.addEventListener("click", (e) => {
        const img = e.target.closest("img");
        if (!img || !grid.contains(img)) return;
        refreshIndex();
        const i = imgs.indexOf(img);
        if (i >= 0) open(i);
    });

    // control bindings
    if (prev) prev.addEventListener("click", () => move(-1));
    if (next) next.addEventListener("click", () => move(1));
    if (closeBtn) closeBtn.addEventListener("click", close);

    // click outside the image closes the overlay
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) close();
    });

    // keyboard interactions
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("lightbox-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") move(-1);
        if (e.key === "ArrowRight") move(1);
    });

    lightbox.dataset.bound = "true";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGalleryLightbox);
} else {
    initGalleryLightbox();
}


