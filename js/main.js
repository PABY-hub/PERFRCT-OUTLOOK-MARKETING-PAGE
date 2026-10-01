/**
 * ATELIER Fashion Designer E-Commerce
 * Main Application Controller
 */

// ==========================================
// DATA STORE
// ==========================================

const Store = {
    products: [
        {
            id: 1,
            name: "Midnight Silk Gown",
            price: 1250,
            category: "dresses",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
            description: "A flowing silk gown with delicate hand-beaded details. Perfect for evening galas and special occasions. Features a draped back and side slit.",
            sizes: ["XS", "S", "M", "L", "XL"],
            colors: [
                { name: "Black", hex: "#000000" },
                { name: "Midnight Blue", hex: "#1a1a2e" },
                { name: "Navy", hex: "#16213e" }
            ],
            inStock: true
        },
        {
            id: 2,
            name: "Tailored Linen Suit",
            price: 890,
            category: "suits",
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
            description: "Italian linen suit with structured shoulders and tapered trousers. Breathable fabric perfect for summer events.",
            sizes: ["44", "46", "48", "50", "52"],
            colors: [
                { name: "Beige", hex: "#f5f5dc" },
                { name: "Sand", hex: "#d4c4b0" },
                { name: "Brown", hex: "#8b7355" }
            ],
            inStock: true
        },
        {
            id: 3,
            name: "Velvet Evening Clutch",
            price: 320,
            category: "accessories",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
            description: "Hand-embroidered velvet clutch with gold hardware. Includes detachable chain strap.",
            sizes: ["One Size"],
            colors: [
                { name: "Burgundy", hex: "#800020" },
                { name: "Navy Blue", hex: "#000080" },
                { name: "Slate", hex: "#2f4f4f" }
            ],
            inStock: true
        },
        {
            id: 4,
            name: "A-Line Tulle Dress",
            price: 780,
            category: "dresses",
            image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
            description: "Romantic tulle dress with layered skirt and corset bodice. Available in custom colors upon request.",
            sizes: ["XS", "S", "M", "L"],
            colors: [
                { name: "Pink", hex: "#ffc0cb" },
                { name: "White", hex: "#ffffff" },
                { name: "Lavender", hex: "#e6e6fa" }
            ],
            inStock: true
        },
        {
            id: 5,
            name: "Cashmere Overcoat",
            price: 1450,
            category: "suits",
            image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
            description: "Luxurious cashmere overcoat with belted waist and wide lapels. Knee-length with hidden pockets.",
            sizes: ["S", "M", "L", "XL"],
            colors: [
                { name: "Tan", hex: "#d2b48c" },
                { name: "Grey", hex: "#808080" },
                { name: "Charcoal", hex: "#2f4f4f" }
            ],
            inStock: true
        },
        {
            id: 6,
            name: "Silk Scarf Collection",
            price: 180,
            category: "accessories",
            image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa33?w=600&q=80",
            description: "Hand-printed silk scarves featuring original artwork. 90x90cm, perfect for neck or bag accessory.",
            sizes: ["One Size"],
            colors: [
                { name: "Coral", hex: "#ff6b6b" },
                { name: "Turquoise", hex: "#4ecdc4" },
                { name: "Yellow", hex: "#ffe66d" }
            ],
            inStock: true
        }
    ],

    lookbookImages: [
        { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", title: "Runway 2024" },
        { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", title: "Spring Collection" },
        { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80", title: "Urban Elegance" },
        { src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", title: "Evening Wear" },
        { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", title: "Street Style" },
        { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", title: "Editorial" }
    ],

    config: {
        whatsappNumber: "233549000504",
        currency: "USD",
        currencySymbol: "$"
    }
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

const State = {
    currentFilter: 'all',
    selectedProduct: null,
    selectedSize: null,
    selectedColor: null,
    cart: [],
    modalOpen: false,
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.notify('filterChanged', filter);
    },
    
    setProduct(product) {
        this.selectedProduct = product;
        this.selectedSize = null;
        this.selectedColor = null;
        this.notify('productSelected', product);
    },
    
    setSize(size) {
        this.selectedSize = size;
        this.notify('sizeSelected', size);
    },
    
    setColor(color) {
        this.selectedColor = color;
        this.notify('colorSelected', color);
    },
    
    addToCart(item) {
        this.cart.push({
            ...item,
            addedAt: new Date().toISOString()
        });
        this.notify('cartUpdated', this.cart);
    },
    
    clearCart() {
        this.cart = [];
        this.notify('cartUpdated', this.cart);
    },
    
    // Simple event system for state changes
    listeners: {},
    
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },
    
    notify(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
};

// ==========================================
// UTILITIES
// ==========================================

const Utils = {
    formatPrice(price) {
        return `${Store.config.currencySymbol}${price.toLocaleString()}`;
    },
    
    encodeWhatsAppMessage(text) {
        return encodeURIComponent(text);
    },
    
    getColorName(hex) {
        const allColors = Store.products.flatMap(p => p.colors);
        const color = allColors.find(c => c.hex === hex);
        return color ? color.name : 'Custom';
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    generateWhatsAppLink(number, message) {
        return `https://wa.me/${number}?text=${this.encodeWhatsAppMessage(message)}`;
    }
};

// ==========================================
// UI CONTROLLERS
// ==========================================

const UI = {
    // Product Grid Rendering
    renderProducts(filter = 'all') {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        
        const filtered = filter === 'all' 
            ? Store.products 
            : Store.products.filter(p => p.category === filter);
        
        grid.innerHTML = filtered.map(product => this.createProductCard(product)).join('');
        
        // Re-initialize scroll reveal for new elements
        Animations.initScrollReveal();
    },
    
    createProductCard(product) {
        return `
            <div class="product-card group cursor-pointer scroll-reveal" data-product-id="${product.id}">
                <div class="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         loading="lazy"
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="product-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <button class="bg-white text-black px-6 py-3 font-medium hover:bg-yellow-600 hover:text-white transition-colors" onclick="event.stopPropagation(); Actions.openProductModal(${product.id})">
                            Quick View
                        </button>
                    </div>
                    ${!product.inStock ? '<div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs">Out of Stock</div>' : ''}
                </div>
                <h3 class="font-display text-xl font-semibold mb-2 group-hover:text-yellow-600 transition-colors">${product.name}</h3>
                <p class="text-gray-600 font-medium">${Utils.formatPrice(product.price)}</p>
                <span class="text-xs text-gray-400 uppercase tracking-wider mt-1 block">${product.category}</span>
            </div>
        `;
    },
    
    // Lookbook Rendering
    renderLookbook() {
        const grid = document.getElementById('lookbook-grid');
        if (!grid) return;
        
        grid.innerHTML = Store.lookbookImages.map((img, idx) => `
            <div class="gallery-item scroll-reveal overflow-hidden group" style="animation-delay: ${idx * 100}ms">
                <img src="${img.src}" 
                     alt="${img.title}" 
                     loading="lazy"
                     class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                     onclick="Actions.openLightbox('${img.src}', '${img.title}')">
                <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p class="text-sm font-medium text-gray-600">${img.title}</p>
                </div>
            </div>
        `).join('');
    },
    
    // Modal Management
    openModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            State.modalOpen = true;
            Animations.lockScroll();
        }
    },
    
    closeModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            State.modalOpen = false;
            State.selectedProduct = null;
            State.selectedSize = null;
            State.selectedColor = null;
            Animations.unlockScroll();
        }
    },
    
    updateModalContent(product) {
        // Update basic info
        const elements = {
            image: document.getElementById('modal-image'),
            category: document.getElementById('modal-category'),
            title: document.getElementById('modal-title'),
            price: document.getElementById('modal-price'),
            description: document.getElementById('modal-description')
        };
        
        if (elements.image) elements.image.src = product.image;
        if (elements.category) elements.category.textContent = product.category;
        if (elements.title) elements.title.textContent = product.name;
        if (elements.price) elements.price.textContent = Utils.formatPrice(product.price);
        if (elements.description) elements.description.textContent = product.description;
        
        // Render sizes
        const sizesContainer = document.getElementById('modal-sizes');
        if (sizesContainer) {
            sizesContainer.innerHTML = product.sizes.map((size, idx) => `
                <div class="relative">
                    <input type="radio" 
                           name="size" 
                           id="size-${idx}" 
                           value="${size}" 
                           class="peer hidden size-option"
                           onchange="Actions.selectSize('${size}')">
                    <label for="size-${idx}" 
                           class="w-12 h-12 border-2 border-gray-200 flex items-center justify-center cursor-pointer 
                                  peer-checked:border-black peer-checked:bg-black peer-checked:text-white 
                                  hover:border-gray-400 transition-all text-sm font-medium rounded-sm">
                        ${size}
                    </label>
                </div>
            `).join('');
        }
        
        // Render colors
        const colorsContainer = document.getElementById('modal-colors');
        if (colorsContainer) {
            colorsContainer.innerHTML = product.colors.map((color, idx) => `
                <div class="relative group/color">
                    <input type="radio" 
                           name="color" 
                           id="color-${idx}" 
                           value="${color.hex}" 
                           class="peer hidden color-option"
                           onchange="Actions.selectColor('${color.hex}')">
                    <label for="color-${idx}" 
                           class="w-10 h-10 rounded-full cursor-pointer block relative
                                  peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black
                                  hover:scale-110 transition-transform shadow-sm"
                           style="background-color: ${color.hex}"
                           title="${color.name}">
                    </label>
                    <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap bg-black text-white px-2 py-1 rounded">
                        ${color.name}
                    </span>
                </div>
            `).join('');
        }
    },
    
    // Cart UI Updates
    updateCartCount() {
        const count = document.getElementById('cart-count');
        if (count) {
            const itemCount = State.cart.length;
            count.textContent = itemCount;
            count.classList.toggle('hidden', itemCount === 0);
            
            // Add bounce animation
            if (itemCount > 0) {
                count.classList.add('animate-bounce');
                setTimeout(() => count.classList.remove('animate-bounce'), 1000);
            }
        }
    },
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white font-medium`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        requestAnimationFrame(() => {
            notification.classList.remove('translate-x-full');
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Filter Buttons Update
    updateFilterButtons(activeFilter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const isActive = btn.dataset.filter === activeFilter;
            btn.classList.toggle('bg-black', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('border-black', isActive);
            btn.classList.toggle('border-gray-300', !isActive);
            btn.classList.toggle('hover:border-black', !isActive);
        });
    }
};

// ==========================================
// ACTIONS
// ==========================================

const Actions = {
    // Product Actions
    filterProducts(category) {
        State.setFilter(category);
        UI.renderProducts(category);
        UI.updateFilterButtons(category);
        
        // Smooth scroll to products
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
    },
    
    openProductModal(productId) {
        const product = Store.products.find(p => p.id === productId);
        if (!product) return;
        
        State.setProduct(product);
        UI.updateModalContent(product);
        UI.openModal();
    },
    
    closeProductModal() {
        UI.closeModal();
    },
    
    // Selection Actions
    selectSize(size) {
        State.setSize(size);
        console.log('Size selected:', size);
    },
    
    selectColor(colorHex) {
        State.setColor(colorHex);
        console.log('Color selected:', colorHex);
    },
    
    // WhatsApp Order Actions
    orderViaWhatsApp() {
        if (!State.selectedProduct) return;
        
        if (!State.selectedSize) {
            UI.showNotification('Please select a size first', 'error');
            return;
        }
        
        if (!State.selectedColor) {
            UI.showNotification('Please select a color first', 'error');
            return;
        }
        
        const colorName = Utils.getColorName(State.selectedColor);
        const message = this.generateOrderMessage(State.selectedProduct, State.selectedSize, colorName);
        const whatsappUrl = Utils.generateWhatsAppLink(Store.config.whatsappNumber, message);
        
        // Add to cart before opening WhatsApp
        State.addToCart({
            product: State.selectedProduct,
            size: State.selectedSize,
            color: State.selectedColor,
            colorName: colorName
        });
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        UI.showNotification('Opening WhatsApp with your order details...');
        UI.updateCartCount();
    },
    
    generateOrderMessage(product, size, colorName) {
        return `Hi! I'm interested in ordering from ATELIER:

*Product:* ${product.name}
*Price:* ${Utils.formatPrice(product.price)}
*Size:* ${size}
*Color:* ${colorName}
*Category:* ${product.category}

Please confirm availability and next steps. Thank you!`;
    },
    
    // Cart Actions
    viewCart() {
        if (State.cart.length === 0) {
            UI.showNotification('Your cart is empty. Browse our collections!', 'info');
            return;
        }
        
        const cartSummary = State.cart.map((item, idx) => 
            `${idx + 1}. ${item.product.name}\n   Size: ${item.size} | Color: ${item.colorName}\n   Price: ${Utils.formatPrice(item.product.price)}`
        ).join('\n\n');
        
        const total = State.cart.reduce((sum, item) => sum + item.product.price, 0);
        
        const fullMessage = `Hi! I'd like to order the following items from ATELIER:\n\n${cartSummary}\n\n*Total: ${Utils.formatPrice(total)}*\n\nPlease confirm availability. Thank you!`;
        
        if (confirm(`Your Cart:\n\n${cartSummary}\n\nTotal: ${Utils.formatPrice(total)}\n\nProceed to order all via WhatsApp?`)) {
            const whatsappUrl = Utils.generateWhatsAppLink(Store.config.whatsappNumber, fullMessage);
            window.open(whatsappUrl, '_blank');
        }
    },
    
    // Lightbox
    openLightbox(src, title) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
        lightbox.innerHTML = `
            <div class="relative max-w-5xl w-full">
                <img src="${src}" alt="${title}" class="w-full h-auto max-h-[85vh] object-contain">
                <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p class="text-white font-display text-xl">${title}</p>
                </div>
                <button onclick="Actions.closeLightbox()" class="absolute -top-12 right-0 text-white hover:text-yellow-600 transition-colors">
                    <i class="fas fa-times text-3xl"></i>
                </button>
            </div>
        `;
        
        lightbox.onclick = (e) => {
            if (e.target === lightbox) this.closeLightbox();
        };
        
        document.body.appendChild(lightbox);
        Animations.lockScroll();
        
        // Fade in
        requestAnimationFrame(() => {
            lightbox.classList.remove('opacity-0');
        });
        
        // Close on escape
        document.addEventListener('keydown', this.handleLightboxKey);
    },
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.remove();
                Animations.unlockScroll();
            }, 300);
        }
        document.removeEventListener('keydown', this.handleLightboxKey);
    },
    
    handleLightboxKey(e) {
        if (e.key === 'Escape') Actions.closeLightbox();
    },
    
    // Contact Form
    submitContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        console.log('Form submitted:', data);
        UI.showNotification('Thank you for your message! We will respond shortly.');
        e.target.reset();
        
        // Optional: Send to WhatsApp as well
        const message = `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`;
        // Uncomment to enable: window.open(Utils.generateWhatsAppLink(Store.config.whatsappNumber, message), '_blank');
    },
    
    // Navigation
    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        const icon = document.querySelector('.mobile-menu-icon');
        
        if (menu) {
            const isHidden = menu.classList.contains('hidden');
            menu.classList.toggle('hidden', !isHidden);
            
            if (icon) {
                icon.classList.toggle('fa-bars', !isHidden);
                icon.classList.toggle('fa-times', isHidden);
            }
        }
    },
    
    // Quick WhatsApp Chat
    quickChat(message = '') {
        const defaultMessage = message || 'Hi! I have a question about your collection.';
        const url = Utils.generateWhatsAppLink(Store.config.whatsappNumber, defaultMessage);
        window.open(url, '_blank');
    }
};

// ==========================================
// ANIMATIONS
// ==========================================

const Animations = {
    scrollObserver: null,
    
    init() {
        this.initScrollReveal();
        this.initNavbarScroll();
        this.initSmoothScroll();
    },
    
    initScrollReveal() {
        // Disconnect existing observer if any
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Stop observing once revealed
                    // this.scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            this.scrollObserver.observe(el);
        });
    },
    
    initNavbarScroll() {
        let lastScroll = 0;
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', Utils.debounce(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar?.classList.add('shadow-md', 'bg-white/95');
            } else {
                navbar?.classList.remove('shadow-md', 'bg-white/95');
            }
            
            lastScroll = currentScroll;
        }, 50));
    },
    
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        Actions.toggleMobileMenu();
                    }
                }
            });
        });
    },
    
    lockScroll() {
        document.body.style.overflow = 'hidden';
    },
    
    unlockScroll() {
        document.body.style.overflow = '';
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

const App = {
    init() {
        console.log('🎨 ATELIER Fashion Designer E-Commerce initialized');
        
        // Initialize UI
        UI.renderProducts();
        UI.renderLookbook();
        
        // Initialize animations
        Animations.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Subscribe to state changes
        State.on('cartUpdated', () => {
            UI.updateCartCount();
        });
        
        // Handle escape key for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && State.modalOpen) {
                Actions.closeProductModal();
            }
        });
        
        // Expose actions globally for HTML onclick handlers
        window.Actions = Actions;
    },
    
    setupEventListeners() {
        // Product card clicks (using event delegation)
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card && !e.target.closest('button')) {
                const productId = parseInt(card.dataset.productId);
                Actions.openProductModal(productId);
            }
        });
        
        // Form submission
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', Actions.submitContactForm);
        }
    }
};

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Expose for debugging
window.Store = Store;
window.State = State;
window.Utils = Utils;