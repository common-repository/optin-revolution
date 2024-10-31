/**
 * php.rcena@gmail.com
 */
(function(tinymce) {
   var DOM = tinymce.activeEditor;    
   tinymce.create('tinymce.plugins.AttachImage', {    
    
   init : function(ed, url) {
   var t = this, ml;
	 t.editor = ed;
   
   ed.addButton('attachimage',
   {
   title : 'Attach an image.',
   image : url + '/images/medialib.png',
   cmd : 'mceAttachImage'
   });
   
   ed.addCommand('mceAttachImage', function() {
   
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
              button: {text : 'Attach an image.'},
              library: {type: 'image'},
              multiple: false
          });                    

          ml.on('select', function()
          {                 
            var wtdom = ed.dom, at = ml.state().get('selection').first().toJSON(), img = document.createElement('img'), an = document.createElement('a'), dv = document.createElement('div'), c = wtdom.get('simplemodal-container'), d = wtdom.get('simplemodal-data'), mn_w = optinrev_wwidth, mn_h = optinrev_hheight, ac;           
            
            if ( at ) {
            //image size
            //get the actual image size
            j.post('admin-ajax.php', {action : 'optinrev_action', optinrev_getimagesize : at.url, cdn: 1}, function(res){
            //resize the image
            if ( dm = j.parseJSON(res) )
            {
                
                var w = dm.width, h = dm.height, b = j('#optinrev_vborder_thickness').val();
                if ( dm.width > mn_w ) {
                tp = ( mn_w / parseInt( dm.width ) ) * parseInt( dm.height );
                w = mn_w;
                h = tp;
                }

                if ( dm.height > mn_h ) {
                tp = ( mn_h / parseInt( dm.height ) ) * parseInt( dm.width );
                w = tp;
                h = mn_h;
                }

               j(img).attr({ 'src' : at.url, 'border' : 0 }).css({width: w - b, height: h - b});
               j(dv)
                .attr('style', 'position: absolute; left: 10px; top: 10px; z-index: 2; border: 1px solid transparent;')
                .html( img );
                j(d).append( dv );

             }

             });
            //image size            
            }
                        
          });
          

          //Open the uploader dialog
          ml.open();
   
   });//command
   
   }//init        		
	 });

// Register plugin with a short name
tinymce.PluginManager.add('attachimage', tinymce.plugins.AttachImage);
})(tinymce);