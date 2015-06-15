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