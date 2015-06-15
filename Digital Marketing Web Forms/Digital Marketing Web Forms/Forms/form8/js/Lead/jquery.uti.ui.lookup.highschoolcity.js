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
