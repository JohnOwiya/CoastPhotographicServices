const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');

    navbar.classList.toggle('sticky', window.scrollY > 50);
});
// --- PORTFOLIO CATEGORY FILTERING MATRIX ---
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active status class from current active tab
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");

            const filterValue = button.getAttribute("data-target");

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");
                
                if (filterValue === "all" || itemCategory === filterValue) {
                    item.classList.remove("hide");
                } else {
                    item.classList.add("hide");
                }
            });
        });
    });
});