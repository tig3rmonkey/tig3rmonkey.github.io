$('.close').on('click', function() {
  $(this).parent('.alert').hide();
});
$(document).ready(function(){
  $('.alert').delay(3500).slideDown(1000);
});