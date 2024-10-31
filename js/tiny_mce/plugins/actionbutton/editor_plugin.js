/**
 * php.rcena@gmail.com
 */
(function(tinymce) {
   var DOM = tinymce.activeEditor;    
   tinymce.create('tinymce.plugins.ActionButton', {    
    
   init : function(ed, url) {
   var t = this, ml;
	 t.editor = ed;
   
   ed.addButton('actionbutton',
   {
   title : 'Attach image as action button.',
   image : url + '/images/medialib.png',
   cmd : 'mceActionButton'
   });
   
   ed.addCommand('mceActionButton', function() {
   
          //wp media test
          if ( typeof wp == 'undefined' ) return false;

          if (ml) {
              ml.open();
              return;
          }

          //Extend the wp.media object
          //ml = wp.media.frames = wp.media({
          ml = wp.media.frames = wp.media({
              title: 'Choose or Upload an Image',
              button: {text : 'Update an action button.'},
              library: {type: 'image'},
              multiple: false
          });


          ml.on('select', function()
          {                 
            var wtdom = ed.dom, at = ml.state().get('selection').first().toJSON(), img = document.createElement('img'), an = document.createElement('a'), dv = document.createElement('div'), c = wtdom.get('simplemodal-container'), d = wtdom.get('simplemodal-data'), mn_w = optinrev_wwidth, mn_h = optinrev_hheight, ac;
            if ( at ) {
            //if action button
            if ( ac = wtdom.get('wm') ) {
                j(img).attr({ 'src' : at.url, 'id' : 'wm', 'border' : 0 });
                j( ac, d ).replaceWith( img );
            }
            }
          });

          //Open the uploader dialog
          ml.open();
   
   });//command
   
   }//init        		
	 });

// Register plugin with a short name
tinymce.PluginManager.add('actionbutton', tinymce.plugins.ActionButton);
})(tinymce);