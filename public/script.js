/**
 * Luxury Surf Bali - Main JavaScript
 * Contains all interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTestimonialSlider();
    initGallerySlider();
    initMobileMenu();
    initSocialMenu();
    initFAQAccordion();
    initImageModal();
});

/**
 * Testimonial Slider
 * Controls the testimonial slideshow on the homepage
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;

    // If no testimonials found, exit function
    if (!slides.length || !dots.length) return;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-advance slides every 5 seconds
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 5000);
}

/**
 * Gallery Slider
 * Handles the image gallery with touch/mouse support and infinite loop
 */
function initGallerySlider() {
    const gallery = document.querySelector('.gallery-wrapper');
    if (!gallery) return; // Exit if gallery doesn't exist

    const track = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const nextButton = document.querySelector('.gallery-arrow.next');
    const prevButton = document.querySelector('.gallery-arrow.prev');
    
    // Mobile check
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        initMobileGallery(gallery, track, slides, nextButton, prevButton);
    } else {
        initDesktopGallery(gallery, track, slides, nextButton, prevButton);
    }
}

/**
 * Mobile Gallery Implementation
 */
function initMobileGallery(gallery, track, slides, nextButton, prevButton) {
    const slideCount = slides.length;
    let currentIndex = 0;
    
    // Clone first and last slides for infinite loop
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[slideCount - 1].cloneNode(true);
    track.appendChild(firstSlideClone);
    track.insertBefore(lastSlideClone, slides[0]);

    // Set initial width for mobile
    slides.forEach(slide => {
        slide.style.minWidth = '100%';
        slide.style.width = '100%';
    });
    
    // Also set width for cloned slides
    firstSlideClone.style.minWidth = '100%';
    firstSlideClone.style.width = '100%';
    lastSlideClone.style.minWidth = '100%';
    lastSlideClone.style.width = '100%';

    function updateSlidePosition(index, animate = true) {
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.3s ease';
        }
        track.style.transform = `translateX(-${(index + 1) * 100}%)`;
    }

    function moveToSlide(direction) {
        if (direction === 'next') {
            currentIndex++;
            if (currentIndex >= slideCount) {
                updateSlidePosition(currentIndex);
                setTimeout(() => {
                    currentIndex = 0;
                    updateSlidePosition(currentIndex, false);
                }, 300);
            } else {
                updateSlidePosition(currentIndex);
            }
        } else {
            currentIndex--;
            if (currentIndex < 0) {
                updateSlidePosition(currentIndex);
                setTimeout(() => {
                    currentIndex = slideCount - 1;
                    updateSlidePosition(currentIndex, false);
                }, 300);
            } else {
                updateSlidePosition(currentIndex);
            }
        }
    }

    // Set initial position
    updateSlidePosition(currentIndex, false);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
    }

    function handleTouchMove(e) {
        if (!isSwiping) return;
        
        // Prevent default to stop page scrolling during swipe
        e.preventDefault();
        
        const currentX = e.touches[0].clientX;
        const diff = touchStartX - currentX;
        
        // Optional: Add visual feedback during swipe
        const movePercent = (diff / window.innerWidth) * 30;
        track.style.transform = `translateX(calc(-${(currentIndex + 1) * 100}% - ${movePercent}px))`;
    }

    function handleTouchEnd(e) {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        // Reset swiping state
        isSwiping = false;
        
        // Determine if swipe was significant enough
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                moveToSlide('next');
            } else {
                moveToSlide('prev');
            }
        } else {
            // If swipe wasn't significant, reset to current position
            updateSlidePosition(currentIndex);
        }
    }

    // Add touch event listeners directly to the gallery element
    gallery.addEventListener('touchstart', handleTouchStart, { passive: false });
    gallery.addEventListener('touchmove', handleTouchMove, { passive: false });
    gallery.addEventListener('touchend', handleTouchEnd);

    // Arrow navigation
    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => moveToSlide('next'));
        prevButton.addEventListener('click', () => moveToSlide('prev'));
    }
    
    // Handle transition end for infinite loop
    track.addEventListener('transitionend', function() {
        if (currentIndex >= slideCount) {
            track.style.transition = 'none';
            currentIndex = 0;
            updateSlidePosition(currentIndex, false);
        } else if (currentIndex < 0) {
            track.style.transition = 'none';
            currentIndex = slideCount - 1;
            updateSlidePosition(currentIndex, false);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateSlidePosition(currentIndex);
    });
}

/**
 * Desktop Gallery Implementation
 */
function initDesktopGallery(wrapper, track, slides, nextButton, prevButton) {
    const slideCount = slides.length;
    
    // Clone multiple slides for better infinite loop
    // Clone first three slides and append to end
    const firstSlideClone = slides[0].cloneNode(true);
    const secondSlideClone = slides[1].cloneNode(true);
    const thirdSlideClone = slides[2].cloneNode(true);
    
    // Clone last three slides and prepend to beginning
    const lastSlideClone = slides[slideCount - 1].cloneNode(true);
    const secondLastSlideClone = slides[slideCount - 2].cloneNode(true);
    const thirdLastSlideClone = slides[slideCount - 3].cloneNode(true);
    
    // Add clones to track
    track.appendChild(firstSlideClone);
    track.appendChild(secondSlideClone);
    track.appendChild(thirdSlideClone);
    
    track.insertBefore(lastSlideClone, slides[0]);
    track.insertBefore(secondLastSlideClone, lastSlideClone);
    track.insertBefore(thirdLastSlideClone, secondLastSlideClone);
    
    let currentIndex = 0;
    const slideWidth = (window.innerWidth - 40) / 3; // Account for gaps
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let dragStartTime = 0;
    let dragDistance = 0;
    
    // Number of cloned slides at the beginning
    const cloneOffset = 3;

    // Set initial width for all slides including clones
    const allSlides = track.querySelectorAll('.gallery-slide');
    allSlides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.flex = `0 0 ${slideWidth}px`;
    });
    
    function updateSlidePosition(transition = true) {
        cancelAnimationFrame(animationID);
        if (!transition) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.3s ease';
        }
        // Position is based on current index plus clone offset
        currentTranslate = -((currentIndex + cloneOffset) * (slideWidth + 20)); // Add gap width and account for clones
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    function setSliderPosition() {
        track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    }

    function resetSlidePosition() {
        if (currentIndex >= slideCount) {
            currentIndex = 0;
            track.style.transition = 'none';
            updateSlidePosition(false);
            // Force reflow
            track.offsetHeight;
        } else if (currentIndex < 0) {
            currentIndex = slideCount - 1;
            track.style.transition = 'none';
            updateSlidePosition(false);
            // Force reflow
            track.offsetHeight;
        }
    }
    
    function animation() {
        setSliderPosition();
        if (isDragging) animationID = requestAnimationFrame(animation);
    }
    
    function dragStart(e) {
        e.preventDefault();
        startPos = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        isDragging = true;
        dragStartTime = Date.now();
        dragDistance = 0;
        track.style.transition = 'none';
        animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const currentPosition = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        dragDistance = currentPosition - startPos;
        currentTranslate = prevTranslate + dragDistance;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        const dragDuration = Date.now() - dragStartTime;
        const velocity = Math.abs(dragDistance) / dragDuration;
        const shouldSlide = Math.abs(dragDistance) > slideWidth * 0.2 || velocity > 0.5;
        
        track.style.transition = 'transform 0.3s ease';
        
        if (shouldSlide) {
            if (dragDistance < 0) {
                currentIndex++;
            } else {
                currentIndex--;
            }
        }
        
        updateSlidePosition();
        setTimeout(resetSlidePosition, 300);
    }
    
    // Event Listeners for desktop
    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('touchstart', dragStart, { passive: false });
    wrapper.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('touchend', dragEnd);
    wrapper.addEventListener('mousemove', drag);
    wrapper.addEventListener('touchmove', drag, { passive: false });
    wrapper.addEventListener('mouseleave', dragEnd);
    
    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => {
            currentIndex++;
            updateSlidePosition();
            setTimeout(resetSlidePosition, 300);
        });
        
        prevButton.addEventListener('click', () => {
            currentIndex--;
            updateSlidePosition();
            setTimeout(resetSlidePosition, 300);
        });
    }

    // Initial position
    updateSlidePosition(false);

    // Handle window resize
    window.addEventListener('resize', () => {
        const newSlideWidth = (window.innerWidth - 40) / 3;
        allSlides.forEach(slide => {
            slide.style.width = `${newSlideWidth}px`;
            slide.style.flex = `0 0 ${newSlideWidth}px`;
        });
        updateSlidePosition(false);
    });

    // Handle transition end for smoother infinite loop
    track.addEventListener('transitionend', () => {
        resetSlidePosition();
    });
}

/**
 * Mobile Menu Toggle
 * Handles the mobile navigation menu
 */
function initMobileMenu() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navRight = document.querySelector('.nav-right');
    const menuIcon = document.querySelector('.menu-icon');
    const header = document.querySelector('.header');

    if (!mobileMenuIcon || !navRight || !menuIcon || !header) return;

    // Cek mode mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        header.classList.add('transparent'); // Set header transparan saat pertama kali load
    }

    mobileMenuIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        navRight.classList.toggle('active');
    
        if (isMobile) {
            if (navRight.classList.contains('active')) {
                header.classList.add('active');
                header.classList.remove('transparent');
                menuIcon.src = 'assets/images/dropdownclose.png';
                console.log('Menu terbuka, header harus active:', header.classList); // Debug
            } else {
                header.classList.remove('active');
                header.classList.add('transparent');
                menuIcon.src = 'assets/images/dropdownopen.png';
                console.log('Menu tertutup, header harus transparent:', header.classList); // Debug
            }
        }
    });

    // Tutup menu jika klik di luar
    document.addEventListener('click', function(e) {
        if (!navRight.contains(e.target) && !mobileMenuIcon.contains(e.target)) {
            navRight.classList.remove('active');
            header.classList.remove('active');
            header.classList.add('transparent');
            menuIcon.src = 'assets/images/dropdownopen.png'; // Kembali ke icon open
        }
    });

    // Tutup menu jika klik salah satu link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navRight.classList.remove('active');
            header.classList.remove('active');
            header.classList.add('transparent');
            menuIcon.src = 'assets/images/dropdownopen.png'; // Kembali ke icon open
        });
    });
}


/**
 * Social Menu Toggle
 * Handles the fixed social icons menu
 */
function initSocialMenu() {
    const socialToggle = document.querySelector('.social-toggle');
    const socialMenu = document.querySelector('.social-menu');
    const socialMenuIcon = document.querySelector('.social-menu-icon');
    
    if (!socialToggle || !socialMenu || !socialMenuIcon) return;
    
    let isOpen = false;

    function toggleSocialMenu(e) {
        e.stopPropagation();
        isOpen = !isOpen;
        socialMenu.classList.toggle('active');
        socialMenuIcon.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0)';
    }

    // Toggle menu when clicking the toggle button
    socialToggle.addEventListener('click', toggleSocialMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const socialIcons = document.querySelector('.fixed-social-icons');
        if (socialIcons && !socialIcons.contains(e.target) && isOpen) {
            isOpen = false;
            socialMenu.classList.remove('active');
            socialMenuIcon.style.transform = 'rotate(0)';
        }
    });

    // Close menu when scrolling
    window.addEventListener('scroll', function() {
        if (isOpen) {
            isOpen = false;
            socialMenu.classList.remove('active');
            socialMenuIcon.style.transform = 'rotate(0)';
        }
    });
}

/**
 * FAQ Accordion
 * Handles the expanding/collapsing of FAQ items
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (!question || !answer || !toggle) return;
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-toggle i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                toggle.querySelector('i').style.transform = 'rotate(180deg)';
            } else {
                answer.style.maxHeight = null;
                toggle.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });
    });
}

/**
 * Image Modal
 * Handles the image zoom functionality on the location page
 */
function initImageModal() {
    const modal = document.getElementById("imageModal");
    if (!modal) return;
    
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");
    const span = document.getElementsByClassName("modal-close")[0];
    const images = document.getElementsByClassName("zoomable-image");

    // Add click event to all zoomable images
    for (let i = 0; i < images.length; i++) {
        images[i].style.cursor = "pointer";
        images[i].onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
    }

    // Close the modal
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    // Close modal when clicking outside the image
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
}
