// library from https://github.com/kmaher9/docx_parser
var fs = require('fs');
var pdfreader = require("pdfreader");
var docx = require('./docx.js');
const mammoth = require('mammoth');
var WordExtractor = require("word-extractor");
var Tesseract = require('tesseract.js');

var content;
var splittedContent = []
var wordsDoc = [];
var wordsPdf = [];
var mommothWords = [];
var WordExtractorWords = [];
var wordFromImage = [];

docx.extract('./test.docx').then(function(res, err) {
    if (err) {
        console.log(err)
    }
    content = res;
    wordsDoc = stringToWords(content);
    // console.log('docx ', wordsDoc);
})


new pdfreader.PdfReader().parseFileItems("./test.pdf", function(err, item) {
    if (err){
        callback(err); 
    }else if (!item){
        // console.log('no item found');
    } 
    else if (item.text){
        // wordsPdf = stringToWords(item.text)
        var arr = stringToWords(item.text);
        wordsPdf = wordsPdf.concat(arr);
    }
});
// setTimeout(() => {
//     console.log('pdf', wordsPdf);
// }, 2000);

 
mammoth.extractRawText({path: "./test.docx"})
.then(function(result){
    mommothWords = stringToWords(result.value);
    // console.log('mommonth',  mommothWords);
})

var extractor = new WordExtractor();
var extracted = extractor.extract("testDoc.doc");
extracted.then(function(doc) {
  WordExtractorWords =  stringToWords(doc.getBody());
//   console.log('wordextractor', WordExtractorWords);
});

const file = './test.jpg';


Tesseract.recognize(file)
  .progress(function  (p) { console.log('progress', p)  })
  .catch(err => console.error(err))
  .then(function (result) {
    wordFromImage = stringToWords(result.text);
    console.log(wordFromImage);
    process.exit(0)
})

function wordCounter(arr){
    return arr.length;
}

function stringToWords(string){
    splittedContent = string.replace(/\r|\n|\t/gm, " ");
    splittedContent = splittedContent.split(" ");
    var words = []
    for (let i = 0; i < splittedContent.length; i++) {
        if(splittedContent[i] !== '' && splittedContent[i] !== ' '){  
            words.push(splittedContent[i]);
        }
    }
    return words;
}



