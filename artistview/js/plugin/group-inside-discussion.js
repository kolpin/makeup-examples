define(['jquery', 'camera-slider'], function($, camera) {
  return {
    'init': function() {
      $('#camera_wrap_1').camera({
        thumbnails: true,
        loader: 'none',
        pagination: false,
        fx: 'scrollLeft',
        navigation: true,
        navigationHover: false,
        mobileNavHover: false,
        alignment: 'topLeft',
        autoAdvance: false,
        mobileAutoAdvance: false,
        transPeriod: 700
      });
    }
  };
});