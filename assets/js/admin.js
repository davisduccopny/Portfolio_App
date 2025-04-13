// Author: Hoang Xuan Quoc
// ---- SET CONFIG ----
let SETUP_SECURE ={
    token: '',
}
let PAGINATION = {
    currentPage_blogs: 1,
    currentPage_testimonials: 1,
    currentPage_contact: 1,
    currentPage_experience: 1,
    currentPage_education: 1,
    currentPage_projects: 1,
    currentPage_skills: 1,
}
const spinner = document.querySelector("#loadingSpinner");
const PAGESIZE = {
    blogs: 5,
    testimonials: 5,
    contact: 5,
    experience: 5,
    education: 5,
    projects: 5,
    skills: 5,
}
// ---- CONFIG LOGIN ----

document.addEventListener("DOMContentLoaded", function () {
    SETUP_SECURE.token = localStorage.getItem("token_authorized_admin");
    if (!SETUP_SECURE.token) {
        window.location.href = `${CONFIG.LOGIN_URL}`;
    } else {
        fetch(`${CONFIG.BASE_URL}/verify_token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SETUP_SECURE.token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            else{
                document.body.style.display = "block";
            }
        })
        .catch(error => {
            window.location.href = `${CONFIG.LOGIN_URL}`;
        });
    }
});

// ---- SET PAGESIZE CHANGE----
const setupPageSizeChange = (id, key, fetchFunction) => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("change", function () {
            const selectedValue = parseInt(this.value);
            PAGESIZE[key] = selectedValue;
            PAGINATION[`currentPage_${key}`] = 1;
            fetchFunction();
        });
    }
};

setupPageSizeChange("select-page-size-blogs", "blogs", fetchBlogs);
setupPageSizeChange("select-page-size-testimonials", "testimonials", fetchTestimonials);
setupPageSizeChange("select-page-size-contacts", "contact", fetchContactForm);
setupPageSizeChange("select-page-size-experiences", "experience", fetchExperiences);
setupPageSizeChange("select-page-size-educations", "education", fetchEducation);
setupPageSizeChange("select-page-size-projects", "projects", fetchProjects);
setupPageSizeChange("select-page-size-skills", "skills", fetchSkill);

// ---- SET FETCH WITH RETRY----

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
// ---- SET THEME ----
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('dark-mode');
    document.getElementById("toggleTheme").addEventListener("click", function() {
        let body = document.body;
        let themeIcon = document.getElementById("themeIcon");
        if (body.dataset.bsTheme === "dark") {
            body.dataset.bsTheme = "light";
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
            document.body.classList.remove('dark-mode');
        } else {
            body.dataset.bsTheme = "dark";
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
            document.body.classList.add('dark-mode');
        }
    });
});
// ---- SET ACTIVE NAVBAR ----
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const forms = document.querySelectorAll(".admin-form");
    const activeItem = localStorage.getItem("activeNavItem");
    let themeIcon = document.getElementById("themeIcon");
    if (activeItem) {
        navLinks.forEach(link => {
            link.classList.remove("active", "bg-info","bg-opacity-10","border-bottom","border-2", "border-info","rounded-1");
            if (link.dataset.form === activeItem) {
                link.classList.add("active", "bg-info","bg-opacity-10","border-bottom","border-2","border-info","rounded-1");
            }
        });
        forms.forEach(form => form.classList.add("d-none"));
        document.getElementById(activeItem)?.classList.remove("d-none");
    }
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            forms.forEach(form => form.classList.add("d-none"));
            document.getElementById(this.dataset.form)?.classList.remove("d-none");
            navLinks.forEach(nav => nav.classList.remove("active", "bg-info","bg-opacity-10","border-bottom","border-2", "border-info","rounded-1"));
            this.classList.add("active", "bg-info","bg-opacity-10","border-bottom" ,"border-2", "border-info","rounded-1");
            localStorage.setItem("activeNavItem", this.dataset.form);
        });
    });
});
// ---- SET FORM ADD ----
document.addEventListener("DOMContentLoaded", function () {
// Xử lý nút Add để hiển thị form
    document.querySelectorAll(".add-form").forEach(button => {
        button.addEventListener("click", function () {
            let targetForm = document.querySelector(this.getAttribute("data-target"));
            if (targetForm) {
                targetForm.classList.remove("d-none");
                targetForm.reset(); 
                targetForm.querySelectorAll("textarea").forEach(textarea => {
                    if ($(textarea).hasClass("summernote")) {
                        if ($(textarea).data('summernote')) {
                            $(textarea).summernote('code', '');
                        }
                    }
                });
                if (targetForm.querySelector("img")) {
                    targetForm.querySelectorAll("img").forEach(img => {
                        img.src = ""; 
                    });
                }
                targetForm.removeAttribute("data-id");
            }
        });
    });

    // Xử lý nút Cancel để ẩn form
    document.querySelectorAll(".cancel-form").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            let parentForm = this.closest(".show-form-add");
            if (parentForm) {
                parentForm.classList.add("d-none"); 
                parentForm.reset();
                parentForm.querySelectorAll("textarea").forEach(textarea => {
                    if ($(textarea).hasClass("summernote")) {
                        if ($(textarea).data('summernote')) {
                            $(textarea).summernote('code', '');
                        }
                    }
                }); 
                if (parentForm.querySelector("img")) {
                    parentForm.querySelectorAll("img").forEach(img => {
                        img.src = ""; 
                    });
                }
                parentForm.removeAttribute("data-id"); 
            }
        });
    });

});
// ---- SET FORM ACTION ----
let toast_show_success;
let toast_show_error;
document.addEventListener("DOMContentLoaded", function () {
    // Define toast
    const toastSuccess = document.getElementById("toastSuccess");
    toast_show_success = new bootstrap.Toast(toastSuccess);
    const toastError = document.getElementById("toastError");
    toast_show_error = new bootstrap.Toast(toastError);
    // Define textarea
    const textAreas = ["about", "sumary", "des_about_1", "des_about_2", "des_about_3", "des_about_4", "description_edu", "description_project", "description_experience","body_blog_text"];
    textAreas.forEach(id => {
        $(`#${id}`).summernote({
            placeholder: 'Write here...',
            tabsize: 2,
            height: 100,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']], 
                ['font', ['fontname', 'fontsize', 'color','forecolor','backcolor']], 
                ['para', ['ul', 'ol', 'paragraph', 'align', 'height']], 
                ['insert', ['link', 'picture', 'video', 'hr']],  
                ['table', ['table']],  
                ['misc', ['fullscreen', 'codeview', 'undo', 'redo', 'help']],
            ],
            callbacks: {
                onPaste: function(e) {
                    setTimeout(() => {
                      document.querySelectorAll('.note-editable img').forEach(img => {
                        img.classList.add('img-fluid');
                      });
                    }, 100);
                  }
            }

        });
    });

    fetchSkill();
    fetchEducation();
    fetchProjects();
    fetchExperiences();
    getDataAPiProfile();
    fetchContactForm();
    fetchTestimonials();
    fetchBlogs();

    document.querySelector("#projectForm").addEventListener("submit", function (event) {
        async function ChangeProjectCommit(event) {
            event.preventDefault();
            if (spinner) {
                spinner.classList.remove("d-none");
            }
            try {
                let form = document.getElementById("projectForm");
                const projectId = form.getAttribute("data-id");
                let url = `${CONFIG.BASE_URL}/projects`;
                let method = "POST";

                if (projectId) {
                    url = `${CONFIG.BASE_URL}/projects/${projectId}`;
                    method = "PUT";
                }
                const formData = new FormData(form);
                let imageFile = document.querySelector("[name='image']").files[0];
                if (imageFile) {
                    formData.append("image", imageFile);
                }
                const textAreas = ["description_project"];
                textAreas.forEach(id => {
                    if ($(`#${id}`).summernote) {
                        formData.append(id, $(`#${id}`).summernote('code'));
                    }
                });

                // Gửi request
                const response = await fetch(url, {
                    method: method,
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${SETUP_SECURE.token}`
                    }
                });

                // Kiểm tra nếu request thất bại
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if (response.status === 401) {
                    window.location.href = `${CONFIG.LOGIN_URL}`;
                }
                const data = await response.json();
                toast_show_success.show();
                console.log("Success:", data);
                fetchProjects();
                form.reset();
                form.classList.add("d-none");
                form.removeAttribute("data-id");

            } catch (error) {
                console.error("Error:", error);
                toast_show_error.show();
            }
            finally {
                if (spinner) {
                    spinner.classList.add("d-none");
                }
            }
        }

        ChangeProjectCommit(event);
    });
    document.querySelector("#BlogsForm",).addEventListener("submit", function (event) {
        async function changeBlogsSubmit(event){
            event.preventDefault();
            if (spinner){
                spinner.classList.remove("d-none");
            }
            try {
                let form = document.getElementById("BlogsForm");
                const BlogId = form.getAttribute("data-id");
                let url = `${CONFIG.BASE_URL}/blogs`;
                let method = "POST";

                if (BlogId) {
                    url = `${CONFIG.BASE_URL}/blogs/${BlogId}`;
                    method = "PUT";
                }
                const formData = new FormData(form);
                let imageFile = document.querySelector("[name='image']").files[0];
                if (imageFile) {
                    formData.append("image", imageFile);
                }
                const textAreas = ["body_blog_text"];
                textAreas.forEach(id => {
                    if ($(`#${id}`).summernote) {
                        formData.append(id, $(`#${id}`).summernote('code'));
                    }
                });

                // Gửi request
                const response = await fetch(url, {
                    method: method,
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${SETUP_SECURE.token}`
                    }
                });

                // Kiểm tra nếu request thất bại
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if (response.status === 401) {
                    window.location.href = `${CONFIG.LOGIN_URL}`;
                }
                const data = await response.json();
                toast_show_success.show();
                fetchBlogs(PAGINATION.currentPage_blogs);
                form.reset();
                form.classList.add("d-none");
                form.removeAttribute("data-id");

            } catch (error) {
                console.error("Error:", error);
                toast_show_error.show();
            }
            finally {
                if (spinner) {
                    spinner.classList.add("d-none");
                }
            }
        }

        changeBlogsSubmit(event);
    });
    
    document.querySelector("#testimonialForm").addEventListener("submit", function (event) {
        event.preventDefault();
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        const testimonialId = this.getAttribute("data-id");
        const formData = new FormData(this);

        let url = `${CONFIG.BASE_URL}/testimonials`;
        let method = "POST"; 

        if (testimonialId) {
            url = `${CONFIG.BASE_URL}/testimonials/${testimonialId}`;
            method = "PUT"; 
        }
        let imageFile = document.querySelector("[name='image']").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        fetch(url, {
            method: method,
            body: formData,
            headers: { 
                'Authorization': `Bearer ${SETUP_SECURE.token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            response.json()
        })
        .then(data => {
            toast_show_success.show();
            console.log("Success:", data)
            fetchTestimonials();
            this.reset(); 
            this.classList.add("d-none"); 
            this.removeAttribute("data-id");
        })
        .catch(error => {
            console.error("Error:", error);
            toast_show_error.show();
        })
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    });

    document.querySelector("#experienceForm").addEventListener("submit", function (event) {
        event.preventDefault();
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        const experienceId = this.getAttribute("data-id");
        const formData = new FormData(this);

        let url = `${CONFIG.BASE_URL}/experience`;
        let method = "POST"; 

        if (experienceId) {
            url = `${CONFIG.BASE_URL}/experience/${experienceId}`;
            method = "PUT"; 
        }
        formData.forEach((value, key) => {
            const textarea = document.querySelector(`#${key}`);
            if (textarea && $(textarea).hasClass("summernote")) {
                formData.set(key, $(`#${key}`).summernote('code'));
            }
        });
        const checkbox_enddate = document.querySelector(`#checkbox_endate`);
        if (checkbox_enddate.checked) {
            formData.set('end_date', 'Present');
        }
        fetch(url, {
            method: method,
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${SETUP_SECURE.token}`
             },
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            response.json()
        })
        .then(data => {
            toast_show_success.show();
            console.log("Success:", data)
            fetchExperiences();
            this.reset(); 
            this.classList.add("d-none"); 
            this.removeAttribute("data-id");
        })
        .catch(error => {
            console.error("Error:", error);
            toast_show_error.show();
        })
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    });
    document.querySelector("#educationForm").addEventListener("submit", function (event) {
        event.preventDefault();
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        const educationId = this.getAttribute("data-id");
        const formData = new FormData(this);

        let url = `${CONFIG.BASE_URL}/education`;
        let method = "POST"; 

        if (educationId) {
            url = `${CONFIG.BASE_URL}/education/${educationId}`;
            method = "PUT"; 
        }
        formData.forEach((value, key) => {
            const textarea = document.querySelector(`#${key}`);
            if (textarea && $(textarea).hasClass("summernote")) {
                formData.set(key, $(`#${key}`).summernote('code'));
            }
        });
        fetch(url, {
            method: method,
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${SETUP_SECURE.token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            response.json()
        })
        .then(data => {
            toast_show_success.show();
            console.log("Success:", data)
            fetchEducation();
            this.reset(); 
            this.classList.add("d-none"); 
            this.removeAttribute("data-id");
        })
        .catch(error => {
            console.error("Error:", error);
            toast_show_error.show();
        })
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    });
    document.querySelector("#skillForm").addEventListener("submit", function (event) {
        event.preventDefault(); 
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        const skillId = this.getAttribute("data-id");
        const formData = new FormData(this);

        let url = `${CONFIG.BASE_URL}/skills`;
        let method = "POST"; 

        if (skillId) {
            url = `${CONFIG.BASE_URL}/skills/${skillId}`;
            method = "PUT"; 
        }

        fetch(url, {
            method: method,
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${SETUP_SECURE.token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            response.json()
        }
        )
        .then(data => {
            toast_show_success.show();
            console.log("Success:", data)
            fetchSkill();
            this.reset(); 
            this.classList.add("d-none"); 
            this.removeAttribute("data-id");
        })
        .catch(error => {
            console.error("Error:", error);
            toast_show_error.show();
        })
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    });
    document.querySelector("#profileForm").addEventListener("submit", function (event) {
        event.preventDefault(); 
        async function updateProfile() {
            if (spinner) {
                spinner.classList.remove("d-none");
            }
            let form = document.getElementById("profileForm");
            let formData = new FormData(form);

            let avatarFile = document.querySelector("[name='avatar']").files[0];
            let backgroundFile = document.querySelector("[name='background']").files[0];

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }
            if (backgroundFile) {
                formData.append("background", backgroundFile);
            }
            const textAreas = ["about", "sumary", "des_about_1", "des_about_2", "des_about_3", "des_about_4"];
            textAreas.forEach(id => {
                if ($(`#${id}`).summernote) {
                    formData.append(id, $(`#${id}`).summernote('code'));
                }
            });
            console.log([...formData.entries()]);
            try {
                let response = await fetch(`${CONFIG.BASE_URL}/profile`, {
                    method: "PUT",
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${SETUP_SECURE.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                if (response.status === 401) {
                    window.location.href = `${CONFIG.LOGIN_URL}`;
                }

                let result = await response.json();
                console.log("Cập nhật thành công:", result);
                toast_show_success.show();
                getDataAPiProfile();
            } catch (error) {
                console.error("Lỗi khi cập nhật profile:", error);
                toast_show_error.show();
            }
            finally {
                if (spinner) {
                    spinner.classList.add("d-none");
                }
            }
        }
        updateProfile();

    });
    document.querySelector("#LoginFormContainer").addEventListener("submit", function (event) {
        event.preventDefault();
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        let form = document.getElementById("LoginFormContainer");
        let formData = new FormData(form);
        let url = `${CONFIG.BASE_URL}/login`;
        let method = "PUT";
        fetch(url, {
            method: method,
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SETUP_SECURE.token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            response.json()
        })
        .then(data => {
            toast_show_success.show();
            console.log("Success:", data)
            form.reset(); 
            form.classList.add("d-none"); 
            form.removeAttribute("data-id");
        })
        .catch(error => {
            console.error("Error:", error);
            toast_show_error.show();
        })
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    });
});
// ---- SET FETCH DATA,SHOW FORM FOR EDIT AND DELETE ITEM ----
// PROFILE
function getDataAPiProfile(){
    const textAreas = ["about", "sumary", "des_about_1", "des_about_2", "des_about_3", "des_about_4"];
    const apiUrl = `${CONFIG.BASE_URL}/profile`;  
    fetchWithRetry(apiUrl)
        .then(data => {
            fillProfileForm(data,textAreas);
        })
        .catch(error => console.error("Error after retry:", error));
}
function fillProfileForm(data,textAreas) {
    const form = document.getElementById("profileForm");
    if (!form) {
        console.error("Không tìm thấy form profile!");
        return;
    }

    Object.keys(data).forEach(key => {
        let input = form.querySelector(`[name="${key}"]`);
        
        if (input) {
            if (input.type === "file") {
                // Không thể gán giá trị cho input file, chỉ cập nhật ảnh preview nếu có
                if (key === "avatar" && data.avatar) {
                    document.getElementById("avatarPreview").src = data.avatar;
                }
                if (key === "background" && data.background) {
                    document.getElementById("backgroundPreview").src =data.background;
                }
            } else if (input.tagName.toLowerCase() === "textarea") {
                textAreas.forEach(id => {
                    if ($(`#${id}`).summernote) {
                        $(`#${id}`).summernote('code', data[id] || "");
                    }
                });

            } else {
                input.value = data[key];  
            }
    }
    });
    
}
// SKILLS
function fetchSkill(page = PAGINATION.currentPage_skills) {
    const limit = PAGESIZE.skills;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/skills?limit=${limit}&offset=${offset}`)
        .then(data => {
            const skills = data.skills;
            const skillContainer = document.querySelector(".table-skill-fech tbody");
            let content = "";
            skills.forEach(skill => {
                content += `
                <tr>
                    <td>${skill.id}</td>
                    <td>${skill.skill}</td>
                    <td>${skill.percentage}%</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 btn-edit-skill" data-target-id ="${skill.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm btn-delete-skill" data-target-id ="${skill.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            skillContainer.innerHTML = content;

            // Gán sự kiện khi click vào nút Edit
            document.querySelectorAll(".btn-edit-skill").forEach(button => {
                button.addEventListener("click", function () {
                    const skillId = this.getAttribute("data-target-id");
                    showFormEditSkill(skillId);
                });
            });
            document.querySelectorAll(".btn-delete-skill").forEach(button => {
                button.addEventListener("click", function () {
                    const skillId = this.getAttribute("data-target-id");
                    deleteSkill(skillId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.skills == 0) {
                renderPagination(
                    "pagination-skills",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_skills = selectedPage;
                        fetchSkill(selectedPage);
                    }
                );
            } else {
                renderPagination(
                    "pagination-skills",
                    data.total,
                    page,
                    PAGESIZE.skills,
                    (selectedPage) => {
                        PAGINATION.currentPage_skills = selectedPage;
                        fetchSkill(selectedPage);
                    }
                );
            }
        })
        .catch(error => console.error("Error loading skills after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormEditSkill(skillId) {
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/skills/${skillId}`)
        .then(response => response.json())
        .then(data => {
            const form = document.querySelector("#skillForm");
            Object.keys(data).forEach(key => {
                let input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
            form.setAttribute("data-id", skillId);
            form.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching skill:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteSkill(skillId){
    if (confirm("Are you sure you want to delete this skill?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/skills/${skillId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            if (response.ok) {
                toast_show_success.show();
                fetchSkill(); 
            } else {
                toast_show_error.show()
                console.error("Error deleting skill:", response.statusText);
            }
            
        })
        .catch(error => {
            toast_show_error.show();
            console.error("Error deleting skill:", error);

        })
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    }
}
// EDUCATION
function fetchEducation(page = PAGINATION.currentPage_education) {
    const limit = PAGESIZE.education;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/education?limit=${limit}&offset=${offset}`)
        .then(data => {
            const educations = data.education;
            const EducationContainer = document.querySelector(".table-education-fech tbody");
            let content = "";
            educations.forEach(education => {
                content += `
                <tr>
                    <td>${education.id}</td>
                    <td>${education.degree.substring(0, 50)}...</td>
                    <td>${education.school.substring(0, 50)}...</td>
                    <td>${education.description.substring(0, 50)}...</td>
                    <td>${education.year}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-edit-education" data-target-id ="${education.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-education" data-target-id ="${education.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            EducationContainer.innerHTML = content;

            // Gán sự kiện khi click vào nút Edit
            document.querySelectorAll(".btn-edit-education").forEach(button => {
                button.addEventListener("click", function () {
                    const educationId = this.getAttribute("data-target-id");
                    showFormEditEducation(educationId);
                });
            });
            document.querySelectorAll(".btn-delete-education").forEach(button => {
                button.addEventListener("click", function () {
                    const educationId = this.getAttribute("data-target-id");
                    deleteEducation(educationId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.education == 0) {
                renderPagination(
                    "pagination-educations",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_education = selectedPage;
                        fetchEducation(selectedPage);
                    }
                );
            } else {
                renderPagination(
                    "pagination-educations",
                    data.total,
                    page,
                    PAGESIZE.education,
                    (selectedPage) => {
                        PAGINATION.currentPage_education = selectedPage;
                        fetchEducation(selectedPage);
                    }
                );
            }
        })
        .catch(error => console.error("Error loading education after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormEditEducation(educationId) {
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/education/${educationId}`)
        .then(response => response.json())
        .then(data => {
            const form = document.querySelector("#educationForm");
            Object.keys(data).forEach(key => {
                let input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.tagName.toLowerCase() === "textarea") {
                        if ($(`#${input.id}`).summernote) {
                            $(`#${input.id}`).summernote('code', data[key] || "");
                        }
                    } else {
                        input.value = data[key];
                    }
                }
            });
            form.setAttribute("data-id", educationId);
            form.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching education:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteEducation(educationId){
    if (confirm("Are you sure you want to delete this education?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/education/${educationId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            if (response.ok) {
                toast_show_success.show();
                fetchEducation(); 
            } else {
                toast_show_error.show();
                console.error("Error deleting education:", response.statusText);
            }
            
        })
        .catch(error => {
            toast_show_error.show()
            console.error("Error deleting education:", error);})
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });

    }
}
// PROJECTS
function fetchProjects(page = PAGINATION.currentPage_projects) {
    const limit = PAGESIZE.projects;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/projects?limit=${limit}&offset=${offset}`)
        .then(data => {
            const projects = data.projects;
            const ProjectsContainer = document.querySelector(".table-projects-fech tbody");
            let content = "";
            projects.forEach(project => {
                content += `
                <tr>
                    <td>${project.id}</td>
                    <td>${project.title.substring(0, 50)}</td>
                    <td>${project.description.substring(0, 50)}</td>
                    <td><img src="${project.image}" width="100" height="100" class="img-fluid"></td>
                    <td>${project.project_date}</td>
                    <td>${project.category}</td>
                    <td>${project.client}</td>
                    <td>${project.github_link}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-edit-project" data-target-id="${project.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-project" data-target-id="${project.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            ProjectsContainer.innerHTML = content;

            // Gán sự kiện khi click vào nút Edit
            document.querySelectorAll(".btn-edit-project").forEach(button => {
                button.addEventListener("click", function () {
                    const projectId = this.getAttribute("data-target-id");
                    showFormEditProject(projectId);
                });
            });
            document.querySelectorAll(".btn-delete-project").forEach(button => {
                button.addEventListener("click", function () {
                    const projectId = this.getAttribute("data-target-id");
                    deleteProject(projectId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.projects == 0) {
                renderPagination(
                    "pagination-projects",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_projects = selectedPage;
                        fetchProjects(selectedPage);
                    }
                );
            } else {
                renderPagination(
                    "pagination-projects",
                    data.total,
                    page,
                    PAGESIZE.projects,
                    (selectedPage) => {
                        PAGINATION.currentPage_projects = selectedPage;
                        fetchProjects(selectedPage);
                    }
                );
            }
        })
        .catch(error => console.error("Error loading projects after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormEditProject(projectId) {
    // Hiển thị spinner trước khi gọi API
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/projects/${projectId}`)
        .then(response => response.json())
        .then(data => {
            const form = document.querySelector("#projectForm");
            Object.keys(data).forEach(key => {
                let input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.tagName.toLowerCase() === "textarea") {
                        if ($(`#${input.id}`).summernote) {
                            $(`#${input.id}`).summernote('code', data[key] || "");
                        }
                    } 
                    else if (input.type === "file"){
                        document.getElementById("projectImagePreview").src =data.image;
                    }
                    else if (input.tagName.toLowerCase() === "select") {
                        // Nếu input là <select>, gán giá trị vào select
                        let option = input.querySelector(`option[value="${data[key]}"]`);
                        if (option) {
                            input.value = data[key]; // Gán giá trị cho select
                        }
                    } 
                    else {
                        input.value = data[key];
                    }
                }
            });
            form.setAttribute("data-id", projectId);
            form.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching project:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteProject(projectId){
    if (confirm("Are you sure you want to delete this projects?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/projects/${projectId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            if (response.ok) {
                toast_show_success.show();
                fetchProjects(); 
            } else {
                toast_show_error.show();
                console.error("Error deleting projects:", response.statusText);
            }
        })
        .catch(error => {
            toast_show_error.show()
            console.error("Error deleting projects:", error);})
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    }
}
// EXPERIENCES
function fetchExperiences(page = PAGINATION.currentPage_experience) {
    const limit = PAGESIZE.experience;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/experience?limit=${limit}&offset=${offset}`)
        .then(data => {
            const experiences = data.experiences;
            const ExperienceContainer = document.querySelector(".table-experience-fech tbody");
            let content = "";
            experiences.forEach(experience => {
                content += `
                <tr>
                    <td>${experience.id}</td>
                    <td>${experience.position.substring(0, 50)}</td>
                    <td>${experience.company.substring(0, 50)}</td>
                    <td>${experience.description.substring(0, 50)}...</td>
                    <td>${experience.start_date}</td>
                    <td>${experience.end_date}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-edit-experience" data-target-id ="${experience.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-experience" data-target-id ="${experience.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            ExperienceContainer.innerHTML = content;

            // Gán sự kiện khi click vào nút Edit
            document.querySelectorAll(".btn-edit-experience").forEach(button => {
                button.addEventListener("click", function () {
                    const experienceId = this.getAttribute("data-target-id");
                    showFormEditExperience(experienceId);
                });
            });
            document.querySelectorAll(".btn-delete-experience").forEach(button => {
                button.addEventListener("click", function () {
                    const experienceId = this.getAttribute("data-target-id");
                    deleteExperience(experienceId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.experience == 0) {
                renderPagination(
                    "pagination-experiences",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_experience = selectedPage;
                        fetchExperiences(selectedPage);
                    }
                );
            } else {
                renderPagination(
                    "pagination-experiences",
                    data.total,
                    page,
                    PAGESIZE.experience,
                    (selectedPage) => {
                        PAGINATION.currentPage_experience = selectedPage;
                        fetchExperiences(selectedPage);
                    }
                );
            }
        })
        .catch(error => console.error("Error loading experiences after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormEditExperience(experienceId) {
    // Hiển thị spinner trước khi gọi API
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/experience/${experienceId}`)
        .then(response => response.json())
        .then(data => {
            const form = document.querySelector("#experienceForm");
            Object.keys(data).forEach(key => {
                let input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.tagName.toLowerCase() === "textarea") {
                        if ($(`#${input.id}`).summernote) {
                            $(`#${input.id}`).summernote('code', data[key] || "");
                        }
                    } else {
                        if (key === "end_date" && data[key] === "Present") {
                            const checkboxEndDate = form.querySelector(`#checkbox_endate`);
                            if (checkboxEndDate) {
                                checkboxEndDate.checked = true;
                            }
                        }
                        input.value = data[key];
                    }
                }
            });
            form.setAttribute("data-id", experienceId);
            form.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching experience:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteExperience(experienceId){
    if (confirm("Are you sure you want to delete this experience?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/experience/${experienceId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }

            if (response.ok) {
                toast_show_success.show();
                fetchExperiences(); 
            } else {
                toast_show_error.show();
                console.error("Error deleting experience:", response.statusText);
            }
        })
        .catch(error => {
            toast_show_error.show();
            console.error("Error deleting experience:", error);})
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    }
}
// CONTACTS FORM
function fetchContactForm(page = PAGINATION.currentPage_contact) {
    const limit = PAGESIZE.contact;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/contact?limit=${limit}&offset=${offset}`)
        .then(data => {
            const contacts = data.contact_forms;
            const contactContainer = document.querySelector(".table-contactForm-fech tbody");
            let content = "";
            contacts.forEach(contact => {
                content += `
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.subject}</td>
                    <td>${contact.message.substring(0, 50)}...</td>
                    <td>${contact.created_at}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-show-contact" data-target-id ="${contact.id}"><i class="fa fa-edit"></i> Show</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-contact" data-target-id ="${contact.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            contactContainer.innerHTML = content;

            // Gán sự kiện khi click vào nút Show/Delete
            document.querySelectorAll(".btn-show-contact").forEach(button => {
                button.addEventListener("click", function () {
                    const contactId = this.getAttribute("data-target-id");
                    showFormContact(contactId);
                });
            });
            document.querySelectorAll(".btn-delete-contact").forEach(button => {
                button.addEventListener("click", function () {
                    const contactId = this.getAttribute("data-target-id");
                    deleteContact(contactId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.contact == 0) {
                renderPagination(
                    "pagination-contacts",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_contact = selectedPage;
                        fetchContactForm(selectedPage);
                    }
                );
            } else {
                renderPagination(
                    "pagination-contacts",
                    data.total,
                    page,
                    PAGESIZE.contact,
                    (selectedPage) => {
                        PAGINATION.currentPage_contact = selectedPage;
                        fetchContactForm(selectedPage);
                    }
                );
            }
        })
        .catch(error => console.error("Error loading contact after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormContact(contactId) {
    // Hiển thị spinner trước khi gọi API
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/contact/${contactId}`)
        .then(response => response.json())
        .then(data => {
            const contactDetailsContainer = document.querySelector("#contactDetailsContainer");
            if (contactDetailsContainer) {
                contactDetailsContainer.querySelector("#contactName").textContent = data.name || "";
                contactDetailsContainer.querySelector("#contactEmail").textContent = data.email || "";
                contactDetailsContainer.querySelector("#contactSubject").textContent = data.subject || "";
                contactDetailsContainer.querySelector("#contactMessage").textContent = data.message || "";
                contactDetailsContainer.querySelector("#contactCreatedDate").textContent = data.created_at || "";
                contactDetailsContainer.setAttribute("data-id", contactId);
                contactDetailsContainer.classList.remove("d-none");
            }
        })
        .catch(error => console.error("Error fetching contact:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteContact(contactId){
    if (confirm("Are you sure you want to delete this contact?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/contact/${contactId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            if (response.ok) {
                toast_show_success.show();
                fetchContactForm(); 
            } else {
                toast_show_error.show();
                console.error("Error deleting contact:", response.statusText);
            }
            
        })
        .catch(error => {
            toast_show_error.show()
            console.error("Error deleting contact:", error);})
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    }
}
// TESTIMONIALS
function fetchTestimonials(page = PAGINATION.currentPage_testimonials) {
    const limit = PAGESIZE.testimonials;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/testimonials?limit=${limit}&offset=${offset}`)
        .then(data => {
            const testimonials = data.testimonials;
            const testimonialsContainer = document.querySelector(".table-testimonials-fech tbody");
            let content = "";
            testimonials.forEach(testimonial => {
                content += `
                <tr>
                    <td>${testimonial.id}</td>
                    <td>${testimonial.name.substring(0, 50)}</td>
                    <td>${testimonial.position.substring(0, 50)}</td>
                    <td>${testimonial.company.substring(0, 50)}</td>
                    <td>${testimonial.description.substring(0, 50)}...</td>
                    <td><img src="${testimonial.image}" width="100" height="100" class="img-fluid"></td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-edit-testimonial" data-target-id ="${testimonial.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-testimonial" data-target-id ="${testimonial.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            testimonialsContainer.innerHTML = content;

            // Gán sự kiện khi click vào nút Edit/Delete
            document.querySelectorAll(".btn-edit-testimonial").forEach(button => {
                button.addEventListener("click", function () {
                    const testimonialId = this.getAttribute("data-target-id");
                    showFormEditTestimonial(testimonialId);
                });
            });
            document.querySelectorAll(".btn-delete-testimonial").forEach(button => {
                button.addEventListener("click", function () {
                    const testimonialId = this.getAttribute("data-target-id");
                    deleteTestimonial(testimonialId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.testimonials == 0) {
                renderPagination(
                    "pagination-testimonials",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_testimonials = selectedPage;
                        fetchTestimonials(selectedPage);
                    }
                );
            } else {
                renderPagination(
                    "pagination-testimonials",
                    data.total,
                    page,
                    PAGESIZE.testimonials,
                    (selectedPage) => {
                        PAGINATION.currentPage_testimonials = selectedPage;
                        fetchTestimonials(selectedPage);
                    }
                );
            }
        })
        .catch(error => console.error("Error loading testimonials after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormEditTestimonial(testimonialId) {
    // Hiển thị spinner trước khi gọi API
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/testimonials/${testimonialId}`)
        .then(response => response.json())
        .then(data => {
            const form = document.querySelector("#testimonialForm");
            Object.keys(data).forEach(key => {
                let input = form.querySelector(`[name="${key}"]`);
                if (input) {
                        if (key === "image" && data.image) {
                            document.getElementById("testimonialImagePreview").src =data.image;
                        } else {
                            input.value = data[key];
                        }
                }
            });
            form.setAttribute("data-id", testimonialId);
            form.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching testimonial:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteTestimonial(testimonialId){
    if (confirm("Are you sure you want to delete this testimonial?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/testimonials/${testimonialId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            if (response.ok) {
                toast_show_success.show();
                fetchTestimonials(); 
            } else {
                toast_show_error.show();
                console.error("Error deleting testimonial:", response.statusText);
            }
            
        })
        .catch(error => {
            toast_show_error.show()
            console.error("Error deleting testimonial:", error);})
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    }
}
// BLOGS
function fetchBlogs(page = PAGINATION.currentPage_blogs) {
    const limit = PAGESIZE.blogs;
    const offset = limit > 0 ? (page - 1) * limit : 0;

    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetchWithRetry(`${CONFIG.BASE_URL}/blogs?limit=${limit}&offset=${offset}`)
        .then(data => {
            const blogs = data.blogs;
            const blogsContainer = document.querySelector(".table-blogs-fech tbody");
            let content = "";
            blogs.forEach(blog => {
                content += `
                <tr>
                    <td>${blog.id}</td>
                    <td>${blog.title.substring(0, 50)}</td>
                    <td><img src="${blog.image}" width="100" height="100" class="img-fluid"></td>
                    <td>${blog.category}</td>
                    <td>${blog.description.substring(0, 50)}</td>
                    <td>${blog.created_at}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-edit-blogs" data-target-id="${blog.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-blogs" data-target-id="${blog.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>`;
            });
            blogsContainer.innerHTML = content;

            // Gán sự kiện Edit/Delete
            document.querySelectorAll(".btn-edit-blogs").forEach(button => {
                button.addEventListener("click", function () {
                    const blogsId = this.getAttribute("data-target-id");
                    showFormEditBlogs(blogsId);
                });
            });
            document.querySelectorAll(".btn-delete-blogs").forEach(button => {
                button.addEventListener("click", function () {
                    const blogsId = this.getAttribute("data-target-id");
                    deleteBlogs(blogsId);
                });
            });

            // Cập nhật phân trang
            if (PAGESIZE.blogs == 0){
                renderPagination(
                    "pagination-blogs",
                    data.total,
                    page,
                    data.total,
                    (selectedPage) => {
                        PAGINATION.currentPage_blogs = selectedPage;
                        fetchBlogs(selectedPage);
                    }
                );
            }
            else{
                renderPagination(
                    "pagination-blogs",
                    data.total,
                    page,
                    PAGESIZE.blogs,
                    (selectedPage) => {
                        PAGINATION.currentPage_blogs = selectedPage;
                        fetchBlogs(selectedPage);
                    }
                );
            }
            
            if (spinner){
                spinner.classList.add("d-none");
            }
        })
        .catch(error => console.error("Error loading blogs after retry:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function showFormEditBlogs(blogsId) {
    // Hiển thị spinner trước khi gọi API
    if (spinner) {
        spinner.classList.remove("d-none");
    }
    fetch(`${CONFIG.BASE_URL}/blogs/${blogsId}`)
        .then(response => response.json())
        .then(data => {
            const form = document.querySelector("#BlogsForm");
            Object.keys(data).forEach(key => {
                let input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.tagName.toLowerCase() === "textarea" && key !== "description") {
                        if ($(`#${input.id}`).summernote) {
                            $(`#${input.id}`).summernote('code', data[key] || "");
                        }
                        else{
                            input.value = data[key];
                        }
                    } else {
                        if (key === "image" && data.image) {
                            document.getElementById("blogsImagePreview").src =data.image;
                        } else {
                            input.value = data[key];
                        }
                    }
                }
            });
            form.setAttribute("data-id", blogsId);
            form.classList.remove("d-none");
        })
        .catch(error => console.error("Error fetching blogs:", error))
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
}
function deleteBlogs(blogsId){
    if (confirm("Are you sure you want to delete this blogs?")) {
        if (spinner) {
            spinner.classList.remove("d-none");
        }
        fetch(`${CONFIG.BASE_URL}/blogs/${blogsId}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${SETUP_SECURE.token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = `${CONFIG.LOGIN_URL}`;
            }
            if (response.ok) {
                toast_show_success.show();
                fetchBlogs(); 
            } else {
                toast_show_error.show();
                console.error("Error deleting blogs:", response.statusText);
            }
            
        })
        .catch(error => {
            toast_show_error.show()
            console.error("Error deleting blogs:", error);})
        .finally(() => {
            if (spinner) {
                spinner.classList.add("d-none");
            }
        });
    }
}
// ----- Function to display image preview when selecting a file --
function displayImage(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById(previewId).src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
document.querySelector("[name='avatar']").addEventListener("change", function () {
    displayImage(this, "avatarPreview");
});
document.querySelector("[name='background']").addEventListener("change", function () {
    displayImage(this, "backgroundPreview");
});
document.querySelector("[name='image']").addEventListener("change",function(){
    displayImage(this, "projectImagePreview");
});
document.querySelector("#imageTestimonial").addEventListener("change", function () {
    displayImage(this, "testimonialImagePreview");
});
document.querySelector("#imageBlogs").addEventListener("change", function () {
    displayImage(this, "blogsImagePreview");
});
// ----- Function to render pagination ----
function renderPagination(containerId,totalItems, currentPage, pageSize, fetchFunction) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pagination = document.getElementById(containerId);
    pagination.innerHTML = "";

    const createPageItem = (label, page, disabled = false, active = false) => {
        return `
        <li class="page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}">
            <button class="page-link" data-page="${page}">${label}</button>
        </li>`;
    };

    pagination.innerHTML += createPageItem("«", currentPage - 1, currentPage === 1);

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += createPageItem(i, i, false, i === currentPage);
    }

    pagination.innerHTML += createPageItem("»", currentPage + 1, currentPage === totalPages);

    // Gắn sự kiện
    pagination.querySelectorAll(".page-link").forEach(button => {
        button.addEventListener("click", () => {
            const selectedPage = parseInt(button.dataset.page);
            if (!isNaN(selectedPage)) {
                fetchFunction(selectedPage);
            }
        });
    });
}