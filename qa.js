/*
                                                                          ,--,                      ,----,                                            
          ,----,            ,-.----.                          ,----..  ,---.'|                    ,/   .`|          ,----..           ,--.            
        .'   .`| ,---,      \    /  \            .--.--.     /   /   \ |   | :                  ,`   .'  :  ,---,  /   /   \        ,--.'| .--.--.    
     .'   .'   ;'  .' \     |   :    \          /  /    '.  /   .     ::   : |           ,--, ;    ;     ,`--.' | /   .     :   ,--,:  : |/  /    '.  
   ,---, '    ./  ;    '.   |   |  .\ :        |  :  /`. / .   /   ;.  |   ' :         ,'_ /.'___,/    ,'|   :  :.   /   ;.  ,`--.'`|  ' |  :  /`. /  
   |   :     .:  :       \  .   :  |: |        ;  |  |--` .   ;   /  ` ;   ; '    .--. |  | |    :     | :   |  .   ;   /  ` |   :  :  | ;  |  |--`   
   ;   | .'  /:  |   /\   \ |   |   \ :        |  :  ;_   ;   |  ; \ ; '   | |__,'_ /| :  . ;    |.';  ; |   :  ;   |  ; \ ; :   |   \ | |  :  ;_     
   `---' /  ; |  :  ' ;.   :|   : .   /         \  \    `.|   :  | ; | |   | :.'|  ' | |  . `----'  |  | '   '  |   :  | ; | |   : '  '; |\  \    `.  
     /  ;  /  |  |  ;/  \   ;   | |`-'           `----.   .   |  ' ' ' '   :    |  | ' |  | |   '   :  ; |   |  .   |  ' ' ' '   ' ;.    ; `----.   \ 
    ;  /  /--,'  :  | \  \ ,|   | ;              __ \  \  '   ;  \; /  |   |  ./:  | | :  ' ;   |   |  ' '   :  '   ;  \; /  |   | | \   | __ \  \  | 
   /  /  / .`||  |  '  '--' :   ' |             /  /`--'  /\   \  ',  /;   : ;  |  ; ' |  | '   '   :  | |   |  '\   \  ',  /'   : |  ; .'/  /`--'  / 
 ./__;       :|  :  :       :   : :            '--'.     /  ;   :    / |   ,/   :  | : ;  ; |   ;   |.'  '   :  | ;   :    / |   | '`--' '--'.     /  
 |   :     .' |  | ,'       |   | :              `--'---'    \   \ .'  '---'    '  :  `--'   \  '---'    ;   |.'   \   \ .'  '   : |       `--'---'   
 ;   |  .'    `--''         `---'.|                           `---`             :  ,      .-./           '---'      `---`    ;   |.'                  
 `---'                        `---`                                              `--`----'                                   '---'                    
* Zap Solutions QA Toolbar
* By: Brandon Trecki
*/


(function() {
    // http://alexmarandon.com/articles/web_widget_jquery/
    // Localize jQuery variable
    var jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.11.3') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src",
            "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
        
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else {
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        
        // Call our main function
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        
        // Call our main function
        main();
    }

    /******** Our main function ********/
    function main() { 
        jQuery(document).ready(function($) {
            if(typeof maestro_id === 'undefined') {
                console.log('Invalid Maestro ID');
                return false;
            }
            /******* Load CSS *******/
            var maestro_qa_css = $("<link>", { 
                rel: "stylesheet", 
                type: "text/css", 
                href: "http://time.zapsolutions.com/js/qa/css/style.css" 
            });
            maestro_qa_css.appendTo('head');

            // get font awesome
            var maestro_qa_fa = $("<link>", { 
                rel: "stylesheet", 
                type: "text/css", 
                href: "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" 
            });
            maestro_qa_fa.appendTo('head');

            /******* Load HTML *******/
            $.ajax({
                type: 'GET',
                url: 'http://time.zapsolutions.com/projects/qa_get_widget/' + maestro_id,
                success: function (response) {
                    $('body').append(response);

                    // check cookies.
                    checkCookies();
                },
                failure: function (response) {
                    console.log(response);
                },
                error: function (response) {
                    console.log(response);
                }
            });

            

            // enable to toolbar
            $('body').on('click', '#maestro-qa-toolbar .maestro-open', function() {
                if( $('#maestro-qa-toolbar #maestro-tabs').hasClass('open') ) {
                    $('#maestro-qa-toolbar #maestro-tabs').removeClass('open offsidebar-open');
                    $('#maestro-qa-toolbar #maestro-tabs #open-toolbar').attr('title', 'Open QA Toolbar');
                    setCookie('maestro-menu-open', 'false', 7);
                }
                else {
                    $('#maestro-qa-toolbar #maestro-tabs').addClass('open offsidebar-open');
                    $('#maestro-qa-toolbar #maestro-tabs #open-toolbar').attr('title', 'Close QA Toolbar');
                    setCookie('maestro-menu-open', 'true', 7);
                }
            });

            // enable the tabs
            $('body').on('click', '#maestro-qa-toolbar .maestro-tab a', function() {
                $('#maestro-qa-toolbar .maestro-tab .maestro-content').fadeOut('fast');
                $(this).next().fadeToggle('fast');
            });

            // tab close button
            $('body').on('click', '#maestro-qa-toolbar .maestro-close-tab', function() {
                $(this).parent().fadeOut('fast');
            });

            // right click to remove
            $('body').on('contextmenu', '#maestro-qa-toolbar #open-toolbar', function(event){ 
                switch (event.which) {
                    case 3:
                        $('#maestro-qa-toolbar').fadeOut('fast')
                        break;
                    default:
                }
                return false; 
            });

            // save settings            
            $('body').on('change', '#maestro-qa-toolbar #maestro-settings #EntryUserId', function() {
                setCookie('maestro-current-user', $(this).val(), 7);
                $('#maestro-qa-toolbar #maestro-settings .col-sm-10').append('<span class="maestro-current-user-progress maestro-progress"><i class="fa fa-circle-o-notch fa-spin"></i></span>')
                setTimeout(function () {
                    $('#maestro-qa-toolbar .maestro-current-user-progress i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-check');

                    setTimeout(function() {
                        $('#maestro-qa-toolbar .maestro-current-user-progress').fadeOut('fast').remove();
                    }, 1000);
                }, 1000);
            });



            // entries add
            $('body').on('click', '#maestro-add-entry', function(e) {
                var url = '/entries/qa_add_entry'; // url to post data to

                //set user id
                $('#EntryProjectUserId').val($('#EntryUserId').val());

                $('#maestro-qa-toolbar .maestro-add-entry-progress').fadeIn();
                
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: $('#EntryAddModalForm').serialize(), // serialize form data
                    success: function(data) {                                            

                        if( data == 'The entry could not be saved. Please, try again.' ) { // by default its set to success
                            $('#maestro-create-entry .alert').removeClass('alert-info').addClass('alert-warning'); // switch out the classes
                        }
                        else {
                            $('#maestro-create-entry .alert').removeClass('alert-warning').addClass('alert-info'); // switch out the classes
                            
                        }

                        
                        
                        // add throbber next to button
                        setTimeout(function () {
                            $('#maestro-qa-toolbar .maestro-add-entry-progress').removeClass('fa-circle-o-notch fa-spin');

                            setTimeout(function() {
                                $('#maestro-qa-toolbar .maestro-add-entry-progress').fadeOut('fast').remove();
                                $('#maestro-create-entry .alert').text(data); // set text
                                $('#maestro-create-entry .alert').fadeIn(); // show alert
                                $('#EntryAddModalForm').trigger('reset'); // erase all form items
                            }, 1000);
                        }, 1000);
                        
                    }
                });
                e.preventDefault(); // prevent form sub...
            });

            // todos add
            $('body').on('click', '#maestro-add-todo', function(e) {
                var url = '/entries/qa_add_todo'; // url to post data to

                //set user id
                $('#EntryProjectUserId').val($('#EntryUserId').val());
                $('#TodoEntryUserId').val($('#EntryUserId').val());

                $('#maestro-qa-toolbar .maestro-add-todo-progress').fadeIn();
                
                
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: $('#EntryAddtodotolistForm').serialize(), // serialize form data
                    success: function(data) {                        

                        if( data == 'The ToDo could not be saved. Please, try again.' ) { // by default its set to success
                            $('#maestro-create-todo .alert').removeClass('alert-info').addClass('alert-warning'); // switch out the classes
                        }
                        else {
                            $('#maestro-create-todo .alert').removeClass('alert-warning').addClass('alert-info'); // switch out the classes                            
                        }

                        
                        
                        // add throbber next to button
                        setTimeout(function () {
                            $('#maestro-qa-toolbar .maestro-add-todo-progress').removeClass('fa-circle-o-notch fa-spin');

                            setTimeout(function() {
                                $('#maestro-qa-toolbar .maestro-add-todo-progress').fadeOut('fast').remove();
                                $('#maestro-create-todo .alert').text(data); // set text
                                $('#maestro-create-todo .alert').fadeIn(); // show alert
                                $('#EntryAddtodotolistForm').trigger('reset'); // erase all form items
                            }, 1000);
                        }, 1000);
                        
                    }
                });
                e.preventDefault(); // prevent form sub...
            });

            // refresh entries
            
            $('body').on('click', '.maestro-refresh-tab', function(e) {

                $(this).addClass('color fa-spin');
                $('.todo-item-list #accordion').fadeOut().remove();
                /******* Load HTML *******/
                $.ajax({
                    type: 'GET',
                    url: 'http://time.zapsolutions.com/projects/qa_get_widget/' + maestro_id,
                    success: function (response) {
                        var $contents = $(response).find('.todo-item-list #accordion');
                        

                        // add throbber next to button
                        setTimeout(function () {
                            $('.maestro-refresh-tab').removeClass('color fa-spin');
                            $('.todo-item-list').html($contents);
                        }, 2000);                        
                    },
                    failure: function (response) {
                        console.log(response);
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });
        });
        
    }

    function setCookie(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function checkCookies() {        
        jQuery(document).ready(function($) {
            var isMenuOpen = getCookie('maestro-menu-open');
            var currentUser = getCookie('maestro-current-user');
            if( isMenuOpen == 'true' ) {
                $('#maestro-qa-toolbar #maestro-tabs').addClass('open');
            }

            if( currentUser ) {
                $('#maestro-qa-toolbar #EntryUserId').val(currentUser);
            }
            else {
                $('#maestro-qa-toolbar .maestro-settings-tab').append('<div class="pull-right label label-danger">1</div>');
                
            }

            
        });
    }
})(); // We call our anonymous function immediately