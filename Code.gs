const SHEET_ID = '1axSVE8Lat8My1EZ3vUTLyZaUKXF2VcX0ID0qQ2ZrlfA';
const TAB_NAME = 'Sheet1';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Finance Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Helper untuk load script HTML / CSS terpisah ke Index.html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}