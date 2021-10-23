function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function alert(msg){
  SpreadsheetApp.getUi().alert(msg);
}

function updateField(row, col, value){
  ActiveSheet.getRange(row, col).setValue(value);
}

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}