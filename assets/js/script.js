const header = document.querySelector("header");
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

