
// Function to handle Google login
function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;

        // The signed-in user info.
        var user = result.user;

        // Redirect to dashboard
        window.location = "dashboard.html";
        return "login done";
        
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        // The email of the user's account used.
        var email = error.email;

        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // Display error message
        window.alert(errorMessage);
    });
}
function logout() {
    if (document.getElementById('template-name') !== null) {
        if (document.getElementById('template-name').innerText !== 'resume_clon_musk') {
            saveResume();
        }
    }

    firebase.auth().signOut().then(function () {
        window.location = "index.html";
    });

    return "logout successful";
}

function selectAll() {
    document.execCommand('selectAll', true, "replace this");
    // Firefox may block scripted keyboard commands
}

function applyBorder(element) {
    element.style.border = "1px solid rgb(150,150,150)";
    element.style.borderRadius = "3px";
}

function checkFields() {
    var fields = document.getElementsByClassName('input-field');
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].innerText === "") {
            return false;
        }
    }
    return true;
}
function ValidateEmail(emailid) {
    var emailPattern = /^\w+([\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(emailid);
}

function printResume() {
    // Check for empty fields
    if (!checkFields()) {
        window.alert('You cannot have empty fields printed');
        return;
    }

    // Validate email
    var emailfield = document.getElementById('e-mail').innerText;
    if (!ValidateEmail(emailfield)) {
        window.alert('Invalid Email!');
        return;
    }

    // Store original document
    var printDocument = document.getElementById('resume').innerHTML;
    var originalDocument = document.body.innerHTML;

    // Clean up for printing
    document.getElementById('resume').classList.remove('my-resume-page');
    document.body.style.background = "white";
    document.body.innerHTML = printDocument;

    var addBtns = document.getElementsByClassName('addButton');
    var rmBtns = document.getElementsByClassName('removeButton');
    var inputs = document.getElementsByTagName('input');

    for (var i = 0; i < addBtns.length; i++) {
        addBtns[i].style.display = 'none';
    }

    for (var i = 0; i < rmBtns.length; i++) {
        rmBtns[i].style.display = 'none';
    }

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.display = 'none';
    }

    var photoCaption = document.getElementById('photocaption');
    if (photoCaption !== null) {
        photoCaption.style.display = 'none';
    }

    // Wait 0.5s to let image load
    setTimeout(function () {
        window.print();
        document.body.innerHTML = originalDocument;
    }, 500);

    return "Print successful";
}
function previewResume() {
    var addbtns = document.getElementsByClassName("addButton");
    var rmbtns = document.getElementsByClassName("removeButton");
    var inputs = document.getElementsByTagName("input");
    var i;

    if (isPreviewClicked) {
        // Switch to edit mode
        for (i = 0; i < addbtns.length; i++) {
            addbtns[i].style.display = 'inline';
        }
        for (i = 0; i < rmbtns.length; i++) {
            rmbtns[i].style.display = 'inline';
        }
        for (i = 0; i < inputs.length; i++) {
            inputs[i].style.display = 'inline-block';
        }
        if (document.getElementById('photocaption') != null) {
            document.getElementById('photocaption').style.display = 'inline-block';
        }
        document.getElementById("preview-doc").innerHTML = "Preview";
        isPreviewClicked = false; // now Preview option should be available
    } else {
        // Switch to preview mode
        for (i = 0; i < addbtns.length; i++) {
            addbtns[i].style.display = 'none';
        }
        for (i = 0; i < rmbtns.length; i++) {
            rmbtns[i].style.display = 'none';
        }
        for (i = 0; i < inputs.length; i++) {
            inputs[i].style.display = 'none';
        }
        if (document.getElementById('photocaption') != null) {
            document.getElementById('photocaption').style.display = 'none';
        }
        document.getElementById("preview-doc").innerHTML = "Edit";
        isPreviewClicked = true; // now Edit option should be available
    }

    return "preview successful";
}

function loadResume(template = -1, ref = null) {
    if (template === -1) {
        template = document.getElementById('template-name').innerHTML;
    }

    // Retrieve data
    if (ref === null) {
        ref = firebase.database().ref("users/" + user.uid + "/" + template);
    }

    ref.on("value", function (snapshot) {
        var tablerows;
        var i, j;

        // Heading
        document.getElementById('stud-name').innerHTML = snapshot.child('name').val();
        document.getElementById('e-mail').innerHTML = snapshot.child('email').val();
        document.getElementById('dob').innerHTML = snapshot.child('dob').val();
        document.getElementById('address').innerHTML = snapshot.child('address').val();

        // Education
        tablerows = document.getElementById('education-table').rows;
        var edu_tabledata = snapshot.child('education').val();
        var rowstobeupdated = edu_tabledata.length;

        while (rowstobeupdated - (tablerows.length - 3) > 0) {
            addEducation(); // Add extra rows if needed
            tablerows = document.getElementById('education-table').rows;
        }

        while ((tablerows.length - 3) - rowstobeupdated > 0) {
            removeRow('education-table'); // Remove extra rows
            tablerows = document.getElementById('education-table').rows;
        }

        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 4; j++) {
                tablerows[i + 2].cells[j].innerHTML = edu_tabledata[i][j];
            }
        }

        // Skills
        tablerows = document.getElementById('skills-table').rows;
        var skills_tabledata = snapshot.child('skills').val();
        rowstobeupdated = skills_tabledata.length;

        while (rowstobeupdated - (tablerows.length - 2) > 0) {
            addSkills();
            tablerows = document.getElementById('skills-table').rows;
        }

        while ((tablerows.length - 2) - rowstobeupdated > 0) {
            removeRow('skills-table');
            tablerows = document.getElementById('skills-table').rows;
        }

        for (i = 0; i < rowstobeupdated; i++) {
            tablerows[i + 1].cells[1].innerHTML = skills_tabledata[i];
        }

        // Internships
        tablerows = document.getElementById('internships-table').rows;
        var internships_tabledata = snapshot.child('internships').val();
        rowstobeupdated = internships_tabledata.length;

        while (rowstobeupdated - (tablerows.length - 2) > 0) {
            addInternships();
            tablerows = document.getElementById('internships-table').rows;
        }

        while ((tablerows.length - 2) - rowstobeupdated > 0) {
            removeRow('internships-table');
            tablerows = document.getElementById('internships-table').rows;
        }

        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 3; j++) {
                tablerows[i + 1].cells[j].innerHTML = internships_tabledata[i][j];
            }
        }

        // Projects
        tablerows = document.getElementById('projects-table').rows;
        var projects_tabledata = snapshot.child('projects').val();
        rowstobeupdated = projects_tabledata.length;

        while (rowstobeupdated - (tablerows.length - 2) > 0) {
            addProjects();
            tablerows = document.getElementById('projects-table').rows;
        }

        while ((tablerows.length - 2) - rowstobeupdated > 0) {
            removeRow('projects-table');
            tablerows = document.getElementById('projects-table').rows;
        }

        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 3; j++) {
                tablerows[i + 1].cells[j].innerHTML = projects_tabledata[i][j];
            }
        }

        // Positions
        document.getElementById('positions-list').innerHTML = snapshot.child('positions').val();

        // Hobbies
        document.getElementById('hobbies-list').innerHTML = snapshot.child('hobbies').val();

        // Awards
        document.getElementById('awards-list').innerHTML = snapshot.child('awards').val();

        return "User data loaded from latest saved database";
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function saveResume() {
    // Heading
    var template = document.getElementById('template-name').innerHTML;
    var studentname = document.getElementById('stud-name').innerHTML;
    var emailaddr = document.getElementById('e-mail').innerHTML;
    var dob = document.getElementById('dob').innerHTML;
    var address = document.getElementById('address').innerHTML;

    var tablerows, i, j;

    // Education
    tablerows = document.getElementById('education-table').rows;
    var edu_tabledata = [];
    for (i = 2; i < tablerows.length - 1; i++) {
        var rowcells = tablerows[i].cells;
        edu_tabledata[i - 2] = [];
        for (j = 0; j < 4; j++) {
            edu_tabledata[i - 2][j] = rowcells[j].innerHTML;
        }
    }

    // Skills
    tablerows = document.getElementById('skills-table').rows;
    var skills_tabledata = [];
    for (i = 1; i < tablerows.length - 1; i++) {
        skills_tabledata.push(tablerows[i].cells[1].innerHTML);
    }

    // Internships
    tablerows = document.getElementById('internships-table').rows;
    var internships_tabledata = [];
    for (i = 1; i < tablerows.length - 1; i++) {
        internships_tabledata[i - 1] = [];
        for (j = 0; j < 3; j++) {
            internships_tabledata[i - 1][j] = tablerows[i].cells[j].innerHTML;
        }
    }

    // Projects
    tablerows = document.getElementById('projects-table').rows;
    var projects_tabledata = [];
    for (i = 1; i < tablerows.length - 1; i++) {
        projects_tabledata[i - 1] = [];
        for (j = 0; j < 3; j++) {
            projects_tabledata[i - 1][j] = tablerows[i].cells[j].innerHTML;
        }
    }

    // Positions
    var ul = document.getElementById('positions-list');
    var positions_list = ul.innerHTML;

    // Hobbies
    ul = document.getElementById('hobbies-list');
    var hobbies_list = ul.innerHTML;

    // Awards
    var awards_list = document.getElementById('awards-list').innerHTML;

    // Resume details dictionary
    var resumeDetails = {
        name: studentname,
        email: emailaddr,
        dob: dob,
        address: address,
        education: edu_tabledata,
        skills: skills_tabledata,
        internships: internships_tabledata,
        projects: projects_tabledata,
        positions: positions_list,
        hobbies: hobbies_list,
        awards: awards_list
    };

    // Save to Firebase
    firebase.database().ref("users/" + user.uid)
        .child(template)
        .set(resumeDetails)
        .then(function () {
            // Show success message
            document.getElementById('save-message-div').style.display = 'block';

            setTimeout(function () {
                document.getElementById('save-message-div').style.opacity = 0;
            }, 2500);

            setTimeout(function () {
                document.getElementById('save-message-div').style.display = 'none';
                document.getElementById('save-message-div').style.opacity = 1;
            }, 3300); // 2500 + 800
        });

    return "save successful";
}

function placementlogin() {
    var email = document.getElementById('e-mail').value;
    var password = document.getElementById('password').value;

    // Sign out any existing session
    firebase.auth().signOut();

    // Sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function () {
            window.location = "placementcell.html";
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
        });

    return "placement login successful";
}

function printf(x) {
    console.log(x);
}

function replaceDotwithSpace(s) {
    let str = String(s);
    return str.replace(/\./g, ' ');
}
function uploadFile() {
    var file = document.getElementById('inp-file').files[0];
    var instituteid;

    if (file) {
        var filename = file.name;
        var pdf = new RegExp(".pdf$");

        console.log(filename);

        // Check if file format is not PDF
        if (!pdf.test(filename)) {
            window.alert('Please upload a PDF document.');
            return "wrong format";
        }

        // Check if file size > 1MB (1MB = 1048576 bytes)
        if (file.size > 1024000) {
            window.alert('Please upload a document of size less than 1MB.');
            return "large size";
        }

        // Assume currentUser.email is available globally
        instituteid = replaceDotwithSpace(currentUser.email);
        console.log(instituteid);

        firebase.storage().ref().child(instituteid).put(file);

        // Show message
        var message = document.getElementById('message');
        message.classList.remove('invisible');
        setTimeout(() => {
            message.style.opacity = 1;
        }, 10);

        return "right format";
    } else {
        window.alert('Nothing is selected!');
        return "nothing is selected";
    }
}

// Helper function
function replaceDotwithSpace(s) {
    return s.replace(/\./g, " ");
}

var x = 0;

function popRegister() {
    x = (x + 1) % 2;

    if (x === 1) {
        var reg = [];
        reg[0] = document.getElementById("formheading");
        reg[1] = document.getElementById("flname");
        reg[2] = document.getElementById("institute");
        reg[3] = document.getElementById("p");
        reg[4] = document.getElementById("forgotpswd");
        reg[5] = document.getElementById("plasignin");

        reg[0].innerText = 'Register';
        reg[0].style.fontSize = '58pt';
        setTimeout(function () {
            reg[0].style.fontSize = '38pt';
        }, 300);

        reg[1].classList.remove('invisible');
        reg[2].classList.remove('invisible');

        setTimeout(function () {
            reg[1].style.opacity = 1;
            reg[2].style.opacity = 1;
        }, 1);

        reg[3].style.fontSize = 0;
        reg[5].style.fontSize = 0;
        reg[4].style.fontSize = 0;

        setTimeout(function () {
            reg[3].style.display = 'none';
            reg[5].style.display = 'none';
            reg[4].style.display = 'none';
        }, 400);

    } else {
        var fname = document.getElementById('fname').value;
        var lname = document.getElementById('lname').value;
        var institute = document.getElementById('institute').value;
        var email = replaceDotwithSpace(document.getElementById('e-mail').value);
        var password = document.getElementById('password').value;

        if (fname === "") {
            window.alert('Enter First name.');
            x = 1;
            return;
        }

        if (lname === "") {
            window.alert('Enter Last name.');
            x = 1;
            return;
        }

        if (institute === "") {
            window.alert('Enter institute name.');
            x = 1;
            return;
        }

        var emailid = document.getElementById('e-mail').value;
        if (!ValidateEmail(emailid)) {
            window.alert('Invalid Email id!');
            x = 1;
            return;
        }

        if (password.length < 6) {
            window.alert('Length of password should be at least 6 characters.');
            x = 1;
            return;
        }

        var newinstitute = {
            'first name': fname,
            'last name': lname,
            'institute': institute,
            'email': email,
            'password': password
        };

        firebase.database().ref("placement cells").child(institute).set(newinstitute)
            .catch(function (error) {
                window.alert(error.code);
            });

        document.getElementById('message').classList.remove('invisible');
        setTimeout(() => {
            document.getElementById('message').style.opacity = 1;
        }, 10);
    }
}

// Replace all dots in email with space for Firebase key safety
function replaceDotwithSpace(s) {
    return s.replace(/\./g, " ");
}

// Dummy email validator
function ValidateEmail(mail) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
}

// Resume addButtons utility
function addEducation() {
    var table = document.getElementById('education-table');
    var lastRowIndex = table.rows.length - 1;
    var newRow = table.insertRow(lastRowIndex);
    var newCellPlaceholder = 'Click to select';

    for (let i = 0; i < 4; i++) {
        var cell = newRow.insertCell(-1);
        cell.setAttribute('contenteditable', "true");
        cell.setAttribute('spellcheck', 'true');
        cell.setAttribute('onclick', 'selectAll()');
        if (i === 3) {
            cell.setAttribute('class', 'text-center');
        }
        cell.innerHTML = i === 0 ? `<b>${newCellPlaceholder}</b>` : newCellPlaceholder;
    }
}
function addSkills() {
    var skilltable = document.getElementById('skills-table');
    var lastrowindex = skilltable.rows.length - 1;
    var newrow = skilltable.insertRow(lastrowindex);

    var cell = newrow.insertCell(0);
    cell.innerHTML = '<b>Technical Electives</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = "New Skill Here";

    console.log('Added Skill');

    document.getElementById('add-skill').classList.add('invisible');
    document.getElementById('remove-skill').classList.remove('invisible');
}

function addInternships() {
    var internshipstable = document.getElementById('internships-table');
    var lastrowindex = internshipstable.rows.length - 1;
    var newrow = internshipstable.insertRow(lastrowindex);

    var cell = newrow.insertCell(0);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<b>New Internship Title</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>Internship Description</p><p><i>Company Name</i></p>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>Duration</p><p>Location</p>';
}
function addProjects() {
    var projectstable = document.getElementById('projects-table');
    var lastrowindex = projectstable.rows.length;
    var newrow = projectstable.insertRow(lastrowindex);

    // Cell 1
    var cell = newrow.insertCell(0);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p><b>' + newCellPlaceholder + '</b></p><p>' + newCellPlaceholder + '</p>';

    // Cell 2
    cell = newrow.insertCell(1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>' + newCellPlaceholder + '</p>';

    // Cell 3
    cell = newrow.insertCell(2);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('class', 'text-right');
    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>' + newCellPlaceholder + '</p><p>' + newCellPlaceholder + '</p>';
}

function addtoList(list_id) {
    var list = document.getElementById(list_id);
    var cell = document.createElement('li');
    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;
    list.appendChild(cell);
}
function addAchievements() {
  document.getElementById('awards-table').style.display = 'inline';
  setTimeout(function () {
    document.getElementById('awards-table').style.opacity = 1;
  }, 10);
  document.getElementById('ach-btn').classList.add('invisible');
}

// Utility function to remove rows or items
function removeRow(tableid) {
  let list;

  if (tableid === 'skills-table') {
    document.getElementById('remove-skill').classList.add('invisible');
    document.getElementById('add-skill').classList.remove('invisible');
  } else if (tableid === 'hobbies-list') {
    list = document.getElementById('hobbies-list');
    if (list.lastChild) {
      list.removeChild(list.lastChild);
    }
    return;
  } else if (tableid === 'positions-list') {
    list = document.getElementById('positions-list');
    if (list.lastChild) {
      list.removeChild(list.lastChild);
    }
    return;
  }

  let table = document.getElementById(tableid);
  let lastrowindex = table.rows.length;

  // Only delete row if condition matches
  if ((tableid !== 'education-table' && lastrowindex > 1) ||
      (tableid === 'education-table' && lastrowindex > 2)) {
    table.deleteRow(lastrowindex - 1);
  }
}

function removeAchievements() {
  document.getElementById('awards-table').style.opacity = 0;

  setTimeout(function () {
    document.getElementById('ach-btn').classList.remove('invisible');
    document.getElementById('awards-table').style.display = 'none';
  }, 600);
}
