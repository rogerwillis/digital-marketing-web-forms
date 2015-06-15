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
