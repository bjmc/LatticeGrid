/* (c) 2009
   AUTHORS: Max Franz
   LICENSE: TODO
   v1.1
*/

;(function($){
   
   $.menu = {};
   $.menu.id = 0;
   
    var show = function(ele){
        //$(ele).show();
        //return;
    
        $(ele).each(function(){
        
            var left = $(this).data("prev_left");
            var top = $(this).data("prev_top");
            
            $(this).css({
                left: left,
                top: top
            });
        
        });
        
    }
    
    var hide = function(ele){
        //$(ele).hide();
        //return;
    
        $(ele).each(function(){
    
            var left = 0;
            var top = $(this).position().top;
            
            $(this).data("prev_left", left);
            $(this).data("prev_top", top);
        
            $(this).css({
                left: -9999,
                top: -9999
            });
            
            //$(this).trigger("mouseout");
        
        }); 
    }
    
    
    
    $.fn.menu = function(options) {  
        
        var defaults = {
            menuTitleClass: "ui-menu-title",
            menuItemClass: "ui-menu-item",
            selectedClass: "ui-state-active",
            togglableClass: "ui-menu-togglable",
            menuBarClass: "ui-menu-bar",
            topMenuClass: "ui-top-menu",
            subMenuClass: "ui-sub-menu",
            subMenuSpacingClass: "ui-sub-menu-spacing",
            menuItemFirstClass: "ui-menu-item-first",
            menuItemLastClass: "ui-menu-item-last",
            menuItemParentClass: "ui-menu-item-parent",
            parentIconClass: "ui-menu-parent-icon",
            checkableClass: "ui-menu-checkable",
            oneCheckableClass: "ui-menu-one-checkable",
            checkIconClass: "ui-menu-check-icon",
            checkedClass: "ui-menu-checked",
            addArrow: true,
            titleArrowText: "<small>&nbsp;&#9660;</small>",
            menuZIndex: 9999,
            menuItemMaxWidth: 9999,
            menuOpenDelay: 250, // in ms
            menuCloseDelay: 250, // in ms
            menuInstanceAttrName: "menu_instance_id",
            onMenuItemSelect: function(li){},
            onMenuItemDeselect: function(li){},
            onMenuItemOpen: function(li){},
            onMenuItemClose: function(li){},
            onMenuItemClick: function(li){},
            onMenuItemCheck: function(li){},
            onMenuItemUnCheck: function(li){}
        };
        
        var options = $.extend(defaults, options); 
        
        var openTimeout;
        
        function openMenu(li) {
            // add selected style           
            if( li.hasClass(options.menuTitleClass) ){
                
                if( li.hasClass(options.togglableClass) || li.find("ul").size() > 0 ) {
                    li.addClass(options.selectedClass);
                }
            } else {
                 li.addClass(options.selectedClass);
            }
            
            // clicking one menu item (toggle or otherwise) closes siblings
            li.siblings("li").each(function(){
                if( $(this).hasClass(options.selectedClass) && ! $(this).hasClass(options.togglableClass) ) {
                    $(this).click();
                }
            });
            
            li.find("." + options.parentIconClass).addClass(options.selectedClass);
            li.children("ul").find("." + options.parentIconClass).removeClass(options.selectedClass);
            
            li.find("." + options.checkIconClass).addClass(options.selectedClass);
            li.children("ul").find("." + options.checkIconClass).removeClass(options.selectedClass);
        
            (! options.onMenuItemSelect) || options.onMenuItemSelect(li);
            
            // opening sub menu is delayed
            openTimeout = setTimeout(function(){
                var children = false;
                
                // open sub menus
                show(  li.children("ul") );
                li.children("ul").each(function(){
                    
                    var maxWidth = 0;
                    var height = 0;
                    
                    $(this).css("width", options.menuItemMaxWidth);
                    
                    $(this).children("li").each(function(){
                        $(this).css("display", "block").css("width", "auto");
                        maxWidth = Math.max( maxWidth, $(this).outerWidth() );
                        $(this).css("height", $(this).height());
                    }).width(maxWidth);            
                    $(this).css("width", maxWidth);
                    
                    $(this).find("." + options.subMenuSpacingClass).each(function(){
                        var top = $(this).parent().parent().outerHeight();
                        var height = $(this).parent().outerHeight() - top;
                        var padding = $(this).parent().parent().width();
                        
                        $(this).css({
                            "position": "absolute",
                            "top": top,
                            "left": 0,
                            "width": "100%",
                            "height": height,
                            "padding-left": padding,
                            "padding-right": padding,
                            "padding-bottom": padding,
                            "margin-left": -1*padding
                            });
                        show( $(this) );
                    });
                    
                    //$(this).css("height", $(this).height());
                    
                    if( ! $(this).parent().hasClass(options.menuTitleClass) ) {
                        $(this).css( "left", $(this).parent().width() );
                        $(this).css( "top", 0 );
                    } else {
                        $(this).css( "top", $(this).parent().outerHeight() + $(this).parent().position().top );
                        $(this).css( "left", 0 );
                    }
                    
                    // icon offsets
                    $(this).children("li").children("." + options.parentIconClass + ", ." + options.checkIconClass).each(function(){
                        var offsetY = ( ( $(this).closest("li").height() - $(this).height() ) / 2 );
                        
                        if( parseInt( $(this).css("margin-top") ) == 0 ) {
                            $(this).css( "margin-top", offsetY );
                        }
                        
                        if( $(this).hasClass(options.parentIconClass) ) {
                            var offsetX = $(this).closest("li").width() - $(this).width();
                            $(this).css("margin-left", offsetX);
                        }
                    });
                    
                    
                    
                    children = true;
                });
                
                if(children) {
                    (! options.onMenuItemOpen) || options.onMenuItemOpen(li);
                }
            }, (li.hasClass(options.menuTitleClass)) ? (0) : (options.menuOpenDelay) );
        }
        
        function closeMenu(li) {
            clearTimeout(openTimeout);
        
            var children = li.children("ul").length > 0;
        
            hide( li.children("ul") );
            
            li.removeClass(options.selectedClass);
            
            li.find("." + options.parentIconClass).removeClass(options.selectedClass);
            li.find("." + options.checkIconClass).removeClass(options.selectedClass);
            
            if( li.hasClass(options.togglableClass) ) {
                li.siblings("li").each(function(){
                    if( $(this).hasClass(options.selectedClass) && ! $(this).hasClass(options.togglableClass) ) {
                        $(this).removeClass(options.selectedClass);
                    }
                });
            }
            
            (! options.onMenuItemDeselect) || options.onMenuItemDeselect(li);
            if(children) {
                (! options.onMenuItemClose) || options.onMenuItemClose(li);
            }
        }
        
        return this.each(function() {
            var ul = $(this).children("ul:first");
            var parent = $(this);
            
            parent.attr(options.menuInstanceAttrName, $.menu.id++);
            
            // add style classes
            $(this).addClass("ui-corner-all outline ui-tabs ui-widget ui-widget-content");
            ul.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
            ul.addClass(options.menuBarClass);
            ul.children("li").addClass("ui-state-default ui-corner-top");
            ul.find("ul").each(function(){                
                $(this).children("li:first").addClass("ui-corner-top").addClass(options.menuItemFirstClass);
                $(this).children("li:last").addClass("ui-corner-bottom").addClass(options.menuItemLastClass);
                
                $(this).children("li").each(function(){
                    if( $(this).children("ul").length > 0 ) {
                        $(this).addClass(options.menuItemParentClass);
                        $(this).prepend("<div style=\"position: absolute\" class=\"" + options.parentIconClass + "\"></div>");
                    }
                    
                    if( $(this).hasClass(options.checkableClass) ) {
                        $(this).prepend("<div style=\"position: absolute\" class=\"" + options.checkIconClass + "\"></div>");
                        
                        $(this).click(function(){
                            var check = $(this).children("." + options.checkIconClass);
              
                            if( $(this).parent().hasClass(options.oneCheckableClass) ) {
                                if(!check.hasClass(options.checkedClass)) {
                                    check.addClass(options.checkedClass);
                                    (! options.onMenuItemCheck) || options.onMenuItemCheck( $(this) );
                                    
                                    $(this).siblings().each(function(){
                                        var sibCheck = $(this).children("." + options.checkIconClass);
                                        
                                        if(sibCheck.hasClass(options.checkedClass)){
                                            sibCheck.removeClass(options.checkedClass);
                                            (! options.onMenuItemUncheck) || options.onMenuItemUncheck( $(this) );
                                        }
                                    });
                                }
                            } else {
                                check.toggleClass(options.checkedClass);
                            
                                if( check.hasClass(options.checkedClass) ) {
                                    (! options.onMenuItemCheck) || options.onMenuItemCheck( $(this) );
                                } else {
                                    (! options.onMenuItemUncheck) || options.onMenuItemUncheck( $(this) );
                                }
                            }
                        });
                    }
                });
            });
            
            // only top level are menu items
            ul.find("li").addClass(options.menuItemClass);
            ul.children("li").removeClass(options.menuItemClass).addClass(options.menuTitleClass);
            ul.children("li").each(function(){
                if( $(this).children("ul").length > 0 && options.addArrow ) {
                    $(this).find("label:first").append(options.titleArrowText);
                } else {
                    //$(this).addClass(options.togglableClass);
                }
            });
            
            // differentiate top level and sub menus
            ul.find("ul").each(function(){
                if( $(this).parent().hasClass(options.menuTitleClass) ) {
                    $(this).addClass(options.topMenuClass);
                } else {
                    $(this).addClass(options.subMenuClass);
                }
            });
            
            // remove corner from top level menus
            ul.find("." + options.topMenuClass).children("." + options.menuItemFirstClass);
            
            // add sub menu spacing
            $("." + options.subMenuClass).find("." + options.subMenuSpacingClass).remove();
            $("." + options.subMenuClass).append("<div class=\"" + options.subMenuSpacingClass + "\"></div>");
         
                       
            // set position and index
            ul.find("ul").css("position", "absolute");
            hide( ul.find("ul") );

            ul.children("li").toggle(function(){
                openMenu( $(this) );
            }, function(){
                closeMenu( $(this) );
            });
            
            ul.find("." + options.menuItemClass).mouseenter(function(){
                openMenu( $(this) );
            }).mouseleave(function(){
                closeMenu( $(this) );
            });
            
            ul.find("li").click(function(){
                // don't send parent clicks
                if( $(this).find("." + options.menuItemClass + "." + options.selectedClass).length > 0 ) {
                    return;
                }
            
                // if it's not selected, we've clicked it, not the user
                // BUT always send toggles
                if( $(this).hasClass(options.selectedClass) || $(this).hasClass(options.togglableClass) ) {
                    (! options.onMenuItemClick) || options.onMenuItemClick( $(this) );
                }
            });
            
            function closeAll() {
                ul.find("." + options.selectedClass).each(function(){
                    if( ! $(this).hasClass(options.togglableClass) ) {
                        $(this).click();
                    }
                });
            }
            
            $("*").live("mouseup", function(){
                var attr_parent = $(this).parents("[" + options.menuInstanceAttrName + "]");            
                
                if( attr_parent.length > 0 ){
                    var attr = attr_parent.attr(options.menuInstanceAttrName);
                    
                    if( attr == $(parent).attr(options.menuInstanceAttrName) ){
                        // keep open
                    } else {
                        closeAll();
                    }
                    
                } else {
                    closeAll();
                }
                
                
            });
        });  
    };  
})(jQuery);  