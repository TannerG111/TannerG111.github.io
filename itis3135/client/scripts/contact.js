document.addEventListener("DOMContentLoaded", function () {
    // phone inputs
    const phoneInputs = Array.from(document.querySelectorAll('input[name="phone"]'));

    function formatPhone(value) {
        // strip all non-digits and cap to 10
        const digits = value.replace(/\D/g, "").slice(0, 10);
        const len = digits.length;
        if (len === 0) return "";
        if (len < 4) return "(" + digits;
        if (len < 7) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
        return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
    }

    phoneInputs.forEach((input) => {
        // hint numeric keypad on supporting mobile browsers
        if (!input.getAttribute("inputmode")) input.setAttribute("inputmode", "numeric");

        // keep the formatted mask in sync during input/blur
        const handle = () => {
            input.value = formatPhone(input.value);
        };
        input.addEventListener("input", handle);
        input.addEventListener("blur", handle);

        // prevent non-digit keys and allow navigation and editing controls
        input.addEventListener("keydown", (e) => {
            const controlKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });

        // handle pasted values
        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData("text") || "";
            input.value = formatPhone(text);
        });
        // initialize if there is prefilled content
        handle();
    });

    // contact form validation and message feedback
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    if (form && status) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // extract digits only and does not affect validation
            const digits = (form.phone.value || "").replace(/\D/g, "");
            const email = (form.email.value || "").trim();
            // basic email format check
            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (digits.length !== 10) {
                status.textContent = "Please enter a 10-digit phone number.";
                status.style.color = "#822222";
                form.phone.focus();
                return;
            }
            if (!emailOk) {
                status.textContent = "Please enter a valid email address.";
                status.style.color = "#822222";
                form.email.focus();
                return;
            }

            // simulated success path
            status.textContent = "Thanks! Your message has been received.";
            status.style.color = "#206a20";
            form.reset();
        });
    }
});
