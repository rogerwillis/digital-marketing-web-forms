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
