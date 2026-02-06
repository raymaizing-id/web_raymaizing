window.onload = function() {
  var anchors = document.getElementsByTagName('*');
  for(var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    anchor.onclick = function() {
      code = this.getAttribute('whenClicked');
      eval(code);
    }
  }
}
