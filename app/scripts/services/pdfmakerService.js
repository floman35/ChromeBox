'use strict';
angular.module('chromeBox')
  .service('pdfmakerService', function() {
    // Style config for pdf
      var style={
            title: {
              fontSize: 20,
              bold: true,
              margin: [0, 15, 0, 10]
            },
            url: {
              fontSize: 8,
              italics: true,
              margin: [0, 5, 0, 20]
            },
            H1: {
              fontSize: 18,
              bold: true,
              margin: [0, 14, 0, 14]
            },
            H2: {
              fontSize: 16,
              bold: true,
              margin: [0, 12, 0, 12]
            },
            H3: {
              fontSize: 14,
              bold: true,
              margin: [0, 10, 0, 10]
            },
            H4: {
              fontSize: 12,
              bold: true,
              margin: [5, 10, 0, 10]
            },
            p: {
              fontSize: 12,
              margin: [25, 7, 0, 7]
            },
          };

  // Generate pdf
    this.printPDF=function(webpage){
      // Set pdf title
        var contents=[
          {text:webpage.date, style:'url'},
          {text:webpage.title, style:'title'},
          {text:webpage.url, style:'url'}
        ];
      // Set pdf content
        contents.push(webpage.page);
      //Generate pdf
        var docDefinition = {
          content: contents,
          styles:style
        };
        pdfMake.createPdf(docDefinition).open();
    };
});
