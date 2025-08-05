
$(function () {
  var form = $('#resume'),
      page1 = $('#resume-page-1'),
      page2 = $('#resume-page-2'),
      cache_width1 = page1.width(),
      cache_height1 = page1.height(),
      cache_width2 = page2.width(),
      cache_height2 = page2.height(),
      a4width = 210, // in mm
      a4height = 297,
      a4 = [595, 842]; // in pixels for jsPDF

  $('#download-doc').on('click', function () {
    if (!checkFields()) {
      alert('You cannot have empty fields printed.');
      return;
    }

    var emailId = document.getElementById('e-mail').innerText;
    if (!ValidateEmail(emailId)) {
      alert('Invalid Email!');
      return;
    }

    $('body').scrollTop(0);
    previewResume();
    createPDF();
  });

  function createPDF() {
    var doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });

    getCanvas(page1).then(function (canvas1) {
      var img1 = canvas1.toDataURL("image/png");
      var height1 = 0.264583 * canvas1.height;

      if (height1 < a4height) {
        doc.addImage(img1, 'JPEG', 2, 7, a4width, height1 - 30);
      } else {
        doc.addImage(img1, 'JPEG', 2, 7, a4width, a4height - 10);
      }

      doc.addPage();

      getCanvas(page2).then(function (canvas2) {
        var img2 = canvas2.toDataURL("image/png");
        var height2 = 0.264583 * canvas2.height;

        if (height2 < a4height) {
          doc.addImage(img2, 'JPEG', 2, 7, a4width, height2 - 30);
        } else {
          doc.addImage(img2, 'JPEG', 2, 7, a4width, a4height - 10);
        }

        var filename = document.getElementById('stud-name')?.innerText || 'resume';
        doc.save(filename + '.pdf');

        // Reset sizes
        page1.width(cache_width1);
        page2.width(cache_width2);

        previewResume();
      });
    });
  }

  function getCanvas(page) {
    page.width((a4[0] * 1.8) - 80).css('max-width', 'none');
    return html2canvas(page[0], {
      imageTimeout: 2000,
      removeContainer: true
    });
  }

  // Dummy field checkers – replace with your logic
  function checkFields() {
    // Implement proper empty field checks here
    return true;
  }

  function ValidateEmail(mail) {
    var re = /\S+@\S+\.\S+/;
    return re.test(mail);
  }

  function previewResume() {
    // Optional: Implement your resume preview logic
    console.log("Preview refreshed");
  }
});
