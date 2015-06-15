/**
 * @author : Ryan Divis <rdivis@solutionstream.com>, 2013
 * Bootstrap Adapter Settings for UTI Completer (typahead or autocompleter)
 *
 * Each function extended to the prototype will allow us to override base functionality
 * and adapt the completer to any javascript library. The main functions that should be
 * overridden are 'setup' and 'formatData'
 * 
 */
$.extend($.Ahead.prototype,{
	setup : function(){
		var self = this;
		this.ahead()
			.typeahead({
                source : function(query,process){
                	process(self.getResults(query));
                },
                updater : function(item){
                	var ui = [];
                	ui['item'] = self.map[item];
                	self.onSelect(ui);
                	return ui.item.label;
                },
                minLength : self.options.minLength
            });  
	}
});
/**
 * @author : Ryan Divis <rdivis@solutionstream.com>, 2013
 * jQuery Adapter Settings for UTI Completer (typahead or autocompleter)
 *
 * Each function extended to the prototype will allow us to override base functionality
 * and adapt the completer to any javascript library. The main functions that should be
 * overridden are 'setup' and 'formatData'
 *
 * @function getResults : overriding this functionality because jQuery UI will load
 * every result set 1 behind the current query if the 'response' callback is not
 * called after success in the ajax call
 * 
 */
$.extend($.Ahead.prototype,{
        setup : function(){
                var self = this;
                this.ahead()
                        .autocomplete({
                source : $.proxy(self.getResults,self),
                select : function(event,ui){
                    ui.item = self.map[ui.item.label];
                    var func = $.proxy(self.onSelect,self,event,ui);
                    func();
                    return false;
                },
                //state: self.options.state,
                //city: self.options.city,
                minLength : self.options.minLength
            });
        },
        getResults : function(request,response){
            if(!request) return false;
            var self = this;

            //handle ajax request
            url = this.options.source;

            getData = { startofname: request.term };

            if (self.options.data === false)
            {
                url = url + "/" + request.term;
                getData = false;
            }
            $.ajax({
                    url : url,
                    type : 'get',
                    data : getData,
                    dateType : 'json',
                    success : function(data)
                    {
                            response(self.formatData(data));
                    }
            });
        }
});
/**
 * @author : Ryan Divis <rdivis@solutionstream.com>, 2013
 * UTI Completer (typahead or autocompleter)
 *
 * This is the basic completer functionality required for use. It is based off of the
 * jQuery UI Widget inheritance. Almost everything is extendable/overrideable. If just
 * this script is included in the page, nothing will happen. Each of the other completer
 * types uses the $.Ahead as the base for their objects.
 *
 * The completer assumes that you want to have a hidden element that has the "real" value
 * stored within after an item is click from the autocomplete drop down. The "real" value
 * input field is linked using the form:
 *      <input name="completer" data-real="#ID" />
 * You can create the real data container yourself or the script will create one for you
 * using the name "real_{completer name}". E.g.
 *      <input name="completer" />
 *      <input type="hidden" name="real_completer" />
 * 
 */
(function( $, undefined ) {
    $.ahead = function( name, base, prototype ) {
        var namespace = name.split( "." )[ 0 ],
            fullName;
        name = name.split( "." )[ 1 ];
        fullName = namespace + "-" + name;

        if ( !prototype ) {
            prototype = base;
            base = $.Ahead;
        }

        // create selector for plugin
        $.expr[ ":" ][ fullName ] = function( elem ) {
            return !!$.data( elem, name );
        };

        $[ namespace ] = $[ namespace ] || {};
        $[ namespace ][ name ] = function( options, element ) {
            // allow instantiation without initializing for simple inheritance
            if ( arguments.length ) {
                this._create( options, element );
            }
        };

        var basePrototype = new base();
        
        basePrototype.options = $.extend( true, {}, basePrototype.options );
        $[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
            namespace: namespace,
            name: name,
            baseClass: fullName
        }, prototype );

        $.ahead.bridge( name, $[ namespace ][ name ] );
    };

    $.ahead.bridge = function( name, object ) {
        $.fn[ name ] = function( options ) {
            var isMethodCall = typeof options === "string",
                args = Array.prototype.slice.call( arguments, 1 ),
                returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ?
                $.extend.apply( null, [ true, options ].concat(args) ) :
                options;

            // prevent calls to internal methods
            if ( isMethodCall && options.charAt( 0 ) === "_" ) {
                return returnValue;
            }

            if ( isMethodCall ) {
                this.each(function() {
                    var instance = $.data( this, name ),
                        methodValue = instance && $.isFunction( instance[options] ) ?
                            instance[ options ].apply( instance, args ) :
                            instance;
                    if ( methodValue !== instance && methodValue !== undefined) {
                        //returnValue = methodValue;
                        return false;
                    }
                    return methodValue;
                });
            } else {
                this.each(function() {
                    var instance = $.data( this, name );
                    if ( instance ) {
                        instance.option( options || {} )._init();
                    } else {
                        $.data( this, name, new object( options, this ) );
                    }
                });
            }

            return returnValue;
        };
    };

    $.Ahead = function( options, element ) {
        // allow instantiation without initializing for simple inheritance
        if ( arguments.length ) {
            this._create( options, element );
        }
    };

    $.Ahead.prototype = {
        name: "typeahead",
        eventPrevix: "",
        options: {
            sourceType : 'js',
            source : '',
            indentifier: 'name',
            state: '',
            city: '',
            minLength : 3,
            valueField : 'id',
            fakeElement : true,
            data : true
        },
        _create: function( options, element ) {
            // $.ahead.bridge stores the plugin instance, but we do it anyway
            // so that it's stored even before the _create function runs
            $.data( element, this.name, this );
            this.element = $( element );
            this.options = $.extend( true, {},
                this.options,
                this._getCreateOptions(),
                options );

            var self = this;
            this.element.bind( "remove." + this.name, function() {
                self.destroy();
            });

            this._init();
        },
        _getCreateOptions: function() {
            return $.metadata && $.metadata.get( this.element[0] )[ this.name ];
        },
        _init: function() {

            if(this.options.fakeElement) {
                //need a hidden element to actually hold the real value
                if(this.element.attr('data-real') && $(this.element.attr('data-real')).length > 0) {
                    this.realElement = $(this.element.attr('data-real'));
                }
                else {
                    //create the hidden element
                    this.realElement = $('<input />',{
                        type : 'hidden',
                        name : 'real_'+this.element.attr('name')
                    });
                    this.element.after(
                        this.realElement    
                    );
                }
            }
            this.results = this.getResults(); 
            this.setup();
        },

        destroy: function() {
            this.element
                .unbind( "." + this.name )
                .removeData( this.name );
            this.ahead()
                .unbind( "." + this.name )
                .removeAttr( "aria-disabled" )
                .removeClass(
                    this.baseClass + "-disabled " +
                    "ui-state-disabled" );
        },

        ahead: function() {
            return this.element;
        },

        option: function( key, value ) {
            var options = key;

            if ( arguments.length === 0 ) {
                // don't return a reference to the internal hash
                return $.extend( {}, this.options );
            }

            if  (typeof key === "string" ) {
                if ( value === undefined ) {
                    return this.options[ key ];
                }
                options = {};
                options[ key ] = value;
            }

            this._setOptions( options );

            return this;
        },
        _setOptions: function( options ) {
            var self = this;
            $.each( options, function( key, value ) {
                self._setOption( key, value );
            });

            return this;
        },
        _setOption: function( key, value ) {
            this.options[ key ] = value;

            if ( key === "disabled" ) {
                this.ahead()
                    [ value ? "addClass" : "removeClass"](
                        this.baseClass + "-disabled" + " " +
                        "ui-state-disabled" )
                .attr( "aria-disabled", value );
            }

            return this;
        },
        setup : function(){
        },
        getResults : function(request) {
            var self = this;
            //handle ajax request
            switch(this.options.sourceType) {
                case 'js':
                    return this.formatData(this.options.source);
                case 'ajax':
                    break;
                default:
                    url = this.options.source;
                    var getData = { startofname: request };
                    if(self.options.data === false) {
                        url = url + "/"+request;
                        getData = false;
                    }
                    $.ajax({
                        url : url,
                        type : 'get',
                        data : getData,
                        dateType : 'json',
                        success : function(data) {
                            self.results = self.formatData(data);
                        }
                    });
                    return self.results;
            }
            return this.formatData(this.options.source);
        },
        formatData : function(results) {
            var self = this;
            //format the data for the specified library
            var data = [];
            self.map = [];
            if(results.length === undefined) {
                var resultitem1 = self.extractFields(results);
                data.push(resultitem1);
            }
            else {
                $.each(results, function(idx, row) {
                    var resultitem2 = self.extractFields(row);
                    data.push(resultitem2);
                });
            }
            return data;
        },
        extractFields: function(ob) {
            var self = this;
            //var item = new Object();
            var item = {};
            $.each(ob,function(j,col){
                var valueField = new RegExp(self.options.valueField,'gi');
                if (j.search(valueField) > -1) {
                    item.value = col;
                }
                var ident = new RegExp(self.options.indentifier,'gi');
                if (j.search(ident) > -1) {
                    item.label = col;
                }
                if (j.search(/city/gi) > -1) {
                    item.city = col;
                }
                if (j.search(/state/gi) > -1) {
                    item.state = col;
                }
            });
            item.label = item.label + ", " + item.city + ", " + item.state;
            self.map[item.label] = item;
            return item.label;
        },
        onSelect : function(event,ui) {

            ui = (!ui)? event : ui;

            //called when a user selects and individual item
            if(this.options.fakeElement) {
                this.realElement.val(ui.item.value);
                this.element.val(ui.item.label);	
            }
            else {
                this.element.val(ui.item.value);
            }
            return false;
        }
    };
}( jQuery ));
/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts
 * UTI Legal disclaimers
 */
(function ($, undefined) {

    $.widget('uti.legal', {

        options: {

            //defaultText:
            //                'I understand that clicking on the "SUBMIT" button, I am giving Universal Technical Institute, Inc. and any of its subsidiaries' +
            //                '(together, "UTI") my express written consent to contact me by telephone or email about UTI\'s services or products. I understand' +
            //                'and agree that calls made to me by UTI may be recorded for quality and employee evaluation purposes.',
            defaultText: '',
            source: activeEnvironment.active + '/api/ewc?ewcType=Form',
            workingIndicator: '#workingIndicator', // TODO ANIMATED GIF LOCATION GREY OUT DISCLAIMER BACKGROUND. 
        },

        _create: function () {

            // Set default text.
            var elm = $('.legalBox');
        },

        _init: function () {

            // Fetch current disclaimer text if available.
            // TODO make the workingIndicator part of the widget construction.
            var self = this;
            $.ajax({
                url: this.options.source,
                type: 'get',
                dateType: 'json',
                beforeSend: function () {
                    // TODO Set opacity....

                    // Show busy...
                    if ($(self.options.workingIndicator).length > 0) { $(self.options.workingIndicator).show() };
                },
                error: function () {
                    // TODO Set opacity....

                    // Clear busy...
                    if ($(self.options.workingIndicator).length > 0) { $(self.options.workingIndicator).hide() };
                },
                success: function (data) {
                    // TODO Set opacity....

                    // Clear busy...
                    if ($(self.options.workingIndicator).length > 0) { $(self.options.workingIndicator).hide() };
                    var ewc = data;
                    self.element.text(ewc.Detail);
                }
            });
        }
    });

}(jQuery));

/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts
 * UTI Countries list.
 */
(function ($, undefined) {
    var d = new Date();
    $.widget('uti.countries', {



        options: {
            source: activeEnvironment.active + '/api/countries/',
            nonSelectionOption: false,
            nonSelectionText: 'Select a country',
            elmSelector: 'countries',
            fetchErrorText: "Failed to get the list"
        },

        _create: function () {

            var self = this;

            // create optional markup.
            self.element.append(
                function () {
                    if (self.nonSelectionOption)
                        return $('<option>').text(self.options.nonSelectionText);
                }
            );
        },

        _init: function () {

            // Fetch and build countries
            var self = this;

            $.getJSON(self.options.source)
               .done(function (data) {
                   $(self.element).empty();
                   $.each(data, function (i, item) {
                       $('<option>').val(item.Code).text(item.CountryName).appendTo(self.element);
                   });

                   if (self.element.is(":data('mobile-selectmenu')"))
                       $(self.element).selectmenu('refresh');

               })
               .fail(function () {
                   $('<option>').val("-1").text(self.options.fetchErrorText).appendTo(self.element);
                   if (self.element.is(":data('mobile-selectmenu')"))
                       $(self.element).selectmenu('refresh');
               });


        }
    });

}(jQuery));

/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts
 * UTI Countries list.
 */
(function ($, undefined) {

    $.widget('uti.highschoolstates', {

        options: {
            source: activeEnvironment.active + '/api/highschoolstate',
            nonSelectionOption: true,
            nonSelectionText: 'Select a State',
            fetchErrorText: "Failed to get the list"
        },

        _create: function () {

            var self = this;

            // create optional markup.
            self.element.append(
                function () {
                    if (self.options.nonSelectionOption)
                        return $('<option>').text(self.options.nonSelectionText)[0];
                }
            );
        },
        clearlist: function () {
            var self = this;
            if (self.element.children('option').length > 1) {
                $(self.element).empty(); //clear HS cities

                if (self.options.nonSelectionOption)
                    $(self.element).append('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
            }
        },
        _init: function () {

            // Fetch and build countries
            var self = this;
			
			$.ajax({ 
				type: 'GET', 
				url: self.options.source, 
				dataType: 'json',
				
				success: function (data) {
                    $(self.element).empty();
                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $.each(data, function (i, item) {
                       $('<option>').val(item.Code).text(item.State).appendTo(self.element);
                    });
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                }, 
				error: function(){
					
				 $('<option>').val("-1").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
					
					}
                
});



           /* $.getJSON(self.options.source)
                .done(function (data) {
                    $(self.element).empty();
                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $.each($.parseJSON(data), function (i, item) {
                       $('<option>').val(item.Code).text(item.State).appendTo(self.element);
                    });
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                })
                .fail(function () {
                    $('<option>').val("-1").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                });*/
        }
    });

}(jQuery));

/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts
 * UTI Countries list.
 */
(function ($, undefined) {

    $.widget('uti.highschoolcity', {

        options: {
            source: activeEnvironment.active + '/api/highschoolcity?state=',
            nonSelectionOption: true,
            nonSelectionText: 'Select a City',
            fetchErrorText: "Failed to get the list"
        },

        _create: function () {

            var self = this;

            // create optional markup.
            
            $(self.element).append(
                function () {
                    if (self.options.nonSelectionOption)
                        return $('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
                }
            );
        },

        _init: function () {

        },
        clearlist : function()
        {
            var self = this;
            if (self.element.children('option').length > 1) {
                $(self.element).empty(); //clear HS cities

                if(self.options.nonSelectionOption)
                    $(self.element).append('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
            }
        },
        lookup : function(state)
        {
            // Fetch and build hs cities
            var self = this;
            var lookup = self.options.source + state;
            $.getJSON(lookup)
                .done(function (data) {
                    $(self.element).empty();
                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $.each(data, function (i, item) {
                        $('<option>').val(item).text(item).appendTo(self.element);
                    });
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                })
                .fail(function () {
                    $('<option>').val("").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                });
        }
    });

}(jQuery));

/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts
 * UTI Countries list.
 */
(function ($, undefined) {

    $.widget('uti.highschoolnames', {


        options: {
            source: activeEnvironment.active + '/api/highschools?state=',
            nonSelectionOption: true,
            nonSelectionText: 'Select Your High School',
            fetchErrorText: "Failed to get the list"
        },

        _create: function () {

            var self = this;

            // create optional markup.

            $(self.element).append(
                function () {
                    if (self.options.nonSelectionOption)
                        return $('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
                }
            );
        },

        _init: function () {

        },
        clearlist: function () {
            var self = this;
            if (self.element.children('option').length > 1) {
                $(self.element).empty(); //clear HS cities

                if (self.options.nonSelectionOption)
                    $(self.element).append('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
            }
        },
        lookup: function (state, city) {
            // Fetch and build hs names
            var self = this;
            var lookup = self.options.source + state + "&city=" + city;
           // console.log(lookup);
            $.getJSON(lookup)
                .done(function (data) {
                    $(self.element).empty();

                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $("#txtHighSchool,#high-school-name").append("<option value=\"0\" >- HIGH SCHOOL NOT LISTED -</option>");
                    $.each(data, function (i, item) {
                        $('<option>').val(item.HighSchoolId).text(item.Name).appendTo(self.element);
                    });
                   
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                })
                .fail(function () { 
                    $('<option>').val("").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                });
        }
    });

}(jQuery));

/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts/rwillis
 * UTI Bases list.
 */
(function ($, undefined) {

    $.widget('uti.militarybases', {


        options: {
            source: activeEnvironment.active + '/api/militarybases?state=',
            nonSelectionOption: true,
            nonSelectionText: 'Select Your Base',
            fetchErrorText: "Failed to get the list"
        },

        _create: function () {

            var self = this;
            
            // create optional markup.

            $(self.element).append(
                function () {
                    if (self.options.nonSelectionOption)
                        return $('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
                }
            );
        },

        _init: function () {

        },
        clearlist: function () {
            var self = this;
            if (self.element.children('option').length > 1) {
                $(self.element).empty(); //clear HS cities

                if (self.options.nonSelectionOption)
                    $(self.element).append('<option selected="selected" value="">' + self.options.nonSelectionText + '</option>');
            }
        },
        lookup: function (state, city) {
            // Fetch and build mb names
            var self = this;
            var lookup = self.options.source + state + '&city=' + city;
            //console.log(lookup);
            $.getJSON(lookup)
                .done(function (data) {
                    $(self.element).empty();

                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $("#txtMilitaryBase,#military-installation").append("<option value=\"0\" >-BASE NOT LISTED -</option>");
                    $.each(data, function (i, item) {
                        $('<option>').val(item.MilitaryBaseId).text(item.Name).appendTo(self.element);
                    });
                   
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                })
                .fail(function () { 
                    $('<option>').val("").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                });
        },
        lookupByState: function (state) {
            // Fetch and build mb names
            var self = this;
            var lookup = self.options.source + state;
            //console.log(lookup);
            $.getJSON(lookup)
                .done(function (data) {
                    $(self.element).empty();

                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $("#txtMilitaryBase,#military-installation").append("<option value=\"0\" >-BASE NOT LISTED -</option>");
                    $.each(data, function (i, item) {
                        $('<option>').val(item.MilitaryBaseId).text(item.Name).appendTo(self.element);
                    });

                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                })
                .fail(function () {
                    $('<option>').val("").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                });
        }

    });

}(jQuery));


(function ($, undefined) {

    $.widget('uti.militarystates', {

        options: {
            source: activeEnvironment.active + '/api/militarybases',
            nonSelectionOption: true,
            nonSelectionText: 'Select a State',
            fetchErrorText: "Failed to get the list"
        },

        _create: function () {

            var self = this;

            // create optional markup.
            self.element.append(
                function () {
                    if (self.options.nonSelectionOption)
                        return $('<option>').text(self.options.nonSelectionText)[0];
                }
            );
        },

        _init: function () {

            // Fetch and build countries
            var self = this;
            $.getJSON(self.options.source)
                .done(function (data) {
                    $(self.element).empty();
                    if (self.options.nonSelectionOption)
                        $('<option>').val("").text(self.options.nonSelectionText).appendTo(self.element);
                    $.each(data, function (i, item) {
                        $('<option>').val(item.City).text(item.State).appendTo(self.element);
                    });
                    if (self.element.is(":data('mobile-selectmenu')"))                    
                        $(self.element).selectmenu('refresh');
                })
                .fail(function () {
                    $('<option>').val("-1").text(self.options.fetchErrorText).appendTo(self.element);
                    if (self.element.is(":data('mobile-selectmenu')"))
                        $(self.element).selectmenu('refresh');
                });
        }
    });

}(jQuery));

/// <reference path="../jquery-1.10.1-vsdoc.js" />
/**
 * @author : Ryan Divis <rdivis@solutionstream.com>, 2013
 * ZipCode - UTI Completer (typahead or autocompleter)
 *
 * Instantiates and extends the UTI Completer base. Talks to the zipcodes api.
 * Every option/function can be overridden/extended. There must be an adapter 
 * (jQuery/Bootstrap or other) in order to work.
 *
 * Simplest use on the page is $('selector').zipCompleter();
 *
 * @option String sourceType : can be js (meaning that you have setup a javascript array/object) or ajax
 * @option String/Variable source : either the url for ajax connection or the name of the js variable for source
 * @option String indentifier : the unique indentifier returned from the api (the zipcode api returns zip)
 * @option Integer minLength : the minimum length for lookup
 * @option String valueField : this should be the field key that you want passed back as the actual value in the form
 * @option Bool fakeElement : whether or not to create a "real" element for value submission
 * @option Bool data : whether or not data needs to be submitted to the api
 * @option Bool updateStateCity : if true, state and city fields (#State,#City) will be updated with values from the selected item
 * 
 */
// (function( $, undefined ) {
//  $.ahead( "uti.zipCompleter",{
//      options : {
//          sourceType : 'ajax',
//          source : '/api/zipcodes',
//          minLength : 5,
//          data : false,
//          valueField : 'zip',
//          fakeElement : false,
//          indentifier : 'zip',
//          updateStateCity : true
//      }
//  });
// }( jQuery ));
(function ($) {

    $.zipCompleter = function (element, options) {

        var defaults = {
            source: activeEnvironment.active + '/api/zipcodes',
            workingIndicator: '.workingIndicator',
            fields: {
                'Zip': 'zip',
                'State': 'state',
                'City': 'city'

            },
            afterUpdate: function () {

            }
        };

        var plugin = this;

        var $element = $(element);

        var $form = $(element).parents('form');

        plugin.ajax = $.ajax();

        this.init = function () {
            this.settings = $.extend(defaults, options);
            this.settings.workingIndicator += ":not(disabled)";
            $element.change(function () {
                if ($(this).val().length === 5) {
                    plugin.getResults($(this).val());
                }
            });
        };

        this.getResults = function (value) {
            $.ajax({
                url: plugin.settings.source + "/" + value,
                type: 'get',
                dateType: 'json',
                beforeSend: function () {
                    if ($(defaults.workingIndicator).length > 0) { $(defaults.workingIndicator).show() };
                },
                error: function () {
                    if ($(defaults.workingIndicator).length > 0) { $(defaults.workingIndicator).hide() };
                },
                success: function (data) {
                    if ($(defaults.workingIndicator).length > 0) { $(defaults.workingIndicator).hide() };
               
                    plugin.updateFields({ "Zip": data[0].Zip, "City": data[0].City, "State": data[0].State });
                   
                }
            });
            // plugin.updateFields({"Zip":"84096","City":"Herriman","State":"UT"});
        };

        this.updateFields = function (data) {

            $.each(plugin.settings.fields, function (key, value) {
                $form.find('input[name="' + value + '"],select[name="' + value + '"]').val(data[key]);
            });

            this.settings.afterUpdate();
        };

        this.init();
    };

    $.fn.zipCompleter = function (options) {

        return this.each(function () {
            if (undefined == $(this).data('zipCompleter')) {
                var plugin = new $.zipCompleter(this, options);
                $(this).data('zipCompleter', plugin);
            }
            else {
                $(this).data('zipCompleter', $(this).data('zipCompleter'));
            }
        });

    };

})(jQuery);