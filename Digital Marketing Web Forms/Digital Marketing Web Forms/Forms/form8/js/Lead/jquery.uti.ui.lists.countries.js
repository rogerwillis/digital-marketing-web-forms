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
