function goToPage(e) {
  console.log($(this));
  dest = e.getAttribute("value");
  location.href = `${dest}.html`;
}
