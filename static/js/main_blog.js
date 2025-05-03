(function() {
    "use strict";
  
    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }
  
    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector('.scroll-top');
  
    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    }
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  
    /**
     * Animation on scroll function and init
     */
    function aosInit() {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
    window.addEventListener('load', aosInit);
  
    /**
     * Init typed.js
     */
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  
    /**
     * Initiate Pure Counter
     */
    new PureCounter();
  
    /**
     * Animate the skills items on reveal
     */
    let skillsAnimation = document.querySelectorAll('.skills-animation');
    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function(direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    });
  
    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  
    /**
     * Init isotope layout and filters
     */
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
  
      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });
  
      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        filters.addEventListener('click', function() {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });
  
    });
  
    /**
     * Init swiper sliders
     */
    function initSwiper() {
      document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
        let config = JSON.parse(
          swiperElement.querySelector(".swiper-config").innerHTML.trim()
        );
  
        if (swiperElement.classList.contains("swiper-tab")) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      });
    }
  
    window.addEventListener("load", initSwiper);
  
    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener('load', function(e) {
      if (window.location.hash) {
        if (document.querySelector(window.location.hash)) {
          setTimeout(() => {
            let section = document.querySelector(window.location.hash);
            let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    });
  
    /**
     * Navmenu Scrollspy
     */
    let navmenulinks = document.querySelectorAll('.navmenu a');
  
    function navmenuScrollspy() {
      navmenulinks.forEach(navmenulink => {
        if (!navmenulink.hash) return;
        let section = document.querySelector(navmenulink.hash);
        if (!section) return;
        let position = window.scrollY + 200;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        } else {
          navmenulink.classList.remove('active');
        }
      })
    }
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);
  
  })();
  
  //-------SECTION FOR JS LOAD AFTER DOM CONTENT LOADED

  function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const icon = document.querySelector(".themeIcon"); 
    const darkClass = "dark-theme";
    htmlElement.classList.toggle(darkClass);
    
    if (htmlElement.classList.contains(darkClass)) {
      icon.classList.remove("bi-moon");
      icon.classList.add("bi-brightness-high");
    } else {
      icon.classList.remove("bi-brightness-high");
      icon.classList.add("bi-moon");
    }
    
    const isDark = htmlElement.classList.contains(darkClass);
    localStorage.setItem("darkMode", isDark ? "true" : "false");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.documentElement.classList.add("dark-theme");
      const icon = document.querySelector(".themeIcon"); 
      if (icon) {
        icon.classList.remove("bi-moon");
        icon.classList.add("bi-brightness-high");
      }
    }
  });
  function navbarChangeIcon() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const icon = navbarToggler.querySelector('i');
    if (navbarToggler && icon) {
      navbarToggler.addEventListener('click', () => {
        if (icon.classList.contains('bi-list')) {
          icon.classList.remove('bi-list');
          icon.classList.add('bi-x-circle');
        } else {
          icon.classList.remove('bi-x-circle');
          icon.classList.add('bi-list');
        }
      });
    }
  }

  function showToastCopy() {
    var toastEl = document.getElementById('ToastShowCopy');
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
}
  
  function openPopup(url, width, height) {
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
  }
  
  function SetActiveIconBarBlogDetail() {
    const iconBar = document.querySelectorAll('.icon-bar a');
    if (iconBar.length > 0) {
    iconBar.forEach((item) => {
      item.addEventListener('click', function() {
        iconBar.forEach((el) => el.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  }
  
  function copyLinkPost() {
    const ElementClick = document.querySelector('.icon-bar .copy-link-post');
    if (ElementClick) {
      ElementClick.addEventListener('click', function(event) {
        const linkToCopy = window.location.href;
        navigator.clipboard.writeText(linkToCopy).then(function() {
          showToastCopy();
        }, function(err) {
          console.error('Không copy được', err);
        });
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    SetActiveIconBarBlogDetail();
    copyLinkPost();
    
    let ShareWithFacebookSelector = document.querySelector('.share-with-facebook');
    if (ShareWithFacebookSelector){
      ShareWithFacebookSelector.addEventListener('click', function() {
        const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
        openPopup(url, 600, 400);  
      });
    }
    
    let ShareWithTwitterSelector = document.querySelector('.share-with-twitter');
    if (ShareWithTwitterSelector){
      document.querySelector('.share-with-twitter').addEventListener('click', function() {
        const url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href);
        openPopup(url, 600, 400);  
      });
    }
    
    let ShareWithLinkedInSelector = document.querySelector('.share-with-linkedin');
    if (ShareWithLinkedInSelector){
      document.querySelector('.share-with-linkedin').addEventListener('click', function() {
        const url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href);
        openPopup(url, 600, 400);  
      });
    }
    
  });
  
  document.addEventListener("DOMContentLoaded", navbarChangeIcon);

