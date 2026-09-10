document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        const navItems = navLinks.querySelectorAll("a");

        navItems.forEach(function (item) {

            item.addEventListener("click", function () {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });

        window.addEventListener("resize", function () {

            if (window.innerWidth > 800) {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });
    }


    /* =====================================================
       CONTACT FORM
       ===================================================== */

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        return;
    }


    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    const formSuccess = document.getElementById("formSuccess");
    const sendError = document.getElementById("sendError");
    const submitButton = document.getElementById("contactSubmit");


    /* =====================================================
       ERROR FUNCTIONS
       ===================================================== */

    function clearError(input, errorElement) {

        if (!input || !errorElement) {
            return;
        }

        const group = input.closest(".form-group");

        if (group) {
            group.classList.remove("input-error");
        }

        errorElement.textContent = "";
    }


    function showError(input, errorElement, message) {

        if (!input || !errorElement) {
            return;
        }

        const group = input.closest(".form-group");

        if (group) {
            group.classList.add("input-error");
        }

        errorElement.textContent = message;
    }


    /* =====================================================
       EMAIL VALIDATION
       ===================================================== */

    function validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    /* =====================================================
       CLEAR ALL ERRORS
       ===================================================== */

    function clearAllErrors() {

        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(subjectInput, subjectError);
        clearError(messageInput, messageError);

        if (sendError) {
            sendError.textContent = "";
        }

        if (formSuccess) {
            formSuccess.classList.remove("show");
        }
    }


    /* =====================================================
       VALIDATE FORM
       ===================================================== */

    function validateForm() {

        let valid = true;

        clearAllErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();


        if (name.length < 2) {

            showError(
                nameInput,
                nameError,
                "Please enter your name."
            );

            valid = false;
        }


        if (!validEmail(email)) {

            showError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

            valid = false;
        }


        if (subject.length < 3) {

            showError(
                subjectInput,
                subjectError,
                "Please enter a subject."
            );

            valid = false;
        }


        if (message.length < 10) {

            showError(
                messageInput,
                messageError,
                "Please enter at least 10 characters."
            );

            valid = false;
        }


        return valid;
    }


    /* =====================================================
       SEND EMAIL
       ===================================================== */

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        /* Check EmailJS */

        if (typeof emailjs === "undefined") {

            sendError.textContent =
                "Email service could not be loaded. Please check your internet connection.";

            return;
        }


        /* Loading */

        submitButton.disabled = true;

        submitButton.innerHTML =
            'Sending... <span>✦</span>';


        /* EmailJS */

        emailjs
            .sendForm(
                "service_x6qgbvn",
                "template_b6q73wr",
                contactForm
            )
            .then(function (response) {

                console.log(
                    "Email sent successfully:",
                    response.status,
                    response.text
                );


                /* Success */

                formSuccess.classList.add("show");

                sendError.textContent = "";

                contactForm.reset();


                /* Restore button */

                submitButton.disabled = false;

                submitButton.innerHTML =
                    'Send Message <span>→</span>';


                /* Hide success message */

                setTimeout(function () {

                    formSuccess.classList.remove("show");

                }, 7000);

            })
            .catch(function (error) {

                console.error(
                    "EmailJS Error:",
                    error
                );


                /* Show actual error */

                if (error && error.text) {

                    sendError.textContent =
                        "EmailJS error: " + error.text;

                } else {

                    sendError.textContent =
                        "Your message could not be sent. Please try again.";
                }


                /* Restore button */

                submitButton.disabled = false;

                submitButton.innerHTML =
                    'Send Message <span>→</span>';
            });
    });


    /* =====================================================
       REMOVE ERRORS WHILE TYPING
       ===================================================== */

    const fields = [
        {
            input: nameInput,
            error: nameError
        },
        {
            input: emailInput,
            error: emailError
        },
        {
            input: subjectInput,
            error: subjectError
        },
        {
            input: messageInput,
            error: messageError
        }
    ];


    fields.forEach(function (field) {

        if (!field.input || !field.error) {
            return;
        }

        field.input.addEventListener(
            "input",
            function () {

                clearError(
                    field.input,
                    field.error
                );

                if (sendError) {
                    sendError.textContent = "";
                }
            }
        );
    });

});