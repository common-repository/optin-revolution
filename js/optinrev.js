(function($){  
  var wtfn = {
  create_cookie: function(name, value, days ) {if (days) {var date = new Date(); date.setTime(date.getTime()+(days*24*60*60*1000));var expires = "; expires="+date.toGMTString();}else { var expires = ""; }document.cookie = name+"="+value+expires+"; path=/";},
  read_cookie: function(name) {var nameEQ = name + "="; var ca = document.cookie.split(';'); for(var i=0;i < ca.length;i++) { var c = ca[i]; while (c.charAt(0)==' ') c = c.substring(1,c.length);	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);}return null;},
  implode: function(glue, pieces) {var i = '', retVal = '', tGlue = '';if (arguments.length === 1) {pieces = glue;glue = '';}if (typeof pieces === 'object') { if (Object.prototype.toString.call(pieces) === '[object Array]') { return pieces.join(glue); }for (i in pieces) { retVal += tGlue + pieces[i]; tGlue = glue; }return retVal;}return pieces;},
  contrast50 : function(hexcolor){return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';},    
  msg: function( msg ) {
  alc = document.createElement('a');
  $(alc).html('&times;').attr({'href':'javascript:;', 'class':'post-message-close'}).bind('click', function(){ $('#post-message').fadeOut(); });
  $('#post-message').html( msg ).append(alc).fadeIn();
  setTimeout(function(){ $('#post-message').fadeOut(); }, 5000);
  },
  ie_version: function() { return parseInt($.browser.version) },
  upgrade: function() {

  $.modal( '<div id="modalx" style="display:block;">'+ $('#modalx').html() +'</div>', {
  containerCss:{
		backgroundColor:"#404040",
		borderColor:"#404040",
		height:246,
		padding:0,
		width:400,
    borderRadius:'4px'
	},
	overlayClose:true,
  onShow: function(dialog) {

  if ( $.browser.msie && $.browser.version == '7.0') {
      $('.popup-arrow', dialog.data).css('margin-left', -423);
      $('.green img', dialog.data).css('margin-left', -333);
      $(dialog.container[0]).css({'width':396, 'height':242});
  }



  }
  });

  },
  is_old_ie9: function() {return ( $.browser.msie && parseInt($.browser.version, 10) < 9  )},
  is_dragging: function() {return ($('#optinrev_dragging').val() == 1) ? true : false;},
  is_round_border_enabled: function() {return ($('#optinrev_round_border').attr('checked')) ? true : false;},
  save: function(submit) {
      var wtdom = tinyMCE.activeEditor.dom, clb = wtdom.get('close'), cl = 'left:' + $(clb).offset().left + 'px;top:' + $(clb).offset().top + ';', c = wtdom.get('simplemodal-container'), clb_class = wtdom.getAttrib( clb, 'class' );
      
      if (submit)
      $('#save_setting_spin').show();

      //$.inputfields_update();

      is_editing = true;
      tinyMCE.activeEditor.isNotDirty = 1;

      $('#optinrev_close_button').val( cl );
      $('#optinrev_close_button_class').val( clb_class );
      $('#optinrev_excerpt').val( encodeURI(tinyMCE.activeEditor.getContent()) );
      $('#optinrev_data').val( encodeURI($(c).find('.simplemodal-data').html()) );

      //wait while saving
      setTimeout(function(){
      $.post(ajaxurl, encodeURI($('#optinrev_setup_form').serialize()), function(res){
        if ( submit ){ $('#save_setting_spin').hide();wtfn.msg('Successfully Updated.');}
        $('#save_setting_spin').hide();
        return false;
      });
      }, 20);
  },  
  redraw: function()
  {
   var r, wtdom = tinyMCE.activeEditor.dom, rnd = parseInt( $('#optinrev_border_radius').val() ), sc = wtdom.get('simplemodal-container');

    //fix broken asset images
    $('img', sc).each(function(i, img){
        var im = $(img).attr('src');
        if ( im.indexOf('../wp-content/plugins/optin-revolution/') !== -1 ) {
        $(img, sc).attr('src', im.replace(/\.\.\/wp-content\/plugins\/optin\-revolution\//, wtp));
        }
    });

   if ( $.browser.msie && wtfn.is_old_ie9() ) {

   modstyle = 'width:'+ $('#optinrev_vwidth').val() + 'px;height:' + $('#optinrev_vheight').val() + 'px;border:' + $('#optinrev_vborder_thickness').val() + 'px solid ' + $('input[name="optinrev_border_color"]').val() + ';background-color:' + $('input[name="optinrev_pwbg_color"]').val() + ';-moz-border-radius:'+ rnd +'px; -webkit-border-radius:'+ rnd +'px; border-radius: '+ rnd +'px;-khtml-border-radius:'+ rnd +'px';
   //heigh onresize
   $('#' + tinyMCE.activeEditor.id + '_ifr').height( parseInt($('#optinrev_vheight').val()) + 110 );
   wtdom.setAttrib(wtdom.get('simplemodal-container'),'style', modstyle);

   } else {

   border_radius = '-moz-border-radius: '+ $('#optinrev_border_radius').val() +'px;-webkit-border-radius: '+ $('#optinrev_border_radius').val() +'px;border-radius: '+ $('#optinrev_border_radius').val() +'px;';
   border_opacity = (parseFloat($('#optinrev_border_opacity').val()) / 100);
   modstyle = 'width:'+ $('#optinrev_vwidth').val() + 'px;height:' + $('#optinrev_vheight').val() + 'px;border:' + $('#optinrev_vborder_thickness').val() + 'px solid rgba(' + wtfn.rgb($('input[name="optinrev_border_color"]').val()) + ','+ border_opacity +');background-color:' + $('input[name="optinrev_pwbg_color"]').val() + ';' + border_radius;

   $('#' + tinyMCE.activeEditor.id + '_ifr').height( parseInt($('#optinrev_vheight').val()) + 100 );
   wtdom.setAttrib(wtdom.get('simplemodal-container'),'style', modstyle);

   }

   //close button
   if ( clb = wtdom.get('close') ) {
       wtdom.setStyles( clb, wtfn.close_button_pos(0) );
       wtdom.setAttrib( clb, 'data-mce-style', 'left:' + wtfn.close_button_pos(0).left + 'px; top:'+ wtfn.close_button_pos(0).top + 'px;' );
   }

   $('#' + tinyMCE.activeEditor.id + '_ifr').attr('title', null);
   $('#' + tinyMCE.activeEditor.id + '_ifr').css({'background': $('#optinrev_wbg_color').val(), 'background-color': 'rgba(' + wtfn.rgb($('#optinrev_wbg_color').val()) + ', '+ ($('#optinrev_wbg_opacity').val() / 100) +')'});

   wtfn.pwby();
   this.bullets_edit();

   $('a', sc).click(function(e){ e.preventDefault();return false;});

  },//redraw
  inputs_setup: function()
  {
    var wtdom = tinyMCE.activeEditor.dom, input_style = '', mceform = wtdom.get('mce_getaccessed'), input_hie = '';

    input_h = $('#optinrev_inputh').val();
    input_h = (input_h / 6) - 1;
    input_h = input_h.toFixed(0);
    input_w = $('#optinrev_inputw').val();

    input_style += 'font-family: arial !important;font-size:' +  $('input[name="optinrev_inputfz"]').val() + 'px;';
    input_style += 'color:#' + $('input[name="optinrev_inputtc"]').val().replace(/\#/g, '');
    input_style += ';line-height:'+ input_h +'px !important;padding:' + input_h + 'px 0px '+ input_h +'px 0px !important';
    input_style += ';width:' + input_w + 'px';
    input_style += ';background-color:#' + $('input[name="optinrev_inputc"]').val().replace(/\#/g, '') + ' !important';
    input_style += ';border:' + $('input[name="optinrev_inputbt"]').val() + 'px solid #' + $('input[name="optinrev_inputb"]').val().replace(/\#/g, '') + ';';

    if ( mceform ) {
        $('input, select, radio, checkbox', mceform).each(function(i, v){
          if ( v.type === 'text' ){
          $(v).attr('style', input_style );
          }
        });
    }

  },
  input_setenabled: function( id, state ) {
    if ( typeof tinyMCE.activeEditor !== 'undefined' )
    {
        if ( tinyMCE.activeEditor == null ) return false;

        var wtdom = tinyMCE.activeEditor.dom;

        //checking undefined value
        $('input', wtdom.get('mce_getaccessed')).each(function(i, v){
          if ( v.type === 'text' ){
          if ( v.value == 'undefined' )
          wtdom.setAttrib( v, 'value', '' );
          }
        });
    }
  },//input set enabled
  mail_provider_save: function( provider ) {
    if ( provider )
    {
      $.post(ajaxurl, {action : "optinrev_action", optinrev_mail_webform : $('#optinrev_email_form').val(), mail_provider : provider});
    }
  },
  mail_provider_get: function( provider ) {
    if ( provider )
    {
      $.post(ajaxurl, {action : "optinrev_action", mail_provider : provider}, function(data){ $('#optinrev_email_form').val(data); });
    }
  },////mail provider

  //INPUTS
  delete_input: function( id ) {
    var wtdom = tinyMCE.activeEditor.dom, mceform = wtdom.get('mce_getaccessed');
    if ( confirm('You want delete this input in editor?') ) {

        if ( inp = wtdom.get(id) ) {
            wtdom.remove( inp );
        }
        $('#ls_' + id).remove();
    } else return false;
  },
  //optin preview
  preview : function()
  {
    var l = window.location.href.toString().replace(/(&show=optin)/ig,''), wtdom = tinyMCE.activeEditor.dom, cl = $(wtdom.get('close')).attr('class'), sd = wtdom.get('simplemodal-container'), c = wtdom.get('simplemodal-data'), ms = vld = {}, ch = $(window).height(), exh = 30;
    var input_valid = {msg: function(m){alert(m);},
    is_email: function( email ) {var re = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;return re.test( email );},
    is_name: function( name ) {var re = /^[a-zA-Z]+$/;return re.test( name );}
    };

    el = document.createElement('div');
    $(el).html( c );

    $.modal(el,{
    closeClass: cl,
    position: [ $('#optinrev_vtop_margin').val() + 'px', null ],
    opacity: $('#optinrev_wbg_opacity').val(), focus : false,
    onShow: function(dialog) {

        var t = $("#simplemodal-container").offset().top, plc = {}, redirect = false;
        if ( t === 0 ) {dialog.container[0].style.marginTop = (Math.ceil(t) + 18) + 'px';}
        var ids = [], listid = 0, action_url = '';

        //constant contact
        if ( mail_form_name == 'constantcontact' ) {
            $('#inputProp0', dialog.data).remove();
            wtfn.getctc_captcha( optinrev_ctcurl, dialog.data );
        }

        //in case form not setup
        if( $('#mce_getaccessed', dialog.data).attr('action').indexOf('optinrevolution') !== -1 ) {
        $('#mce_getaccessed', dialog.data).attr( 'action', 'http://www.optinrevolution.com/setup/?utm_source=plugin&utm_medium=not-setup&utm_campaign=lite' );
        }


        //form inputs
        $('input, select, radio, checkbox', dialog.data).each(function(i, v){

        if ( v.type === 'text' )
        {

            plc[ $(v).attr('id') ] = $(v).val();
            ids.push( $(v).attr('id') );

            $(v).bind("focus", function(){
            if ( $(this).val() == plc[ $(this).attr('id') ] ) $(this).val('');
            $( dialog.data ).find('#required').remove();
            }).bind("blur", function(){
            if ( $(this).val().length == 0 ) $(this).val( plc[ $(this).attr('id') ] );
            });
        }
        });

        //onsubmit
        $('#wm', dialog.data).css( 'cursor','pointer' ).click(function(){

            $( dialog.data ).find('#required').remove();//tip

            if ( typeof isvalid.email !== 'undefined' ) {

            femail = 'email';

            $( 'input', dialog.data ).each(function(e, el2){
            if ( /email_address|fields_email|email|ea/.test( el2.name.toLowerCase() ) )
            {
               femail = el2.name;
               return false;
            }
            });

            var inp = $('#' + femail, dialog.data );

            if ( inp.val() !== '' ) {

                if ( !input_valid.is_email( inp.val() ) )
                {
                    inp.after( input_valid.msg('Invalid email address.') );
                    inp.focus();
                    return false;
                }
                } else {

                   inp.after( input_valid.msg('Please enter the email address.') );
                   inp.focus();
                   return false;
            }

            }

            //mailchimp changed
            if ( mail_form_name == 'mailchimp' )
            {
                $('#email', dialog.data).attr('name', 'MERGE0');
                $('#email', dialog.data).attr('id', 'MERGE0');
            }

            if ( mail_form_name == 'constantcontact' ) {
            $('#email', dialog.data).attr('name', $('#email', dialog.data).attr('data-ctc') );
            }

            $('#mce_getaccessed', dialog.data).submit();
        });

        $(document).bind('keydown.simplemodal', function (e) {
				if (e.keyCode === 13) { $('#wm', dialog.data).click(); }
        });
    },
    onClose: function(dialog){
    window.location = l;
    }});

    return false;
  },//optin preview

  ///JS popup images
  add_jsmessage: function() {
    if ( $('#optinrev_setup_form #text_alert_messages').val().length == 0 ) {
        alert('No messages to save. Please fill the message entry.');
        return false;
    }

    $.post(ajaxurl, {action : 'optinrev_action', optinrev_jspopup_messages_add : $('#optinrev_setup_form #text_alert_messages').val()}, function(res){
      if (res == 'success') { wtfn.msg( 'Alert message has been added.');
      $('#optinrev_jspopup_messages').load(ajaxurl, {action : 'optinrev_action', optinrev_jspopup_messages : 'load'});
      }
    });
    return false;
  },
  delete_jsmessage: function() {
  $.post(ajaxurl, {action : 'optinrev_action', optinrev_jspopup_messages_del : $('#optinrev_setup_form #select_alert_messages').val()}, function(res){
    if (res == 'success') { wtfn.msg( 'Alert message has been deleted.');
    $('#optinrev_jspopup_messages').load(ajaxurl, {action : 'optinrev_action', optinrev_jspopup_messages : 'load'});
    }
  });
  return false;
  },
  edit_alert_message: function() {
  var p = $('#optinrev_setup_form'), sl = $('#select_alert_messages option:selected', p).text();
  $('#text_alert_messages', p).val( sl );

  if ( $('#mscancel', p).length == 0 )
  $('#jsm_del', p).after('&nbsp;<span class="submit" id="mscancel"><input type="button" value="Cancel" onclick="optinrev_alert_message_cancel();"></span>');

  $('#jsm_add', p).hide();
  $('#jsm_wupdate', p).show();
  $('#jsm_edit', p).hide();
  },
  cancel_alert_message: function() {
  var p = $('#optinrev_setup_form');
  $('#text_alert_messages', p).val('');
  $('#jsm_add', p).show();
  $('#jsm_wupdate', p).hide();
  $('#mscancel', p).remove();
  $('#jsm_edit', p).show();
  },
  update_jsmessage: function() {
  var p = $('#optinrev_setup_form');
  $.post(ajaxurl, {action : 'optinrev_action', optinrev_jspopup_messages_update : $('#select_alert_messages', p).val(), optinrev_jspopup_messages: $('#text_alert_messages', p).val()}, function(res){
  if (res == 'success') { wtfn.msg( 'Alert message has been updated.');
  $('#optinrev_jspopup_messages').load(ajaxurl, {action : 'optinrev_action', optinrev_jspopup_messages : 'load'});
  }})
  },///JS popup images
  pwby: function() {
  var wtdom = tinyMCE.activeEditor.dom, mn = wtdom.get('simplemodal-container'), mn_h = $(mn).height(), mn_w = $(mn).width(), bw = 1;

  if ( wtfn.is_old_ie9() ) {
  bw = parseInt( wtfn.ie_border_weight(mn) );
  } else {

  if ( parseInt($.browser.version) > 8 ) {
  bw = parseInt( $(mn).css('borderLeftWidth') );
  } else {
  bw = parseInt( wtfn.ie_border_weight(mn) );
  }

  }

  wtdom.remove( wtdom.select('#poweredby') );
  pwt =( wtfn.is_old_ie9() ) ? (mn_h + 5) + bw : (mn_h + 2) + bw;

  cl = wtfn.contrast50($('#optinrev_wbg_color').val());

  href = 'http://goo.gl/0hf0ke';
  wtdom.add( wtdom.get('simplemodal-data'), 'div', {'id': 'poweredby', style : { 'position': 'absolute', left: '40%', top: pwt, 'color': cl}}, '<a href="'+href+'" target="_blank" rel="nofollow" style="color:'+ cl +' !important">Powered</a> <span style="color:'+ cl +'">by</span> <a href="'+href+'" target="_blank" rel="nofollow" style="color:'+ cl +' !important">Optin Revolution</a>');

  $('input[type="text"]', wtdom.get('mce_getaccessed')).each(function(e, el){
      if ( /first_name|last_name|name\(awf_first\)|name\(awf_last\)|FNAME|LNAME|fields_fname|fields_lname|fname|lname/g.test(el.id) ) {
      $(el, wtdom.get('mce_getaccessed')).remove();
      }
  });

  },
  mce_toolbar:function( state ) {
  var ctrl = 'fontselect,fontsizeselect,forecolor,backcolor,moveforward,movebackward,textbox,actionbutton,attachimage,lineheight,bold,italic,underline,bullist,numlist,justifyleft,justifycenter,justifyright,justifyfull,link,unlink,wp_adv,removeformat,outdent,indent,input_align_left,input_align_top,object_align_top,object_align_bottom,object_align_center,object_align_left,object_align_right,text_align_left,text_align_center,text_align_justify,text_align_right';
  tinyMCE.each( ctrl.split(','), function(v, i) {

  if ( /^(input_align_left|input_align_top)$/i.test(v) ) {
     tinyMCE.activeEditor.controlManager.setDisabled( v, !state );
      } else {
     tinyMCE.activeEditor.controlManager.setDisabled( v, state );
  }

  tinyMCE.activeEditor.controlManager.setDisabled( 'absolute', true );
  tinyMCE.activeEditor.controlManager.setDisabled( 'textedit', true );
  tinyMCE.activeEditor.controlManager.setDisabled( 'imgresize', true );
  });
  },
  rgb: function(color) {
    var result;
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
  },
  prevent_default: function(e){
    if(e.preventDefault){ e.preventDefault()}
    else{e.stop()};

    e.returnValue = false;
    e.stopPropagation();
  },
 set_optin_default: function( msg ) {
  $.post(ajaxurl, {action : 'optinrev_action', optinrev_popup_reset : 77}, function(res){
    var n = ( msg ) ? 'content' : 'default';
    if ( res.indexOf('success') !== -1 )
    {
        wtfn.msg( 'The '+ n +' has been reset. Please wait. It will reload the page.');
        setTimeout(function(){ window.location.reload(true); }, 1000);
    }
  });
 },
 clear_layer: function( ed ) {
   if ( ed ) {
       $( ed.getDoc() ).find('#mceWotlayer').removeAttr('class');
       $( ed.getDoc() ).find('#mceWotlayer').removeAttr('id');
       $( ed.getDoc() ).find('#mceWotmove').remove();
       $( ed.getDoc() ).find('#mceDeleteObj').remove();
       $( ed.getDoc() ).find('#zindex').remove();
       $( ed.getDoc() ).find('.ui-resizable-handle').remove();
   }
 },
 tinymce_event: function( e ){
   //exclude the event
   if ( e.type == 'dblclick' ) return false;
   if ( e.type == 'mousedown' ) {
   if (e.target.id === 'tinymce') return false;
   }

   if ( e.type == 'keydown' ) return false;

   if (/close|simplemodal-container/.test(e.target.id)) return false;

   if (wtfn.is_dragging())
   return false;

   return true;
 },
 //tinymce setup callback
 tinymce: function( ed )
 {
    var elm;

   _ccdom = function( ed, target, remove ) {
     var t = tinymce, sel;

     nl = 0;
			tinymce.walk(target, function(n) {
          if ( t.isIE ) {
                  if ( typeof n.style !== 'undefined' ) {
                  if ( typeof n.style.direction !== 'undefined' ) {
                          if ( n.style.direction == 'ltr' ) {
                                ed.dom.setAttrib( n, 'unselectable', 'on' );
                                ed.dom.setAttrib( n, 'id', 'curvy1' );
                                n.contentEditable = false;
                                $(n).bind("oncontrolselect", function(){ return false; });
                                $(n).bind("onmousedown", function(e){ e.returnValue = false; this.hideFocus = true; });
                                $(n).bind("onselect", function(){ this.hideFocus = true; return false; });
                                $(n).bind("onclick", function(){ return false; });
                                $(n).bind("ondrag", function(){ return false; });
                          }
                      }
                  }

                  if ( n.className === 'autoPadDiv' ) {
                      ed.dom.setAttrib( n, 'id', 'curvy2' );
                  }
          }
				//if (n.nodeName === 'div')
          if ( n.className === 'simplemodal-data' )
          {
              ed.dom.setAttrib( n, 'id', 'simplemodal-data' );
    					nl = n;
          }

			}, 'childNodes');

     if ( nl )
     if ( ed.dom.get( nl ).hasChildNodes() )
     {

      var dl = [];
      tinymce.walk(nl, function(n) {
				if ( n.nodeName === 'DIV' )
				dl.push( n );

			}, 'childNodes');


       tinymce.each( dl, function(v, k)  {
       if ( v.style.display !== 'none' ) {
       s = ed.dom.getAttrib( v, 'style' );

       if ( remove )
       {
          //remove marker
          ps = ed.dom.parseStyle( s );
          delete ps.border;
          s = ed.dom.serializeStyle( ps, null );

          if ( typeof v !== 'undefined' )
          ed.dom.setAttrib( v, 'style', s );

        } else {

        //marker
        if ( v.nodeName !== 'FORM' && v.id !== 'simplemodal-container' && v.className !== 'simplemodal-data' && v.id !== 'poweredby' ) {
        ed.dom.setAttrib( v, 'style', s + 'border: 1px solid transparent;' );
        if ( v.firstChild )
        if ( v.firstChild.nodeName == '#text' ) {
          if ( v.innerHTML.length > 0 ) {
               //span wraping
               inh = v.innerHTML;
               v.innerHTML = '<span>'+ inh +'</span>';
          }
        }
        }

        tinymce.dom.Event.add( v, 'mousedown', function(e)
        {
          if ( e.target.id == 'zindex' ) return false;
          el = e.target.parentNode;

          if ( !wtfn.is_dragging() ) return false;
          if ( is_drag ) return false;
          if ( el == null) return false;
          if ( el.id === 'simplemodal-container' ) return false;
          if ( el.className === 'simplemodal-data' ) return false;

          if ( el = ed.dom.getParent( e.target, 'DIV' ) )
          {

            if ( /^(mceWotmove|ui-resizable-handle|mceDeleteObj|poweredby)$/i.test(el.id) ) return false;

            wtfn.clear_layer(ed);

            elm = el;
            if ( tinymce.isIE )
            {
              ed.dom.setAttrib( el, 'unselectable', 'on' );
              el.contentEditable = false;
              $(el).bind("oncontrolselect", function(){ return false; });
            }

            _drawLayer(el);
          }
        });

        }
       }//display:none;
       });  //EACH
     }
   }

   ed.onInit.add( function( ed )
   {

     var t = tinymce, dobj, tdobj, tx = ty = x = y = ml = mov = 0, mlp = {}, is_grip = is_drag = false, bwn = ed.dom.get('simplemodal-container'), nodeItem = 'UL,H1,H2,H3,H4,H5,H6', ed_ifr = $('#' + ed.id + '_ifr').height();
     var imgd = {};

     if ( ed.getContent().length == 0 ) { wtfn.set_optin_default(0); return false; }
     //init
     wtfn.mce_toolbar( wtfn.is_dragging() );

     //main marker
     if ( typeof bwn === 'undefined' || bwn === null ) return false;
     if ( tinymce.isIE )
     {
      ed.dom.setAttrib( bwn, 'unselectable', 'on' );
      bwn.contentEditable = false;
      $(bwn).bind("onmousedown", function(){ return false; });
      $(bwn).bind("onselect", function(){ return false; });
      $(bwn).bind("onclick", function(){ return false; });
      $(bwn).bind("ondrag", function(){ return false; });
      $(bwn).bind("oncontrolselect", function(){ return false; });
    }

     // if has no close button
     if ( typeof bwn.childNodes[1] === 'undefined' )
     {
        clb = document.createElement('div');
        clb.setAttribute( 'id', 'close' );
        clb.setAttribute( 'class', $('input[name="optinrev_close_popup_image"]').val() );
        clb.setAttribute( 'style', $('#optinrev_close_button').val() );
        bwn.insertBefore( clb, bwn.firstChild );
     }

     //preview
     if ( parseInt(window.location.href.toString().indexOf('show=optin')) > 0 )
     {
       ed.isNotDirty = 1;
       wtfn.preview();
       return false;
     }

     if ( !tinymce.isIE ) {
     ed.getDoc().designMode = 'off';
     $(ed.getBody()).attr('contenteditable', 'false' );
     }

    //drap help button
     $('.mce_ifdragedithelp').mouseover(function(){
       $('.optinrev_dragtip').remove();//avoid duplication
       var dvtp = document.createElement('DIV');
       img = '&nbsp;<img src="' + wtp + 'images/drag.png"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
       $(dvtp).attr('class','optinrev_dragtip').html('The '+ img +' on the toolbar enable/disable <br />editing text or moving objects on the stage.<br />If the toolbar is greyed out and you can\'t edit<br /> the text you will need to click the '+ img +'.');
       $(this).append( dvtp );
     }).mouseout(function(){ $('.optinrev_dragtip').fadeOut(); });
     $('.mceToolbar').mouseout(function(){$('.optinrev_dragtip').fadeOut();});

     $('#optinrev_excerpt_jspopupimg_open').bind('mousedown',function(){
     $('#modal').reveal({ animation: 'fade', dismissmodalclass: 'close' });
     return false;
     });

     //border transparent
     _ccdom(ed, bwn, 0);

     //new feature form
     wtfn.optin_form_check();

     //checking if theres no input field
     if ( !ed.dom.get('mce_getaccessed') ) {
     wtfn.save(0);
     }

     ed.isNotDirty = 1;
     wtfn.pwby();

    $('a', bwn).click(function(e){ e.preventDefault();return false;});

    $(bwn).dblclick(function(e) {
    wtfn.prevent_default(e);
    return false;
    });

    //add image from briefcase
    if ( is_bfcase != 0 ) {
    wtfn.action_add_image_briefcase( is_bfcase );
    }

    //add image from briefcase
    if ( is_delbfcase != 0 ) {
    wtfn.action_del_image_briefcase( is_delbfcase );
    }

    //update action button
    if ( is_actionbtn != 0 ) {
    wtfn.action_add_button_briefcase( is_actionbtn );
    }

     _drawLayer = function( el )
     {
        if ( el && el.className != 'mceWotlayer' )
        {
          ed.dom.setAttrib( el, 'class', 'mceWotlayer' );
          ed.dom.setAttrib( el, 'id', 'mceWotlayer' );
          //drag box
          ed.dom.add(el, 'div', {id : 'mceWotmove'});

          if ( el.firstChild.id != 'wm' && el.firstChild.nodeName != 'INPUT' )
          ed.dom.add(el, 'div', {id : 'mceDeleteObj'});

        }
     }

     //remove a specific style
     _removeAStyle = function( ed, dobj, astyle )
     {
        s = ed.dom.getAttrib( dobj, 'style' );
        ps = ed.dom.parseStyle( s );
        delete ps[astyle];
        s = ed.dom.serializeStyle( ps, null );
        ed.dom.setAttrib( dobj, 'style', s );
     }

    function makeOb$(event) {
        var obj = new Object(), o = {}, p = ed.dom.get('simplemodal-container');
        e = ( event.target ) ? event.target : event.srcElement;

        is_drag = true;
        obj.element = e;

        obj.minBoundX = 0;
        obj.minBoundY = 0;

        if ( e.id === 'mceWotmove' ) {
        o = { 'offsetWidth' : e.parentNode.offsetWidth, 'offsetHeight' : e.parentNode.offsetHeight, 'offsetLeft' : e.parentNode.offsetLeft, 'offsetTop' : e.parentNode.offsetTop };
        } else {

        ofh = e.offsetHeight;
        ofw = e.offsetWidth;

        o = { 'offsetWidth' : ofw, 'offsetHeight' : ofh, 'offsetLeft' : e.offsetLeft, 'offsetTop' : e.offsetTop };
        }

        obj.maxBoundX = obj.minBoundX + $(p).width() - o.offsetWidth;
        obj.maxBoundY = obj.minBoundY + $(p).height() - o.offsetHeight;

        obj.posX = event.clientX - o.offsetLeft;
        obj.posY = event.clientY - o.offsetTop;
        obj.imgwidth = $( 'img', e.parentNode ).width();
        obj.imgheight = $( 'img', e.parentNode ).height();

        obj.maxBoundX = obj.maxBoundX;
        obj.maxBoundY = obj.maxBoundY;

        return obj;
    }

      ///CLOSE BUTTON
      tinymce.dom.Event.add(ed.dom.get('close'), 'mousedown', function(e)
      {
        wtfn.prevent_default(e);
        return false;
      });
      ///CLOSE BUTTON

      tinymce.dom.Event.add(ed.getDoc(), 'mousedown', function(e)
      {
        el = e.target;

        wtfn.prevent_default(e);

        //lock the target
        if ( el.nodeName === 'HTML' || el.id == 'simplemodal-container' || el.parentNode.id == 'poweredby' ) {
        return false;
        }

        if ( /^(tinymce|simplemodal-container|simplemodal-data|close|poweredby)$/i.test(el.id) ) return false;

        //delete an object
        if ( e.target.id === 'mceDeleteObj' ) {
             if ( confirm('Do you want to remove ?') ) {

                 if ( el.parentNode.firstChild.nodeName == 'IMG' )
                 $.post(ajaxurl, {action : 'optinrev_action', optinrev_remove_object : el.parentNode.firstChild.id});

                 ed.dom.remove( el.parentNode );
                 setTimeout(function(){
                 wtfn.save(0);
                 }, 1000);

                 return false;
             }
        }

        if ( el.id == 'ui-resizable-handle' ) {
            tdobj = el;
            dobj = makeOb$(e);
            return false;
        }

        //if dragging
        if ( wtfn.is_dragging() )
        {
          //move selection
          if ( el.id == 'mceWotmove' )
          {
              tdobj = el.parentNode;
              dobj = makeOb$(e);
              return false;

          }

        } else
        {

          if ( el.id == 'zindex' ) return false;

          wtfn.clear_layer( ed );

          var el = ed.dom.getParent(el, 'DIV');

          //design once
          if ( el ) {

            if ( el.className != 'mceWotlayer' )
            {
              if ( tinymce.isIE )
              {
                  el.contentEditable = true;
                  el.onselectstart = function(){return true;}
              }

              if ( el && el.className != 'mceWotlayer' )
              {
                ed.dom.setAttrib( el, 'class', 'mceWotlayer' );
                ed.dom.setAttrib( el, 'id', 'mceWotlayer' );

                if ( el.firstChild.id != 'wm' && el.firstChild.nodeName != 'INPUT' )
                ed.dom.add(el, 'div', {id : 'mceDeleteObj'});

              }

              if ( el.firstChild.nodeName == 'IMG' ) {
                  if ( $( ed.getDoc() ).find('.ui-resizable-handle').length == 0 ) {
                       ed.dom.add( el, 'div', {'class' : 'ui-resizable-handle ui-resizable-e'} );
                       ed.dom.add( el, 'div', {'class' : 'ui-resizable-handle ui-resizable-s'} );
                       ed.dom.add( el, 'div', {'id' : 'ui-resizable-handle', 'class' : 'ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'} );
                  }
                  imgd = {width : $(el.firstChild).width(), height : $(el.firstChild).height()};
              }


              //action button exclude
              if ( el.id == 'wm' ) {
                  return false;
              }
            }

            //textedit
            if ( el.id == 'mceWotlayer' ) {
            ed.controlManager.setDisabled( 'textedit', $('span', el).length == 0 );
            }

          }

        }

        //draggable protection
        if ( /IMG/.test( e.target.nodeName ) ) {
           return false;
        }


        ed.undoManager.add();
      });

      //move inside the modal
      tinymce.dom.Event.add(ed.getDoc(), 'mousemove', function(e)
      {

        $('.optinrev_dragtip').fadeOut();

        if ( is_drag && dobj )
        {

            var ex = ( dobj.maxBoundX / 2 ), ey = ( dobj.maxBoundY / 2 );

            l = Math.max(dobj.minBoundX, Math.min(e.clientX - dobj.posX, dobj.maxBoundX));
            t = Math.max(dobj.minBoundY, Math.min(e.clientY - dobj.posY, dobj.maxBoundY));

            l = ( l > ex ) ? ( l + 2 ) : ( l - 1 );
            t = ( t > ey ) ? ( t + 1 ) : ( t - 1 );

            if ( tdobj.id === 'ui-resizable-handle' )
            {
                hdlse = 10;

                //resize the image
                if ( e.shiftKey )
                {

                  posx = ( tinyMCE.isIE ) ? e.clientX : e.pageX;
                  posy = ( tinyMCE.isIE ) ? e.clientY : e.pageY;

                  thisX = posx - $(tdobj.parentNode).offset().left;
                  thisY = posy - $(tdobj.parentNode).offset().top;
                  ratio = ((thisX + thisY) / 2) / ((imgd.height + imgd.width) / 2);

                  height_new = imgd.height * ratio,
                  width_new = imgd.width * ratio;


                  ed.dom.setStyles( tdobj.parentNode, { 'width': width_new, 'height': height_new  } );
                  ed.dom.setStyles( $('img', tdobj.parentNode), { 'width': width_new, 'height': height_new } );
                  ed.dom.setStyles( tdobj, {'left': $(tdobj.parentNode).width() - hdlse, 'top': $(tdobj.parentNode).height() - hdlse} );


                } else
                {
                  ed.dom.setStyles( tdobj, {'left': l, 'top': t} );
                  ed.dom.setStyles( tdobj.parentNode, { 'width': (l + hdlse), 'height': (t + hdlse) } );
                  ed.dom.setStyles( $('img', tdobj.parentNode), {'width': (l + hdlse), 'height': (t + hdlse)} );
                }

                } else
                {

                ed.dom.setStyles( tdobj, {'left': l, 'top': t} );

            }
        }
      });

      tinymce.dom.Event.add(ed.getDoc(), 'mouseup', function(e)
      {
        if ( wtfn.is_dragging() )
        wtfn.prevent_default(e);

        if ( e.target.id == 'ui-resizable-handle' ) {
            imgd = { width :  $(e.target.parentNode).width(), height : $(e.target.parentNode).height() };
        }

        is_drag = false;
        is_grip = false;
        redraw = 0;
        _removeAStyle( ed, e.target, 'cursor' );
      });

      tinymce.dom.Event.add(ed.getDoc(), 'blur', function(e)
      {
        ed.dom.remove('zindex');
      });

      tinymce.dom.Event.add(ed.getWin(), 'mouseout', function(e)
      {
        if ( !wtfn.is_dragging() ) return false;
        var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
        if ( $(reltg).attr('id') )
        if ( reltg.id == 'tinymce' ) wtfn.clear_layer(ed);
      });

      tinymce.dom.Event.add(ed.getWin(), "mouseover", function(e){
          if ( is_editing )
          {
             wtfn.clear_layer(ed)
             wtfn.redraw();
             _ccdom(ed, ed.dom.get('simplemodal-container'), null);
             is_editing = false;
          }
      });

      tinymce.dom.Event.add(ed.getWin(), "mousedown", function(e){
          if ( e.target.id === 'tinymce' ) {
              wtfn.prevent_default(e);
              return false;
          }
      });

   });

 ed.onLoadContent.add(function(ed, o) {
    wtfn.clear_layer(ed);
    wtfn.redraw();
    wtfn.inputs_setup();
 });

 ed.onPreProcess.add(function(ed, o) {
      if (o.get)
      {
        wtfn.clear_layer(ed);
        _ccdom(ed, ed.dom.get('simplemodal-container'), 1);

      }
  });

  ed.onPostProcess.add(function(ed, o) {
      if (o.get)
      {
        wtfn.clear_layer(ed);
        //wtfn.redraw();
        _ccdom(ed, ed.dom.get('simplemodal-container'), 1);

      }
  });

  ed.onDblClick.add(function(ed, e) {
  wtfn.prevent_default(e);
  return false;
  });

 },//mce
 ie_border_weight: function( e ) {
  //ie borders weight
  var ie8 = $.browser.version == '8.0';
  var thin = ie8 ? 1 : 2, medium = ie8 ? 3 : 4, thick = ie8 ? 5 : 6;
  ie_bw = { 'thin': thin, 'medium': medium, 'thick':  thick };
  return ( $.browser.msie ) ? parseInt($(e).css('borderLeftWidth')) : $(e).css('border');
 },
 close_button_pos : function( btn_class ) {

  var wtdom = tinyMCE.activeEditor.dom, bcls = wtdom.get('close'), mn = wtdom.get('simplemodal-container'), mn_w = $(mn).width(), mn_h = $(mn).height(), gw_loc = $('#optinrev_gotowebsite').val();

  if ( $.browser.msie )
  bw = wtfn.ie_border_weight( mn );
  else
  bw = (mn) ? parseInt(mn.style.border.substring(0, mn.style.border.indexOf('px'))) : 1;

  loc = 20;
  if ( bcls ) {
      if ( /close7|close8/.test(bcls.className) ) {
      loc = ( gw_loc == 'bottom' ) ? (mn_h - 56) : loc;
      }
  }

  var clpos = {
    'close1' : { left: ((mn_w - (30 / 2)) + (bw-1)), top: -( 30 / 2 ) - (bw - 1) },
    'close2' : { left: ((mn_w - (45 / 2)) + (bw-1)), top: -( 45 / 2 ) - (bw - 1) },
    'close3' : { left: ((mn_w - (60 / 2)) + (bw-1)), top: -( 60 / 2 ) - (bw - 1) },
    'close4' : { left: ((mn_w - (30 / 2)) + (bw-1)), top: -( 30 / 2 ) - (bw - 1) },
    'close5' : { left: ((mn_w - (45 / 2)) + (bw-1)), top: -( 45 / 2 ) - (bw - 1) },
    'close6' : { left: ((mn_w - (60 / 2)) + (bw-1)), top: -( 60 / 2 ) - (bw - 1) },
    'close7' : { left: (mn_w - 272), top: loc },
    'close8' : { left: (mn_w - 272), top: loc }
  }

  if ( !btn_class )
  btn_class = $(bcls).attr('class');

  return clpos[btn_class];
  },
  gw_loc_btn: function( loc ) {
    var wtdom = tinyMCE.activeEditor.dom, bcls = wtdom.get('close'), mn = wtdom.get('simplemodal-container'), mn_h = $(mn).height();
    if ( /close7|close8/.test(bcls.className) ) {
       if (loc == 'bottom') {
       wtdom.setStyle( bcls, 'top', (mn_h - 56) );
       } else {
       wtdom.setStyle( bcls, 'top', 20 );
       }
    }
  },
  input_autotext: function( id, vl ) {
  var wtdom = tinyMCE.activeEditor.dom;
  if ( txt = wtdom.get( id ) ) {
  wtdom.setAttrib( txt, 'value', vl );
  }
  },
  /**
   * IMAGES
   */
  //auto add images from briefcase
  action_add_image_briefcase: function( bfcase ) {
     if ( tinyMCE.activeEditor != null ) {
         var wtdom = tinyMCE.activeEditor.dom, mn = wtdom.get('simplemodal-container'), mn_w = $(mn).width(), mn_h = $(mn).height();
         $.each( $.parseJSON(bfcase), function(i,v) {
            var img = v;
            $.post(ajaxurl, {action : 'optinrev_action', optinrev_add_image : img, optinrev_curr_page : wtpage}, function(res){
              if ( ac = $.parseJSON( res ) )
              {
                //set the marker
                wtdom.add( wtdom.get('simplemodal-data'), 'div', {
                style : { 'position': 'absolute', left: 10, top: 10, 'border': '1px solid transparent' }
                }, wtdom.create('img', {id : img, 'src' : ac.image, 'border' : 0}, null));

                //get image size
                $.post(ajaxurl, {action : 'optinrev_action', optinrev_getimagesize : ac.image}, function(res){

                //resize the image
                if ( dm = $.parseJSON(res) )
                {
                    cr_img = wtdom.get(img);
                    if ( dm.width > mn_w ) {
                    tp = ( mn_w / parseInt( dm.width ) ) * parseInt( dm.height );
                    wtdom.setStyles( cr_img, {'width': mn_w, 'height': tp } );
                    }

                    if ( dm.height > mn_h ) {
                    tp = ( mn_h / parseInt( dm.height ) ) * parseInt( dm.width );
                    wtdom.setStyles( cr_img, {'width': tp, 'height': mn_h } );
                    }

                    if ( pcr_img = cr_img.parentNode ) {
                        wtdom.setStyle( pcr_img, 'left', 1 );
                        wtdom.setStyle( pcr_img, 'top', 1 );
                    }

                }

                });

                //TODO
                tinyMCE.activeEditor.isNotDirty = 0;
                is_editing = true;

                setTimeout(function(){
                wtfn.save(0);
                }, 2000);

              }
            });
         });
     }
  },
  //add image to the canvas
  action_add_image: function( img ) {
   if ( confirm('Are you sure, you want to insert this image in Optin Popup 1 ?') ) {
   $.post(ajaxurl, {action : 'optinrev_action', optinrev_add_image_briefcase : img, optinrev_curr_page : 'optinrevolution/optin1'}, function(){wtfn.msg( 'Successfully added.' );});
   }
   return false;
  },
  //delete image to the canvas
  action_del_image: function( img ) {
   if ( confirm('Are you sure, you want to delete this image ?') ) {
   $.post(ajaxurl, {action : 'optinrev_action', optinrev_del_image_briefcase : img, optinrev_curr_page : 'optinrevolution/optin1'}, function(){wtfn.msg( 'Successfully deleted.' );});
   }
   return false;
  },
  //auto del images from briefcase
  action_del_image_briefcase: function( delbfcase ) {
     if ( tinyMCE.activeEditor != null ) {
         var wtdom = tinyMCE.activeEditor.dom;
         $.each( $.parseJSON(delbfcase), function(i,v) {
         if (wi = wtdom.get(v)) {
            $.post(ajaxurl, {action : 'optinrev_action', optinrev_remove_object : v}, function(res){
            wtdom.remove(wi.parentNode);
            });
         }
         });
         tinyMCE.activeEditor.isNotDirty = 0;
         is_editing = true;

         setTimeout(function(){
         wtfn.save(0);
         }, 2000);
     }
  },
  /**
   * IMAGES---------------------------------------------------
   */

  /**
   * ACTION BUTTON
   */
  //auto add action button from briefcase
  action_add_button_briefcase: function( is_actionbtn ) {
     if ( tinyMCE.activeEditor != null ) {
        var wtdom = tinyMCE.activeEditor.dom, mn = wtdom.get('simplemodal-container'), mn_w = $(mn).width(), mn_h = $(mn).height();
        if ( img = wtdom.get('wm') )
        {
          pos = wtdom.getPos(img);
          imgh = $(img).height();

          wtdom.replace( wtdom.create('img', {id : 'wm', 'src' : is_actionbtn, 'border' : 0}, null), img );

          //prev gap
          crnb = wtdom.get('wm');
          pcrnb = crnb.parentNode;

          wtdom.setStyle( pcrnb, 'left', ( mn_w / 2 ) - Math.floor(($(crnb).width())/2) );
          wtdom.setStyle( pcrnb, 'top', ( mn_h / 2 ) - Math.floor($(crnb).height()/2) );
          wtdom.setStyle( pcrnb, 'z-index', 5 );

          tinyMCE.activeEditor.isNotDirty = 0;

          setTimeout(function(){
          wtfn.save(0);
          }, 2000);
        }
     }
  },
  action_del_action_button: function( todel_action ) {
  if ( tinyMCE.activeEditor != null ) {
      var wtdom = tinyMCE.activeEditor.dom;
      $.each( $.parseJSON( todel_action ), function(i,v) {
        b = v.split('|');
        if ( img = wtdom.get('wm') ) {
           if ( img.src.indexOf( b[0] ) >= 0 ) {
           wtfn.action_add_button_briefcase( b[1] );
           }
        }
      });
  }
  },
  //add action button to the canvas
  action_add_button: function( img ) {
   if ( confirm('Are you sure, you want to update the action button of Optin Popup 1') ) {
   $.post(ajaxurl, {action : 'optinrev_action', optinrev_add_button_briefcase : img, optinrev_curr_page : 'optinrevolution/optin1'}, function(){wtfn.msg( 'Successfully updated.' );});
   }
   return false;
  },
  /**
   * ACTION BUTTON---------------------------------------------------
   */
  optin_form_default: function() {
    if ( typeof tinyMCE.activeEditor != 'undefined' )
    {
      var ed = tinyMCE.activeEditor, wtdom = ed.dom, email = '', styl = '';
      if ( frm = ed.dom.get('mce_getaccessed') ) {

      //form
      mf = document.createElement('form');
      mf.setAttribute( 'method', 'post' );
      mf.setAttribute( 'id', 'mce_getaccessed' );
      mf.setAttribute( 'action', 'http://www.optinrevolution.com/setup/?utm_source=plugin&utm_medium=not-setup&utm_campaign=lite' );
      mf.setAttribute( 'target', '_blank' );

      loc = {left: 10, top: 10};

      //Current email location
      if ( efld = wtdom.get( 'email_address' ) ) {
      loc = $( efld.parentNode ).position();
      } else if ( efld = wtdom.get( 'fields_email' ) ) {
      loc = $( efld.parentNode ).position();
      } else if ( efld = wtdom.get( 'email' ) ) {
      loc = $( efld.parentNode ).position();
      }

      //set id = name
      infld = '<input type="text" name="email" id="email" value="Enter Your Email...">';
      txtfld = document.createElement( 'div' );
      $( txtfld ).css({ 'position': 'absolute', 'left' : loc.left, 'top': loc.top, 'z-index': 5, 'border': '1px solid transparent' }).append( infld );
      $( mf ).append( txtfld );

      //clean up form;
      if ( typeof wtdom.select("form")[0] !== 'undefined' )
      wtdom.remove(wtdom.select('form')[0]);

      //set the marker
      $( wtdom.get( 'simplemodal-data' ) ).append( mf );

      //update the design;
      wtfn.inputs_setup();
      //saving

      }
    }//tinymce
   },
   save_wait: function( el ) {
    dv = document.createElement('span');
    $(dv).css({'background-color':'#fff','color':'#ff8000','padding':'6px'}).html('Please wait...');

    $(el).after( dv );
    wtfn.save(0);

    setTimeout(function(){
    $(dv).html('Successfully Saved.');
    }, 1000);

    setTimeout(function(){
    $(dv).fadeOut().remove();
    }, 3000);

  },
  tabs: function( el ) {
  var nt = $('#optinrev-nav-tab'), tid = el.id;

  //reset
  $( 'a', nt ).removeClass('nav-tab-active');
  $(el).addClass('nav-tab-active');


  for(r=1; r<=4;r++)
  $( '.optinrev-settab' + r ).hide();

  $( '.optinrev-settab' + $(el).attr('data-tab') ).show();

  },
  optin_form: function( fcode ) {  

  if ( typeof tinyMCE.activeEditor != 'undefined' )
  {
  var ed = tinyMCE.activeEditor, wtdom = ed.dom, ocode = $( '#foptin_box #optinrev_optincode_' + fcode ).val();

  if ( fcode === 'wysija' ) {
  ocode = '<form action="#wysija" method="post"><input type="text" name="email" id="email"/></form>';
  }

  if ( tinyMCE.activeEditor.getContent().length == 0 ) return false;

  if ( ocode.toLowerCase().indexOf('action') < 0 ) {

  if ( fcode === 'constantcontact' ) {
     if ( typeof $('#cwait')[0] !== undefined ) {
     alert('Please wait until the code to load.');
     return false;
     }
  }

  alert('Invalid form code. Please check.');
  return false;
  }

  //Check the legit form
  if ( fcode == 'aweber'  ) {

      if ( ocode.toLowerCase().indexOf('aweber') == -1 ) {
          alert('Invalid Aweber form code. Please check.');
          return false;
      }

  } else if ( fcode == 'icontact' ) {

      if ( ocode.toLowerCase().indexOf('icontact') == -1 ) {
          alert('Invalid Icontact form code. Please check.');
          return false;
      }

  } else if ( fcode == 'getresponse' ) {

      if ( ocode.toLowerCase().indexOf('getresponse') == -1 ) {
          alert('Invalid GetResponse form code. Please check.');
          return false;
      }

  } else if ( fcode == 'mailchimp' ) {

      if ( ocode.toLowerCase().indexOf('list-manage') == -1 ) {
          alert('Invalid Mailchimp form code. Please check.');
          return false;
      }

  } else if ( fcode == 'constantcontact' ) {
  
      if ( ocode.toLowerCase().indexOf('constantcontact') == -1 ) {
          alert('Invalid ConstantContact form code. Please check.');
          return false;
      }

  }

  //Field
  //mpr = mailpro[ fcode ];
  //elt = mpr.text.split( ',' );

  var tf = document.createElement('div');
  $( tf ).attr('id','temp_form').html( ocode );
  $( 'form', tf ).attr( 'id', 'mce_getaccessed' );
  $( 'form', tf ).find( 'input[type="submit"]' ).remove();

  var hdfld = document.createElement('div'), frm = document.createElement('form'), aweber_pxl = '', wycf='';

  //hidden field wrapper
  $( hdfld ).css( 'display', 'none' );

  //form
  mf = document.createElement('form');
  mf.setAttribute( 'method', 'post' );
  mf.setAttribute( 'id', 'mce_getaccessed' );
  mf.setAttribute( 'action', $( 'form', tf ).attr('action') );
  mf.setAttribute( 'target', '_blank' );
  
  if ( frm = ed.dom.get('mce_getaccessed') ) {          
          
  $('input', frm).each( function( i, el ) {  
  //get wysija custom field
  if ( fcode == 'wysija' ) {
    if ( el.name.indexOf('wysija') !== -1 )  {
      var elp = $(el).parent(); 
      wycf += elp[0].outerHTML;
    }
  }
  
  });    
  
  }


  $( 'form input', tf ).each(function(e, el){
  
  //hidden field
  if ( el.type === 'hidden' ) {
  
      $( hdfld ).append( el );

      if ( fcode == 'aweber' && el.name == 'meta_required' )
      $(el).val( 'email' );

  }
  
  //Text
  if ( el.type == 'text' )
  if ( /\bemail_address|fields_email|email|ea\b/.test( el.name.toLowerCase() ) )
  {
      loc = {left: 10, top: 10};

      //Current email location
      if ( efld = wtdom.get( 'email_address' ) ) {
      loc = $( efld.parentNode ).position();
      } else if ( efld = wtdom.get( 'fields_email' ) ) {
      loc = $( efld.parentNode ).position();
      } else if ( efld = wtdom.get( 'email' ) ) {
      loc = $( efld.parentNode ).position();
      }
            

      vlu = 'Enter Your Email...';
      if ( typeof $( '.foptin_ifo #femail' ).val() !== 'undefined' )
      vlu = $( '.foptin_ifo #femail' ).val();


      //set id = name
      infld = '<input type="text" name="'+ el.name.toLowerCase() +'" id="'+ el.name.toLowerCase() +'" value="'+ vlu +'">';
      txtfld = document.createElement( 'div' );
      $( txtfld ).css({ 'position': 'absolute', 'left' : loc.left, 'top': loc.top, 'z-index': 5, 'border': '1px solid transparent' }).append( infld );
      $( mf ).append( txtfld );
  }

  });


  if ( fcode == 'aweber' ) {

  imgfld = document.createElement( 'div' );
  $( imgfld ).css( 'display', 'none' ).append( $( 'form img', tf )[0] );
  $( mf ).append( imgfld );

  }
  
  //Added wysija custom fields
  if ( fcode == 'wysija' ) {            
  $( mf ).append( wycf );
  }

  //Add hidden field
  $( mf ).append( hdfld );

  //clean up form;
  //if ( typeof wtdom.select("form")[0] !== 'undefined' )
  //wtdom.remove(wtdom.select('form')[0]);
  $( 'form', wtdom.get( 'simplemodal-data' ) ).remove();

  //set the marker
  $( wtdom.get( 'simplemodal-data' ) ).append( mf );

  //update the design;
  wtfn.inputs_setup();
  //saving

  is_editing = true;

  $( '#foptin_box li').css( 'display', 'none' );
  $('.foptin_ifo').show();
  $( '#optinrev_foptin_active' ).val( fcode );
  $( '#optinrev_foptin_form_active' ).val( fcode );

  wtfn.save(0);

  }

  },
  optin_form_email: function( el ) {

  if (el.value=='') { el.value = 'Enter Your Email...'; }

  if ( typeof tinyMCE.activeEditor != 'undefined' )
  {
      var ed = tinyMCE.activeEditor, wtdom = ed.dom;

      $( 'input', wtdom.get( 'mce_getaccessed' ) ).each(function(e, el2){
      //Text
      if ( /email_address|fields_email|email|ea/.test( el2.name.toLowerCase() ) )
      {
         $(el2, wtdom.get('mce_getaccessed')).attr('value', el.value);
         return false;
      }
      });

  }
  }
  ,
  optin_form_deactivate: function() {

  //textbox
  id = $( '#femail_tab li.active' ).attr('id');

  $( '#foptin_box li').css( 'display', 'none' );
  $( '#foptin_box #optinrev_optin_' + id ).css( 'display', '' );
  $('.foptin_ifo').hide();
  $( '#optinrev_foptin_form_active' ).val('');

  wtfn.optin_form_default();

  $( '#femail_validate' ).prop('checked', false);

  wtfn.save(0);

  },

  optin_form_check: function() {

  if ( $('#optinrev_optincode_' + $('#optinrev_foptin_active').val() ).val() !== '' ) return false;

  if ( typeof tinyMCE.activeEditor != 'undefined' )
  {
      var ed = tinyMCE.activeEditor, wtdom = ed.dom, ff = wtdom.get( 'mce_getaccessed' ), fcode = '';

      act_url = $(ff).attr('action');

      if ( typeof act_url === 'undefined' ) return false;

      if ( act_url.indexOf('aweber') !== -1 ) {
      fcode = 'aweber';
      } else if ( act_url.indexOf('icontact') !== -1 ) {
      fcode = 'icontact';
      } else if ( act_url.indexOf('getresponse') !== -1 ) {
      fcode = 'getresponse';
      } else if ( act_url.indexOf('mailchimp') !== -1 ) {
      fcode = 'mailchimp';
      } else if ( act_url.indexOf('constantcontact') !== -1 ) {
      fcode = 'constantcontact';
      } else if ( act_url.indexOf('wysija') !== -1 ) {
      fcode = 'wysija';
      } else if ( act_url.indexOf('optinrevolution') !== -1 ) {
      fcode = 'optinrevolution';
      }


      if ( fcode !== 'optinrevolution' ) {
          if ( $( '#foptin_box #optinrev_optincode_' + fcode ).val() == '' ) {
              $( '#foptin_box #optinrev_optincode_' + fcode ).val( ff.outerHTML );
              $( '#optinrev_foptin_form_active' ).val( fcode );
              $( '#femail_tab #'+ fcode).click();
          }
      }

      wtfn.save(0);

  }

  },

  getctc_form: function( el ) {
  var u = el.value;

  if ( u == '' ) return false;

  if ( u.indexOf( 'constantcontact.com' ) !== -1 ) {

  if ( typeof $('#cwait')[0] !== undefined )
  $(el).after('<span id="cwait" style="color:#009900"><em>&nbsp;Wait...</em></span>');

  $.post( doc_base_url +"?optinrev-ccform=1", {url: u}, function(res){
  $('#cwait').remove();
  $('#' + $(el).attr('data-ctc') ).val( res );
  });

  }

  },

  getctc_captcha: function( u, dialog ) {

  if ( u == '' ) return false;

  if ( u.indexOf( 'constantcontact.com' ) !== -1 ) {

  $.post( site_url+"?optinrev-ccform=1", {url: u}, function(res){

  var tf = document.createElement('div');
  $( tf ).attr('id','temp_form').html( res );

  c = $( '#captcha\\.control', tf ).val();
  $( '#captcha\\.control', dialog ).val( c );

  });

  }

  },

  bullets_get_color: function( ul ) {
  return $('li strong, li span', ul).css('color');
  },

  bullets_edit: function() {
  var wtdom = tinyMCE.activeEditor.dom, mn = wtdom.get('simplemodal-container'), c;

  $('ul,ol', mn).each(function(i, el){
  c = wtfn.bullets_get_color(el);
  $('li',el).css( 'color', c );
  });

  },
    
  mailpoet_req_field: function(e) {
    var ed = tinyMCE.activeEditor, wtdom = ed.dom, frm = wtdom.get('mce_getaccessed');
    $('#wysija_'+ $(e).attr('data-id'), frm).attr('required', true);  
  },
  
  mailpoet_remove_cfields: function(e) {
    var ed = tinyMCE.activeEditor, wtdom = ed.dom, frm = wtdom.get('mce_getaccessed');  
    $( '#' + $(e).attr('data-id') ).parent().remove();
    $('#wysija_'+ $(e).attr('data-id'), frm).parent().remove();    
  },
  
  mailpoet_add_cfields: function() {
  var cfg = $('#wysija_custom_fields'), dcf = $('#wysija_cf_list'), lcf = $('.wysija_cf_active'), inf = true, lbl='';
  
  if ( cfg.val() == '' ) return false;
  
  //finding existing element
  if ( typeof lcf !== 'undefined' ) {      
      $(lcf).each(function(i,e){      
        if(e.id == cfg.val()) {
            inf = false;
        }      
      });
  }
    
  if ( !inf ) return false;
  
  lbl = cfg[0].selectedOptions[0].innerText;   
  
  dcf.append( '<div><label>'+ lbl +'</label>&nbsp;<input type="text" name="wysija_cf_active['+ cfg.val() +'][]" id="'+ cfg.val() +'" onblur="wtfn.mailpoet_stage_inputtext(this);" class="wysija_cf_active" placeholder="'+ lbl +'" value="'+ lbl +'">&nbsp;<a href="javascript:void(0);" title="Remove custom field." data-id="'+ cfg.val() +'" onclick="wtfn.mailpoet_remove_cfields(this);">[-]</a></div>' );
  
  this.mailpoet_add_stage( lbl, cfg.val() );    
  wtfn.inputs_setup();
  
  is_editing = true;
  ifsave = true;
  
  },
  
  mailpoet_stage_inputtext: function(e) {    
    var ed = tinyMCE.activeEditor, wtdom = ed.dom, frm = wtdom.get('mce_getaccessed');      
    $('#wysija_'+ e.id, frm).attr( 'value', e.value );    
  },  
  
  mailpoet_add_stage: function( lbl, el ) {  
  var ed = tinyMCE.activeEditor, wtdom = ed.dom, frm = wtdom.get('mce_getaccessed');
  
  if ( nm = wtdom.get( el ) )
   {
        pstyl = $(nm.parentNode).attr('style');//wrapper
        fld = '<div style="'+ pstyl +'"><input type="text" name="wysija[field]['+ el +']" id="wysija_'+ el +'" value="'+ lbl +'"></div>';                    
        
        } else {
                        
        fld = '<div style="position: absolute; left: 10px; top: 10px; z-index: 5; border: 1px solid transparent;"><input type="text" name="wysija[field]['+ el +']" id="wysija_'+ el +'" value="'+ lbl +'"></div>';
  
    }
    
    //adding element in stage
    $(frm).append( fld );  
  
  }

  }//end fn

  //Document loaded
  $(document).ready( function() {
    var wted = {
        msger: function( id, msg ) {
        sp = document.createElement('div');
        $('.tmsg').remove();
        $(sp).attr('class', 'tmsg');
        $(sp).attr('id', '#post-message');
        $(sp).html( msg );
        $('#' + id).after( $(sp) );
        setTimeout(function(){ $('.tmsg').remove(); }, 3000);
        },
        move_closebtn: function() {
        var wtdom = tinyMCE.activeEditor.dom, clb = wtdom.get('close');
        wtdom.setStyles( clb, wtfn.close_button_pos(0) );
        },
        stage_resize: function(w, h) {
        var wtdom = tinyMCE.activeEditor.dom, dt = wtdom.get('simplemodal-data');

          tinyMCE.walk(dt, function(n) {
    				if ( n.nodeName === 'DIV' )
            {
              if ( n.style.display !== 'none' ) {
                  if ( n.style.position == 'absolute' ) {
                      if ( w ) {
                          mvl = parseInt(n.style.left) + parseInt( $(n).width() );
                          //check the object width
                          if ( parseInt( $(n).width() ) > w ) {
                              wted.msger('optinrev_swidth','Unable to resize there is an object is more than the width of a stage. Please check.');
                              return false;
                          }

                          if ( mvl > w )
                          {
                            wtdom.setStyle( n, 'left', (parseInt(n.style.left) - parseInt( $(n).width() )) );
                          }
                      } else if ( h ) {
                          mvh = parseInt(n.style.top) + parseInt( $(n).height() );
                          //check the object height
                          if ( parseInt( $(n).height() ) > h ) {
                              wted.msger('optinrev_sheight', 'Unable to resize there is an object is more than the height of a stage. Please check.');
                              return false;
                          }

                          if ( mvh > h ) {
                          wtdom.setStyle( n, 'top', (parseInt(n.style.top) - parseInt( $(n).height() )) );
                          }
                      }
                  }
              }
            }
    			}, 'childNodes');
        }
    }

    $.each([1,2,3,4,5,6,7,8], function(i, v){
      $('#_box'+ v +'-t').click(function(){
      $('#_box'+ v).slideToggle(function(){
       $('._box'+ v +'-x').css('display', ($(this).is(':visible')?'none':'inline') );
       $('._box'+ v +'-c').css('display', ($(this).is(':visible')?'inline':'none') );
      });
      });

      $('._box'+ v +'-c').hide();
      $('#_box'+ v).slideUp();

    });


    $('#optinrev_wbg_opacity').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#wbg_opacity_slider').slider({value: eval($(this).val())});
    });

    $('#wbg_opacity_slider').slider({
       range : 'min', value : optinrev_wbg_opacity, min : 0, max : 100, slide: function(even, ui){$('#optinrev_wbg_opacity').val( ui.value );wtfn.redraw();}
    });

    $('#optinrev_border_opacity').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#border_opacity_slider').slider({value: eval($(this).val())});
    });

    $('#border_opacity_slider').slider({
       range : 'min', value : optinrev_border_opacity, min : 0, max : 100, slide: function(even, ui){
       $('#optinrev_border_opacity').val( ui.value );
       wtfn.redraw();
       }
    });

    $('#optinrev_border_radius').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#border_radius_slider').slider({value: eval($(this).val())});
    wtfn.redraw();
    });

    $('#border_radius_slider').slider({
       range : 'min', value : optinrev_border_radius, min : 0, max : 25, slide: function(even, ui){
       $('#optinrev_border_radius').val( ui.value );
       wtfn.redraw();
       }
    });

    $('#optinrev_vborder_thickness').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#optinrev_sborder_thickness').slider({value: eval($(this).val())});
    });

    $('#optinrev_sborder_thickness').slider({
       range : 'min',
       value : optinrev_border_thickness,
       min : 1,
       max : 10,
       slide: function(even, ui){
       $('#optinrev_vborder_thickness').val( ui.value );
       wtfn.redraw();
       }
    });

    $('#optinrev_vtop_margin').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#optinrev_stop_margin').slider({value: eval($(this).val())});
    });

    $('#optinrev_stop_margin').slider({
       range : 'min',
       value : optinrev_top_margin,
       min : 0,
       max : 150,
       slide: function(even, ui){
       $('#optinrev_vtop_margin').val( ui.value );
       }
    });

    $('#optinrev_vwidth').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#optinrev_swidth').slider({value: eval($(this).val())});
    wtfn.redraw();
    });

    $('#optinrev_swidth').slider({
       range : 'min',
       value : optinrev_wwidth,
       min : 10,
       max : defs.width,
       step: 10,
       slide: function(even, ui){
       $('#optinrev_vwidth').val( ui.value );
       wtfn.redraw();
       wted.stage_resize( ui.value , 0);
       wted.move_closebtn();
       }
    });

    $('#optinrev_vheight').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#optinrev_sheight').slider({value: eval($(this).val())});
    });

    $('#optinrev_sheight').slider({
       range : 'min',
       value : optinrev_hheight,
       min : 10,
       max : defs.height,
       step: 10,
       slide: function(even, ui){
       $('#optinrev_vheight').val( ui.value );
       is_editing = true;
       wted.stage_resize(0, ui.value);
       wted.move_closebtn();
       }
    });

    $('#optinrev_vdelay').keyup(function(event){
    if (event.which == 13) {event.preventDefault();}
    $('#optinrev_sdelay').slider({value: eval($(this).val())});
    });

    $('#optinrev_sdelay').slider({
       range : 'min',
       value : optinrev_delay,
       min : 0,
       max : 15,
       slide: function(even, ui){
       $('#optinrev_vdelay').val( ui.value );
       $('#optinrev_need_longer').css( 'display', ( parseInt( ui.value ) > 0 ) ? '' : 'none' );
       }
    });


    //optin input setup
    $('#optinrev_inpuths').slider({
       range : 'min',
       value : optinrev_inputh,
       min : 10,
       max : 100,
       slide: function(even, ui){
       $('#optinrev_inputh').val( ui.value );
       wtfn.inputs_setup();
       }
    });

    $('#optinrev_inputws').slider({
       range : 'min',
       value : optinrev_inputw,
       min : 10,
       max : 350,
       slide: function(even, ui){
       $('#optinrev_inputw').val( ui.value );
       wtfn.inputs_setup();
       }
    });

    $('#optinrev_inputbts').slider({
       range : 'min',
       value : optinrev_inputbt,
       min : 1,
       max : 10,
       slide: function(even, ui){
       $('#optinrev_inputbt').val( ui.value );
       wtfn.inputs_setup();
       }
    });

    $('#optinrev_inputfzs').slider({
       range : 'min',
       value : optinrev_inputfz,
       min : 12,
       max : 72,
       slide: function(even, ui){
       $('input[name="optinrev_inputfz"]').val( ui.value );
       wtfn.inputs_setup();
       }
    });

    $('input[name="optinrev_inputc"], input[name="optinrev_inputb"], input[name="optinrev_inputtc"]').change(function(){
    wtfn.inputs_setup();
    });

    $('#optinrev_setup_form').submit(function(){
      wtfn.save(1);
      return false;
    });

    $('input[name="optinrev_show_where"]').change(function(){
    $.post(ajaxurl, {action : "optinrev_action", optinrev_show_where : $(this).val()});
    });

    $("#optinrev_round_border").iButton({
    change: function ($input){
    if ($input.is(":checked")) {
    $('#optinrev_border_radius').val(optinrev_border_radius).keyup(); $('#_nbr').show();
    } else {
    $('#optinrev_border_radius').val(0).keyup();$('#_nbr').hide();
    }
    }
    });

    $("#optinrev_round_border").iButton({
    change: function ($input){
    if ($input.is(":checked")) {
    $('#optinrev_border_radius').val(optinrev_border_radius).keyup(); $('#_nbr').show();
    } else {
    $('#optinrev_border_radius').val(0).keyup();$('#_nbr').hide();
    }
    }
    });

    $("#optinrev_link_color").change(function(){
      if ( typeof tinyMCE != 'undefined' ) {
          var wtdom = tinyMCE.activeEditor.dom, mn = wtdom.get('simplemodal-container');
          deco = ( typeof $('#optinrev_link_underline').attr('checked') != 'undefined' ) ? 'underline !important' : 'none !important';
          $('a', mn).each(function(i,v){
              if ( v.id != 'poweredby' ) {
              $( v, mn ).attr('style', 'color : '+ $('#optinrev_link_color').val() + ';text-decoration : '+ deco );
              }
          });
          tinyMCE.activeEditor.isNotDirty = 0;
      }
    });

    $("#optinrev_link_underline").iButton({change: function(){
      $("#optinrev_link_color").change();
    }});

     $('#optinrev_list').change(function(){
        if ( $(this).val() === 'reset' ) {
        $('#action_reset').click();
        return false;
        }
     });

     //reset
     $('#action_reset').click(function(){
        if (confirm('Are you sure, you want it to reset?')) {
        wtfn.set_optin_default(1);
        }
        return false;
     });

     //preview
     $('#action_preview').click(function(){
        wtfn.save(0);
        wtfn.msg( 'Please wait. It will reload the page.' );
        hash = window.location.hash;
        href2 = window.location.href.toString().replace(/#.*/g,'');
        window.setTimeout(function(){ window.location = href2 + '&show=optin' + hash; }, 1000);
        return false;
     });

     $('input[name="optinrev_close_popup_image"]').change(function(){
        var wtdom = tinyMCE.activeEditor.dom, clbtn = wtdom.get('close');
        get_close_btn = $(this).val();
        if ( clbtn = wtdom.get('close') ) {
            wtdom.setAttrib( clbtn, 'class', get_close_btn );
            wtdom.setStyles( clbtn, wtfn.close_button_pos( get_close_btn ) );
        }
     });

     $('input[name="optinrev_border_color"],input[name="optinrev_pwbg_color"] ').change(function(){
      wtfn.redraw();
     });

     //EMAIL FORMS tab
     $('#femail_tab li').click(function(){

     $('#femail_tab li').removeClass('active');
     $( this ).addClass( 'active' );

     $('#foptin_ifo_lbl').html('<b>'+ $( this ).attr('data-title') +'</b>');

     if ( $( '#optinrev_foptin_form_active' ).val() == $(this).attr('id') ) {

     $('.foptin_ifo').show();
     //textbox
     $( '#foptin_box li').css( 'display', 'none' );
     $( '#foptin_box #optinrev_optin_' + $(this).attr('id') ).css( 'display', 'none' );

     } else {

     //textbox
     $( '#foptin_box li').css( 'display', 'none' );
     $( '#foptin_box #optinrev_optin_' + $(this).attr('id') ).css( 'display', '' );
     $('.foptin_ifo').hide();

     }


     });

    //reset call action button
    $('#reset_cab').click(function(){
      var wtdom = tinyMCE.activeEditor.dom;
      $(this).html('<i>Please wait...</i>');
      //set default active button
      $.post(ajaxurl, {action : "optinrev_action", optinrev_reset_action_button : 'get_access2.png'});
      //get default button and replace
      setTimeout(function(){
      wm = wtdom.get('wm');
      wtdom.replace( wtdom.create('img', {id : 'wm', 'src' : wtp + 'assets/get_access2.png', 'border' : 0}, null), wm );
      $(wm.parentNode).css({'width': '', 'height': ''});
      wtfn.save(0);
      $('#reset_cab').html('Done.');
      setTimeout(function(){ $('#reset_cab').html('Reset'); }, 1000);
      }, 500);
    })

    //Email Marketing form selection
    $('input[name="optinrev_email_form_opt"]').change(function(){
    $('#wotinput_fields').load(ajaxurl, {action : 'optinrev_action', optinrev_mail_webform : wtpage, optinrev_mail_provider: $('input[name="optinrev_email_form_opt"]:checked').val()});
    });

    //wotinput fields
    setTimeout(function(){
      $('#wotinput_fields').load(ajaxurl, {action : 'optinrev_action', optinrev_mail_webform : wtpage, optinrev_mail_provider: $('input[name="optinrev_email_form_opt"]:checked').val()}, function(){
         $('select', this).each(function(i,v){
            nm = $(v).attr('name');
            if ( nm.indexOf('input_enabled') > 0 ) {
                if ( $(v).val() == 0 ) {
                    nm = nm.substring( nm.indexOf('[') + 1, nm.indexOf(']'));
                    wtfn.input_setenabled( nm,  $(v).val());
                }
            }
         });
      });
    }, 1000);

    $('.mail_opt img').click(function(){$('input[name="optinrev_email_form_opt"][value="'+ $(this).attr('id') +'"]').attr('checked',true).change();});
    //Save button scroll
    scl = ( $.browser.msie ) ? 200 : 170;

    $(window).scroll(function(){if ( $(window).scrollTop() >= scl ) {$('#wotbuttons').css( {'position' : 'fixed', 'right' : '14px', 'top' : '36px', 'z-index': 9999} );} else {$('#wotbuttons').css( {'position' : 'static'} );}});
    //jsoptin_load.init();


          //set active menu
    if ( hash = window.location.hash ) {
       $('#optinrev-nav-tab a').each(function(e, el){

          if ( hash == '#email-forms' && $(el).attr('data-tab') == 1  ) {
          wtfn.tabs(el);
          return false;
          } else if ( hash == '#input-fields' && $(el).attr('data-tab') == 2  ) {
          wtfn.tabs(el);
          return false;
          } else if ( hash == '#background' && $(el).attr('data-tab') == 3  ) {
          wtfn.tabs(el);
          return false;
          } else if ( hash == '#popup' && $(el).attr('data-tab') == 4  ) {
          wtfn.tabs(el);
          return false;
          }

       });
    }
    
  $('.optinrev-alert-close').click(function(){      
    $('.optinrev-alert-close').parent().fadeOut('1000');
    
    wtfn.create_cookie( 'OPTINREV_ALERT',1, 1 );
    return false;
  });    

  });//doc ready
  
  //Init all functions
  window.wtfn = wtfn;
  
})(jQuery);  
