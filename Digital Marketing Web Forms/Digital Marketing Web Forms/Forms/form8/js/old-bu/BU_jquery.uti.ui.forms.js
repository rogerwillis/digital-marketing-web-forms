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
//  _appendQSParms  Appends the query string parameters to the AdditionalInfos section of the lead.
(function ($, undefined) {
  
    $.widget('uti.uiForm', {

        //#region options
        options: {
            url: activeEnvironment.lead + '/api/leads',
            thankYou: true,//Enable thank you page
            thankYouPage:thankYouPage.form5,
            selector: 'form',
            posted: null, // Callback for ajax done method.
            //#region leadTemplate
            leadTemplate : {

                FormID : null,
                InterestCode : null,
                IPAddress : null,
                LeadSourceCode : null,
                Education : null,
                FirstName : null,
                LastName : null,
                DateOfBirth: null,
                Comments:null,
                EmailAddresses : [
                    {
                        Type: 'P',
                        Address: null
                    }
                ],
                Addresses : [
                    {
                        AddressType: "L",
                        AddressLine1: null,
                        City: null,
                        State: null,
                        PostalCode: null,
                        Country: null,
                    }
                    //,{
                    //    AddressType: "A",
                    //    AddressLine1: null,
                    //    City: null,
                    //    State: null,
                    //    PostalCode: null,
                    //    Country: null,
                    //}
                ],
                PhoneNumbers : [
                    {
                        Type: "L",
                        Number: null,
                        okToText: null
                    },
                    {
                        Type: "C",
                        Number: null,
                        okToText: null
                    }
                ],
                GradMonth : null,
                GradYear : null,
                HighSchoolID : null,
                HighSchoolState : null,
                HighSchoolCity : null,
                HighSchoolNotListed : null,
                IsMilitary : null,
                MilitaryID : null,
                MilitarySeparation : null,
                InstallationNotListed : null,
                AdditionalInfo : [
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
            this._appendQSParms(this.element.data('lead'));
            
            
        },

       

        destroy: function () {
            // Restore element to pre-uiForm create state...
            this.element.removeClass('uti-uiForm');
            this._destroy();

        },

        _appendQSParms: function (lead) {

            if ($.url().attr('query').length > 0) {

                var _infos = [], _keyVals;
                var _nvPairs;
                _nvPairs = $.url().attr('query').split('&');

                if (_nvPairs[0].length === 0)
                    return $.param(_infos);//rw added return value

                var appendAt = lead.AdditionalInfo.length;

                for (var nvIdx = 0; nvIdx < _nvPairs.length; nvIdx++) {

                    _keyVals = _nvPairs[nvIdx].split('=');
                    lead.AdditionalInfo[appendAt] = { Key: _keyVals[0], Value: _keyVals[1] };
                    appendAt++;
                }
                
                return $.param(_infos);
                
            }
        },

        // Very basic diagnosic method to check that all minimum requirements are populated on the object.
        checkLead: function (consoleOutput) {

            var errors = [];
            if (null == this.element.data('lead').FormID) errors.push('FormID is required.');
            if (null == this.element.data('lead').FirstName) errors.push('FirstName is required.');
            if (null == this.element.data('lead').LastName) errors.push('LastName is required.');
            if (null == this.element.data('lead').InterestCode) errors.push('InterestCode is required.');
            
            if((null == this.element.data('lead').EmailAddresses[0].Address) && (null == this.element.data('lead').PhoneNumbers[0].Number))
                errors.push('An email address or phone number is required');

            if (null == this.element.data('lead').Addresses[0].PostalCode) errors.push('A Postal code is required.');

            if(consoleOutput) {
                $.each(errors, function (idx, val) {
                    if(console)
                        console.log(val);
                });
            }

            return errors;
        },

        // TODO EXPOSE .done as a posted callback in options.



      

        post: function () {
            

            //function crossDomainAjax(url, successCallback) {
           
            //    // IE8 & 9 only Cross domain JSON GET request
            //    if ('XDomainRequest' in window && window.XDomainRequest !== null) {

                   
            //        var xdr;
            //        function err() {
            //            alert('Error');
            //        }
            //        function timeo() {
            //            alert('Time off');
            //        }
            //        function loadd() {
            //            alert('Response: ' + xdr.responseText);
            //        }
            //        function stopdata() {
            //            xdr.abort();
            //        }
            //        xdr = new window.XDomainRequest();
            //        if (xdr) {
            //            xdr.onerror = err;
            //            xdr.ontimeout = timeo;
            //            xdr.onload = loadd;
            //            xdr.timeout = 10000;
            //            xdr.open('POST', url);
            //            xdr.send('foo=12345');
            //            //xdr.send('foo=<?php echo $foo; ?>'); to send php variable
            //        } else {
            //            alert('XDR undefined');
            //        }

            //    }


            //        // Do normal jQuery AJAX for everything else          
            //    else {
            //        $.ajax({
            //            url: url,
            //            cache: false,
            //            dataType: 'json',
            //            type: 'POST',
            //            async: false, // must be set to false
            //            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                 
            //        }).done(function (response, textStatus, jqXHR) {
            //            self.element.data('lead', response);
            //            self._trigger("posted", self.element.data('lead'));
              
                   
            //            window.location.replace(self.options.thankYouPage);
                    

            //        }).fail(function (jqXHR, textStatus, errorThrown) { 
            //            // log the error to the console
            //            console.error("Error POSTing gateway object. Status:" + textStatus + " Error: " + errorThrown);
            //        })
            //            .always(function (jqXHR, textStatus, errorThrown) {

            //            });

            //        return self;;
            //    }


            //};



            //crossDomainAjax(this.options.url, function (data) {
            //    // success logic
            //});


            var $ajaxResult;
            var self = this;
            $.ajax({
                type: 'POST',
                url: this.options.url,
                data: JSON.stringify(this.element.data('lead')),
                dataType: "json",
                cache: false,
                contentType: "application/json; charset=UTF-8",
              
                beforeSend: function () {
            
                }
            })
            // callback handler on success - populate lead object with returned data.
            .done(function (response, textStatus, jqXHR) {
                self.element.data('lead', response);
                self._trigger("posted", self.element.data('lead'));
              
                   
                        window.location.replace(self.options.thankYouPage);
                    

                })
            // callback handler that will be called on failure
            .fail(function (jqXHR, textStatus, errorThrown) { //.fail(function () {
                // log the error to the console
                console.error("Error POSTing gateway object. Status:" + textStatus + " Error: " + errorThrown);
            })
            .always(function (jqXHR, textStatus, errorThrown) {

            });

            return self; // support chaining...
        },

        _setOption: function (key, value) {

    }

    });
})(jQuery);
