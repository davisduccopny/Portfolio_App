        // experience
    const spinner_form = document.querySelector("#loadingSpinner");
    let toast_show_success;
    let toast_show_error;
    document.addEventListener("DOMContentLoaded", function () {
        const toastSuccess = document.getElementById("toastSuccess");
        toast_show_success = new bootstrap.Toast(toastSuccess);
        const toastError = document.getElementById("toastError");
        toast_show_error = new bootstrap.Toast(toastError);
        const form_client_sent = document.querySelector("#FormContactClient");
        if (form_client_sent) {
            form_client_sent.addEventListener("submit", sendContactForm);
        }
    });
function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
        return fetch(url, options).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).catch(error => {
            if (retries > 0) {
                console.warn(`Retrying... (${3 - retries + 1})`, error);
                return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
                    fetchWithRetry(url, options, retries - 1, delay)
                );
            } else {
                console.error("All retries failed:", error);
                throw error;
            }
        });
}
    
    function fetchExperiences() {
        fetchWithRetry(`${CONFIG.BASE_URL}/experience`) // API lấy kinh nghiệm
            .then(data => {
                const data_experience = data.experiences;
                const experienceContainer = document.querySelector("#resume .row .col-lg-6[data-aos-delay='200']");
                let content = "";
                data_experience.forEach(exp => {
                    content += `
                        <div class="resume-item">
                        <h4>${exp.position}</h4>
                        <h5>${new Date(exp.start_date).getFullYear()} - ${exp.end_date ? new Date(exp.end_date).getFullYear() : "Present"}</h5>
                        <p><em>${exp.company}</em></p>
                            ${exp.description}
                        </div>
                    `;
                });
                let subject = `<h3 class="resume-title">Professional Experience</h3>`
                experienceContainer.innerHTML = subject + content;
            })
            .catch(error => console.error("Error loading experiences after retry:", error));
    }
    
    // education
    function fetchEducation() {
        fetchWithRetry(`${CONFIG.BASE_URL}/education`) // API lấy giáo dục
            .then(data => {
                const data_education = data.education;
                const educationContainer = document.querySelector("#resume .row .col-lg-6[data-aos-delay='100']");
                let content = "";
                data_education.forEach(edu => {
                    content += `
                        <div class="resume-item">
                            <h4>${edu.degree}</h4>
                            <h5>${edu.year}</h5>
                            <p><em>${edu.school}</em></p>
                            <p>${edu.description}</p>
                        </div>
                    `;
                });
                let resume = `<h3 class="resume-title">Sumary</h3>
                                <div class="resume-item pb-0 sumary-cv-class">
                                <h4></h4>
                                <p><em></em></p>
                                <ul>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                                </div>`
                let title_education = `<h3 class="resume-title">Education</h3>`
                educationContainer.innerHTML = resume + title_education + content;
            })
            .catch(error => console.error("Error loading education after retry:", error));
    }
    
    // projects
    function fetchProjects() {
        fetchWithRetry(`${CONFIG.BASE_URL}/projects`) 
            .then(data => {
                const data_projects = data.projects;
                const projectContainer = document.querySelector(".portfolio .isotope-container");
                let content = "";
                data_projects.forEach(project => {
                    content += `
                        <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-${project.category}">
                            <div class="portfolio-content h-100">
                                <img src="${project.image}" class="img-fluid" alt="${project.title}">
                                <div class="portfolio-info">
                                    <h4>${project.title}</h4>
                                    <p>${project.description}</p>
                                    <a href="${project.image}" title="${project.title}" data-gallery="portfolio-gallery-app" class="glightbox preview-link">
                                        <i class="bi bi-zoom-in"></i>
                                    </a>
                                    <a href="portfolio-details.html?project_id=${project.id}" title="More Details" class="details-link">
                                        <i class="bi bi-link-45deg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;        });
                projectContainer.innerHTML = content;
                imagesloaderContainer();
            })
            .catch(error => console.error("Error loading projects after retry:", error));
    }
    // Fetch category projects
    function fetchCategoryProjects() {
        fetchWithRetry(`${CONFIG.BASE_URL}/projects/categories`) // API lấy danh mục dự án
            .then(data => {
                const categoryContainer = document.querySelector(".portfolio-filters");
                let content = `<li data-filter="*" class="filter-active">All</li>`;
                data.forEach(category => {
                    content += `<li data-filter=".filter-${category}">${category}</li>`;
                });
                categoryContainer.innerHTML = content;
            })
            .catch(error => console.error("Error loading categories after retry:", error));
    }
    // skills
    function fetchAndUpdateSkills() {
        fetchWithRetry(`${CONFIG.BASE_URL}/skills`)
            .then(data => updateSkills(data.skills))
            .catch(error => console.error("Error loading skills after retry:", error));
    }
    function updateSkills(skills) {
            const skillsContainer = document.querySelector(".skills-content"); 
            skillsContainer.innerHTML = ""; // Xóa nội dung cũ

            let colDiv = null; // Chứa nhóm 3 kỹ năng
            skills.forEach((skill, index) => {
                if (index % 3 === 0) {
                    colDiv = document.createElement("div");
                    colDiv.classList.add("col-lg-6");
                    skillsContainer.appendChild(colDiv);
                }

                const skillElement = document.createElement("div");
                skillElement.classList.add("progress");
                skillElement.innerHTML = `
                    <span class="skill"><span>${skill.skill}</span> <i class="val">${skill.percentage}%</i></span>
                    <div class="progress-bar-wrap">
                        <div class="progress-bar" role="progressbar" aria-valuenow="${skill.percentage}" 
                            aria-valuemin="0" aria-valuemax="100" style="width: ${skill.percentage}%;">
                        </div>
                    </div>
                `;
                colDiv.appendChild(skillElement); // Thêm skill vào nhóm 3 kỹ năng
            });
    }
        
    // Profile
    function calculateAge(birthdate) {
        if (!birthdate) return "NA";
        const birthYear = new Date(birthdate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }
    // function fetchProfile() {
    //     fetchWithRetry(`${CONFIG.BASE_URL}/profile`)
    //         .then(data => {
    //             // Update summary
    //             const sumaryClass = document.querySelector(".sumary-cv-class");
    //             if (sumaryClass) {
    //                 sumaryClass.querySelector("h4").textContent = data.name || "";
    //                 sumaryClass.querySelector("p em").textContent = data.sumary || "";
    //                 const listItems = sumaryClass.querySelectorAll("ul li");
    //                 if (listItems[0]) listItems[0].textContent = data.address || "";
    //                 if (listItems[1]) listItems[1].textContent = data.phone || "";
    //                 if (listItems[2]) listItems[2].textContent = data.email || "";
    //             }

    //             // Counter
    //             const clientCounter = document.querySelector(".client_counter span");
    //             if (clientCounter) clientCounter.setAttribute("data-purecounter-end", data.clients || 0);
    //             const projectsCounter = document.querySelector(".projects_counter span");
    //             if (projectsCounter) projectsCounter.setAttribute("data-purecounter-end", data.projects || 0);
    //             const hoursCounter = document.querySelector(".hours_counter span");
    //             if (hoursCounter) hoursCounter.setAttribute("data-purecounter-end", data.hours || 0);
    //             const workerCounter = document.querySelector(".worker_counter span");
    //             if (workerCounter) workerCounter.setAttribute("data-purecounter-end", data.workers || 0);

    //             // Personal information
    //             const birthdayInfo = document.querySelector(".birthday_info span");
    //             if (birthdayInfo) birthdayInfo.textContent = data.birthdate || "N/A";
    //             const websiteInfo = document.querySelector(".website_info span");
    //             if (websiteInfo) websiteInfo.textContent = data.website || "N/A";
    //             const phoneInfo = document.querySelector(".phone_info span");
    //             if (phoneInfo) phoneInfo.textContent = data.phone || "N/A";
    //             const cityInfo = document.querySelector(".city_info span");
    //             if (cityInfo) cityInfo.textContent = data.address || "N/A";
    //             const ageInfo = document.querySelector(".age_info span");
    //             if (ageInfo) ageInfo.textContent = calculateAge(data.birthdate);
    //             const degreeInfo = document.querySelector(".degree_info span");
    //             if (degreeInfo) degreeInfo.textContent = data.degree || "N/A";
    //             const emailInfo = document.querySelector(".email_info span");
    //             if (emailInfo) emailInfo.textContent = data.email || "N/A";
    //             const freelanceInfo = document.querySelector(".freelance_info span");
    //             if (freelanceInfo) freelanceInfo.textContent = data.freelance || "N/A";

    //             // Description
    //             const aboutDes1 = document.querySelector(".about_des_01");
    //             if (aboutDes1) aboutDes1.textContent = data.des_about_1 || "";
    //             const aboutDes2 = document.querySelector(".about_des_02");
    //             if (aboutDes2) aboutDes2.textContent = data.des_about_2 || "";
    //             const resumeSectionTitle = document.querySelector(".resume .section-title p");
    //             if (resumeSectionTitle) resumeSectionTitle.textContent = data.des_about_3 || "";

    //             // Main profile updates
    //             const siteName = document.querySelector(".sitename");
    //             if (siteName) siteName.textContent = data.name || "";
    //             const heroName = document.querySelector(".hero h2");
    //             if (heroName) heroName.textContent = data.name || "";
    //             const titlePageGross = document.querySelector(".title_page_gross");
    //             if (titlePageGross) titlePageGross.textContent = data.title || "";
    //             const heroTyped = document.querySelector(".hero p .typed");
    //             if (heroTyped) heroTyped.setAttribute("data-typed-items", data.title || "");
    //             const heroImage = document.querySelector(".hero img");
    //             if (heroImage) heroImage.src = data.background || "";
    //             const profileImg = document.querySelector(".profile-img img");
    //             if (profileImg) profileImg.src = data.avatar || "";
    //             const aboutImageContainer = document.querySelector(".image-container-about");
    //             if (aboutImageContainer) aboutImageContainer.src = data.avatar || "";
    //             const aboutContentTitle = document.querySelector("#about .content h2");
    //             if (aboutContentTitle) aboutContentTitle.textContent = data.title || "";
    //             const aboutSectionTitle = document.querySelector("#about .section-title p");
    //             if (aboutSectionTitle) aboutSectionTitle.textContent = data.about || "";
    //             const contactAddress = document.querySelector("#contact .info-item p");
    //             if (contactAddress) contactAddress.textContent = data.address || "";
    //             const contactPhone = document.querySelector("#contact .info-item:nth-child(2) p");
    //             if (contactPhone) contactPhone.textContent = data.phone || "";
    //             const contactEmail = document.querySelector("#contact .info-item:nth-child(3) p");
    //             if (contactEmail) contactEmail.textContent = data.email || "";
    //             const contactMap = document.querySelector("#contact iframe");
    //             if (contactMap) contactMap.src = data.google_map || "";

    //             // Social network
    //             const twitterLink = document.querySelector(".social-links .twitter");
    //             if (twitterLink) twitterLink.href = data.x_link || "#";
    //             const facebookLink = document.querySelector(".social-links .facebook");
    //             if (facebookLink) facebookLink.href = data.facebook_link || "#";
    //             const instagramLink = document.querySelector(".social-links .instagram");
    //             if (instagramLink) instagramLink.href = data.instagram_link || "#";
    //             const githubLink = document.querySelector(".social-links .github");
    //             if (githubLink) githubLink.href = data.github_link || "#";
    //             const linkedinLink = document.querySelector(".social-links .linkedin");
    //             if (linkedinLink) linkedinLink.href = data.linkedin_link || "#";
    //         })
    //         .catch(error => console.error("Error loading profile after retry:", error));
    // }
    function fetchProfile() {
        fetchWithRetry(`${CONFIG.BASE_URL}/profile`)
            .then(data => {
                // Mapping text content
                const mappings = [
                    { selector: ".phone_info span", key: "phone" },
                    { selector: ".email_info span", key: "email" },
                    { selector: ".birthday_info span", key: "birthdate" },
                    { selector: ".website_info span", key: "website" },
                    { selector: ".city_info span", key: "address" },
                    { selector: ".degree_info span", key: "degree" },
                    { selector: ".freelance_info span", key: "freelance" },
                    { selector: ".about_des_01", key: "des_about_1" },
                    { selector: ".about_des_02", key: "des_about_2" },
                    { selector: ".resume .section-title p", key: "des_about_3" },
                    { selector: ".sitename", key: "name" },
                    { selector: ".hero h2", key: "name" },
                    { selector: ".title_page_gross", key: "title" },
                    { selector: "#about .content h2", key: "title" },
                    { selector: "#about .section-title p", key: "about" },
                    { selector: "#contact .info-item p", key: "address" },
                    { selector: "#contact .info-item:nth-child(2) p", key: "phone" },
                    { selector: "#contact .info-item:nth-child(3) p", key: "email" }
                ];
    
                mappings.forEach(item => {
                    const el = document.querySelector(item.selector);
                    if (el) {
                        if (item.key.startsWith("des_about") || item.key === "about") {
                            el.innerHTML = data[item.key] || "N/A";
                        } else {
                            el.textContent = data[item.key] || "N/A";
                        }
                    }
                });
    
                // Set birthdate
                const ageInfo = document.querySelector(".age_info span");
                if (ageInfo) ageInfo.textContent = calculateAge(data.birthdate);
    
                // Counter
                const counters = [
                    { selector: ".client_counter span", key: "clients" },
                    { selector: ".projects_counter span", key: "projects" },
                    { selector: ".hours_counter span", key: "hours" },
                    { selector: ".worker_counter span", key: "workers" }
                ];
    
                counters.forEach(item => {
                    const el = document.querySelector(item.selector);
                    if (el) el.setAttribute("data-purecounter-end", data[item.key] || 0);
                });
    
                // Sumary block 
                const summary = document.querySelector(".sumary-cv-class");
                if (summary) {
                    summary.querySelector("h4").textContent = data.name || "";
                    summary.querySelector("p em").innerHTML = data.sumary || "";
                    const listItems = summary.querySelectorAll("ul li");
                    if (listItems[0]) listItems[0].textContent = data.address || "";
                    if (listItems[1]) listItems[1].textContent = data.phone || "";
                    if (listItems[2]) listItems[2].textContent = data.email || "";
                }
                else{
                    console.error("Summary element not found in the DOM.");
                }
    
                // Hình ảnh
                const heroImage = document.querySelector(".hero img");
                if (heroImage) heroImage.src = data.background || "";
    
                const profileImg = document.querySelector(".profile-img img");
                if (profileImg) profileImg.src = data.avatar || "";
    
                const aboutImageContainer = document.querySelector(".image-container-about");
                if (aboutImageContainer) aboutImageContainer.src = data.avatar || "";
    
                // Hero Typed
                const heroTyped = document.querySelector(".hero p .typed");
                if (heroTyped) heroTyped.setAttribute("data-typed-items", data.title || "");
    
                // Google Map
                const contactMap = document.querySelector("#contact iframe");
                if (contactMap) contactMap.src = data.google_map || "";
    
                // Social links
                const socialMappings = [
                    { selector: ".social-links .twitter", key: "x_link" },
                    { selector: ".social-links .facebook", key: "facebook_link" },
                    { selector: ".social-links .instagram", key: "instagram_link" },
                    { selector: ".social-links .github", key: "github_link" },
                    { selector: ".social-links .linkedin", key: "linkedin_link" }
                ];
    
                socialMappings.forEach(item => {
                    const el = document.querySelector(item.selector);
                    if (el) el.href = data[item.key] || "#";
                });
            })
            .catch(error => console.error("Error loading profile after retry:", error));
    }
    
    function sendContactForm(event) {
        event.preventDefault();
        if (spinner_form) {
            spinner_form.classList.remove("d-none");
        }
        const form = document.querySelector("#FormContactClient");
        const formData = new FormData(form);
        fetch(`${CONFIG.BASE_URL}/contact`, {
            method: "POST",
            body: formData,
        })
            .then(response =>
            {
                if (response.status == 200){
                    toast_show_success.show();
                    form.reset();
                }
                else{
                    toast_show_error.show();
                }
            }
            )
            .catch(error => console.error("Error sending message:", error))
            .finally(() => {
                if (spinner_form) {
                    spinner_form.classList.add("d-none");
                }
            });
    }
// INIT ISOTOPE BEFORE LOAD CONTENT
/**
 * Init isotope layout and filters
 */
function imagesloaderContainer() {
    document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
      let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
      let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";
  
      let initIsotope;
      imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
        initIsotope = new Isotope(
          isotopeItem.querySelector(".isotope-container"),
          {
            itemSelector: ".isotope-item",
            layoutMode: layout,
            filter: filter,
            sortBy: sort,
          }
        );
        // ✅ GẮN SỰ KIỆN SAU KHI ISOTOPE ĐƯỢC KHỞI TẠO
        isotopeItem
          .querySelectorAll(".isotope-filters li")
          .forEach(function (filters) {
            console.log(filters);
            filters.addEventListener(
              "click",
              function () {
                isotopeItem
                  .querySelector(".isotope-filters .filter-active")
                  .classList.remove("filter-active");
                this.classList.add("filter-active");
                initIsotope.arrange({
                  filter: this.getAttribute("data-filter"),
                });
  
                if (typeof aosInit === "function") {
                  aosInit();
                }
              },
              false
            );
          });
      });
    });
  }
  // INIT ISOTOPE LAYOUT
fetchCategoryProjects();
fetchExperiences();
fetchEducation();
fetchProjects();
fetchAndUpdateSkills();
window.addEventListener("load", function () {
    fetchProfile();
});