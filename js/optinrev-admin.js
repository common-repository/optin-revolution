var wtfn = {
  //message alert
  msgx: function( msg, x, y ) {
    jQuery('#post-message').stop().animate({left: x, top: y}).show().html( msg );    
    setTimeout(function(){ jQuery('#post-message').hide(); }, 2000);
  },
  msg: function( msg ) {
  alc = document.createElement('a');
  jQuery(alc).html('&times;').attr({'href':'javascript:;', 'class':'post-message-close'}).bind('click', function(){ jQuery('#post-message').fadeOut(); });
  jQuery('#post-message').html( msg ).append(alc).fadeIn();
  setTimeout(function(){ jQuery('#post-message').fadeOut(); }, 5000);
  },
  optinrev_show_popup : function( state )
  {     
    var shw = state;
    if (shw.length == 0) return false;    
    
    if ( state === 'show_once_in' ) {    
    shw = ( state == 'show_once_in' ) ? 'show_once_in|1' : state;
    jQuery('#optinrev_time_session').val(1);
    jQuery('#show_once_in').attr('checked', true);
    }
    
    if ( state === 'show_times_per_session' ) {
    shw = ( state == 'show_times_per_session' ) ? 'show_times_per_session|' + jQuery('#optinrev_time_session').val() : shw;    
    jQuery('#show_times_per_session').attr('checked', true);
    } else {
    jQuery('#optinrev_time_session').val(1);
    }    
    
    jQuery.post(ajaxurl, {action : "optinrev_action", optinrev_show_popup : shw}, function(res){
    jQuery('#save_showset').hide();    
    wtfn.msg('Successfully Updated.');    
    });
  },
  reset_emailform: function() {
    if ( confirm('Do you want to reset the email form?') ) {
    jQuery.post(ajaxurl, {action : "optinrev_action", optinrev_emailform_reset : 1}, function(res){    
    wtfn.msg('Successfully Reset.');    
    });
    }
    return false;
  },
  reset_popup: function() {
    if ( confirm('Do you want to reset the popup settings and set to default?') ) {
    jQuery.post(ajaxurl, {action : "optinrev_action", optinrev_factory_reset : 1}, function(res){    
    wtfn.msg('Successfully Reset.');    
    });
    }
    return false;
  },
  create_cookie: function(name, value, days ) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
  }   

  };