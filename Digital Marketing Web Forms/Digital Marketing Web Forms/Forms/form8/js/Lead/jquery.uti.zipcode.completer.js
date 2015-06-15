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