const header = document.querySelector("header");
const openMenu = document.querySelector(".menu-burger")
const closeMenu = document.querySelector(".close-menu")

// menu mobile script //

openMenu.addEventListener('click', () => {
    if (!openMenu) {
        openMenu.style.display = 'flex';
        closeMenu.style.display = 'none';
    } else {
        closeMenu.style.display = 'flex';
        openMenu.style.display = 'none'
    }
})

closeMenu.addEventListener('click', () => {
    if (!closeMenu) {
        openMenu.style.display = 'none';
        closeMenu.style.display = 'flex';
    } else {
        closeMenu.style.display = 'none';
        openMenu.style.display = 'flex'
    }
})

// header script //

let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0%)";
    }

    lastScroll = currentScroll;
});


