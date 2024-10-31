<?php

  if ( !defined( 'ABSPATH' ) ) die('');//keep silent
  if ( !defined( 'OPTINREV_LITE' ) ) die();

  header('Content-type: text/javascript');

 if ( isset($_GET['optinrev-edit-init-js']) && $plugin_page = esc_html( $_GET['optinrev-edit-init-js'] ) )
 {

  $dir = OPTINREV_DIR;

  //$optin = optinrev_popups();
  //mail providers
  $mailpro = json_encode( unserialize(optinrev_get('optinrev_mail_providers')) );
  //is autosave
  $autosave = optinrev_get('optinrev_autosave');
  $poweredby = optinrev_get('optinrev_poweredby');
  
  $optin = optinrev_get_optin();  

  //mail provider set
  $mail_form_name = (isset($optin['optinrev_foptin_active']))?trim($optin['optinrev_foptin_active']):'aweber';

  $optinrev_ctcurl = ( isset($optin['optinrev_ctcurl']) && $optin['optinrev_foptin_active']=='constantcontact') ? $optin['optinrev_ctcurl'] : '';

  //briefcase images - it will insert to the canvas
  $is_bfcase = 0;
  if ( $imgs = optinrev_get_image( $plugin_page )) {

      $is_bfcase = array();
      foreach( $imgs as $v ) {
        $is_bfcase[] = $v->content;
        optinrev_delete( $v->name );
      }
      $is_bfcase = json_encode($is_bfcase);
  }

  $is_delbfcase = 0;
  if ( $imgs = optinrev_delete_image( $plugin_page )) {
      $is_delbfcase = array();
      foreach( $imgs as $v ) {
        $is_delbfcase[] = $v->content;
        optinrev_delete( $v->name );
      }
      $is_delbfcase = json_encode($is_delbfcase);
  }

  //briefcase button - it will insert to the canvas
  $is_actionbtn = 0;
  if ( $case_btn = optinrev_get('optinrev_add_button_briefcase') )
  {
      $is_actionbtn = $case_btn;
      optinrev_update( 'optinrev_active_action_button', $is_actionbtn );
      optinrev_delete( 'optinrev_add_button_briefcase' );
  }

  $is_upload = optinrev_get( 'optinrev_upload' );  
  
?>
/* 
<![CDATA[ */var j = jQuery.noConflict(),doc_base_url='<?php echo home_url('/');?>', wtp = '<?php echo $dir;?>', defs = {'width': 900, 'height': 600}, jpdata = [], wtpage = '<?php echo $plugin_page;?>', vldator =<?php echo (isset($optin['optinrev_input_validator']))?json_encode($optin['optinrev_input_validator']):'{}';?> , apc = false, is_editing = false, redraw=0, isvalid =<?php echo (isset($optin['validate']))?json_encode($optin['validate']):'{}';?> , get_close_btn='', is_autosave = '<?php echo $autosave;?>', is_poweredby = '<?php echo $poweredby?>', is_bfcase = '<?php echo $is_bfcase;?>', is_delbfcase = '<?php echo $is_delbfcase;?> ', is_actionbtn = '<?php echo $is_actionbtn;?> ', mail_form_name = '<?php echo $mail_form_name;?> ',optinrev_wbg_opacity = '<?php echo (isset($optin['optinrev_wbg_opacity'])) ? $optin['optinrev_wbg_opacity'] : 0;?>', optinrev_wbg_color = '<?php echo (isset($optin['optinrev_wbg_color'])) ? $optin['optinrev_wbg_color'] : '#ffffff';?>',optinrev_border_opacity = '<?php echo (isset($optin['optinrev_border_opacity'])) ? $optin['optinrev_border_opacity'] : 0;?>',optinrev_border_radius = '<?php echo (isset($optin['optinrev_border_radius'])) ? $optin['optinrev_border_radius'] : 0;?>',optinrev_border_thickness = '<?php echo (isset($optin['optinrev_border_thickness'])) ? $optin['optinrev_border_thickness'] : 1;?>',optinrev_top_margin = '<?php echo (isset($optin['optinrev_top_margin'])) ? $optin['optinrev_top_margin'] : 0;?>',optinrev_wwidth = '<?php echo (isset($optin['optinrev_wwidth'])) ? $optin['optinrev_wwidth'] : 900;?>',optinrev_hheight = '<?php echo (isset($optin['optinrev_hheight'])) ? $optin['optinrev_hheight'] : 600;?>',optinrev_delay = '<?php echo (isset($optin['optinrev_delay'])) ? $optin['optinrev_delay'] : 0;?>',optinrev_inputh = '<?php echo (isset($optin['optinrev_inputh'])) ? $optin['optinrev_inputh'] : 50;?>',optinrev_inputw = '<?php echo (isset($optin['optinrev_inputw'])) ? $optin['optinrev_inputw'] : 160;?>',optinrev_inputbt = '<?php echo (isset($optin['optinrev_inputbt'])) ? $optin['optinrev_inputbt'] : 1;?>',optinrev_inputfz = '<?php echo (isset($optin['optinrev_inputfz'])) ? $optin['optinrev_inputfz'] : 12;?>',mailpro =<?php echo $mailpro;?> , is_upload = '<?php echo $is_upload;?> ', optinrev_link_color = '<?php echo (isset($optin['optinrev_link_color'])) ? $optin['optinrev_link_color'] : '#1122CC';?>', optinrev_link_underline = '<?php echo (isset($optin['optinrev_link_underline'])) ? $optin['optinrev_link_underline'] : '';?>', optinrev_ctcurl='<?php echo $optinrev_ctcurl;?>';/* ]]> */
<?php } else die();?>