document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    // Close mobile menu when clicking outside (optional, but good UX)
    document.addEventListener('click', (event) => {
        // Check if the click is outside the mobile navigation and the toggle button
        if (!mobileNav.contains(event.target) && !mobileMenuToggle.contains(event.target) && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
        }
    });

    // Product Data (You will populate this with your 54 toys)
    const products = [
        {
            id: 'coke-labubu-001',
            name: 'Labubu Coca-Cola Классика',
            price: '30000 ₸', // Цена изменена на тенге
            description: 'Ограниченная серия Labubu в культовом образе классической бутылки Coca-Cola. Детализированная фигурка с характерными элементами и глянцевым покрытием. Идеально дополнит любую коллекцию, придавая ей нотку ностальгии.',
            images: ['images/coke1_main.jpg', 'images/coke1_side.jpg', 'images/coke1_back.jpg']
        },
        {
            id: 'coke-labubu-002',
            name: 'Labubu Coca-Cola Винтаж',
            price: '30000 ₸', // Цена изменена на тенге
            description: 'Эта фигурка Labubu вдохновлена винтажными рекламными плакатами Coca-Cola 50-х годов. Имеет матовую отделку и ретро-цвета, что придает ей особый шарм. Отличный выбор для ценителей ретро-стиля.',
            images: ['images/coke2_main.jpg', 'images/coke2_detail.jpg']
        }
        // Add all 54 of your Labubu toys here following this structure!
        // Remember to create unique image paths for each toy.
    ];

    const productGrid = document.querySelector('.product-grid');
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalCarousel = document.querySelector('.modal-image-carousel');
    
    let currentProduct = null;
    let currentImageIndex = 0;

    // Function to render product cards
    function renderProducts() {
        productGrid.innerHTML = ''; // Clear existing content
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            // Add animation delay for staggered appearance
            card.style.animationDelay = `${0.1 * index}s`;

            card.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <button class="btn view-details-btn" data-id="${product.id}">Смотреть подробнее</button>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Add event listeners after cards are rendered
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                currentProduct = products.find(p => p.id === productId);
                if (currentProduct) {
                    openModal(currentProduct);
                }
            });
        });
    }

    // Function to open the modal
    function openModal(product) {
        modalTitle.textContent = product.name;
        modalPrice.textContent = product.price;
        modalDescription.textContent = product.description;
        
        // Clear previous images and load new ones
        modalCarousel.innerHTML = `
            <button class="carousel-arrow prev-arrow">&lsaquo;</button>
            <button class="carousel-arrow next-arrow">&rsaquo;</button>
        `; // Re-add arrows
        
        product.images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = product.name + ' image ' + (index + 1);
            img.classList.add('carousel-image');
            if (index === 0) {
                img.classList.add('active'); // Show first image by default
            }
            modalCarousel.appendChild(img);
        });

        // Re-assign arrow event listeners after dynamic content change
        const currentPrevArrow = modalCarousel.querySelector('.prev-arrow');
        const currentNextArrow = modalCarousel.querySelector('.next-arrow');
        currentPrevArrow.addEventListener('click', () => navigateCarousel(-1));
        currentNextArrow.addEventListener('click', () => navigateCarousel(1));

        currentImageIndex = 0; // Reset carousel to first image
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling body when modal is open
    }

    // Function to navigate carousel
    function navigateCarousel(direction) {
        const images = modalCarousel.querySelectorAll('.carousel-image');
        if (images.length === 0) return;

        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        images[currentImageIndex].classList.add('active');
    }

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('show');
        // Add a small delay for fade-out animation before hiding completely
        setTimeout(() => {
            modal.style.display = 'none'; 
            document.body.style.overflow = ''; // Restore body scrolling
        }, 300); // Should match fadeOutModal animation duration
    }

    // Close modal when close button is clicked
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- Active navigation link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a, .mobile-nav .mobile-nav-list a');
    const header = document.querySelector('.header');

    function highlightActiveLink() {
        let currentActiveSectionId = '';
        const headerHeight = header.offsetHeight;
        const scrollOffset = 50; // Смещение для активации (50px ниже шапки)

        // Проходим по секциям снизу вверх
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const sectionTop = section.offsetTop - headerHeight - scrollOffset;
            
            // Если верх секции находится на уровне или выше верхней части видимого окна
            // ИЛИ (если это последняя секция И мы в самом низу страницы)
            if (window.scrollY >= sectionTop || (i === sections.length - 1 && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50)) {
                currentActiveSectionId = section.getAttribute('id');
                break;
            }
        }

        // Если скролл совсем вверху, и мы не в секции, то активна "Главная"
        if (window.scrollY < sections[0].offsetTop - headerHeight - scrollOffset) {
            currentActiveSectionId = 'hero';
        }

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(currentActiveSectionId)) {
                link.classList.add('active-link');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', highlightActiveLink);
    // Call on load to set initial active link
    highlightActiveLink(); 

    // Initial render of products when page loads
    renderProducts();
});