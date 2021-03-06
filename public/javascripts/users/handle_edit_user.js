// Handle edit user

$(document).ready(function() {
  // Select image
  $('.modal-body').on('change', '#id_image', function() {
    readURL(this);
    if ($(this).val()) {
      $('.avatar-update-container')
        .children()
        .show('open');
    }
  });

  // Cancel select image
  $('#cancel-crop-button').click(function() {
    $('#id_image').replaceWith(
      '<input id="id_image" name="image" type="file">'
    );
    $('.avatar-update-container')
      .children()
      .hide('close');
  });

  // Handle the submit button from the edit application form
  $('#create_avatar_form').on('submit', function(event) {
    /*if (!use_gravatar && !use_avatar) {*/
    // stop form from submitting normally
    event.preventDefault();

    var types = ['jpg', 'jpeg', 'png'];
    var file_type = $(this)
      .find('#id_image')[0]
      .files[0].name.split('.')
      .pop()
      .toLowerCase();

    if (types.includes(file_type)) {
      // Continue with the submit request
      $('#create_avatar_form')[0].submit();
    } else {
      alert('Please upload a valid file: jpg, jpeg or png');
      $('#id_image').replaceWith(
        '<input id="id_image" name="image" type="file">'
      );
      $('.avatar-update-container')
        .children()
        .hide('close');
    }
    /*}*/
  });

  // To remove message
  $('#container.container-fluid').on('click', '#close_message', function() {
    $('.messages').empty();
  });
});

var jcrop_api;

// Init Jcrop on image
function initJcrop(width, height) {
  $('.avatar-update-container')
    .find('#avatar-update')
    .Jcrop(
      {
        onSelect: showCoords,
        setSelect: [0, 0, width, height],
        aspectRatio: 10 / 12,
      },
      function() {
        jcrop_api = this;
      }
    );
}

// Read image and preview
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function(ev) {
        $('.avatar-update-container')
          .find('#avatar-update')
          .attr('src', this.src);
        if (!$('.avatar-update-container').find('.jcrop-holder').length) {
          initJcrop(this.width, this.height);
        } else {
          jcrop_api.setImage(this.src, function() {
            this.setSelect([
              0,
              0,
              jcrop_api.getBounds()[0],
              jcrop_api.getBounds()[1],
            ]);
          });
        }
      };
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Insert values of area cropped in hidden inputs
function showCoords(c) {
  $('#id_x').val(c.x);
  $('#id_y').val(c.y);
  $('#id_w').val(c.w);
  $('#id_h').val(c.h);
}
