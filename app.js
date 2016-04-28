(function() {
  'use strict';
  var RIGHT = 40;
  var LEFT = 12;
  var INTERVAL = 30000;
  var UP = 0;
  var thr0w = window.thr0w;
  var $ = window.$;
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var position = 0;
    var positions = document.querySelectorAll('.carousel .item').length;
    var frameEl = document.getElementById('my_frame');
    var $carousel = $('.carousel');
    var sync;
    $carousel.carousel({
      interval: false
    });
    thr0w.setBase('http://localhost');
    thr0w.addAdminTools(frameEl, connectCallback, messageCallback);
    function connectCallback() {
      var grid = new thr0w.FlexGrid(
        frameEl,
        document.getElementById('my_content'),
        [
          [0],
          [1]
        ],
        [
          {
            width: 1920,
            height: 1080
          },
          {
            width: 1366,
            height: 768
          }
        ]
      );
      sync = new thr0w.Sync(
        grid,
        'cycle',
        message,
        receive,
        true
      );
      if (thr0w.getChannel() === 0) {
        window.setInterval(cycle, INTERVAL);
        sync.update();
      }
      function message() {
        return {
          position: position
        };
      }
      function receive(data) {
        position = data.position;
        $carousel.carousel(position);
      }
      function cycle() {
        position = position < positions - 1 ? position + 1 : 0;
        $carousel.carousel(position);
        sync.update();
      }
    }
    function messageCallback(data) {
      var value = data.message.value;
      switch (data.message.pin) {
        case RIGHT:
          if (value === UP) {
            position = position < positions - 1 ? position + 1 : 0;
            $carousel.carousel(position);
            sync.update();
          }
          break;
        case LEFT:
          if (value === UP) {
            position = position > 0 ? position - 1 : positions - 1;
            $carousel.carousel(position);
            sync.update();
          }
          break;
        default:
      }
    }
  }
})();
