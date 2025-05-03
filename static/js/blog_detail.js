  // function fetchProfilePage_Blog_detail(title_blogs) {
  //   fetchWithRetry(`${CONFIG.BASE_URL}/profile`)
  //     .then((data) => {
  //       // Profile image
  //       const profileImg = document.querySelector(".profile-img img");
  //       if (profileImg) profileImg.src = data.avatar || "";

  //       // Social links
  //       const socialMappings = [
  //         { selector: ".social-links .twitter", key: "x_link" },
  //         { selector: ".social-links .facebook", key: "facebook_link" },
  //         { selector: ".social-links .instagram", key: "instagram_link" },
  //         { selector: ".social-links .github", key: "github_link" },
  //         { selector: ".social-links .linkedin", key: "linkedin_link" },
  //       ];

  //       socialMappings.forEach((item) => {
  //         const el = document.querySelector(item.selector);
  //         if (el) el.href = data[item.key] || "#";
  //       });
  //       document.title = title_blogs + " | " + data.title
  //     })
  //     .catch((error) =>
  //       console.error("Error loading profile after retry:", error)
  //     );
  // }
  function initializeTableOfContents() {
    const headers = document.querySelectorAll(".blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5");
    if (headers.length === 0) return;
    headers.forEach(header => {
      const level = parseInt(header.tagName.substring(1));
      const safeId = header.id || header.textContent
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/[0-9.,]/g, '');
      header.id = safeId;
    });
    //  //   // Initialize tocbot for mobile view
    tocbot.init({
      tocSelector: '.toc-js-automate-mobile',
      contentSelector: '.blog-content',
      headingSelector: 'h2, h3, h4',
      collapseDepth: 6,
      scrollSmooth: false,
      hasInnerContainers: true,
      orderedList: false,
    });
    tocbot.init({
      tocSelector: '.toc-js-automate',
      contentSelector: '.blog-content',
      headingSelector: 'h2, h3, h4',
      collapseDepth: 6,
      scrollSmooth: false,
      scrollSmoothDuration: 400,
      headingsOffset: 0,
      hasInnerContainers: true,
      orderedList: false,
    });
    
  }
  // function fetchRelatedBlogs(blogId) {
  //   fetchWithRetry(`${CONFIG.BASE_URL}/blogs/${blogId}/related`)
  //     .then(data => {
  //       const relatedContentContainer = document.querySelector('.related-scroll .d-flex');
  //       relatedContentContainer.innerHTML = ''; // Clear existing related content
  //       related_list = data.blogs
  //       related_list.forEach(related => {
  //         const relatedItem = document.createElement('div');
  //         relatedItem.className = 'flex-shrink-0';
  //         relatedItem.style.width = '250px';
  //         relatedItem.innerHTML = `
  //       <div class="related-item text-center position-relative"
  //       style="height: 150px; background-size: cover; background-position: center; background-image: url('${related.image}');">
  //       <a href="/blog/${related.id}/${related.slug}" class="d-flex h-100 w-100 text-decoration-none"
  //         style="font-size: 14px;flex-direction: column; justify-content: flex-end; background: rgba(0, 0, 0, 0.5);padding-bottom: 10%;">
  //         <h5 class="text-white m-0">${related.title}</h5>
  //       </a>
  //       </div>
  //     `;
  //         relatedContentContainer.appendChild(relatedItem);
  //       });
  //     })
  //     .catch(error => console.error('Error fetching related blogs after retry:', error));
  // }
  // function fetchBlogDetail() {
  //   const pathParts = window.location.pathname.split('/');
  //   const blogId = pathParts[2];
  //   const slug = pathParts[3];
  //   fetchWithRetry(`${CONFIG.BASE_URL}/blogs/${blogId}`)
  //     .then(data => {
  //       document.querySelector('.blog-image img').src = data.image;
  //       document.querySelector('.blog-image img').alt = data.title;
  //       document.querySelector('.blog-category .badge').innerText = data.category.name;
  //       // document.querySelector('.blog-category .link-category').href = `/category/${data.category.id}/${data.category.slug}`;
  //       document.querySelector('.blog-title').innerText = data.title;
  //       document.querySelector('.blog-subtitle').innerText = data.description;
  //       document.querySelector('.blog-date small').innerText = new Date(data.created_at).toLocaleDateString();
  //       BlogTagElement = document.querySelector('.blog-tags-show');
  //       BlogTagElement.innerHTML = '';
  //       data.tags.forEach(tag => {
  //         const tagElement = document.createElement('span');
  //         tagElement.className = 'badge me-1 mb-1 px-3 py-2';
  //         tagElement.innerText = tag.name;
  //         BlogTagElement.appendChild(tagElement);
  //       });
  //       const blogContent = document.querySelector('.blog-content');
  //       blogContent.innerHTML = data.body_blog;
  //       fetchProfilePage_Blog_detail(data.title);
  //       fetchRelatedBlogs(blogId);
  //       initializeTableOfContents();
  //     })
  //     .catch(error => console.error('Error fetching blog details after retry:', error));
  // }
document.addEventListener("DOMContentLoaded", function(){
  initializeTableOfContents();
});
