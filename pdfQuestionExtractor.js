  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.

  // var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
  var url = 'https://tubopdfs.s3.amazonaws.com/AWS-Certified-Solutions-Architect-Official-Study-Guide.pdf';

  var pdfObject = null;
  var extractedPagesText = [];

  function getIntValue( inputField ) {
    var pageNumStr = document.getElementById(inputField).value;
    if (!pageNumStr.trim().length) {
      return 1;
    }
    return parseInt(pageNumStr);
  }

  function getPageNumber() {
    return getIntValue('pageNum');
  }

  function setPageNumber(pageNum) {
    document.getElementById('pageNum').value = pageNum;
  }

  function callRenderPage(event) {
    if (event.key === "Enter") { // Enter key pressed
      renderPage();
    }
  }

  function findNextReviewQuestionsPage() {
    findText( 1, 'Review\tQuestions');
  }

  /**
   * Convenience method for adding listeners to buttons
   * @param {input element} button 
   * @param {Event} event 
   * @param {EventListener} listener 
   */
  function armButtonWithListener( button, event, listener ) {
    document.getElementById(button).addEventListener(event, listener);
  }

  async function findText() {
    var textToFind = document.getElementById('textToFind').value;
    const textFoundOnPageNum = await find( textToFind );
    if (textFoundOnPageNum === -1) {
      console.log(textToFind + ' not found');
    }
    else {
      console.log( textToFind + ' found on page ' + textFoundOnPageNum );
      // save the current location in an array for "find prev" requests
      setPageNumber( textFoundOnPageNum );
      renderPage();
    }
  }

  function find(word) {
    return new Promise(async resolve => {
      for (let i = 1; i < pdfObject.numPages; i++) {
        const finalString = await getPageText(i);
        if (finalString.includes(word)) {
          resolve(i);
          break; // end loop
        } 
      }
      resolve(-1);
    });
  }

  async function createQuiz() {
    
    const questionPagesText = 
      await getTextFromPages( getIntValue('qPageNumFrom'), 
                              getIntValue('qPageNumTo') );

    const answerPagesText = await 
      getTextFromPages( getIntValue('ansPageNumFrom'), 
                        getIntValue('ansPageNumTo'));

    const quizCreator = new QuizCreator();
    const quiz = quizCreator.createQuiz( questionPagesText, answerPagesText );
    console.log( quiz.toJson() );
  }

  async function printQPages() {
    const questionPagesText = 
      await getTextFromPages( getIntValue('qPageNumFrom'), 
                              getIntValue('qPageNumTo') );
    console.log( questionPagesText );
  }

  async function printAPages() {
    const answerPagesText = await 
      getTextFromPages( getIntValue('ansPageNumFrom'), 
                        getIntValue('ansPageNumTo'));
    console.log( answerPagesText );
  }

  /**
   * Extracts text from multiple pages using an array of Promises
   * @param {integer} fromPageNum 
   * @param {integer} toPageNum 
   */
  function getTextFromPages(fromPageNum, toPageNum) {
    return new Promise( async resolve => {
      // Create an array that will contain our promises 
      var pagesPromises = [];

      for (var i = fromPageNum-1; i < toPageNum; i++) {
        // Required to prevent that i is always the total of pages
        (function (pageNumber) {
          // Store the promise of getPageText that returns the text of a page
          pagesPromises.push(getPageText(pageNumber));
        })(i + 1);
      }

      // Execute all the promises
      Promise.all(pagesPromises).then(function (pagesText) {
        // e.g ["Text content page 1", "Text content page 2", "Text content page 3" ... ]
        resolve(pagesText);
      });
    });
  }

/**
  * Retrieves the text of a specified page within a PDF Document obtained through pdfObject.js 
  * 
  * @param {Integer} pageNum Specifies the number of the page 
  * @param {PDFDocument} pdfObject The PDF document obtained 
**/
 function getPageText(pageNumber) {
  // Return a Promise that is solved once the text of the page is retrieved
  return new Promise(function (resolve, reject) {
    pdfObject.getPage(pageNumber).then(function (pdfPage) {
      // The main trick to obtain the text of the PDF page, use the getTextContent method
      pdfPage.getTextContent().then(function (textContent) {
        const finalString = textContent.items.map( item => item.str ).join(" ");

        // Solve promise with the text retrieved from the page
        resolve(finalString);
      });
    });
  });
}

function renderPage() {
    var pageNumber = getPageNumber();
    pdfObject.getPage(pageNumber).then(function(page) {
      console.log('Page loaded');
    
      var scale = 1.5;
      var viewport = page.getViewport({scale: scale});

      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        console.log('Page rendered');
      });
    });
  }

  function loadPdf() {
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'http://mozilla.github.io/pdf.js/build/pdf.worker.js';

    return new Promise( async resolve => {
      // Asynchronous download of PDF
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');
        resolve(pdf);
      }, 
      function (reason) {
        // PDF loading error
        console.error(reason);
      });
    });
  }

  async function initialize() {
    url = document.getElementById('pdfFile').value;
    if ( url === null || typeof(url) === 'undefined') {
      alert( "Please enter a file name");
      return;
    }

    pdfObject = await loadPdf();
    renderPage();

    document.getElementById('totalPages').innerHTML = `${pdfObject.numPages}`;
    armButtonWithListener('gotoPage', 'click', renderPage);
    armButtonWithListener('pageNum', 'keyup', callRenderPage);
    armButtonWithListener('findNext', 'click', findText);
    armButtonWithListener('printQPages', 'click', printQPages);
    armButtonWithListener('printAPages', 'click', printAPages);
    armButtonWithListener('createQuiz', 'click', createQuiz);
  }

  module.exports = {
    maxAnsIndex
  }