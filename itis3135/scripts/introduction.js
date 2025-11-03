document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("intro-form");
    const courses = document.getElementById("courses-container");
    const addCourseBtn = document.getElementById("add-course");
    const clearBtn = document.getElementById("clear-form");
    const resetBtn = document.getElementById("reset-form");
    let output = document.getElementById("rendered-output");
    const restartWrap = document.getElementById("restart-wrapper");
    const restartLink = document.getElementById("restart-link");
    const instructions = document.getElementById("form-instructions");
    const pictureUpload = document.getElementById("pictureUpload");
    var useDefaultImage = true;

    const initialCourses = [
        { department: "ITIS", number: "3135", name: "Front-End Web App Development", reason: "Required for degree completion." },
        { department: "ITSC", number: "3146", name: "Intro to Operating Systems & Networking", reason: "Required for degree completion." },
        { department: "ITSC", number: "3155", name: "Software Engineering", reason: "Required for degree completion." },
        { department: "ITSC", number: "3160", name: "Database Design and Implementation", reason: "Required for degree completion." }
    ];
    let courseCounter = 0;

    function addCourseRow(prefill) {
        courseCounter += 1;
        const base = `course_${courseCounter}`;
        const row = document.createElement("div");
        row.className = "course-row";

        const deptLabel = document.createElement("label");
        deptLabel.htmlFor = `${base}_dept`;
        deptLabel.textContent = "Department";
        const dept = document.createElement("input");
        dept.id = `${base}_dept`;
        dept.type = "text";
        dept.placeholder = "Dept (e.g., ITIS)";
        dept.value = prefill && prefill.department ? prefill.department : "";
        dept.required = true;

        const numLabel = document.createElement("label");
        numLabel.htmlFor = `${base}_num`;
        numLabel.textContent = "Number";
        const num = document.createElement("input");
        num.id = `${base}_num`;
        num.type = "text";
        num.placeholder = "Number (e.g., 3135)";
        num.value = prefill && prefill.number ? prefill.number : "";
        num.required = true;

        const nameLabel = document.createElement("label");
        nameLabel.htmlFor = `${base}_name`;
        nameLabel.textContent = "Name";
        const name = document.createElement("input");
        name.id = `${base}_name`;
        name.type = "text";
        name.placeholder = "Course name";
        name.value = prefill && prefill.name ? prefill.name : "";
        name.required = true;

        const reasonLabel = document.createElement("label");
        reasonLabel.htmlFor = `${base}_reason`;
        reasonLabel.textContent = "Reason";
        const reason = document.createElement("input");
        reason.id = `${base}_reason`;
        reason.type = "text";
        reason.placeholder = "Reason (e.g., Required)";
        reason.value = prefill && prefill.reason ? prefill.reason : "";
        reason.required = true;

        const del = document.createElement("button");
        del.type = "button";
        del.textContent = "Delete";
        del.addEventListener("click", function () { row.remove(); });

        row.appendChild(deptLabel);
        row.appendChild(dept);
        row.appendChild(numLabel);
        row.appendChild(num);
        row.appendChild(nameLabel);
        row.appendChild(name);
        row.appendChild(reasonLabel);
        row.appendChild(reason);
        row.appendChild(del);
        return row;
    }

    function loadInitialCourses() {
        courses.innerHTML = "";
        for (var i = 0; i < initialCourses.length; i++) {
            courses.appendChild(addCourseRow(initialCourses[i]));
        }
    }

    loadInitialCourses();

    addCourseBtn.addEventListener("click", function () {
        courses.appendChild(addCourseRow());
    });

    clearBtn.addEventListener("click", function () {
        var inputs = form.querySelectorAll("input[type='text'], input[type='url'], input[type='date'], textarea");
        for (var i = 0; i < inputs.length; i++) { inputs[i].value = ""; }
        if (pictureUpload) pictureUpload.value = "";
        courses.innerHTML = "";
        courses.appendChild(addCourseRow());
        useDefaultImage = false;
    });

    form.addEventListener("reset", function () {
        setTimeout(function () {
            loadInitialCourses();
            if (pictureUpload) pictureUpload.value = "";
            useDefaultImage = true;
        }, 0);
    });

    function handleSubmit(e) {
        if (e) e.preventDefault();
        var requiredIds = [
            'firstName','lastName','ackStatement','ackDate',
            'mascotAdj','mascotAnimal','divider',
            'pictureCaption','personalStatement',
            'bullet1','bullet2','bullet3','bullet4',
            'link1Name','link1','link2Name','link2','link3Name','link3','link4Name','link4','link5Name','link5'
        ];
        for (var i = 0; i < requiredIds.length; i++) {
            var el = document.getElementById(requiredIds[i]);
            if (el && !el.value.trim()) { alert('Please complete: ' + requiredIds[i]); el.focus(); return; }
        }
        // Validate fallback date format if needed
        var ackField = document.getElementById('ackDate');
        if (ackField && ackField.type === 'text') {
            var v = ackField.value.trim();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
                alert('Please enter Acknowledgement Date as YYYY-MM-DD');
                ackField.focus();
                return;
            }
        }
        var rows = courses.querySelectorAll('.course-row');
        if (rows.length === 0) { alert("Please add at least one course."); return; }
        for (var r = 0; r < rows.length; r++) {
            var fields = rows[r].querySelectorAll('input');
            for (var f = 0; f < fields.length; f++) { if (!fields[f].value.trim()) { alert("Please fill all course fields or delete the row."); return; } }
        }

        function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
        function formatMiddle(m) {
            if (!m) return '';
            var t = m.trim();
            if (t.length === 1) return t + '.';
            return t;
        }
        var preferred = val('preferredName');
        var middle = formatMiddle(val('middleName'));
        var first = val('firstName');
        var last = val('lastName');
        var nick = preferred ? (' "' + preferred + '"') : '';
        var nameLine = [first, middle].filter(Boolean).join(' ') + nick + (last ? (' ' + last) : '');
        var fullName = [first, middle, last].filter(Boolean).join(' ');
        var imgSrc = null;
        if (pictureUpload && pictureUpload.files && pictureUpload.files[0]) {
            imgSrc = URL.createObjectURL(pictureUpload.files[0]);
        } else if (useDefaultImage) {
            imgSrc = 'images/professional-photo.jpg';
        }

        var courseLis = '';
        for (var j = 0; j < rows.length; j++) {
            var c = rows[j].querySelectorAll('input');
            courseLis += '<li><b>' + c[0].value + (c[1].value ? c[1].value : '') + ' - ' + c[2].value + '</b>: ' + c[3].value + '</li>';
        }

        var figureStr = imgSrc ? (
            '<figure id="professional-photo">' +
                '<img src="' + imgSrc + '" alt="' + val('pictureCaption') + '">' +
                '<figcaption>' + val('pictureCaption') + '</figcaption>' +
            '</figure>'
        ) : '';

        if (!output) {
            output = document.createElement('div');
            output.id = 'rendered-output';
            output.style.display = 'none';
            form.parentNode.insertBefore(output, document.getElementById('restart-wrapper'));
        }

        var funnyStr = val('funnyThing') ? '<li><strong>Funny/Interesting Item to Remember Me by</strong>: ' + val('funnyThing') + '</li>' : '';
        var shareStr = val('shareThing') ? '<li><strong>I\u2019d Also Like to Share</strong>: ' + val('shareThing') + '</li>' : '';

        var linksLis = '';
        for (var k = 1; k <= 5; k++) {
            var nm = val('link' + k + 'Name');
            var href = val('link' + k);
            if (href && nm) {
                linksLis += '<li><a href="' + href + '" target="_blank" rel="noopener">' + nm + '</a></li>';
            }
        }
        var linksStr = linksLis ? '<li><strong>Links</strong>:<ul>' + linksLis + '</ul></li>' : '';

        output.innerHTML =
            '<h3>' + nameLine + ' | ' + val('mascotAdj') + ' ' + val('mascotAnimal') + '</h3>' +
            figureStr +
            '<ul>' +
                '<li><strong>Personal Background</strong>: ' + val('bullet1') + '</li>' +
                '<li><strong>Professional Background</strong>: ' + val('bullet2') + '</li>' +
                '<li><strong>Academic Background</strong>: ' + val('bullet3') + '</li>' +
                '<li><strong>Primary Computer Platform</strong>: ' + val('bullet4') + '</li>' +
                '<li><strong>Courses I\'m taking and why</strong>:<ul>' + courseLis + '</ul></li>' +
                funnyStr +
                shareStr +
                linksStr +
            '</ul>';

        form.style.display = 'none';
        if (instructions) instructions.style.display = 'none';
        output.style.display = 'block';
        restartWrap.style.display = 'block';
    }

    form.addEventListener("submit", handleSubmit);
    var submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    restartLink.addEventListener("click", function (e) {
        e.preventDefault();
        if (output) output.style.display = 'none';
        restartWrap.style.display = 'none';
        form.style.display = 'block';
        if (instructions) instructions.style.display = 'block';
        form.reset();
        loadInitialCourses();
        useDefaultImage = true;
        window.scrollTo(0, 0);
    });
});


