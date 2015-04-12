/**
 * Created by sam on 15-4-12.
 */


+function($){
  'use strict';

  var bmDuoshuo = function(formEl, config){
    this.$form = $(formEl);
    this.config = $.extend({}, bmDuoshuo.CONFIG, typeof config == 'object' && config);
    this.intervalArray = [];
    this.successCode = 0;

    this.config.threadKey = this.$form.find('.bm_form_title').eq(0).text();
    this.config.author = this.$form.find('.bm_form_author').eq(0).text();

    this.$form.on('submit.bm.duoshuo', $.proxy(this.submit, this));
  };

  bmDuoshuo.CONFIG = {
    api: {
      json: 'http://sysbmtest.duoshuo.com/posts/create.json',
      jsonp: 'http://sysbmtest.duoshuo.com/posts/create.jsonp'
    },
    shortName: null,
    secret: null,
    message: null,
    method: 'POST',
    successHandler: null,
    errorHandler: null,
    wrongInputClass: 'bm_form_errorInput'
  };

  bmDuoshuo.prototype.submit = function(e){
    e.preventDefault();
    var that = this;
    if(!this.checkInput()) return false;
    this.sendAjax(this.checkInput());

  };

  bmDuoshuo.prototype.clearInterval = function(){
    if(!this.intervalArray.length) return;
    var intervalTmp = this.intervalArray.pop();
    clearInterval(intervalTmp);
    return this.clearInterval.call(this);
  };

  bmDuoshuo.prototype.checkInput = function(){
    var that = this;
    var wrongFlag = false;
    var checkResult = false;
    var wrongMsg = '内容不能为空！';
    this.clearInterval();
    this.$form.find('.bm_form_group').each(function(){
      var $label = $(this).find('label');
      var $input = $(this).find('input.bm_form_control');
      if(!$input.val()){
        !wrongFlag && (wrongFlag = true);
        that.wrongInput($input, wrongMsg);
      }
    });
    !wrongFlag && (checkResult = true);
    return checkResult;
  };

  bmDuoshuo.prototype.wrongInput = function($wrongElement, wrongMessage){
    var that = this;
    $wrongElement.addClass(this.config.wrongInputClass);
    $wrongElement.attr('placeholder', wrongMessage);
    var interval = setInterval(function(){
      $wrongElement.removeClass(that.config.wrongInputClass);
    }, 2000);
    this.intervalArray.push(interval);
    return;
  };

  bmDuoshuo.prototype.collectInput = function(){
    var that = this;
    var message = '';

    message += "讲座名称：" + this.config.threadKey + '\n';
    message += "主讲人：" + this.config.author + '\n';

    this.$form.find('.bm_form_group').each(function(){
      var $label = $(this).find('label');
      var $input = $(this).find('input.bm_form_control');
      var msgTmp = $label.text() + '：' + $input.val() + '\n';
      message += msgTmp;
    });
    return message;
  };

  bmDuoshuo.prototype.sendAjax = function(message){
    var that = this;
    var ajaxData = {
      short_name: 'sysbmtest',
      secret: '35fd76467164cdf595a9c788d86cb377',
      message: message,
      thread_key: that.config.threadKey,
      author_name: that.config.author,
      author_email: "funnyecho@foxmail.com"
    };
    $.ajax({
      url: that.config.api.json,

      // The name of the callback parameter, as specified by the YQL service
      //jsonp: "callback",
      type: that.config.method,

      // Tell jQuery we're expecting JSONP
      dataType: "json",

      // have problem in IE8-
      data: JSON.stringify(ajaxData),

      // Work with the response
      success: $.proxy(that.success, that),
      error: $.proxy(that.error, that)
    });
  };

  bmDuoshuo.prototype.success = function(response){
    console.log(response);
  };

  bmDuoshuo.prototype.error = function(response){
    console.log(response);
  };

  var initModule = function(config){
    return this.each(function(){
      var $this = $(this);
      var data = $this.data('bm.duoshuo');
      var configs = $.extend({}, $this.data(), typeof config == 'object' && config);

      if(!data) $this.data('bm.duoshuo', (data = new bmDuoshuo(this, configs)));
    });
  };

  $(window).on('load', function(){
    $('form[data-duosho="true"]').each(function(){
      var $element = $(this);
      var data = $element.data();
      initModule.call($element, data);
    });
  });


}(jQuery);