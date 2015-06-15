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
