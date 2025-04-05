// Login set
let token;
const spinner = document.querySelector("#loadingSpinner");
document.addEventListener("DOMContentLoaded", function () {
    token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login.html";
    } else {
        fetch(`${CONFIG.BASE_URL}/verify_token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
            }
        })
        .catch(error => {
            window.location.href = "/login.html";
        });
    }
});

// Change theme
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
// Congig navigation
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
// Toggle form
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
// Get data and config summernote
let toast_show_success;
let toast_show_error;
document.addEventListener("DOMContentLoaded", function () {
    // Define toast
    const toastSuccess = document.getElementById("toastSuccess");
    toast_show_success = new bootstrap.Toast(toastSuccess);
    const toastError = document.getElementById("toastError");
    toast_show_error = new bootstrap.Toast(toastError);
    // Define textarea
    const textAreas = ["about", "sumary", "des_about_1", "des_about_2", "des_about_3", "des_about_4", "description_edu", "description_project", "description_experience"];
    textAreas.forEach(id => {
        $(`#${id}`).summernote({
            placeholder: 'Write here...',
            tabsize: 2,
            height: 100,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']], 
                ['font', ['fontname', 'fontsize', 'color']], 
                ['para', ['ul', 'ol', 'paragraph', 'align']], 
                ['insert', ['link', 'picture', 'video', 'hr']],  
                ['table', ['table']],  
                ['misc', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]  
            ]

        });
    });

    fetchSkill();
    fetchEducation();
    fetchProjects();
    fetchExperiences();
    getDataAPiProfile();

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
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Kiểm tra nếu request thất bại
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if (response.status === 401) {
                    window.location.href = "/login.html";
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
                'Authorization': `Bearer ${token}`
             },
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
                'Authorization': `Bearer ${token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
                'Authorization': `Bearer ${token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                if (response.status === 401) {
                    window.location.href = "/login.html";
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
                "Authorization": `Bearer ${token}`
             }
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
function getDataAPiProfile(){
    const textAreas = ["about", "sumary", "des_about_1", "des_about_2", "des_about_3", "des_about_4"];
    const apiUrl = `${CONFIG.BASE_URL}/profile`;  
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            fillProfileForm(data,textAreas);
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu profile:", error));
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
function fetchSkill() {
    fetch(`${CONFIG.BASE_URL}/skills`)
        .then(response => response.json())
        .then(data => {
            const skillContainer = document.querySelector(".table-skill-fech tbody");
            let content = "";
            data.forEach(skill => {
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
        })
        .catch(error => console.error("Error loading skills:", error));
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
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
function fetchEducation() {
    fetch(`${CONFIG.BASE_URL}/education`)
        .then(response => response.json())
        .then(data => {
            const EducationContainer = document.querySelector(".table-education-fech tbody");
            let content = "";
            data.forEach(education => {
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
            EducationContainer.innerHTML =content;
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
        })
        .catch(error => console.error("Error loading experiences:", error));
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
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
function fetchProjects() {
    fetch(`${CONFIG.BASE_URL}/projects`)
        .then(response => response.json())
        .then(data => {
            const ProjectsContainer = document.querySelector(".table-projects-fech tbody");
            let content = "";
            data.forEach(projects => {
                content += `
                <tr>
                    <td>${projects.id}</td>
                    <td>${projects.title.substring(0, 50)}</td>
                    <td>${projects.description.substring(0, 50)}</td>
                    <td><img src="${projects.image}" width="100" height="100"></td>
                    <td>${projects.project_date}</td>
                    <td>${projects.category}</td>
                    <td>${projects.client}</td>
                    <td>${projects.github_link}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2 mb-2 btn-edit-project" data-target-id ="${projects.id}"><i class="fa fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm mb-2 btn-delete-project" data-target-id ="${projects.id}"><i class="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `;
            });
            ProjectsContainer.innerHTML =content;
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
        })
        .catch(error => console.error("Error loading experiences:", error));
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
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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
function fetchExperiences() {
    fetch(`${CONFIG.BASE_URL}/experience`)
        .then(response => response.json())
        .then(data => {
            const ExperienceContainer = document.querySelector(".table-experience-fech tbody");
            let content = "";
            data.forEach(experience => {
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
            ExperienceContainer.innerHTML =content;
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
        })
        .catch(error => console.error("Error loading experiences:", error));
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
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login.html";
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