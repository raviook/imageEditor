$(function () {
  'use strict';

  var URL = window.URL || window.webkitURL;
  var $image = $('#image');
  var $download = $('#download');
  var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var options = {
    aspectRatio: 8 / 9,
    preview: '.img-preview',
    crop: function (e) {
      $dataX.val(Math.round(e.detail.x));
      $dataY.val(Math.round(e.detail.y));
      $dataHeight.val(Math.round(e.detail.height));
      $dataWidth.val(Math.round(e.detail.width));
      $dataRotate.val(e.detail.rotate);
      $dataScaleX.val(e.detail.scaleX);
      $dataScaleY.val(e.detail.scaleY);
    }
  };
  var originalImageURL = $image.attr('src');
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageType = 'image/jpeg';
  var uploadedImageURL;

  $('[data-toggle="tooltip"]').tooltip();
  $image.on({}).cropper(options);
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }
  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="roate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }
  if (typeof $download[0].download === 'undefined') {
    $download.addClass('disabled');
  }
  //onAction
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var $target;
    var result;
    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }
    if (cropper && data.method) {
      data = $.extend({}, data);//cloning

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }
      cropped = cropper.cropped;
      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('clear');
          }
          break;

        case 'getCroppedCanvas':
          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('crop');
          }

          break;
        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!$download.hasClass('disabled')) {
              download.download = uploadedImageName;
             // alert(result.toDataURL(uploadedImageType));
              $download.attr('href', result.toDataURL(uploadedImageType));
            }
          }
          break;
        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  });
  //after Image Insertion
  var $inputImage = $('#inputImage');
  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;
$("#rotateSlider").val(0);
      glblRotationclick=0;
      glblLastRoationVal=0;
      $("#zoomSlider").val(0);
      glblZoomonclick=0;
      glblLastZoomoVal=0;
      $("#zoomInputVal").val(0);
      $("#rotateInputVal").val(0);
      if (!$image.data('cropper')) {
        return;
      }
      if (files && files.length) {
        file = files[0];
        if (/^image\/\w+$/.test(file.type)) {
          uploadedImageName = file.name;
          uploadedImageType = file.type;
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }
          uploadedImageURL = URL.createObjectURL(file);
          var x= $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
          console.log(x);
          $inputImage.val('');
        } else {
          window.alert('Please choose an image file.');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }
});
var glblRotationclick=0;
var glblLastRoationVal=0;
function rotate(value) {
  if(glblRotationclick!=0){
    $("#rotateBtn").data('option',-(glblLastRoationVal));
    $("#rotateBtn").click();
    $("#rotateBtn").data('option',value);
    $("#rotateBtn").click();
    $("#rotateSlider").val(value);
    $("#rotateInputVal").val(value);
    glblLastRoationVal=value;
  }else{
    $("#rotateBtn").data('option',value);
    $("#rotateBtn").click();
    $("#rotateSlider").val(value);
    $("#rotateInputVal").val(value);
    glblLastRoationVal=value;
  }
  glblRotationclick++;
 }
 var glblZoomonclick=0;
 var glblLastZoomoVal=0;
 function zoomMethod(value){
  if(glblZoomonclick!=0){
    $("#zoomBtn").data('option',-(glblLastZoomoVal));
    $("#zoomBtn").click();
    $("#zoomBtn").data('option',value);
    $("#zoomBtn").click();
    $("#zoomSlider").val(value);
    $("#zoomInputVal").val(value*100);
    glblLastZoomoVal=value;
  }else{
    $("#zoomBtn").data('option',value);
    $("#zoomBtn").click();
    $("#zoomSlider").val(value);
    $("#zoomInputVal").val(value*100);
    glblLastZoomoVal=value;
  }
  glblZoomonclick++;
 }
function settingZoomInputVal(value){
  zoomMethod(value/100);
}
function settingRotateInputVal(value){
  rotate(value);
}
