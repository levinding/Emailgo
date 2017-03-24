 /**
 * Main page javascript begin
 * Author:levin Ding
 * Project: Verp VP 2.0 version
 * Date:Sept 2015
 */

/**
 * Global variables for all functions to use. All developers who contribute his code in this file
 * should prevent from naming the same name of following variables in his or her codes
 * for the reason of avoid of possible unknow error happen
 */
  //Check the list hover status for left side lists
  var listHover = false,
      childHover = false;

  //Check the check all radios checked status
  var checkAllStatus = 'unchecked',
      checkListStatus = 'unchecked';
  
  //Datetimepicker global variables
  var startDate = '',
      endDate = '';

/**
 * The main functions begin
 */
$(function(){
	//Recall the main structure layout calculation function
	layout();
	
	//Ajust the left aside row height to equal right side table cells height
	leftRowHeight();
    leftListChild();
	
	//init the niceScroll bar
	var scrollObj = $(".scroll");
	if(scrollObj.length > 0){
		scrollObj.each(function(){
			var _this =$(this),
			    arr = '';
			if(!_this.data('scroll') == '' || !_this.data('scroll') == 'undefined') arr = _this.data('scroll');
			initScroll(_this, arr);
		});
	}
	
	//Left side block display toggole function
	$('header').on('click', '.switch, .title', function(){
		var win = $(window),
		    winW = win.width(),
		    aside = $("#main-content aside"),
		    article = $("#main-content article"),
		    asideScroll = aside.children('.scroll'),
		    asideFooter = aside.children('footer'),
		    contact = $("#main-content > header .contact"),
		    title = $('#main-content > header .title'),
			isdh = aside.data("isdh");
			if(isdh){
				return false;
			}
			aside.data("isdh",true);
			if(aside.outerWidth() == 42) {
				aside.add(contact).addClass('open');
				aside.animate({width:"216px"},'fast', function(){
					asideScroll.height(aside.height() - asideFooter.height()).getNiceScroll().resize();
				});
				article.animate({left: "216px", width:winW - 216 + "px"},'fast', function(){
					aside.data("isdh",false);
				});
				if(title.is(':hidden')) title.removeClass('hidden');
			}else{
				aside.add(contact).removeClass('open');
				var FooterHeight = $('aside footer').height();
				aside.animate({width:"42px"},'fast', function(){
					asideScroll.height(aside.height() - asideFooter.height()).getNiceScroll().resize();
				});
				article.animate({left: "42px", width:winW - 42 + "px"},'fast', function(){
					aside.data("isdh",false);
				});
				if(contact.is(':visible')) title.addClass('hidden');
			}
	});
	
	//The left side list selection hover and click event function to display her children and choosing terms
	if($('#main-content > aside .list').length > 0){
		var list = $('#main-content > aside .list > li'),
		    children = $('#main-content > aside > .list-children'),
		    popover = children.children('.popover'),
            terms = children.children('.popover.opt').children('li').not('.search'),
            label = popover.find('.am-checkbox'),
            checkBox = label.children(),
            select = $('#main-content > aside .selected'),
            sort = select.prev('h3'),
			clear = select.next('.clear'),
            getAttr = function(_class, _text){
	        	this.className = getClass(_class, 2);
	        	this.term = select.children('.'+this.className).children('.term');
	        	this.text = _text;
	        	this.menu = $('#main-content > aside .list > li.'+this.className);
	        	this.title = this.menu.text();
	        },
	        activeTerms = function(popover){
                var newText = '';
                popover.children('li.active').each(function(){
                    newText += $(this).text() + ', ';
                })
                newText = newText.substring(0, newText.lastIndexOf(', '));
                return newText;
            };
        
        list.each(function(){
            var _this = $(this);
            var index = _this.index() + 1;
            var span = _this.children('span');
            var className = _this.attr('class');
			var popover = children.find('> .'+ className);
			
			_this.hoverDelay({
				hoverEvent: function(){
					listHover = true;
					if(!span.hasClass('hover')){
		                span.addClass('hover');
		            }
					popOver(_this, popover, index, span);
				},
				outEvent: function(){
					popOut(popover, span);
				}
			});
		});
        
        //popover list click event on left side
        label.on('click', 'input[type="checkbox"]', function(event){
            var _this = $(this),
                popover = _this.parents('.popover'),
                className = popover.attr('class'),
                checkAll = popover.children('li.all').children('.am-checkbox').children(),
                text = _this.parents('li').text(),
                attr = new getAttr(className, text);
            
            showSwitch();
            
            if(_this.is(':checked')){
                if(_this.parents('li').hasClass('all')){
                    _this.parents('li').siblings('li').find('.am-checkbox').children().uCheck('check');
                    _this.parents('.popover').children('li').addClass('active');
                }else{
                    _this.parents('li').addClass('active');
                }
                selected(attr.className, attr.menu, attr.term, attr.title, attr.text);
            }else{
                if(_this.parents('li').hasClass('all')){
                    _this.parents('li').siblings('li').find('.am-checkbox').children().uCheck('uncheck');
                    _this.parents('.popover').children('li').removeClass('active');
                    attr.term.text('');
                }else{
                    _this.parents('li').removeClass('active');
                    if(checkAll.is(':checked')){
                        checkAll.uCheck('uncheck');
                        checkAll.parents('li').removeClass('active');
                    }
                }
                unCheck(attr.className, attr.menu, attr.term, attr.text, activeTerms(popover));
            }
            event.stopPropagation();
        });
        
        terms.on('click', function(){
            var _this = $(this),
                className = _this.parent('.popover').attr('class'),
                text = _this.text(),
                attr = new getAttr(className, text);
            
            showSwitch();
            
            if(!_this.hasClass('active')){
                _this.addClass('active');
                selected(attr.className, attr.menu, attr.term, attr.title, attr.text);
            }else{
                _this.removeAttr('class');
                unCheck(attr.className, attr.menu, attr.term, attr.text, actives.newTerms);
            }
        });
        
        //Clear the selected terms
        clear.on('click', function(){
            select.empty();
            if(popover.children('li.active').length > 0){
                popover.children('li.active').removeClass('active');
            }
            if(checkBox.is(':checked')){
                checkBox.uCheck('uncheck');
            }
            if(list.hasClass('hidden')){
            	list.removeClass('hidden');
            }
            select.add(clear).addClass('hidden');
            sort.removeClass('hidden');
            startDate = endDate = '';
        })
        
        //close event at term boxs on left side
        select.on('click', '.group > .am-icon-close', function(){
        	var className = getClass($(this).parent().attr('class'), 1);
        	var popover = children.children('.'+className);
        	var checkBox = popover.find('.am-checkbox > input[type="checkbox"]');
        	var menu  = select.siblings('.list').children('.'+className);
        	$(this).parent('.group').remove();
        	menu.removeClass('hidden');
        	popover.removeClass('in');
        	if(checkBox.is(':checked')){
        		checkBox.uCheck('uncheck');
    			checkBox.parents('li').removeClass('active');
        	}
        	if(select.html() == '') {
                select.add(clear).addClass('hidden');
                sort.removeClass('hidden');
            }
        	startDate = endDate = '';
        });
        
        //AmazeUI Datepicker initialize
        var startDateTime = children.find('#start-date').datetimepicker({
        	format: 'yyyy-mm-dd',
        	minView: 'month'
        });
        var endDateTime = children.find('#end-date').datetimepicker({
        	format: 'yyyy-mm-dd',
        	minView: 'month'
        });
        startDateTime.on('changeDate', function(event){
        	var start_time = children.find('#start-date'),
        	    className = start_time.parents('.popover').attr('class'),
        	    text = (endDate == '')?'开始日期: ' + start_time.data('date') : start_time.data('date'),
        	    attr = new getAttr(className, text);
        	
        	startDate = start_time.data('date');    
        	showSwitch();
        	selected(attr.className, attr.menu, attr.term, attr.title, attr.text);
        });
        endDateTime.on('changeDate', function(event){
        	var end_time = children.find('#end-date'),
        	    className = end_time.parents('.popover').attr('class'),
        	    text = (startDate == '')?'结束日期: ' + end_time.data('date') : end_time.data('date'),
        	    attr = new getAttr(className, text);
        	
        	endDate = end_time.data('date');
        	showSwitch();
        	selected(attr.className, attr.menu, attr.term, attr.title, attr.text);
        });
        
        //Public callback function for select event at left side bar
        function getClass(_class, num){
        	var className = _class.split(' '),
        	    className = className[num];
        	return className;
        }
        function showSwitch(){
        	if(select.hasClass('hidden')){
                select.add(clear).removeClass('hidden');
                sort.addClass('hidden');
            }
        }
        function selected(className, menu, term, title, text){
        	if(menu.is(':visible')){
    			menu.addClass('hidden');
    		}
        	if(term.length == 0){
                select.append('<div class="group ' + className+'"><span class="am-icon-close hidden"></span><div class="title">'+title+'</div><div class="term"></div></div>');
                term = select.children('.' + className).children('.term');
                term.append(text);
            }else{
            	if(text == '所有'){
            		term.text(text);
            	}else if(term.parent('.group').hasClass('last-time')){
            		if(!startDate == '' && !endDate == ''){
            			term.text(startDate + ' ~ ' + endDate);
            		}else{
            			term.text(text);
            		}
            	}else{
            		term.append(', ' + text);
            	}
            }
            
            //The selected group hover event to replace the hidden list hover event for display popover on left side
			select.children('.group').each(function(){
	            var _this = $(this);
	            var index = (_this.index() == 0)? 1 : 0;
	            var className = getClass(_this.attr('class'), 1);
				var popover = children.find('> .'+className);
				
				_this.hoverDelay({
					hoverEvent: function(){
						listHover = true;
						if(!_this.hasClass('hover')){
			                _this.addClass('hover');
			            }
						popOver(_this, popover, index, _this);
					},
					outEvent: function(){
						popOut(popover, _this);
					}
				});
			});
        }
        function unCheck(className, menu, term, text, newTerms){
        	if(term.text().indexOf(',') > 0){
        		var newTerm = term.text().split(', ' + text).join('');
        		if(newTerm == term.text()){
        			newTerm = term.text().split(text+',').join('');
        			term.text(newTerm);
        		}else{
        			term.text(newTerm);
        		}
        	}else{
        		if(term.text() == '所有'){
        			term.text(newTerms);
        		}else{
        			select.children('.'+className).remove();
        			menu.removeClass('hidden');
        		}
            }
            if(select.html() == '') {
                select.add(clear).addClass('hidden');
                sort.removeClass('hidden');
            }
        }
        function popOver(_this, popover, index, hoverTag){
            var winH = $(window).height();
            var offsetTop = _this.offset().top;
            var offsetBottom = winH - _this.offset().top;
            var close = _this.children('.am-icon-close');
            
            if(!popover.hasClass('in')){
                popover.addClass('in');
            }
            if(close.length > 0){
            	close.removeClass('hidden');
            }
            
			if(popover.outerHeight() >= offsetBottom) {
                if(offsetTop >= 1/2 * winH - 40){
                    if(popover.outerHeight() >= offsetTop){
                        popover.css({'top': 2 - index + 'px', 'height':offsetTop + 'px'});
                    }else{
                        popover.css({'top':offsetTop - 40 - popover.outerHeight() + 42 - index + 'px', 'height':'auto'});
                    }
                }else{
                    popover.css({'top':offsetTop - 40 - index +'px', 'height':offsetBottom - 40 + 'px'});
                }
				initScroll(popover);
			}else{
                popover.css('top',offsetTop - 40 - index +'px');
            }
			
			popover.on('mouseover', function(){
            	childHover = true;
            	listHover = true;
            }).on('mouseleave', function(){
            	listHover = false;
            	childHover = false;
            	delayHide();
            });
            
            $(document).on('mouseover', '.nicescroll-rails', function(){
            	listHover = true;
            	childHover = true;
            }).on('mouseleave', '.nicescroll-rails',  function(){
            	listHover = false;
            	childHover = false;
            	delayHide();
            });
            
            function delayHide(){
            	setTimeout(function(){
            		if(!listHover){
	            		popover.removeClass('in').css('height','auto');
	            		hoverTag.removeClass('hover');
	            		if(close.length > 0){
			            	close.addClass('hidden');
			            }
	            	}
            	},200);
            }
		}
        function popOut(popover, hoverTag){
        	var close = hoverTag.children('.am-icon-close');
        	if(!childHover){
				popover.removeClass('in').css('height','auto');
				hoverTag.removeClass('hover');
				if(close.length > 0){
	            	close.addClass('hidden');
	            }
			}
        }
	}
	
	//Hover function for elements display toggle
	if($('.hover').length > 0) {
		var element = $('.hover');
		element.each(function(){
			var _this = $(this);
			hover(_this);
		});
	}
	
	//Click the checkbox to process the function related to body table.
	if($("#main-content > article .check-all input[type='checkbox']").length > 0) {
		var checkAll = $("#main-content > article .check-all input[type='checkbox']");
		var options = checkAll.closest('div').find('.popover');
		var checkList = $('.tbody .am-checkbox');
		var CheckBox = checkList.children("input[type='checkbox']");
		var icon = $('.tbody .circle');
		var defaultCheck = options.children('li:first-child');
		var contact = $('header .contact');
		var title = $('header .title');
		checkAll.each(function(){
			var _this = $(this);
			_this.click(function(){
				if(_this.is(':checked')){
					if($("#main-content aside").outerWidth() == 42) title.addClass('hidden');
					defaultCheck.addClass('active');
					_this.val(defaultCheck.html());
					contact.removeClass('hidden');
					contact.find('.checked').html(checked);
					icon.removeClass('in');
					checkList.addClass('in');
					CheckBox.uCheck('check');
					checkAll.uCheck('check');
					checkAllStatus = 'checked';
					var checked = checkList.children("input[type='checkbox']:checked").length;
					contact.find('.checked').html(checked);
				}else{
					options.children('li').removeClass('active');
					_this.val('');
					contact.addClass('hidden');
					if(title.is(':hidden')) title.removeClass('hidden');
					contact.find('.checked').html('0');
					icon.addClass('in');
					checkList.removeClass('in');
					CheckBox.uCheck('uncheck');
					checkAll.uCheck('uncheck');
					checkAllStatus = 'unchecked';
					checkListStatus = 'unchecked';
				}
			});
		});
		CheckBox.each(function(){
			var _this = $(this);
			_this.click(function(){
				var checked = checkList.children("input[type='checkbox']:checked").length;
				if(checked > 0){
					contact.removeClass('hidden');
					if($("#main-content aside").outerWidth() == 42) title.addClass('hidden');
					contact.find('.checked').html(checked);
					icon.removeClass('in');
					checkList.addClass('in');
					checkListStatus = 'checked';
				}else{
					if(checkAll.is(':checked')){
						checkAll.uCheck('uncheck');
						checkAllStatus = 'unchecked';
					}
					contact.addClass('hidden');
					if(title.is(':hidden')) title.removeClass('hidden');
					contact.find('.checked').html('0');
					options.children('li').removeClass('active');
					icon.addClass('in');
					checkList.removeClass('in');
					checkListStatus = 'unchecked';
				}
			});
		});
		options.each(function(){
			var opt = $(this);
			var li = opt.children('li');
			var nextOption;
			if(opt.parents('footer').length > 0) nextOption = opt.parents('footer').siblings('div').find('.popover')
			else nextOption = opt.parent('div').siblings('footer').find('.popover');
			li.each(function(){
				var _this = $(this);
				var checkBox = _this.closest('div').find(".am-checkbox input[type='checkbox']");
				_this.click(function(){
					var nextList = nextOption.children('li').eq(_this.index());
					if(_this.index() !== 2){
						_this.addClass('active').siblings().removeClass('active');
						nextList.addClass('active').siblings().removeClass('active');
						checkBox.uCheck('check').val(_this.html());
						contact.removeClass('hidden');
						if($("#main-content aside").outerWidth() == 42) title.addClass('hidden');
						icon.removeClass('in');
						checkList.addClass('in');
						CheckBox.uCheck('check');
						checkAll.uCheck('check');
						checkAllStatus = 'checked';
						if(_this.index() == 0){
							var checked = checkList.children("input[type='checkbox']:checked").length;
							contact.find('.checked').html(checked);
						}
					}else{
						_this.siblings().removeClass('active');
						nextList.siblings().removeClass('active');
						checkBox.uCheck('uncheck').val('');
						contact.addClass('hidden');
						if(title.is(':hidden')) title.removeClass('hidden');
						contact.find('.checked').html('0');
						icon.addClass('in');
						checkList.removeClass('in');
						CheckBox.uCheck('uncheck');
						checkAll.uCheck('uncheck');
						checkAllStatus = 'unchecked';
						checkListStatus = 'unchecked';
					}
				});
			});
		});
		
		//The table button tag hover function
		if($('.tbody .circle').length > 0) {
			var td = $('.tbody .circle').parent('td');
			td.each(function(){
				var _this = $(this),
				    tag = _this.children('.circle'),
			        checkList = _this.children('.am-checkbox');
			    _this.hoverDelay({
			    	hoverEvent: function(){
			    		if(checkAllStatus == 'unchecked'){
							tag.removeClass('in');
							checkList.addClass('in');
						}
					},
					outEvent: function(){
						if(checkAllStatus == 'unchecked' && checkListStatus == 'unchecked'){
							tag.addClass('in');
							checkList.removeClass('in');
						}
					}
				});
			});
		}
	}
});

//Ajust the layout dynamically when window size change
$(window).resize(function() {
	layout();
});

//The main structure default layout of page function
function layout(){
	var win = $(window),
	    winH = win.height(),
	    winW = win.width(),
	    header = $('#main-content header'),
	    left = $('#main-content aside'),
	    right = $('#main-content article'),
	    thead = right.find('.thead'),
	    asideSection = left.find('> section:last-child'),
	    footerLH = left.find('footer').height(),
	    footerRH = right.find('footer').height();
	right.width(winW - left.outerWidth());
	left.add(right).height(winH - header.height());
	left.find('.scroll').height(left.height()- footerLH);
	right.find('.scroll').height(right.height() - thead.height() - footerRH);
	
    /**
    * Call mailNote function for mail number appear in the tabel column in the html exsample layout file.
    * This function should be removed from below by Backend developer as it will be recalled later in the function
    * in which mail note number was appened.
    */
    mailNote();
}

//Initiate nicescoll settings
function initScroll(obj, options){
	var _this = obj,
	    opt = $.extend(
			{},
			{
				cursorcolor: "#CCE3F5",
				cursorwidth: "5px",
				cursorborderradius: "5px",
				autohidemode: true,
				background: "",
				horizrailenabled: false,
				cursorborder: "1px solid #fff",
				railoffset: false
			},
			options
		);
	_this.niceScroll(opt);
	_this.getNiceScroll().resize()
}

//Adjust the row height of lists in left side to equal to table cells in right side
function leftRowHeight(){
	var aside = $('#main-content > aside');
	var list = aside.find('.list > li');
	var _length = list.length;
	var i = 0;
	if(aside.length > 0){
		for(i; i < _length; i++){
			list.eq(i).children('span').css('top', -(i+1)+'px');
		}
	}
}

//Ajust the list children position to align with each related list on left side
function leftListChild(){
    var aside = $('#main-content > aside');
	var list = aside.find('.list > li');
    var children = aside.children('.list-children');
    list.each(function(){
        var _this = $(this);
        var className = _this.attr('class');
        var offset = _this.offset().top - 40;
        children.find('.'+className).css('top', offset+'px');
    });
}

//initillize the table cell size to be same between thead and tbody
 function tableCell(){
	var scroll = $('.tbody.scroll');
	if(scroll.length > 0){
		var th = $('.thead th'),
		    td = scroll.find('tr:first-child td');
		for(var i=0; i<th.length; i++){
			th.eq(i).width(td.eq(i).width());
		}
	}
}
 
/**
 * Dynamically ajust the table cell unit width in email column.
 * This function should be called in the function in which the note numbber is appened into the mail column.
 * See example layout in html file for this section
 */
function mailNote(){
	var note = $('.table span.note');
	note.children('span:first-child').css('width', '');
	note.each(function(){
		var _this = $(this),
		    mail = _this.children('span:first-child');
		if(mail.outerWidth() > _this.outerWidth() - _this.children('span:last-child').width() - 19) {
			mail.css('width', _this.outerWidth() - _this.children('span:last-child').width() - 20);
		}
	});
}

function hover(obj) {
	var _this = obj,
	    showBox = _this.closest('div').find('.popover');
    if(_this.children('.popover').length > 0){
    	_this.hover(function(){
    		showBox.toggleClass('in');
	    });
    }else{
    	_this.add(showBox).hover(function(){
    		showBox.toggleClass('in');
    	});
    }
}

$.fn.hoverDelay = function(options){
	var defaults = {
		hoverDuring: 200,
		outDuring: 200,
		hoverEvent: function(){
			$.noop();
		},
		outEvent: function(){
			$.noop();
		}
    };
    var sets = $.extend(defaults,options || {});
    var hoverTimer, outTimer;
    return $(this).each(function(){
    	$(this).hover(function(){
    		clearTimeout(outTimer);
    		hoverTimer = setTimeout(sets.hoverEvent, sets.hoverDuring);
    	},function(){
    		clearTimeout(hoverTimer);
    		outTimer = setTimeout(sets.outEvent, sets.outDuring);
    	});
    });
}
