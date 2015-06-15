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
