// const spinner = document.querySelector("#loadingSpinner");
// let PAGINATION = {
//   currentPage_blogs: 1,
//   currentPage_blogs_categories: 1,
//   currentPage_blogs_tags: 1,
//   currentPage_blogs_search: 1,
// };
// const PAGESIZE = {
//   blogs: 5,
// };
// document.addEventListener("DOMContentLoaded", function () {
//   fetchProfilePage();
//   fetchBlogsClient(PAGINATION.currentPage_blogs);
//   fetchCategories();
//   fetchTags();
//   document
//     .querySelector("#search-input")
//     .addEventListener("keypress", (event) => {
//       if (event.key === "Enter") {
//         const query = event.target.value.trim();
//         if (query.length > 0) {
//           fetchBlogsBySearch(query, PAGINATION.currentPage_blogs_search);
//         } else {
//           fetchBlogsClient(PAGINATION.currentPage_blogs);
//         }
//       }
//     });
// });
// function fetchBlogsClient(page = PAGINATION.currentPage_blogs) {
//   const limit = PAGESIZE.blogs;
//   const offset = limit > 0 ? (page - 1) * limit : 0;

//   if (spinner) {
//     spinner.classList.remove("d-none");
//   }
//   fetchWithRetry(`${CONFIG.BASE_URL}/blogs?limit=${limit}&offset=${offset}`)
//     .then((data) => {
//       const blogs = data.blogs;
//       const blogsContainer = document.querySelector("#blog .row.gy-3");
//       let content = "";
//       blogs.forEach((blog) => {
//         content += `
//                 <div class="col-12 position-relative" data-target-id="${
//                   blog.id
//                 }">
//                     <div class="blog-item d-flex align-items-center p-3 shadow-sm rounded-3">
//                         <div class="blog-thumbnail flex-shrink-0 me-3">
//                             <img src="${blog.image}" alt="Blog Thumbnail"
//                                 class="img-fluid rounded-3"
//                                 style="width: 120px; height: 80px; object-fit: cover;">
//                         </div>
//                         <div class="blog-content">
//                             <h5 class="blog-title"><a href="/blog/${blog.id}/${
//           blog.slug
//         }" class="stretched-link">${blog.title}</a></h5>
//                             <p class="blog-description text-muted-custome" style="font-size: 0.9rem;">${blog.description.substring(
//                               0,
//                               100
//                             )}</p>
//                         </div>
//                     </div>
//                 </div>`;
//       });
//       blogsContainer.innerHTML = content;

//       const titleSet = document.querySelector("#blog .title-blog-head h2");
//       if (titleSet) {
//         titleSet.innerHTML = `Blogs`;
//       }
//       const totalItems = document.querySelector("#blog .title-blog-head p");
//       if (totalItems) {
//         totalItems.innerHTML = `Explore our latest articles, insights, and updates. Stay
//                                 informed and inspired with our
//                                 curated
//                                 content.`;
//       }
//       // Cập nhật phân trang
//       if (PAGESIZE.blogs == 0) {
//         renderPagination(
//           "pagination-blogs",
//           data.total,
//           page,
//           data.total,
//           (selectedPage) => {
//             PAGINATION.currentPage_blogs = selectedPage;
//             fetchBlogsClient(selectedPage);
//           }
//         );
//       } else {
//         renderPagination(
//           "pagination-blogs",
//           data.total,
//           page,
//           PAGESIZE.blogs,
//           (selectedPage) => {
//             PAGINATION.currentPage_blogs = selectedPage;
//             fetchBlogsClient(selectedPage);
//           }
//         );
//       }

//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     })
//     .catch((error) => console.error("Error loading blogs after retry:", error))
//     .finally(() => {
//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     });
// }
// function fetchCategories() {
//   const categoriesContainer = document.querySelector(".categories ul");
//   if (!categoriesContainer) return;

//   fetchWithRetry(`${CONFIG.BASE_URL}/blogs/categories`)
//     .then((data) => {
//       let content = "";
//       data.forEach((category) => {
//         content += `<li><a href="#" class="btn btn-outline-secondary btn-sm" data-category-id="${category.id}">${category.name}</a></li>`;
//       });
//       categoriesContainer.innerHTML = content;

//       // Attach event listeners to category buttons
//       categoriesContainer
//         .querySelectorAll("a[data-category-id]")
//         .forEach((link) => {
//           link.addEventListener("click", (event) => {
//             event.preventDefault();
//             const categoryId = link.dataset.categoryId;
//             const categoryName = link.innerText;
//             fetchBlogsByCategory(
//               categoryId,
//               categoryName,
//               PAGINATION.currentPage_blogs_categories
//             );
//           });
//         });
//     })
//     .catch((error) => console.error("Error loading categories:", error));
// }
// function fetchBlogsByCategory(categoryId, categoryName, page) {
//   const limit = PAGESIZE.blogs;
//   const offset = limit > 0 ? (page - 1) * limit : 0;

//   if (spinner) {
//     spinner.classList.remove("d-none");
//   }

//   fetchWithRetry(
//     `${CONFIG.BASE_URL}/blogs/filter-blogs-category/${categoryId}?limit=${limit}&offset=${offset}`
//   )
//     .then((data) => {
//       const blogs = data.blogs;
//       const blogsContainer = document.querySelector("#blog .row.gy-3");
//       let content = "";
//       blogs.forEach((blog) => {
//         content += `
//                 <div class="col-12 position-relative" data-target-id="${
//                   blog.id
//                 }">
//                     <div class="blog-item d-flex align-items-center p-3 shadow-sm rounded-3">
//                         <div class="blog-thumbnail flex-shrink-0 me-3">
//                             <img src="${blog.image}" alt="Blog Thumbnail"
//                                 class="img-fluid rounded-3"
//                                 style="width: 120px; height: 80px; object-fit: cover;">
//                         </div>
//                         <div class="blog-content">
//                             <h5 class="blog-title"><a href="/blog/${blog.id}/${
//           blog.slug
//         }" class="stretched-link">${blog.title}</a></h5>
//                             <p class="blog-description text-muted-custome" style="font-size: 0.9rem;">${blog.description.substring(
//                               0,
//                               100
//                             )}</p>
//                         </div>
//                     </div>
//                 </div>`;
//       });
//       blogsContainer.innerHTML = content;
//       const titleSet = document.querySelector("#blog .title-blog-head h2");
//       if (titleSet) {
//         titleSet.innerHTML = `${categoryName}`;
//       }
//       const totalItems = document.querySelector("#blog .title-blog-head p");
//       if (totalItems) {
//         totalItems.innerHTML = `${data.total} PAGES`;
//       }

//       // Update pagination
//       renderPagination(
//         "pagination-blogs",
//         data.total,
//         page,
//         PAGESIZE.blogs,
//         (selectedPage) => {
//           fetchBlogsByCategory(categoryId, categoryName, selectedPage);
//         }
//       );

//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     })
//     .catch((error) => console.error("Error loading blogs by category:", error))
//     .finally(() => {
//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     });
// }
// function fetchTags() {
//   const tagsContainer = document.querySelector(".Tags ul");
//   if (!tagsContainer) return;

//   fetchWithRetry(`${CONFIG.BASE_URL}/blogs/tags`)
//     .then((data) => {
//       let content = "";
//       data.forEach((tag) => {
//         content += `<li><a href="#" class="btn btn-outline-secondary btn-sm" data-tag-id="${tag.id}">${tag.name}</a></li>`;
//       });
//       tagsContainer.innerHTML = content;

//       // Attach event listeners to tag buttons
//       tagsContainer.querySelectorAll("a[data-tag-id]").forEach((link) => {
//         link.addEventListener("click", (event) => {
//           event.preventDefault();
//           const tagId = link.dataset.tagId;
//           const tagName = link.innerText;
//           fetchBlogsByTag(tagId, tagName, PAGINATION.currentPage_blogs_tags);
//         });
//       });
//     })
//     .catch((error) => console.error("Error loading tags:", error));
// }
// function fetchBlogsByTag(tagId, tagName, page) {
//   const limit = PAGESIZE.blogs;
//   const offset = limit > 0 ? (page - 1) * limit : 0;

//   if (spinner) {
//     spinner.classList.remove("d-none");
//   }

//   fetchWithRetry(
//     `${CONFIG.BASE_URL}/blogs/filter-blogs-tag/${tagId}?limit=${limit}&offset=${offset}`
//   )
//     .then((data) => {
//       const blogs = data.blogs;
//       const blogsContainer = document.querySelector("#blog .row.gy-3");
//       let content = "";
//       blogs.forEach((blog) => {
//         content += `
//                 <div class="col-12 position-relative" data-target-id="${
//                   blog.id
//                 }">
//                     <div class="blog-item d-flex align-items-center p-3 shadow-sm rounded-3">
//                         <div class="blog-thumbnail flex-shrink-0 me-3">
//                             <img src="${blog.image}" alt="Blog Thumbnail"
//                                 class="img-fluid rounded-3"
//                                 style="width: 120px; height: 80px; object-fit: cover;">
//                         </div>
//                         <div class="blog-content">
//                             <h5 class="blog-title"><a href="/blog/${blog.id}/${
//           blog.slug
//         }" class="stretched-link">${blog.title}</a></h5>
//                             <p class="blog-description text-muted-custome" style="font-size: 0.9rem;">${blog.description.substring(
//                               0,
//                               100
//                             )}</p>
//                         </div>
//                     </div>
//                 </div>`;
//       });
//       blogsContainer.innerHTML = content;
//       const titleSet = document.querySelector("#blog .title-blog-head h2");
//       if (titleSet) {
//         titleSet.innerHTML = `${tagName}`;
//       }
//       const totalItems = document.querySelector("#blog .title-blog-head p");
//       if (totalItems) {
//         totalItems.innerHTML = `${data.total} PAGES`;
//       }

//       // Update pagination
//       renderPagination(
//         "pagination-blogs",
//         data.total,
//         page,
//         PAGESIZE.blogs,
//         (selectedPage) => {
//           fetchBlogsByTag(tagId, tagName, selectedPage);
//         }
//       );

//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     })
//     .catch((error) => console.error("Error loading blogs by tag:", error))
//     .finally(() => {
//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     });
// }
// function fetchBlogsBySearch(query, page) {
//   const limit = PAGESIZE.blogs;
//   const offset = limit > 0 ? (page - 1) * limit : 0;

//   if (spinner) {
//     spinner.classList.remove("d-none");
//   }

//   fetchWithRetry(
//     `${CONFIG.BASE_URL}/blogs/filter-blogs-search-string/${query}?limit=${limit}&offset=${offset}`
//   )
//     .then((data) => {
//       const blogs = data.blogs;
//       const blogsContainer = document.querySelector("#blog .row.gy-3");
//       let content = "";
//       blogs.forEach((blog) => {
//         content += `
//                 <div class="col-12 position-relative" data-target-id="${
//                   blog.id
//                 }">
//                     <div class="blog-item d-flex align-items-center p-3 shadow-sm rounded-3">
//                         <div class="blog-thumbnail flex-shrink-0 me-3">
//                             <img src="${blog.image}" alt="Blog Thumbnail"
//                                 class="img-fluid rounded-3"
//                                 style="width: 120px; height: 80px; object-fit: cover;">
//                         </div>
//                         <div class="blog-content">
//                             <h5 class="blog-title"><a href="/blog/${blog.id}/${
//           blog.slug
//         }" class="stretched-link">${blog.title}</a></h5>
//                             <p class="blog-description text-muted-custome" style="font-size: 0.9rem;">${blog.description.substring(
//                               0,
//                               100
//                             )}</p>
//                         </div>
//                     </div>
//                 </div>`;
//       });
//       blogsContainer.innerHTML = content;

//       const titleSet = document.querySelector("#blog .title-blog-head h2");
//       if (titleSet) {
//         titleSet.innerHTML = `Search Results for "${query}"`;
//       }
//       const totalItems = document.querySelector("#blog .title-blog-head p");
//       if (totalItems) {
//         totalItems.innerHTML = `${data.total} Results Found`;
//       }

//       // Update pagination
//       renderPagination(
//         "pagination-blogs",
//         data.total,
//         page,
//         PAGESIZE.blogs,
//         (selectedPage) => {
//           fetchBlogsBySearch(query, selectedPage);
//         }
//       );

//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     })
//     .catch((error) => console.error("Error loading blogs by search:", error))
//     .finally(() => {
//       if (spinner) {
//         spinner.classList.add("d-none");
//       }
//     });
// }
// function renderPagination(
//   containerId,
//   totalItems,
//   currentPage,
//   pageSize,
//   fetchFunction
// ) {
//   const totalPages = Math.ceil(totalItems / pageSize);
//   const pagination = document.getElementById(containerId);
//   pagination.innerHTML = "";

//   const createPageItem = (
//     label,
//     page,
//     isDisabled = false,
//     isActive = false
//   ) => {
//     if (isDisabled) {
//       return `<li><span class="btn btn-outline-secondary px-3 py-1 disabled">${label}</span></li>`;
//     }
//     return `<li><a href="#" class="btn btn-outline-secondary px-3 py-1 ${
//       isActive ? "active" : ""
//     }" data-page="${page}">${label}</a></li>`;
//   };

//   for (let i = 1; i <= totalPages; i++) {
//     if (totalPages > 5) {
//       if (
//         i === 1 ||
//         i === totalPages ||
//         (i >= currentPage - 1 && i <= currentPage + 1)
//       ) {
//         pagination.innerHTML += createPageItem(i, i, false, i === currentPage);
//       } else if (i === currentPage - 2 || i === currentPage + 2) {
//         pagination.innerHTML += createPageItem("...", null, true);
//       }
//     } else {
//       pagination.innerHTML += createPageItem(i, i, false, i === currentPage);
//     }
//   }

//   // Attach event listeners
//   pagination.querySelectorAll("a[data-page]").forEach((link) => {
//     link.addEventListener("click", (event) => {
//       event.preventDefault();
//       const selectedPage = parseInt(link.dataset.page);
//       if (!isNaN(selectedPage)) {
//         fetchFunction(selectedPage);
//       }
//     });
//   });
// }
// function fetchP -0rofilePage() {
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
//     })
//     .catch((error) =>
//       console.error("Error loading profile after retry:", error)
//     );
// }
