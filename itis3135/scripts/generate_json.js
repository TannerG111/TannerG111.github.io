document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("intro-form");
    var instructions = document.getElementById("form-instructions");
    var generateBtn = document.getElementById("generate-json");
    var restartWrap = document.getElementById("restart-wrapper");
    var restartLink = document.getElementById("restart-link");
    var pictureUpload = document.getElementById("pictureUpload");

    function val(id) { var el = document.getElementById(id); return el ? (el.value || "").trim() : ""; }
    function middleInitial() {
        var m = val('middleName');
        if (!m) return "";
        return m.trim().charAt(0).toUpperCase();
    }
    function getImageSrc() {
        if (pictureUpload && pictureUpload.files && pictureUpload.files[0]) {
            try { return URL.createObjectURL(pictureUpload.files[0]); } catch (e) { return 'images/professional-photo.jpg'; }
        }
        return 'images/professional-photo.jpg';
    }
    function buildCourses() {
        var rows = document.querySelectorAll('#courses-container .course-row');
        var out = [];
        for (var i = 0; i < rows.length; i++) {
            var inputs = rows[i].querySelectorAll('input');
            out.push({
                department: (inputs[0] && inputs[0].value || "").trim(),
                number: (inputs[1] && inputs[1].value || "").trim(),
                name: (inputs[2] && inputs[2].value || "").trim(),
                reason: (inputs[3] && inputs[3].value || "").trim()
            });
        }
        return out;
    }
    function buildLinks() {
        var out = [];
        for (var i = 1; i <= 5; i++) {
            var name = val('link' + i + 'Name');
            var href = val('link' + i);
            if (!href) continue;
            out.push({ name: name || href, href: href });
        }
        return out;
    }

    function buildJson() {
        return {
            firstName: val('firstName'),
            preferredName: val('preferredName'),
            middleInitial: middleInitial(),
            lastName: val('lastName'),
            divider: val('divider'),
            mascotAdjective: val('mascotAdj'),
            mascotAnimal: val('mascotAnimal'),
            image: getImageSrc(),
            imageCaption: val('pictureCaption'),
            personalStatement: val('personalStatement'),
            personalBackground: val('bullet1'),
            professionalBackground: val('bullet2'),
            academicBackground: val('bullet3'),
            subjectBackground: "",
            primaryComputer: val('bullet4'),
            courses: buildCourses(),
            links: buildLinks()
        };
    }

    function renderJson() {
        var mainH2 = document.querySelector('main h2');
        if (mainH2) mainH2.textContent = 'Introduction JSON';
        if (form) form.style.display = 'none';
        if (instructions) instructions.style.display = 'none';

        var prev = document.getElementById('json-code-output');
        if (prev) prev.remove();

        var section = document.createElement('section');
        section.id = 'json-code-output';
        var pre = document.createElement('pre');
        var code = document.createElement('code');
        code.className = 'language-json';
        code.textContent = JSON.stringify(buildJson(), null, 2);
        pre.appendChild(code);
        section.appendChild(pre);

        var main = document.querySelector('main');
        var anchor = document.getElementById('restart-wrapper');
        if (main) { if (anchor) main.insertBefore(section, anchor); else main.appendChild(section); }

        if (restartWrap) restartWrap.style.display = 'block';
        if (window.hljs && typeof window.hljs.highlightElement === 'function') window.hljs.highlightElement(code);
        else if (window.hljs && typeof window.hljs.highlightAll === 'function') window.hljs.highlightAll();
        window.scrollTo(0, 0);
    }

    if (generateBtn) generateBtn.addEventListener('click', renderJson);
    if (restartLink) restartLink.addEventListener('click', function () {
        var section = document.getElementById('json-code-output');
        if (section) section.remove();
        var mainH2 = document.querySelector('main h2');
        if (mainH2) mainH2.textContent = 'Introduction Form';
    });
});


