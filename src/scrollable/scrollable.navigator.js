/**
 * @license 
 * jQuery Tools @VERSION / Scrollable Navigator
 * 
 * Copyright (c) 2010 Tero Piirainen
 * http://flowplayer.org/tools/scrollable/navigator.html
 *
 * Dual licensed under MIT and GPL 2+ licenses
 * http://www.opensource.org/licenses
 *
 * Since: September 2009
 * Date: @DATE 
 */
(function($) {
		
	var t = $.tools.scrollable; 
	
	t.navigator = {
		
		conf: {
			navi: '.navi',
			naviItem: null,		
			activeClass: 'active',
			indexed: false,
			idPrefix: null,
			
			// 1.2
			history: false,
			keyboard: false
		}
	};		
		
	// jQuery plugin implementation
	$.fn.navigator = function(conf) {

		// configuration
		if (typeof conf == 'string') { conf = {navi: conf}; } 
		conf = $.extend({}, t.navigator.conf, conf);
		
		var ret;
		
		this.each(function() {
			
			var api = $(this).data("scrollable"),
				 navi = api.getRoot().parent().find(conf.navi), 
				 buttons = api.getNaviButtons(),
				 cls = conf.activeClass,
				 history = conf.history && $.fn.history;

			// @deprecated stuff
			if (api) { ret = api; }
			
			api.getNaviButtons = function() {
				return buttons.add(navi);	
			}; 
			
			
			function doClick(el, i, e) {
				api.seekTo(i);				
				if (history) {
					location.hash = el.attr("href").replace("#", "");	
				} else  {
					return e.preventDefault();			
				}
			}
			
			function els() {
				return navi.find(conf.naviItem || '> *');	
			}
			
			function addItem(i) {  
				
				var item = $("<" + (conf.naviItem || 'a') + "/>").click(function(e)  {
					doClick($(this), i, e);
					
				}).attr("href", "#" + i);
				
				// index number / id attribute
				if (i === 0) {  item.addClass(cls); }
				if (conf.indexed)  { item.text(i + 1); }
				if (conf.idPrefix) { item.attr("id", conf.idPrefix + i); } 
				
				return item.appendTo(navi);
			}

			
			// generate navigator
			if (els().length) {
				els().each(function(i) { 
					$(this).click(function(e)  {
						doClick($(this), i, e);		
					});
				});
				
			} else {
				$.each(api.getItems(), function(i) {
					addItem(i); 
				});
			}   
			
			// activate correct entry
			api.onBeforeSeek(function(e, index) {
				var el = els().eq(index);
				if (!e.isDefaultPrevented() && el.length) {			
					els().removeClass(cls).eq(index).addClass(cls);
				}
			}); 
			
			function doHistory(evt, hash) {
				var el = els().eq(hash.replace("#", ""));
				if (!el.length) {
					el = els().filter("[href=" + hash + "]");	
				}
				el.click();		
			}
			
			// new item being added
			api.onAddItem(function(e, item) {
				var item = addItem(api.getItems().index(item)); 
				if (history)  { item.history(doHistory); }
			});
			
			if (history) { els().history(doHistory); }
			
		});		
		
		return conf.api ? ret : this;
		
	};
	
})(jQuery);			
