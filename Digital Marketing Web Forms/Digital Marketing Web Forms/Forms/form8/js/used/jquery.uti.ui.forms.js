/// <reference path="jquery-1.9.1.js" />
/// <reference path="purl/2.3.1/purl.js" />
/// <reference path="jquery-ui-1.10.4.custom.min.js" />
//  Uti form plug-in that creates an underlying lead based on the option: leadTemplate or the overidden version of
//  and submits it to the gateway with the proper headers.  Uses the jquery-ui widget framework to manage object lifetime,
//  instantiation, and events.
//
//  Dependencies:
//  -----------------------------------------------------------------
//  jquery-ui, jquery, purl.js
//  
//  Options:
//  url:            The url to submit leads to
//  selector:       The element selector to attach the leads object to.
//  leadTemplate:   The base lead to load so that it can be populated.  Can be replaced/merged by passing in a leadTemplate: option 
//                  the widget constructor.  Merges fields if leadTemplate object provided, replaces if all fields provided are an
//                  match the template exactly.          
//
//  Usage:          See quUtiLeadApiTests.html
//
//  Methods of interest:
//  -----------------------------------------------------------------
//  post:           Submits the lead object to the gateway.
//  _appendAdditionalData  Appends the query string parameters to the AdditionalInfos section of the lead.
(function ($, undefined) {

    $.widget('uti.uiForm', {

        //#region options
        options: {
            url: activeEnvironment.lead + '/api/leads',
            dataType: "json",
            contentType: "application/json",
            selector: 'form',
            posted: null, // Callback for ajax done promise.
            failed: null, // Callback for ajax fail promise.
            //#region leadTemplate
            leadTemplate: {

                FormID: null,
                InterestCode: null,
                IPAddress: null,
                LeadSourceCode: null,
                Education: null,
                FirstName: null,
                LastName: null,
                DateOfBirth: null,
                Comments: null,
                EmailAddresses: [
                    {
                        Type: 'P',
                        Address: null
                    }
                ],
                Addresses: [
                    {
                        AddressType: "L",
                        AddressLine1: null,
                        City: null,
                        State: null,
                        PostalCode: null,
                        Country: null,
                    }
                    //,{                        Removed from template if address is present it must contain a ZipCode.
                    //    AddressType: "A",
                    //    AddressLine1: null,
                    //    City: null,
                    //    State: null,
                    //    PostalCode: null,
                    //    Country: null,
                    //}
                ],
                PhoneNumbers: [
                    {
                        Type: "C",
                        Number: null,
                        IsPrimary: true
                    },
                    {
                        Type: "L",
                        Number: null,
                        IsPrimary: false
                    }
                ],
                GradMonth: null,
                GradYear: null,
                HighSchoolID: null,
                HighSchoolState: null,
                HighSchoolCity: null,
                HighSchoolNotListed: null,
                IsMilitary: null,
                MilitaryID: null,
                MilitarySeparation: null,
                InstallationNotListed: null,
                AdditionalInfo: [
                    {
                        Key: 'IsComplete', Value: false
                    },
                    {
                        Key: 'LeadGuid', Value: null
                    }
                ],
            },
            //#endregion leadTemplate
        },
        //#endregion options

        _create: function () {
            this.element.addClass("uti-uiForm");
        },

        _init: function () {

            // Load/copy lead template to element instance data...
            this.element.data('lead', this.options.leadTemplate);
            //this._appendQSParms(this.element.data('lead'));           ***OLD
            this._appendAdditionalData(this.element.data('lead'));      ///NEW 
            this.element.data('isLtIETen', this._isLtIETen());
            if (this.element.data('isLtIETen')) {

                this.options.dataType = "text";
                this.options.contentType = "text/plain";
                this.options.url =
                    $.url(this.options.url).attr('protocol') + '://'
                    + $.url(this.options.url).attr('host')
                    + (($.url(this.options.url).attr('port').length > 0) ? ':' + $.url(this.options.url).attr('port') : '')
                    + '/corsproxy/';
            }
        },


        // Use the _setOption method to respond to changes to options
        _setOption: function (key, value) {
            switch (key) {
                case "clear":
                    // handle changes to clear option
                    break;
            }
            // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
            // In jQuery UI 1.9 and above, you use the _super method instead
            // this._super("_setOption", key, value);
        },


        destroy: function () {
            // Restore element to pre-uiForm create state...
            this.element.removeClass('uti-uiForm');
            this._destroy();

        },

        /// OLD function repalced by _appendAdditionalData
        //_appendQSParms: function (lead) {

        //    if ($.url().attr('query').length > 0) {

        //        var _infos = [], _keyVals;
        //        var _nvPairs;
        //        _nvPairs = $.url().attr('query').split('&');

        //        if (_nvPairs[0].length === 0)
        //            return $.param(_infos);//rw added return value

        //        var appendAt = lead.AdditionalInfo.length;

        //        for (var nvIdx = 0; nvIdx < _nvPairs.length; nvIdx++) {

        //            _keyVals = _nvPairs[nvIdx].split('=');
        //            lead.AdditionalInfo[appendAt] = { Key: _keyVals[0], Value: _keyVals[1] };
        //            appendAt++;
        //        }

        //        return $.param(_infos);

        //    }
        //},

        _appendAdditionalData: function (lead) {
            var additionalData = '';
            var _infos = [];

            /// Add any query string info
            if ($.url().attr('query').length > 0) {
                additionalData = $.url().attr('query');
            }

            /// Add any qsCookie info
            var qsCookie = cookieManager.getQSInfoCookie();
            if (qsCookie != null && qsCookie.length > 0) {
                additionalData += qsCookie;
            }

            /// Add referral info
            var refCookie = cookieManager.getReferralCookie();
            if (refCookie != null && refCookie.length > 0) {
                additionalData += '&referral=' + refCookie;
            }

            /// Add Optimizely info 
            /// Currently, only adds Active Experiments and their Variations
            try {
                    var accountId, projectId, activeExperimentIds, /*sectionId,*/ variationIds;

                    accountId = optimizely.getAccountId();

                    if (accountId) {
                        projectId = optimizely.getProjectId();                        
                        activeExperimentIds = optimizely.data.state.activeExperiments;                        
                        
                        if (optimizely.data.state.activeExperiments.length > 0) {

                            if (accountId) { additionalData += '&Opt_AccountId=' + accountId; }
                            if (projectId) { additionalData += '&Opt_ProjectId=' + projectId; }

                            for (j = 0; j < activeExperimentIds.length; j++) {                                
                                var expID = activeExperimentIds[j];
                                additionalData += '&Opt_ExperimentId_' + (j + 1) + '=' + expID;

                                /// Get Variation of Experiment
                                var varID = optimizely.data.state.variationIdsMap[expID][0];
                                additionalData += '&Opt_VariationId=' + varID;
                            }                                                        
                        }
                        else {
                            /// No Active Experiments 
                        }
                    }
            }
            catch (e) { }

            /// If no addtional data
            if (additionalData == null || additionalData.length === 0) {
                return $.param(_infos);         //rw added return value
            }

            /// If there is addtional data
            var appendAt = lead.AdditionalInfo.length;
            var _nvPairs = additionalData.replace('?', '').trim().split('&');
            var _keyVals;
            for (var nvIdx = 0; nvIdx < _nvPairs.length; nvIdx++) {
                _keyVals = _nvPairs[nvIdx].split('=');

                if (_keyVals[0].length != 0) {
                    lead.AdditionalInfo[appendAt] = { Key: _keyVals[0], Value: _keyVals[1] };
                }

                appendAt++;
            }
            return $.param(_infos);             //rw added return value
        },


        // Very basic diagnosic method to check that all minimum requirements are populated on the object.
        checkLead: function (consoleOutput) {

            var errors = [];
            if (null == this.element.data('lead').FormID) errors.push('FormID is required.');
            if (null == this.element.data('lead').FirstName) errors.push('FirstName is required.');
            if (null == this.element.data('lead').LastName) errors.push('LastName is required.');
            if (null == this.element.data('lead').InterestCode) errors.push('InterestCode is required.');

            if ((null == this.element.data('lead').EmailAddresses[0].Address) && (null == this.element.data('lead').PhoneNumbers[0].Number))
                errors.push('An email address or phone number is required');

            if (null == this.element.data('lead').Addresses[0].PostalCode) errors.push('A Postal code is required.');

            if (consoleOutput) {
                $.each(errors, function (idx, val) {
                    if (console)
                        console.log(val);
                });
            }

            return errors;
        },

        _isLtIETen: function () {

            if (navigator.appName == "Microsoft Internet Explorer") {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                if (re.exec(ua) != null) {
                    return parseInt(RegExp.$1) < 10;
                }
            } else {
                return false;
            }
        },


        // TODO EXPOSE .done as a posted callback in options.
        post: function () {

            var $ajaxResult;
            var self = this;
            $.ajax({
                type: 'POST',
                url: this.options.url,
                data: JSON.stringify(this.element.data('lead')),
                dataType: this.options.dataType,
                contentType: this.options.contentType
            })
            // callback handler on success - populate lead object with returned data.
            .done(function (response, textStatus, jqXHR) {

                if (self.element.data('isLtIETen')) {
                    var lead = $.parseJSON(response);
                    self.element.data('lead', lead);
                }
                else {
                    self.element.data('lead', response);
                }
                self._trigger("posted", self.element.data('lead'));

            })
            // callback handler that will be called on failure
            .fail(function (jqXHR, textStatus, errorThrown) { //.fail(function () {
                // log the error to the console
                console.error("Error POSTing gateway object. Status:" + textStatus + " Error: " + errorThrown);
                self._trigger("failed", jqXHR);
            })
            .always(function (jqXHR, textStatus, errorThrown) {

            });

            return self; // support chaining...
        }




    });
})(jQuery);