document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("intro-form");
    var generateBtn = document.getElementById("generate-html");
    var instructions = document.getElementById("form-instructions");
    var restartWrap = document.getElementById("restart-wrapper");
    var restartLink = document.getElementById("restart-link");
    var pictureUpload = document.getElementById("pictureUpload");

    function val(id) { var el = document.getElementById(id); return el ? (el.value || "").trim() : ""; }
    function fmtMid(m) { if (!m) return ""; var t = m.trim(); return t.length === 1 ? (t + ".") : t; }

    function buildCourses() {
        var rows = document.querySelectorAll('#courses-container .course-row');
        var out = [];
        for (var i = 0; i < rows.length; i++) {
            var inputs = rows[i].querySelectorAll('input');
            var dept = (inputs[0] && inputs[0].value || "").trim();
            var num = (inputs[1] && inputs[1].value || "").trim();
            var name = (inputs[2] && inputs[2].value || "").trim();
            var reason = (inputs[3] && inputs[3].value || "").trim();
            var title = (dept + (num ? (" " + num) : "") + (name ? (" - " + name) : "")).trim();
            out.push("            <li><strong>" + title + "</strong>: " + reason + "</li>");
        }
        return out.join("\n");
    }

    function buildLinksList() {
        var lines = [];
        for (var i = 1; i <= 5; i++) {
            var nm = val('link' + i + 'Name');
            var href = val('link' + i);
            if (href && nm) {
                lines.push('            <li><a href="' + href + '">' + nm + '</a></li>');
            }
        }
        return lines.join('\n');
    }

    function getImageSrc() {
        if (pictureUpload && pictureUpload.files && pictureUpload.files[0]) {
            try { return URL.createObjectURL(pictureUpload.files[0]); } catch (e) { return 'images/professional-photo.jpg'; }
        }
        return 'images/professional-photo.jpg';
    }

    function buildHtml() {
        var preferred = val('preferredName');
        var middle = fmtMid(val('middleName'));
        var first = val('firstName');
        var last = val('lastName');
        var nick = preferred ? (' "' + preferred + '"') : '';
        var nameLine = [first, middle].filter(Boolean).join(' ') + nick + (last ? (' ' + last) : '');
        var mascotAdj = val('mascotAdj');
        var mascotAnimal = val('mascotAnimal');
        var divider = val('divider') || '|';
        var fullName = [first, middle, last].filter(Boolean).join(' ');
        var funny = val('funnyThing');
        var share = val('shareThing');
        var pictureCaption = val('pictureCaption');
        var courseLis = buildCourses();
        var linksLis = buildLinksList();

        var html =
            '<h2>Introduction HTML</h2>\n' +
            '<h3>' + nameLine + ' ' + divider + ' ' + mascotAdj + ' ' + mascotAnimal + '</h3>\n\n' +
            '<figure>\n' +
            '    <img src="' + getImageSrc() + '" alt="' + pictureCaption + '" />\n' +
            '    <figcaption>' + pictureCaption + '</figcaption>\n' +
            '</figure>\n\n' +
            '<ul>\n' +
            '    <li><strong>Personal Background:</strong> ' + val('bullet1') + '</li>\n' +
            '    <li><strong>Professional Background:</strong> ' + val('bullet2') + '</li>\n' +
            '    <li><strong>Academic Background:</strong> ' + val('bullet3') + '</li>\n' +
            '    <li><strong>Primary Computer Platform:</strong> ' + val('bullet4') + '</li>\n' +
            '    <li><strong>Courses I\'m taking and why</strong>:\n' +
            '        <ul>\n' +
            (courseLis ? courseLis + "\n" : '') +
            '        </ul>\n' +
            '    </li>\n' +
            (linksLis ? '    <li><strong>Links</strong>:\n        <ul>\n' + linksLis + '\n        </ul>\n    </li>\n' : '') +
            (funny ? '    <li><strong>Funny/Interesting Item to Remember Me by:</strong> ' + funny + '</li>\n' : '') +
            (share ? '    <li><strong>I\'d Also Like to Share:</strong> ' + share + '</li>\n' : '') +
            '</ul>';
        return html;
    }

    function renderHighlighted() {
        var mainH2 = document.querySelector('main h2');
        if (mainH2) mainH2.textContent = 'Introduction HTML';
        if (form) form.style.display = 'none';
        if (instructions) instructions.style.display = 'none';

        var prev = document.getElementById('html-code-output');
        if (prev) prev.remove();

        var section = document.createElement('section');
        section.id = 'html-code-output';
        var pre = document.createElement('pre');
        var code = document.createElement('code');
        code.className = 'language-html';
        code.textContent = buildHtml();
        pre.appendChild(code);
        section.appendChild(pre);

        var main = document.querySelector('main');
        var anchor = document.getElementById('restart-wrapper');
        if (main) {
            if (anchor) main.insertBefore(section, anchor); else main.appendChild(section);
        }

        if (restartWrap) restartWrap.style.display = 'block';
        if (window.hljs && typeof window.hljs.highlightElement === 'function') window.hljs.highlightElement(code);
        else if (window.hljs && typeof window.hljs.highlightAll === 'function') window.hljs.highlightAll();
        window.scrollTo(0, 0);
    }

    if (generateBtn) generateBtn.addEventListener('click', renderHighlighted);
    if (restartLink) restartLink.addEventListener('click', function () {
        var section = document.getElementById('html-code-output');
        if (section) section.remove();
        var mainH2 = document.querySelector('main h2');
        if (mainH2) mainH2.textContent = 'Introduction Form';
    });
});


