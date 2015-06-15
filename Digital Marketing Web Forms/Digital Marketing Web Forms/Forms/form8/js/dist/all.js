/// Functions

var copyrightDate = function () {
    //set copyright year dynamically
    var d = new Date();
    var year = d.getFullYear();
    $(".year").text(year);

};

var showUsFields = function () {

    $('label[for="zipCodePre"]').text("Zip:");
    $('label[for="ddlStatePre"],label[for="ddlState"]').text("State:");
    $('label[for="zipCode"]').text("Zip:");
    $('.txtRegion').hide();
    $('.txtPostalCode').hide();
    $('.txtZipCode').show();
    $('#ddlStatePre, #ddlState').show();
};

var showNonUsFields = function () {

    $('#zipCodePre, #zipCode').val('');
    $('label[for="zipCodePre"]').text("Postal Code:");
    $('label[for="zipCode"]').text("Postal Code:");
    $('label[for="ddlStatePre"],label[for="ddlState"]').text("Region:");
    $('.txtRegion').show();
    $('.txtPostalCode').show();
    $('.txtZipCode').hide();
    $('#ddlStatePre, #ddlState').hide();

};

var digitFormat = function() {
    //Only allow digits in these fields
    $("#phone1, #phone2, #phone3, #phoneAlt1, #phoneAlt2, #phoneAlt3,#zipCodePre, #zipCode").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
};

var setMaxFieldLengths = function() {
    $('#firstName, #lastName, #email, #txtAddress, #txtCity, #txtHighSchoolNotListed, #txtInstallationNotListed').attr('maxlength', '100');
    $('#postalCodePre, #postalCode').attr('maxlength', '10');
    $('#zipCodePre, #zipCode').attr('maxlength', '5');
};

var autoTabbing = function() {
    //auto tabbing
    //$('#phone').autoTab();
    //$('#phoneAlt').autoTab();
};

var uiValidate = function () {

    //VALIDATION INIT ---------------------------------------w---------

    var $validator = $("#utiForm").validate({
        'onkeyup': false,
        submitHandler: function (form) {
            // do other things for a valid form
            //console.log("Submit Handler");
        },

        errorPlacement: function (error, element) {
            if (element.is(':radio') || element.is(':checkbox')) {
                error.insertBefore(element.next());

            } else {
                error.insertAfter(element);
            }


            if (element.attr("id") == "phone1" || element.attr("id") == "phone2" || element.attr("id") == "phone3") {

                error.insertAfter("#phone");

            } else {
                error.insertAfter(element);

            }

            if (element.attr("id") == "phoneAlt1" || element.attr("id") == "phoneAlt2" || element.attr("id") == "phoneAlt3") {
                error.insertAfter("#phoneAlt");
            } else {
                error.insertAfter(element);
            }
        },

        groups: {
            phoneNumber: "phone1 phone2 phone3",
            altPhoneNumber: "phoneAlt1 phoneAlt2 phoneAlt3"
        },

        rules: {
            email: {
                required: true,
                email: true,
                remote: {
                    url: activeEnvironment.active + '/api/returnemails',
                    type: 'get',
                    data: {
                        email: function () {
                            return $("#email").val();

                        }

                    },
                    dataType: 'json',
                    success: function (data) {


                        var validator = this;
                        data = data[0];
                        validator.result = data;
                        validator.valid = data.Ok;


                        var prospectName = $("#firstName").val();
                        var modalOk = ' <div class="modal-footer" style="text-align:center;"><button type="button" class="btn btn-danger btn-lg" data-dismiss="modal">Close</button></div>';


                        var addModal = function () {
                            $(".modal-info").text(validator.result.StatusDesc + "." + " Please try again.");
                            $('#submitting').modal('show');
                            addCloseBtn();
                            removeModalCloseBtn();

                        };

                        var addCloseBtn = function () {
                            $(modalOk).insertAfter("#submitting .modal-body");
                        };

                        var removeModalCloseBtn = function () {

                            $("#submitting .modal-footer button").on('click', function () {
                                $('#submitting').modal('hide');
                                $("#submitting .modal-footer").remove();

                            });
                        };

                        if (data.Ok == false) {

                            $("#email, #email2").val("");
                            $("#email").focus();
                            $("label.error[for='email2']").remove();
                            addModal();

                        };

                    }
                }
            },
            email2: {
                equalTo: "#email",
            },
            milStatus: {
                required: true
            },
            phone1: {
                required: true,
                digits: true,
                minlength: 3,
                maxlength: 3
            },
            phone2: {
                required: true,
                digits: true,
                minlength: 3,
                maxlength: 3
            },
            phone3: {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4
            },
            phoneAlt1: {
                minlength: {
                    digits: true,
                    param: 3,
                    depends: function (element) {
                        //return $('#phoneAlt1').val().length > 0;
                        if ($('#phoneAlt1').val().length > 0) { return true; } else { return false; }
                    }
                },
                maxlength: {
                    digits: true,
                    param: 3,
                    depends: function (element) {
                        //return $('#phoneAlt1').val().length > 0;
                        if ($('#phoneAlt1').val().length > 0) { return true; } else { return false; }
                    }
                }
            },
            phoneAlt2: {
                minlength: {
                    digits: true,
                    param: 3,
                    depends: function (element) {
                        //return $('#phoneAlt1').val().length > 0;
                        if ($('#phoneAlt2').val().length > 0) { return true; } else { return false; }
                    }
                },
                maxlength: {
                    digits: true,
                    param: 3,
                    depends: function (element) {
                        //return $('#phoneAlt1').val().length > 0;
                        if ($('#phoneAlt2').val().length > 0) { return true; } else { return false; }
                    }
                }
            },
            phoneAlt3: {
                minlength: {
                    param: 4,
                    depends: function (element) {
                        //return $('#phoneAlt1').val().length > 0;
                        if ($('#phoneAlt3').val().length > 0) { return true; } else { return false; }
                    }
                },
                maxlength: {
                    param: 4,
                    depends: function (element) {
                        //return $('#phoneAlt1').val().length > 0;
                        if ($('#phoneAlt3').val().length > 0) { return true; } else { return false; }
                    }
                }
            }
        },

        messages: {

            email2: {
                equalTo: "Email Addresses Must Match",
                required: "Email Addresses Must Match"
            },
            phone1: {
                required: "Phone Number is required",
                digits: "Please enter only digits for phone numbers",
                minlength: "Please enter a valid Phone Number",
                maxlength: "Please enter a valid Phone Number"
            },
            phone2: {
                required: "Phone Number is required",
                digits: "Please enter only digits for phone numbers",
                minlength: "Please enter a valid Phone Number",
                maxlength: "Please enter a valid Phone Number"
            },
            phone3: {
                required: "Phone Number is required",
                digits: "Please enter only digits for phone numbers",
                minlength: "Please enter a valid Phone Number",
                maxlength: "Please enter a valid Phone Number"
            },
            phoneAlt1: {
                digits: "Please enter only digits for phone numbers",
                minlength: "Please enter a valid alternative Phone Number",
                maxlength: "Please enter a valid alternative Phone Number"
            },
            phoneAlt2: {
                digits: "Please enter only digits for phone numbers",
                minlength: "Please enter a valid alternative Phone Number",
                maxlength: "Please enter a valid alternative Phone Number"
            },
            phoneAlt3: {
                digits: "Please enter only digits for phone numbers",
                minlength: "Please enter a valid alternative Phone Number",
                maxlength: "Please enter a valid alternative Phone Number"
            }
        }
    });

    jQuery.extend(jQuery.validator.messages, {
        required: "Required",

    });
};

var tcpaLangDisplay = function () {
    $('.privacy-policy-text').css('display', 'none');
    $('#phone3').focusout(function () {

        var p1 = $('#phone1').val();
        var p2 = $('#phone2').val();
        var p3 = $('#phone3').val();

        if (p1 != "" && p2 != "" && p3 != "") {
            $('.privacy-policy-text').css('display', 'block');
        } else {
            $('.privacy-policy-text').css('display', 'none');
        }
    });
};

$(document).ready(function () {
    
    /// Form Widget Plugin Options
    var uiForm;

    uiForm = $('form').uiForm({

        // url: activeEnvironment.active + '/api/leads',
        posted: function (evt) {

            /// Clear cookieManager data for next visit
            if (typeof cookieManager == 'object') {
                cookieManager.deleteQSInfoCookie();
                cookieManager.deleteReferralCookie();
            }

            var host = "http://" + window.location.host;
            window.location.replace(host + "/forms/form8/thankyou/");
        },

        failed: function () {
            $('#submitting').modal('hide');
            $("#error .modal-info").text("Sorry there has been an error in the form. Please try again later.");
            $('#error').modal('show');
        }

    });    

    var submitForm = function () {
        var tmpComments = "";


        //basic info
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();
        var interestCode = $("#interest").val();
        var dobMonth = $("select[name='dob[Month]']").val();
        var dobDay = $("select[name='dob[Day]']").val();
        var dobYear = $("select[name='dob[Year]']").val();

        //phone
        var phone = "(" + $("#phone1").val() + ") " + $("#phone2").val() + "-" + $("#phone3").val();

        //alt
        var txtAltPhone = $("#phoneAlt1").val() && $("#phoneAlt2").val() && $("#phoneAlt3").val() != "" ? "(" + $("#phoneAlt1").val() + ") " + $("#phoneAlt2").val() + "-" + $("#phoneAlt3").val() : "";


        //address
        var txtAddress = $("#txtAddress").val();
        var txtCity = $("#txtCity").val();
        var txtRegion = $("#txtRegion").val();
        var ddlState = $("#ddlState").val();
        var zip = $("#zipCode").val();
        var postal = $("#postalCode").val();
        var ddlCountry = $("#ddlCountry").val();


        //education
        var ddlEducation = $("#ddlEducation").val();
        var gradMonth = $("#gradMonth").val();
        var selectChoiceGradYear = $("#gradYear").val();
        var highschoolId = $("#high-school-name").val();
        var highSchoolState = $("#high-school-state").val();
        var highSchoolCity = $("#high-school-city").val();
        var chkNoHSAttended = $("#chkNoHSAttended").val();
        var hsNameNotListed = $("#txtHighSchoolNotListed").val();


        //military
        var isMilitary = $("input[name=milStatus]:checked").val();
        var militarySeparationMonth = $("select[name='MilitarySeparationMonth']").val();
        var militarySeparationYear = $("select[name='MilitarySeparationYear']").val();

        if (militarySeparationMonth !== "") {
            militarySeparationMonth--; //month is 0-based in Date(year, month, day [, hour, minute, second, millisecond]);
        }

        var milSepDate = new Date(militarySeparationYear, militarySeparationMonth);
        var militarySeparationDate = militarySeparationYear != "" ? milSepDate : null;


        var militaryId = $("#military-installation").val();
        var milStates = $("#milStates").val();
        var milCities = $("#milCities").val();
        var milBaseNotListed = $("#txtInstallationNotListed").val();
        //var variable = $("#").val();


        //element mapping
        uiForm.data('lead').FormID = 'form8';
        uiForm.data('lead').FirstName = firstName;
        uiForm.data('lead').LastName = lastName;
        uiForm.data('lead').InterestCode = interestCode;
        uiForm.data('lead').EmailAddresses[0].Address = email;

        uiForm.data('lead').Addresses[0].PostalCode = ddlCountry == "US" ? zip : postal;

        uiForm.data('lead').DateOfBirth = dobMonth + "/" + dobDay + "/" + dobYear;
        uiForm.data('lead').Education = ddlEducation;

        //addresses
        uiForm.data('lead').Addresses[0].AddressType = "L";
        uiForm.data('lead').Addresses[0].AddressLine1 = txtAddress;
        uiForm.data('lead').Addresses[0].City = txtCity;
        uiForm.data('lead').Addresses[0].State = ddlCountry == "US" ? ddlState : txtRegion;
        uiForm.data('lead').Addresses[0].Country = ddlCountry;

        ////phone numbers
        uiForm.data('lead').PhoneNumbers[0].Number = phone;
        uiForm.data('lead').PhoneNumbers[0].Type = "C";

        uiForm.data('lead').PhoneNumbers[1].Number = txtAltPhone;
        uiForm.data('lead').PhoneNumbers[1].Type = "L";

        ////education
        uiForm.data('lead').GradMonth = gradMonth;
        uiForm.data('lead').GradYear = selectChoiceGradYear;
        uiForm.data('lead').HighSchoolID = highschoolId;
        uiForm.data('lead').HighSchoolState = highSchoolState;
        uiForm.data('lead').HighSchoolCity = highSchoolCity;
        uiForm.data('lead').HighSchoolNotListed = hsNameNotListed != "" ? "HS: " + hsNameNotListed : "";


        ////military
        uiForm.data('lead').IsMilitary = isMilitary;
        uiForm.data('lead').MilitaryID = militaryId;
        uiForm.data('lead').MilitarySeparation = militarySeparationDate;
        uiForm.data('lead').InstallationNotListed = milBaseNotListed != undefined ? milBaseNotListed : "";

        //set status of highschool & military into comments field to populate CRM
        if ($(hsNotAttended).is(':checked')) {
            tmpComments += " Never Attended High School" + " - ";
        }

        if (highschoolId == "0") {
            console.log("High school id = to " + highschoolId);
            tmpComments += " High School: " + hsNameNotListed + " - " + highSchoolCity + ", " + highSchoolState;
        }


        if (militaryId == "0") {
            tmpComments += " Military Base: " + milBaseNotListed + " - ";
        }

        uiForm.data('lead').Comments = tmpComments;

        //set isComplete to true
        uiForm.data('lead').AdditionalInfo[0].Value = true;
        uiForm.data('lead').AdditionalInfo[1].Value = uid;
        uiForm.uiForm('post');

    }

    /// Form Wizard
    $(function () {
        $("#utiForm").formwizard({
            disableUIStlyes: true,
            //inAnimation: { left: "0px" },
            //outAnimation: { left: "+=600px" },
            formPluginEnabled: true,
            historyEnabled: true,
            textNext: 'Next Step',
            textBack: '< back',
            textSubmit: 'Get Info!',
            validationEnabled: true,
            validationoptions: {},
            focusFirstInput: false,
            submitStepClass: 'formSubmit',
            formOptions: {

                dataType: 'json',
                resetForm: true,
                beforeSerialize: function () {
                },

                beforeSubmit: function () {


                    var prospectName = $("#firstName").val();
                    /// Create cookie with email address for C3 Metrics Leads Conversion Tag to use on thank you page
                    var expiry = new Date(new Date().getTime() + 1 * 86400000).toUTCString();
                    var tmp = document.domain.split('.');
                    var rootDomain = '.uti.edu';
                    if (tmp.length === 3) { rootDomain = '.' + tmp[1] + '.' + tmp[2]; } else { rootDomain = '.' + tmp[0] + '.' + tmp[1]; }
                    document.cookie = 'c3mEmail=' + $("#email").val() + '; expires=' + expiry + '; path=/; domain=' + rootDomain + ';';
                    /// End

                    $(".modal-info").text("Processing...");
                    $('#submitting').modal('show');

                    submitForm();

                },
                beforeSend: function (data) { },
            }
        }
        );
    });

    /// Form Wizard Progress
    $("#utiForm").bind("step_shown", function (event, data) {

        if (data.currentStep == "area-of-interest") {
            $(".progress-bar").css({ width: '25%' });
            $(".the-title").text("A New Career Path Starts Here");

        }
        if (data.currentStep == "location") {
            $(".progress-bar").css({ width: '45%' });
            $(".the-title").text("A New Career Path Starts Here");

        }
        if (data.currentStep == "education") {
            $(".progress-bar").css({ width: '65%' });
            $(".the-title").text("Almost Done");
            $(".progressbar-subtitle").text("It only takes a few minutes to learn about technician training opportunities.");
        }
        if (data.currentStep == "contact-information") {
            $(".progress-bar").css({ width: '85%' });
            $(".the-title").text("Last Step!");
            $(".progressbar-subtitle").text("One more step and you're done!");
        }
    });
 
    copyrightDate();
    digitFormat();
    setMaxFieldLengths();
    autoTabbing();
    tcpaLangDisplay();

    $('.step').fadeIn(1200);

    uiValidate();

    //-------------------------------------------------------------
    //-------------------- FORM LOGIC -----------------------------
    //-------------------------------------------------------------


    //Field Mapping
    var country = $('#ddlCountryPre');
    var country2 = $('#ddlCountry');
    var countries = $('#ddlCountryPre,#ddlCountry');

    var hsState = $('#high-school-state').highschoolstates();
    var hsCity = $('#high-school-city').highschoolcity();
    var hsName = $("#high-school-name").highschoolnames();
    var milStatus = $("input:radio[name=milStatus]");
    var milStates = $('#military-states');
    var milInstallation = $("#military-installation");

    var education = $("#ddlEducation");
    var gradMonth = $("#gradMonth");
    var gradYear = $("#gradYear");
    var hsNotListed = $("#txtHighSchoolNotListed");
    var hsNotAttended = $("#chkNoHighSchoolAttended");



    ///////////////////////////////////////////////////
    //Field Changes 
    ///////////////////////////////////////////////////



    //Country Change
    countries.change(function () {
        //hide show US/Non-US Fields
        if ($(this).val() === "US") { showUsFields();} else {showNonUsFields(); }});

    //Education Change
    education.change(function () {

        $('select[name="dob[Day]"],select[name="dob[Month]"],select[name="dob[Year]"]').val('');
        $(".education").hide();

        if (education.val() == "HS Grad" || education.val() == "Home School") {
            $('#gradDateLabel').html('When will/did you graduate?');
            $('#highschoolStateLabel').html('High School State:');
            $('#highschoolCityLabel').html('High School City:');
            $('#highschoolNameLabel').html('High School Name:');
            $("#chkNoHighSchoolAttendedLabel").hide();

            hsNotAttended.hide();

        }

        else if (education.val() == "GED") {
            $('#gradDateLabel').html('When did you last attend High School?');
            $('#highschoolStateLabel').html('Last High School State:');
            $('#highschoolCityLabel').html('Last High School City:');
            $('#highschoolNameLabel').html('Last High School Name:');

            $("#chkNoHighSchoolAttendedLabel").show();
            hsNotAttended.show();
        }

        else if (education.val() == "No Equivalent") {
            $('#gradDateLabel').html('When did you last attend High School?');
            $('#highschoolStateLabel').html('Last High School State:');
            $('#highschoolCityLabel').html('Last High School City:');
            $('#highschoolNameLabel').html('Last High School Name:');

            $("#chkNoHighSchoolAttendedLabel").show();
            hsNotAttended.show();
        }
    });

    //HS Not Listed Change - Set High School to Not Listed
    $("#txtHighSchoolNotListed").on('keyup', function () {
        //console.log("Key Press");
        //hsName.val(0);
    });

    //on city change
    $("#txtCity").change(function () {

        $("#txtCityPre").val($(this).val());

    });
    $("#txtCityPre").change(function () {

        $("#txtCity").val($(this).val());

    });

    //On Postal Code Change
    $("#postalCodePre").change(function () {

        $("#postalCode").val($(this).val());

    });
    $("#postalCode").change(function () {

        $("#postalCodePre").val($(this).val());

    });

    //On Region Change
    $("#txtRegionPre").change(function () {

        $("#txtRegion").val($(this).val());

    });
    $("#txtRegion").change(function () {

        $("#txtRegionPre").val($(this).val());

    });

    $("#ddlCountryPre").change(function () {

        $("#ddlCountry").val($(this).val());

    });
    $("#ddlCountry").change(function () {

        $("#ddlCountryPre").val($(this).val());

    });

    //HS State Change
    hsState.change(function () {
        hsCity.highschoolcity('clearlist');


        var value = $(this).val();

        if (value !== "") {
            hsCity.highschoolcity('lookup', value);
            hsNotListed.prop("disabled", false);
        } else {
            hsState.highschoolstates('clearlist');
            hsState.highschoolstates();
            hsName.highschoolnames('clearlist');
            hsNotListed.prop("disabled", true);
        }

    });
    //HS City Change
    hsCity.change(function () {
        hsName.highschoolnames('clearlist');
        var hsStateCode = $('#high-school-state').val();
        var hsCityVal = $('#high-school-city').val();

        if (hsStateCode !== "" && hsCity !== "") {

            hsName.highschoolnames('lookup', hsStateCode, hsCityVal);
        }
    });
    //*Military Radio Change*/
    milStatus.change(function () {
        milInstallation.militarybases();
        var militaryStatus = $(this).val();
        if (militaryStatus == 'false') {

            $('#select-choice-military-year').val('');
            $('#select-choice-military-month').val('');
            $("#txtInstallationNotListed").val('');
            milInstallation.militarybases('clearlist');
            $(".milBaseNotListed").hide();
            $(".isMilitary").fadeOut();

        } else {

            $(".isMilitary").fadeIn();
            milStates.highschoolstates();
            milInstallation.militarybases('clearlist');
        }

    });

    $('#ddlState, #ddlStatePre, #high-school-state').highschoolstates();
    $('select[name="dob[Day]"],select[name="dob[Month]"],select[name="dob[Year]"]').change(function () {

        var day = parseInt($('select[name="dob[Day]"]').val(), 10);
        var month = parseInt($('select[name="dob[Month]"]').val(), 10);
        var year = parseInt($('select[name="dob[Year]"]').val(), 10);

        if (isNaN(month) || isNaN(day) || isNaN(year)) {
            $(".education").hide();
        }
        // console.log("Month: "+month+" - Day: " +day+" - Year:"+year);

        if (day > 0 && month > 0 && year > 1900) {
            month--; //month is 0-based in Date(year, month, day [, hour, minute, second, millisecond]);
            var dob = new Date(year, month, day);

            var today = new Date();
            var dobFor20 = new Date();
            dobFor20.setFullYear(today.getFullYear() - 20); //over 20, no highschool info required

            //SHOW Hide Education
            //check age - hide military question if under 18
            if (dob > dobFor20) {
                $(".militaryRb,.isMilitary").hide();
                $('#select-choice-military-year').val('');
                $('#select-choice-military-month').val('');

                $("#txtInstallationNotListed").val('');
                $(".milBaseNotListed").hide();

                $("input[name=milStatus]#option2").prop('checked', true);
                if (education.val() != "Home School") {
                    $(".education").show();
                }

                //  $("#txtHighSchoolNotListed").prop("disabled", true);

            } else {
                $(".education").hide();
                $(".militaryRb").show();
                $("input[name=milStatus]#option2").prop('checked', false);
            }
        }
    });
    $('select[name="GradDate[year]"]').change(function () {

        if ($(this).val() != "" && $("#gradMonth").val() != "") {

            $(".hsState,.hsCity").fadeIn();
        } else {
            $(".hsState,.hsCity").fadeOut();
        }
    });
    $('select[name="HighSchoolState"],select[name="HighSchoolCity"]').change(function () {
        if ($('select[name="HighSchoolState"]').val() != "" && $('select[name="HighSchoolCity"]').val() != "") {

            $(".hsName").fadeIn();
        } else {
            $(".hsName").fadeOut();
        }
    });

    hsName.change(function () {

        if (hsName.val() == 0 && hsName.val() != "") {

            $(".hsNotListedWrap").show();

        } else {
            $(".hsNotListedWrap").hide();
            hsNotListed.val('');
        }

    });
    //Military State Change
    milStates.change(function () {
        var milStateCode = $(this).val();
        milInstallation.militarybases();
        milInstallation.militarybases('lookupByState', milStateCode);

    });

    //military installation change
    milInstallation.change(function () {

        if (milInstallation.val() == 0 && milInstallation.val() != "") {

            $(".milBaseNotListed").show();

        } else {
            $(".milBaseNotListed").hide();
            $("#txtInstallationNotListed").val('');
        }
    });



    //Populate Drop Down Lists on PageLoad
    country.countries();
    country2.countries();

    //get TCPA
    $(".legalBox").legal();

    /*-----------Completers----------------------------------*/
    $('#zipCodePre').zipCompleter({
        'afterUpdate': function () {
            $("#zipCode").val($("#zipCodePre").val());
        }
    });
    $('#zipCode').zipCompleter({
        'afterUpdate': function () {

            $('#zipCodPre').val($('#zipCode').val());
        }
    });

    //I Never Attended High School Checkbox Toggle
    //Never attended high school is only shown on GED, none of the above (HOME SCHOOL Should be added to this as well... )

    hsNotAttended.change(function () {

        if ($(this).is(':checked')) {

            //console.log("disable");
            gradMonth.val('').attr("disabled", true);
            gradYear.val('').attr("disabled", true);
            hsState.val('').attr("disabled", true);
            hsCity.val('').attr("disabled", true);
            hsName.val('').attr("disabled", true);
            hsNotListed.val('').attr("disabled", true);



        } else {
            gradMonth.attr("disabled", false);
            gradYear.attr("disabled", false);
            hsState.attr("disabled", false);
            hsCity.attr("disabled", false);
            hsName.attr("disabled", false);
            hsNotListed.attr("disabled", false);
        }

    });

    //setup Leadguid id
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    }

    var uid = guid();
});
/*!
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery BBQ: Back Button & Query Library
//
// *Version: 1.2.1, Last updated: 2/17/2010*
// 
// Project Home - http://benalman.com/projects/jquery-bbq-plugin/
// GitHub       - http://github.com/cowboy/jquery-bbq/
// Source       - http://github.com/cowboy/jquery-bbq/raw/master/jquery.ba-bbq.js
// (Minified)   - http://github.com/cowboy/jquery-bbq/raw/master/jquery.ba-bbq.min.js (4.0kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// Basic AJAX     - http://benalman.com/code/projects/jquery-bbq/examples/fragment-basic/
// Advanced AJAX  - http://benalman.com/code/projects/jquery-bbq/examples/fragment-advanced/
// jQuery UI Tabs - http://benalman.com/code/projects/jquery-bbq/examples/fragment-jquery-ui-tabs/
// Deparam        - http://benalman.com/code/projects/jquery-bbq/examples/deparam/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-4,
//                   Chrome 4-5, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-bbq/unit/
// 
// About: Release History
// 
// 1.2.1 - (2/17/2010) Actually fixed the stale window.location Safari bug from
//         <jQuery hashchange event> in BBQ, which was the main reason for the
//         previous release!
// 1.2   - (2/16/2010) Integrated <jQuery hashchange event> v1.2, which fixes a
//         Safari bug, the event can now be bound before DOM ready, and IE6/7
//         page should no longer scroll when the event is first bound. Also
//         added the <jQuery.param.fragment.noEscape> method, and reworked the
//         <hashchange event (BBQ)> internal "add" method to be compatible with
//         changes made to the jQuery 1.4.2 special events API.
// 1.1.1 - (1/22/2010) Integrated <jQuery hashchange event> v1.1, which fixes an
//         obscure IE8 EmulateIE7 meta tag compatibility mode bug.
// 1.1   - (1/9/2010) Broke out the jQuery BBQ event.special <hashchange event>
//         functionality into a separate plugin for users who want just the
//         basic event & back button support, without all the extra awesomeness
//         that BBQ provides. This plugin will be included as part of jQuery BBQ,
//         but also be available separately. See <jQuery hashchange event>
//         plugin for more information. Also added the <jQuery.bbq.removeState>
//         method and added additional <jQuery.deparam> examples.
// 1.0.3 - (12/2/2009) Fixed an issue in IE 6 where location.search and
//         location.hash would report incorrectly if the hash contained the ?
//         character. Also <jQuery.param.querystring> and <jQuery.param.fragment>
//         will no longer parse params out of a URL that doesn't contain ? or #,
//         respectively.
// 1.0.2 - (10/10/2009) Fixed an issue in IE 6/7 where the hidden IFRAME caused
//         a "This page contains both secure and nonsecure items." warning when
//         used on an https:// page.
// 1.0.1 - (10/7/2009) Fixed an issue in IE 8. Since both "IE7" and "IE8
//         Compatibility View" modes erroneously report that the browser
//         supports the native window.onhashchange event, a slightly more
//         robust test needed to be added.
// 1.0   - (10/2/2009) Initial release

(function($,window){
  '$:nomunge'; // Used by YUI compressor.
  
  // Some convenient shortcuts.
  var undefined,
    aps = Array.prototype.slice,
    decode = decodeURIComponent,
    
    // Method / object references.
    jq_param = $.param,
    jq_param_fragment,
    jq_deparam,
    jq_deparam_fragment,
    jq_bbq = $.bbq = $.bbq || {},
    jq_bbq_pushState,
    jq_bbq_getState,
    jq_elemUrlAttr,
    jq_event_special = $.event.special,
    
    // Reused strings.
    str_hashchange = 'hashchange',
    str_querystring = 'querystring',
    str_fragment = 'fragment',
    str_elemUrlAttr = 'elemUrlAttr',
    str_location = 'location',
    str_href = 'href',
    str_src = 'src',
    
    // Reused RegExp.
    re_trim_querystring = /^.*\?|#.*$/g,
    re_trim_fragment = /^.*\#/,
    re_no_escape,
    
    // Used by jQuery.elemUrlAttr.
    elemUrlAttr_cache = {};
  
  // A few commonly used bits, broken out to help reduce minified file size.
  
  function is_string( arg ) {
    return typeof arg === 'string';
  };
  
  // Why write the same function twice? Let's curry! Mmmm, curry..
  
  function curry( func ) {
    var args = aps.call( arguments, 1 );
    
    return function() {
      return func.apply( this, args.concat( aps.call( arguments ) ) );
    };
  };
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    return url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Get location.search (or what you'd expect location.search to be) sans any
  // leading #. Thanks for making this necessary, IE6!
  function get_querystring( url ) {
    return url.replace( /(?:^[^?#]*\?([^#]*).*$)?.*/, '$1' );
  };
  
  // Section: Param (to string)
  // 
  // Method: jQuery.param.querystring
  // 
  // Retrieve the query string from a URL or if no arguments are passed, the
  // current window.location.
  // 
  // Usage:
  // 
  // > jQuery.param.querystring( [ url ] );
  // 
  // Arguments:
  // 
  //  url - (String) A URL containing query string params to be parsed. If url
  //    is not passed, the current window.location is used.
  // 
  // Returns:
  // 
  //  (String) The parsed query string, with any leading "?" removed.
  //
  
  // Method: jQuery.param.querystring (build url)
  // 
  // Merge a URL, with or without pre-existing query string params, plus any
  // object, params string or URL containing query string params into a new URL.
  // 
  // Usage:
  // 
  // > jQuery.param.querystring( url, params [, merge_mode ] );
  // 
  // Arguments:
  // 
  //  url - (String) A valid URL for params to be merged into. This URL may
  //    contain a query string and/or fragment (hash).
  //  params - (String) A params string or URL containing query string params to
  //    be merged into url.
  //  params - (Object) A params object to be merged into url.
  //  merge_mode - (Number) Merge behavior defaults to 0 if merge_mode is not
  //    specified, and is as-follows:
  // 
  //    * 0: params in the params argument will override any query string
  //         params in url.
  //    * 1: any query string params in url will override params in the params
  //         argument.
  //    * 2: params argument will completely replace any query string in url.
  // 
  // Returns:
  // 
  //  (String) Either a params string with urlencoded data or a URL with a
  //    urlencoded query string in the format 'a=b&c=d&e=f'.
  
  // Method: jQuery.param.fragment
  // 
  // Retrieve the fragment (hash) from a URL or if no arguments are passed, the
  // current window.location.
  // 
  // Usage:
  // 
  // > jQuery.param.fragment( [ url ] );
  // 
  // Arguments:
  // 
  //  url - (String) A URL containing fragment (hash) params to be parsed. If
  //    url is not passed, the current window.location is used.
  // 
  // Returns:
  // 
  //  (String) The parsed fragment (hash) string, with any leading "#" removed.
  
  // Method: jQuery.param.fragment (build url)
  // 
  // Merge a URL, with or without pre-existing fragment (hash) params, plus any
  // object, params string or URL containing fragment (hash) params into a new
  // URL.
  // 
  // Usage:
  // 
  // > jQuery.param.fragment( url, params [, merge_mode ] );
  // 
  // Arguments:
  // 
  //  url - (String) A valid URL for params to be merged into. This URL may
  //    contain a query string and/or fragment (hash).
  //  params - (String) A params string or URL containing fragment (hash) params
  //    to be merged into url.
  //  params - (Object) A params object to be merged into url.
  //  merge_mode - (Number) Merge behavior defaults to 0 if merge_mode is not
  //    specified, and is as-follows:
  // 
  //    * 0: params in the params argument will override any fragment (hash)
  //         params in url.
  //    * 1: any fragment (hash) params in url will override params in the
  //         params argument.
  //    * 2: params argument will completely replace any query string in url.
  // 
  // Returns:
  // 
  //  (String) Either a params string with urlencoded data or a URL with a
  //    urlencoded fragment (hash) in the format 'a=b&c=d&e=f'.
  
  function jq_param_sub( is_fragment, get_func, url, params, merge_mode ) {
    var result,
      qs,
      matches,
      url_params,
      hash;
    
    if ( params !== undefined ) {
      // Build URL by merging params into url string.
      
      // matches[1] = url part that precedes params, not including trailing ?/#
      // matches[2] = params, not including leading ?/#
      // matches[3] = if in 'querystring' mode, hash including leading #, otherwise ''
      matches = url.match( is_fragment ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/ );
      
      // Get the hash if in 'querystring' mode, and it exists.
      hash = matches[3] || '';
      
      if ( merge_mode === 2 && is_string( params ) ) {
        // If merge_mode is 2 and params is a string, merge the fragment / query
        // string into the URL wholesale, without converting it into an object.
        qs = params.replace( is_fragment ? re_trim_fragment : re_trim_querystring, '' );
        
      } else {
        // Convert relevant params in url to object.
        url_params = jq_deparam( matches[2] );
        
        params = is_string( params )
          
          // Convert passed params string into object.
          ? jq_deparam[ is_fragment ? str_fragment : str_querystring ]( params )
          
          // Passed params object.
          : params;
        
        qs = merge_mode === 2 ? params                              // passed params replace url params
          : merge_mode === 1  ? $.extend( {}, params, url_params )  // url params override passed params
          : $.extend( {}, url_params, params );                     // passed params override url params
        
        // Convert params object to a string.
        qs = jq_param( qs );
        
        // Unescape characters specified via $.param.noEscape. Since only hash-
        // history users have requested this feature, it's only enabled for
        // fragment-related params strings.
        if ( is_fragment ) {
          qs = qs.replace( re_no_escape, decode );
        }
      }
      
      // Build URL from the base url, querystring and hash. In 'querystring'
      // mode, ? is only added if a query string exists. In 'fragment' mode, #
      // is always added.
      result = matches[1] + ( is_fragment ? '#' : qs || !matches[1] ? '?' : '' ) + qs + hash;
      
    } else {
      // If URL was passed in, parse params from URL string, otherwise parse
      // params from window.location.
      result = get_func( url !== undefined ? url : window[ str_location ][ str_href ] );
    }
    
    return result;
  };
  
  jq_param[ str_querystring ]                  = curry( jq_param_sub, 0, get_querystring );
  jq_param[ str_fragment ] = jq_param_fragment = curry( jq_param_sub, 1, get_fragment );
  
  // Method: jQuery.param.fragment.noEscape
  // 
  // Specify characters that will be left unescaped when fragments are created
  // or merged using <jQuery.param.fragment>, or when the fragment is modified
  // using <jQuery.bbq.pushState>. This option only applies to serialized data
  // object fragments, and not set-as-string fragments. Does not affect the
  // query string. Defaults to ",/" (comma, forward slash).
  // 
  // Note that this is considered a purely aesthetic option, and will help to
  // create URLs that "look pretty" in the address bar or bookmarks, without
  // affecting functionality in any way. That being said, be careful to not
  // unescape characters that are used as delimiters or serve a special
  // purpose, such as the "#?&=+" (octothorpe, question mark, ampersand,
  // equals, plus) characters.
  // 
  // Usage:
  // 
  // > jQuery.param.fragment.noEscape( [ chars ] );
  // 
  // Arguments:
  // 
  //  chars - (String) The characters to not escape in the fragment. If
  //    unspecified, defaults to empty string (escape all characters).
  // 
  // Returns:
  // 
  //  Nothing.
  
  jq_param_fragment.noEscape = function( chars ) {
    chars = chars || '';
    var arr = $.map( chars.split(''), encodeURIComponent );
    re_no_escape = new RegExp( arr.join('|'), 'g' );
  };
  
  // A sensible default. These are the characters people seem to complain about
  // "uglifying up the URL" the most.
  jq_param_fragment.noEscape( ',/' );
  
  // Section: Deparam (from string)
  // 
  // Method: jQuery.deparam
  // 
  // Deserialize a params string into an object, optionally coercing numbers,
  // booleans, null and undefined values; this method is the counterpart to the
  // internal jQuery.param method.
  // 
  // Usage:
  // 
  // > jQuery.deparam( params [, coerce ] );
  // 
  // Arguments:
  // 
  //  params - (String) A params string to be parsed.
  //  coerce - (Boolean) If true, coerces any numbers or true, false, null, and
  //    undefined to their actual value. Defaults to false if omitted.
  // 
  // Returns:
  // 
  //  (Object) An object representing the deserialized params string.
  
  $.deparam = jq_deparam = function( params, coerce ) {
    var obj = {},
      coerce_types = { 'true': !0, 'false': !1, 'null': null };
    
    // Iterate over all name=value pairs.
    $.each( params.replace( /\+/g, ' ' ).split( '&' ), function(j,v){
      var param = v.split( '=' ),
        key = decode( param[0] ),
        val,
        cur = obj,
        i = 0,
        
        // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
        // into its component parts.
        keys = key.split( '][' ),
        keys_last = keys.length - 1;
      
      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
        // Remove the trailing ] from the last keys part.
        keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );
        
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat( keys );
        
        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }
      
      // Are we dealing with a name=value pair, or just a name?
      if ( param.length === 2 ) {
        val = decode( param[1] );
        
        // Coerce values.
        if ( coerce ) {
          val = val && !isNaN(val)            ? +val              // number
            : val === 'undefined'             ? undefined         // undefined
            : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
            : val;                                                // string
        }
        
        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is 
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for ( ; i <= keys_last; i++ ) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
              ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
              : val;
          }
          
        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.
          
          if ( $.isArray( obj[key] ) ) {
            // val is already an array, so push on the next value.
            obj[key].push( val );
            
          } else if ( obj[key] !== undefined ) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [ obj[key], val ];
            
          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }
        
      } else if ( key ) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
          ? undefined
          : '';
      }
    });
    
    return obj;
  };
  
  // Method: jQuery.deparam.querystring
  // 
  // Parse the query string from a URL or the current window.location,
  // deserializing it into an object, optionally coercing numbers, booleans,
  // null and undefined values.
  // 
  // Usage:
  // 
  // > jQuery.deparam.querystring( [ url ] [, coerce ] );
  // 
  // Arguments:
  // 
  //  url - (String) An optional params string or URL containing query string
  //    params to be parsed. If url is omitted, the current window.location
  //    is used.
  //  coerce - (Boolean) If true, coerces any numbers or true, false, null, and
  //    undefined to their actual value. Defaults to false if omitted.
  // 
  // Returns:
  // 
  //  (Object) An object representing the deserialized params string.
  
  // Method: jQuery.deparam.fragment
  // 
  // Parse the fragment (hash) from a URL or the current window.location,
  // deserializing it into an object, optionally coercing numbers, booleans,
  // null and undefined values.
  // 
  // Usage:
  // 
  // > jQuery.deparam.fragment( [ url ] [, coerce ] );
  // 
  // Arguments:
  // 
  //  url - (String) An optional params string or URL containing fragment (hash)
  //    params to be parsed. If url is omitted, the current window.location
  //    is used.
  //  coerce - (Boolean) If true, coerces any numbers or true, false, null, and
  //    undefined to their actual value. Defaults to false if omitted.
  // 
  // Returns:
  // 
  //  (Object) An object representing the deserialized params string.
  
  function jq_deparam_sub( is_fragment, url_or_params, coerce ) {
    if ( url_or_params === undefined || typeof url_or_params === 'boolean' ) {
      // url_or_params not specified.
      coerce = url_or_params;
      url_or_params = jq_param[ is_fragment ? str_fragment : str_querystring ]();
    } else {
      url_or_params = is_string( url_or_params )
        ? url_or_params.replace( is_fragment ? re_trim_fragment : re_trim_querystring, '' )
        : url_or_params;
    }
    
    return jq_deparam( url_or_params, coerce );
  };
  
  jq_deparam[ str_querystring ]                    = curry( jq_deparam_sub, 0 );
  jq_deparam[ str_fragment ] = jq_deparam_fragment = curry( jq_deparam_sub, 1 );
  
  // Section: Element manipulation
  // 
  // Method: jQuery.elemUrlAttr
  // 
  // Get the internal "Default URL attribute per tag" list, or augment the list
  // with additional tag-attribute pairs, in case the defaults are insufficient.
  // 
  // In the <jQuery.fn.querystring> and <jQuery.fn.fragment> methods, this list
  // is used to determine which attribute contains the URL to be modified, if
  // an "attr" param is not specified.
  // 
  // Default Tag-Attribute List:
  // 
  //  a      - href
  //  base   - href
  //  iframe - src
  //  img    - src
  //  input  - src
  //  form   - action
  //  link   - href
  //  script - src
  // 
  // Usage:
  // 
  // > jQuery.elemUrlAttr( [ tag_attr ] );
  // 
  // Arguments:
  // 
  //  tag_attr - (Object) An object containing a list of tag names and their
  //    associated default attribute names in the format { tag: 'attr', ... } to
  //    be merged into the internal tag-attribute list.
  // 
  // Returns:
  // 
  //  (Object) An object containing all stored tag-attribute values.
  
  // Only define function and set defaults if function doesn't already exist, as
  // the urlInternal plugin will provide this method as well.
  $[ str_elemUrlAttr ] || ($[ str_elemUrlAttr ] = function( obj ) {
    return $.extend( elemUrlAttr_cache, obj );
  })({
    a: str_href,
    base: str_href,
    iframe: str_src,
    img: str_src,
    input: str_src,
    form: 'action',
    link: str_href,
    script: str_src
  });
  
  jq_elemUrlAttr = $[ str_elemUrlAttr ];
  
  // Method: jQuery.fn.querystring
  // 
  // Update URL attribute in one or more elements, merging the current URL (with
  // or without pre-existing query string params) plus any params object or
  // string into a new URL, which is then set into that attribute. Like
  // <jQuery.param.querystring (build url)>, but for all elements in a jQuery
  // collection.
  // 
  // Usage:
  // 
  // > jQuery('selector').querystring( [ attr, ] params [, merge_mode ] );
  // 
  // Arguments:
  // 
  //  attr - (String) Optional name of an attribute that will contain a URL to
  //    merge params or url into. See <jQuery.elemUrlAttr> for a list of default
  //    attributes.
  //  params - (Object) A params object to be merged into the URL attribute.
  //  params - (String) A URL containing query string params, or params string
  //    to be merged into the URL attribute.
  //  merge_mode - (Number) Merge behavior defaults to 0 if merge_mode is not
  //    specified, and is as-follows:
  //    
  //    * 0: params in the params argument will override any params in attr URL.
  //    * 1: any params in attr URL will override params in the params argument.
  //    * 2: params argument will completely replace any query string in attr
  //         URL.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements, but with modified URL
  //  attribute values.
  
  // Method: jQuery.fn.fragment
  // 
  // Update URL attribute in one or more elements, merging the current URL (with
  // or without pre-existing fragment/hash params) plus any params object or
  // string into a new URL, which is then set into that attribute. Like
  // <jQuery.param.fragment (build url)>, but for all elements in a jQuery
  // collection.
  // 
  // Usage:
  // 
  // > jQuery('selector').fragment( [ attr, ] params [, merge_mode ] );
  // 
  // Arguments:
  // 
  //  attr - (String) Optional name of an attribute that will contain a URL to
  //    merge params into. See <jQuery.elemUrlAttr> for a list of default
  //    attributes.
  //  params - (Object) A params object to be merged into the URL attribute.
  //  params - (String) A URL containing fragment (hash) params, or params
  //    string to be merged into the URL attribute.
  //  merge_mode - (Number) Merge behavior defaults to 0 if merge_mode is not
  //    specified, and is as-follows:
  //    
  //    * 0: params in the params argument will override any params in attr URL.
  //    * 1: any params in attr URL will override params in the params argument.
  //    * 2: params argument will completely replace any fragment (hash) in attr
  //         URL.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements, but with modified URL
  //  attribute values.
  
  function jq_fn_sub( mode, force_attr, params, merge_mode ) {
    if ( !is_string( params ) && typeof params !== 'object' ) {
      // force_attr not specified.
      merge_mode = params;
      params = force_attr;
      force_attr = undefined;
    }
    
    return this.each(function(){
      var that = $(this),
        
        // Get attribute specified, or default specified via $.elemUrlAttr.
        attr = force_attr || jq_elemUrlAttr()[ ( this.nodeName || '' ).toLowerCase() ] || '',
        
        // Get URL value.
        url = attr && that.attr( attr ) || '';
      
      // Update attribute with new URL.
      that.attr( attr, jq_param[ mode ]( url, params, merge_mode ) );
    });
    
  };
  
  $.fn[ str_querystring ] = curry( jq_fn_sub, str_querystring );
  $.fn[ str_fragment ]    = curry( jq_fn_sub, str_fragment );
  
  // Section: History, hashchange event
  // 
  // Method: jQuery.bbq.pushState
  // 
  // Adds a 'state' into the browser history at the current position, setting
  // location.hash and triggering any bound <hashchange event> callbacks
  // (provided the new state is different than the previous state).
  // 
  // If no arguments are passed, an empty state is created, which is just a
  // shortcut for jQuery.bbq.pushState( {}, 2 ).
  // 
  // Usage:
  // 
  // > jQuery.bbq.pushState( [ params [, merge_mode ] ] );
  // 
  // Arguments:
  // 
  //  params - (String) A serialized params string or a hash string beginning
  //    with # to merge into location.hash.
  //  params - (Object) A params object to merge into location.hash.
  //  merge_mode - (Number) Merge behavior defaults to 0 if merge_mode is not
  //    specified (unless a hash string beginning with # is specified, in which
  //    case merge behavior defaults to 2), and is as-follows:
  // 
  //    * 0: params in the params argument will override any params in the
  //         current state.
  //    * 1: any params in the current state will override params in the params
  //         argument.
  //    * 2: params argument will completely replace current state.
  // 
  // Returns:
  // 
  //  Nothing.
  // 
  // Additional Notes:
  // 
  //  * Setting an empty state may cause the browser to scroll.
  //  * Unlike the fragment and querystring methods, if a hash string beginning
  //    with # is specified as the params agrument, merge_mode defaults to 2.
  
  jq_bbq.pushState = jq_bbq_pushState = function( params, merge_mode ) {
    if ( is_string( params ) && /^#/.test( params ) && merge_mode === undefined ) {
      // Params string begins with # and merge_mode not specified, so completely
      // overwrite window.location.hash.
      merge_mode = 2;
    }
    
    var has_args = params !== undefined,
      // Merge params into window.location using $.param.fragment.
      url = jq_param_fragment( window[ str_location ][ str_href ],
        has_args ? params : {}, has_args ? merge_mode : 2 );
    
    // Set new window.location.href. If hash is empty, use just # to prevent
    // browser from reloading the page. Note that Safari 3 & Chrome barf on
    // location.hash = '#'.
    window[ str_location ][ str_href ] = url + ( /#/.test( url ) ? '' : '#' );
  };
  
  // Method: jQuery.bbq.getState
  // 
  // Retrieves the current 'state' from the browser history, parsing
  // location.hash for a specific key or returning an object containing the
  // entire state, optionally coercing numbers, booleans, null and undefined
  // values.
  // 
  // Usage:
  // 
  // > jQuery.bbq.getState( [ key ] [, coerce ] );
  // 
  // Arguments:
  // 
  //  key - (String) An optional state key for which to return a value.
  //  coerce - (Boolean) If true, coerces any numbers or true, false, null, and
  //    undefined to their actual value. Defaults to false.
  // 
  // Returns:
  // 
  //  (Anything) If key is passed, returns the value corresponding with that key
  //    in the location.hash 'state', or undefined. If not, an object
  //    representing the entire 'state' is returned.
  
  jq_bbq.getState = jq_bbq_getState = function( key, coerce ) {
    return key === undefined || typeof key === 'boolean'
      ? jq_deparam_fragment( key ) // 'key' really means 'coerce' here
      : jq_deparam_fragment( coerce )[ key ];
  };
  
  // Method: jQuery.bbq.removeState
  // 
  // Remove one or more keys from the current browser history 'state', creating
  // a new state, setting location.hash and triggering any bound
  // <hashchange event> callbacks (provided the new state is different than
  // the previous state).
  // 
  // If no arguments are passed, an empty state is created, which is just a
  // shortcut for jQuery.bbq.pushState( {}, 2 ).
  // 
  // Usage:
  // 
  // > jQuery.bbq.removeState( [ key [, key ... ] ] );
  // 
  // Arguments:
  // 
  //  key - (String) One or more key values to remove from the current state,
  //    passed as individual arguments.
  //  key - (Array) A single array argument that contains a list of key values
  //    to remove from the current state.
  // 
  // Returns:
  // 
  //  Nothing.
  // 
  // Additional Notes:
  // 
  //  * Setting an empty state may cause the browser to scroll.
  
  jq_bbq.removeState = function( arr ) {
    var state = {};
    
    // If one or more arguments is passed..
    if ( arr !== undefined ) {
      
      // Get the current state.
      state = jq_bbq_getState();
      
      // For each passed key, delete the corresponding property from the current
      // state.
      $.each( $.isArray( arr ) ? arr : arguments, function(i,v){
        delete state[ v ];
      });
    }
    
    // Set the state, completely overriding any existing state.
    jq_bbq_pushState( state, 2 );
  };
  
  // Event: hashchange event (BBQ)
  // 
  // Usage in jQuery 1.4 and newer:
  // 
  // In jQuery 1.4 and newer, the event object passed into any hashchange event
  // callback is augmented with a copy of the location.hash fragment at the time
  // the event was triggered as its event.fragment property. In addition, the
  // event.getState method operates on this property (instead of location.hash)
  // which allows this fragment-as-a-state to be referenced later, even after
  // window.location may have changed.
  // 
  // Note that event.fragment and event.getState are not defined according to
  // W3C (or any other) specification, but will still be available whether or
  // not the hashchange event exists natively in the browser, because of the
  // utility they provide.
  // 
  // The event.fragment property contains the output of <jQuery.param.fragment>
  // and the event.getState method is equivalent to the <jQuery.bbq.getState>
  // method.
  // 
  // > $(window).bind( 'hashchange', function( event ) {
  // >   var hash_str = event.fragment,
  // >     param_obj = event.getState(),
  // >     param_val = event.getState( 'param_name' ),
  // >     param_val_coerced = event.getState( 'param_name', true );
  // >   ...
  // > });
  // 
  // Usage in jQuery 1.3.2:
  // 
  // In jQuery 1.3.2, the event object cannot to be augmented as in jQuery 1.4+,
  // so the fragment state isn't bound to the event object and must instead be
  // parsed using the <jQuery.param.fragment> and <jQuery.bbq.getState> methods.
  // 
  // > $(window).bind( 'hashchange', function( event ) {
  // >   var hash_str = $.param.fragment(),
  // >     param_obj = $.bbq.getState(),
  // >     param_val = $.bbq.getState( 'param_name' ),
  // >     param_val_coerced = $.bbq.getState( 'param_name', true );
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * Due to changes in the special events API, jQuery BBQ v1.2 or newer is
  //   required to enable the augmented event object in jQuery 1.4.2 and newer.
  // * See <jQuery hashchange event> for more detailed information.
  
  jq_event_special[ str_hashchange ] = $.extend( jq_event_special[ str_hashchange ], {
    
    // Augmenting the event object with the .fragment property and .getState
    // method requires jQuery 1.4 or newer. Note: with 1.3.2, everything will
    // work, but the event won't be augmented)
    add: function( handleObj ) {
      var old_handler;
      
      function new_handler(e) {
        // e.fragment is set to the value of location.hash (with any leading #
        // removed) at the time the event is triggered.
        var hash = e[ str_fragment ] = jq_param_fragment();
        
        // e.getState() works just like $.bbq.getState(), but uses the
        // e.fragment property stored on the event object.
        e.getState = function( key, coerce ) {
          return key === undefined || typeof key === 'boolean'
            ? jq_deparam( hash, key ) // 'key' really means 'coerce' here
            : jq_deparam( hash, coerce )[ key ];
        };
        
        old_handler.apply( this, arguments );
      };
      
      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }
    
  });
  
})(jQuery,this);

/*!
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery hashchange event
//
// *Version: 1.2, Last updated: 2/11/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (1.1kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrate one way
// in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and robust,
// there are a few unfortunate browser bugs surrounding expected hashchange
// event-based behaviors, independent of any JavaScript window.onhashchange
// abstraction. See the following examples for more information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// About: Release History
// 
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Method / object references.
  var fake_onhashchange,
    jq_event_special = $.event.special,
    
    // Reused strings.
    str_location = 'location',
    str_hashchange = 'hashchange',
    str_href = 'href',
    
    // IE6/7 specifically need some special love when it comes to back-button
    // support, so let's do a little browser sniffing..
    browser = $.browser,
    mode = document.documentMode,
    is_old_ie = browser.msie && ( mode === undefined || mode < 8 ),
    
    // Does the browser support window.onhashchange? Test for IE version, since
    // IE8 incorrectly reports this when in "IE7" or "IE8 Compatibility View"!
    supports_onhashchange = 'on' + str_hashchange in window && !is_old_ie;
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || window[ str_location ][ str_href ];
    return url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Property: jQuery.hashchangeDelay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 100.
  
  $[ str_hashchange + 'Delay' ] = 100;
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // window.onhashchange event is used (IE8, FF3.6), otherwise a polling loop is
  // initialized, running every <jQuery.hashchangeDelay> milliseconds to see if
  // the hash has changed. In IE 6 and 7, a hidden Iframe is created to allow
  // the back button and hash-based history to work.
  // 
  // Usage:
  // 
  // > $(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one callback
  //   is actually bound to 'hashchange'.
  // * If you need the bound callback(s) to execute immediately, in cases where
  //   the page 'state' exists on page load (via bookmark or page refresh, for
  //   example) use $(window).trigger( 'hashchange' );
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a $(document).ready() callback.
  
  jq_event_special[ str_hashchange ] = $.extend( jq_event_special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      iframe,
      set_history,
      get_history;
    
    // Initialize. In IE 6/7, creates a hidden Iframe for history handling.
    function init(){
      // Most browsers don't need special methods here..
      set_history = get_history = function(val){ return val; };
      
      // But IE6/7 do!
      if ( is_old_ie ) {
        
        // Create hidden Iframe after the end of the body to prevent initial
        // page load from scrolling unnecessarily.
        iframe = $('<iframe src="javascript:0"/>').hide().insertAfter( 'body' )[0].contentWindow;
        
        // Get history by looking at the hidden Iframe's location.hash.
        get_history = function() {
          return get_fragment( iframe.document[ str_location ][ str_href ] );
        };
        
        // Set a new history item by opening and then closing the Iframe
        // document, *then* setting its location.hash.
        set_history = function( hash, history_hash ) {
          if ( hash !== history_hash ) {
            var doc = iframe.document;
            doc.open().close();
            doc[ str_location ].hash = '#' + hash;
          }
        };
        
        // Set initial history.
        set_history( get_fragment() );
      }
    };
    
    // Start the polling loop.
    self.start = function() {
      // Polling loop is already running!
      if ( timeout_id ) { return; }
      
      // Remember the initial hash so it doesn't get triggered immediately.
      var last_hash = get_fragment();
      
      // Initialize if not yet initialized.
      set_history || init();
      
      // This polling loop checks every $.hashchangeDelay milliseconds to see if
      // location.hash has changed, and triggers the 'hashchange' event on
      // window when necessary.
      (function loopy(){
        var hash = get_fragment(),
          history_hash = get_history( last_hash );
        
        if ( hash !== last_hash ) {
          set_history( last_hash = hash, history_hash );
          
          $(window).trigger( str_hashchange );
          
        } else if ( history_hash !== last_hash ) {
          window[ str_location ][ str_href ] = window[ str_location ][ str_href ].replace( /#.*/, '' ) + '#' + history_hash;
        }
        
        timeout_id = setTimeout( loopy, $[ str_hashchange + 'Delay' ] );
      })();
    };
    
    // Stop the polling loop, but only if an IE6/7 Iframe wasn't created. In
    // that case, even if there are no longer any bound event handlers, the
    // polling loop is still necessary for back/next to work at all!
    self.stop = function() {
      if ( !iframe ) {
        timeout_id && clearTimeout( timeout_id );
        timeout_id = 0;
      }
    };
    
    return self;
  })();
  
})(jQuery,this);


/*!
 * Bootstrap v3.0.3 (http://getbootstrap.com)
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 */

if("undefined"==typeof jQuery)throw new Error("Bootstrap requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]}}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d)};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.is("input")?"val":"html",e=c.data();a+="Text",e.resetText||c.data("resetText",c[d]()),c[d](e[a]||this.options[a]),setTimeout(function(){"loadingText"==a?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons"]'),b=!0;if(a.length){var c=this.$element.find("input");"radio"===c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?b=!1:a.find(".active").removeClass("active")),b&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}b&&this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition.end&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}this.sliding=!0,f&&this.pause();var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});if(!e.hasClass("active")){if(this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")){if(this.$element.trigger(j),j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(600)}else{if(this.$element.trigger(j),j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")}return f&&this.cycle(),this}};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?(this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350),void 0):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(jQuery),+function(a){"use strict";function b(){a(d).remove(),a(e).each(function(b){var d=c(a(this));d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown")),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown"))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){if("ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b),f.trigger(d=a.Event("show.bs.dropdown")),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown"),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=a("[role=menu] li:not(.divider):visible a",f);if(h.length){var i=h.index(h.filter(":focus"));38==b.keyCode&&i>0&&i--,40==b.keyCode&&i<h.length-1&&i++,~i||(i=0),h.eq(i).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu]",f.prototype.keydown)}(jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.load(this.options.remote)};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show(),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focus",i="hover"==g?"mouseleave":"blur";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show),void 0):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide),void 0):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this.tip();this.setContent(),this.options.animation&&c.addClass("fade");var d="function"==typeof this.options.placement?this.options.placement.call(this,c[0],this.$element[0]):this.options.placement,e=/\s?auto?\s?/i,f=e.test(d);f&&(d=d.replace(e,"")||"top"),c.detach().css({top:0,left:0,display:"block"}).addClass(d),this.options.container?c.appendTo(this.options.container):c.insertAfter(this.$element);var g=this.getPosition(),h=c[0].offsetWidth,i=c[0].offsetHeight;if(f){var j=this.$element.parent(),k=d,l=document.documentElement.scrollTop||document.body.scrollTop,m="body"==this.options.container?window.innerWidth:j.outerWidth(),n="body"==this.options.container?window.innerHeight:j.outerHeight(),o="body"==this.options.container?0:j.offset().left;d="bottom"==d&&g.top+g.height+i-l>n?"top":"top"==d&&g.top-l-i<0?"bottom":"right"==d&&g.right+h>m?"left":"left"==d&&g.left-h<o?"right":d,c.removeClass(k).addClass(d)}var p=this.getCalculatedOffset(d,g,h,i);this.applyPlacement(p,d),this.$element.trigger("shown.bs."+this.type)}},b.prototype.applyPlacement=function(a,b){var c,d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),a.top=a.top+g,a.left=a.left+h,d.offset(a).addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;if("top"==b&&j!=f&&(c=!0,a.top=a.top+f-j),/bottom|top/.test(b)){var k=0;a.left<0&&(k=-2*a.left,a.left=0,d.offset(a),i=d[0].offsetWidth,j=d[0].offsetHeight),this.replaceArrow(k-e+i,i,"left")}else this.replaceArrow(j-f,j,"top");c&&d.offset(a)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach()}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.$element.trigger("hidden.bs."+this.type),this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"html":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(c).is("body")?a(window):a(c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#\w/.test(e)&&a(e);return f&&f.length&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parents(".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top()),"function"==typeof h&&(h=f.bottom());var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;this.affixed!==i&&(this.unpin&&this.$element.css("top",""),this.affixed=i,this.unpin="bottom"==i?e.top-d:null,this.$element.removeClass(b.RESET).addClass("affix"+(i?"-"+i:"")),"bottom"==i&&this.$element.offset({top:document.body.offsetHeight-h-this.$element.height()}))}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(jQuery);
var environments = {
    local: 'http://localhost:39540',
    dev: 'http://utileadgateway-dev.cloudapp.net',
    stage: 'http://leadgatewaystage.uti.edu',
    qa: 'http://leadgatewayqa.uti.edu',
    prod: 'http://leadgateway.uti.edu',
    lead: 'http://crspc.cloudapp.net'
};

var activeEnvironment = {
    active: "",
    lead: ""
};

var host = window.location.host;

var getActiveEnvironment = function (host) {


    if (host.indexOf("www.uti.edu") >= 0) {
        activeEnvironment.active = environments.prod;
        activeEnvironment.lead = environments.prod;
    } else if (host.indexOf('stage.uti.edu') >= 0) {
        activeEnvironment.active = environments.stage;
        activeEnvironment.lead = environments.stage;
    }
    else if (host.indexOf('localhost') >= 0) {
        activeEnvironment.active = environments.dev;
        activeEnvironment.lead = environments.dev;
    }
    else if (host.indexOf('prdsitecore01.uticorp.com') >= 0) {
        activeEnvironment.active = environments.dev;
        activeEnvironment.lead = environments.dev;
    } else {

        alert("error - please try again later");

    }
};

getActiveEnvironment(host);
/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
/*!
 * jQuery Form Plugin
 * version: 2.43 (12-MAR-2010)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/*
	Usage Note:
	-----------
	Do not use both ajaxSubmit and ajaxForm on the same form.  These
	functions are intended to be exclusive.  Use ajaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
		$('#myForm').bind('submit', function() {
			$(this).ajaxSubmit({
				target: '#output'
			});
			return false; // <-- important!
		});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
		$('#myForm').ajaxForm({
			target: '#output'
		});
	});

	When using ajaxForm, the ajaxSubmit function will be invoked for you
	at the appropriate time.
*/

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
	// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
	if (!this.length) {
		log('ajaxSubmit: skipping submit process - no element selected');
		return this;
	}

	if (typeof options == 'function')
		options = { success: options };

	var url = $.trim(this.attr('action'));
	if (url) {
		// clean url (don't include hash vaue)
		url = (url.match(/^([^#]+)/)||[])[1];
   	}
   	url = url || window.location.href || '';

	options = $.extend({
		url:  url,
		type: this.attr('method') || 'GET',
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
	}, options || {});

	// hook for manipulating the form data before it is extracted;
	// convenient for use with rich editors like tinyMCE or FCKEditor
	var veto = {};
	this.trigger('form-pre-serialize', [this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
		return this;
	}

	// provide opportunity to alter form data before it is serialized
	if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSerialize callback');
		return this;
	}

	var a = this.formToArray(options.semantic);
	if (options.data) {
		options.extraData = options.data;
		for (var n in options.data) {
		  if(options.data[n] instanceof Array) {
			for (var k in options.data[n])
			  a.push( { name: n, value: options.data[n][k] } );
		  }
		  else
			 a.push( { name: n, value: options.data[n] } );
		}
	}

	// give pre-submit callback an opportunity to abort the submit
	if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSubmit callback');
		return this;
	}

	// fire vetoable 'validate' event
	this.trigger('form-submit-validate', [a, this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
		return this;
	}

	var q = $.param(a);

	if (options.type.toUpperCase() == 'GET') {
		options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
		options.data = null;  // data is null for 'get'
	}
	else
		options.data = q; // data is the query string for 'post'

	var $form = this, callbacks = [];
	if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
	if (options.clearForm) callbacks.push(function() { $form.clearForm(); });

	// perform a load on the target only if dataType is not provided
	if (!options.dataType && options.target) {
		var oldSuccess = options.success || function(){};
		callbacks.push(function(data) {
			var fn = options.replaceTarget ? 'replaceWith' : 'html';
			$(options.target)[fn](data).each(oldSuccess, arguments);
		});
	}
	else if (options.success)
		callbacks.push(options.success);

	options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
		for (var i=0, max=callbacks.length; i < max; i++)
			callbacks[i].apply(options, [data, status, xhr || $form, $form]);
	};

	// are there files to upload?
	var files = $('input:file', this).fieldValue();
	var found = false;
	for (var j=0; j < files.length; j++)
		if (files[j])
			found = true;

	var multipart = false;
//	var mp = 'multipart/form-data';
//	multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

	// options.iframe allows user to force iframe mode
	// 06-NOV-09: now defaulting to iframe mode if file input is detected
   if ((files.length && options.iframe !== false) || options.iframe || found || multipart) {
	   // hack to fix Safari hang (thanks to Tim Molendijk for this)
	   // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
	   if (options.closeKeepAlive)
		   $.get(options.closeKeepAlive, fileUpload);
	   else
		   fileUpload();
	   }
   else
	   $.ajax(options);

	// fire 'notify' event
	this.trigger('form-submit-notify', [this, options]);
	return this;


	// private function for handling file uploads (hat tip to YAHOO!)
	function fileUpload() {
		var form = $form[0];

		if ($(':input[name=submit]', form).length) {
			alert('Error: Form elements must not be named "submit".');
			return;
		}

		var opts = $.extend({}, $.ajaxSettings, options);
		var s = $.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);

		var id = 'jqFormIO' + (new Date().getTime());
		var $io = $('<iframe id="' + id + '" name="' + id + '" src="'+ opts.iframeSrc +'" onload="(jQuery(this).data(\'form-plugin-onload\'))()" />');
		var io = $io[0];

		$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

		var xhr = { // mock object
			aborted: 0,
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {},
			abort: function() {
				this.aborted = 1;
				$io.attr('src', opts.iframeSrc); // abort op in progress
			}
		};

		var g = opts.global;
		// trigger ajax global events so that activity/block indicators work like normal
		if (g && ! $.active++) $.event.trigger("ajaxStart");
		if (g) $.event.trigger("ajaxSend", [xhr, opts]);

		if (s.beforeSend && s.beforeSend(xhr, s) === false) {
			s.global && $.active--;
			return;
		}
		if (xhr.aborted)
			return;

		var cbInvoked = false;
		var timedOut = 0;

		// add submitting element to data if we know it
		var sub = form.clk;
		if (sub) {
			var n = sub.name;
			if (n && !sub.disabled) {
				opts.extraData = opts.extraData || {};
				opts.extraData[n] = sub.value;
				if (sub.type == "image") {
					opts.extraData[n+'.x'] = form.clk_x;
					opts.extraData[n+'.y'] = form.clk_y;
				}
			}
		}

		// take a breath so that pending repaints get some cpu time before the upload starts
		function doSubmit() {
			// make sure form attrs are set
			var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (form.getAttribute('method') != 'POST')
				form.setAttribute('method', 'POST');
			if (form.getAttribute('action') != opts.url)
				form.setAttribute('action', opts.url);

			// ie borks in some cases when setting encoding
			if (! opts.skipEncodingOverride) {
				$form.attr({
					encoding: 'multipart/form-data',
					enctype:  'multipart/form-data'
				});
			}

			// support timout
			if (opts.timeout)
				setTimeout(function() { timedOut = true; cb(); }, opts.timeout);

			// add "extra" data to form if provided in options
			var extraInputs = [];
			try {
				if (opts.extraData)
					for (var n in opts.extraData)
						extraInputs.push(
							$('<input type="hidden" name="'+n+'" value="'+opts.extraData[n]+'" />')
								.appendTo(form)[0]);

				// add iframe to doc and submit the form
				$io.appendTo('body');
				$io.data('form-plugin-onload', cb);
				form.submit();
			}
			finally {
				// reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
				t ? form.setAttribute('target', t) : $form.removeAttr('target');
				$(extraInputs).remove();
			}
		};

		if (opts.forceSync)
			doSubmit();
		else
			setTimeout(doSubmit, 10); // this lets dom updates render
	
		var domCheckCount = 100;

		function cb() {
			if (cbInvoked) 
				return;

			var ok = true;
			try {
				if (timedOut) throw 'timeout';
				// extract the server response from the iframe
				var data, doc;

				doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
				
				var isXml = opts.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
				log('isXml='+isXml);
				if (!isXml && (doc.body == null || doc.body.innerHTML == '')) {
				 	if (--domCheckCount) {
						// in some browsers (Opera) the iframe DOM is not always traversable when
						// the onload callback fires, so we loop a bit to accommodate
				 		log('requeing onLoad callback, DOM not available');
						setTimeout(cb, 250);
						return;
					}
					log('Could not access iframe DOM after 100 tries.');
					return;
				}

				log('response detected');
				cbInvoked = true;
				xhr.responseText = doc.body ? doc.body.innerHTML : null;
				xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
				xhr.getResponseHeader = function(header){
					var headers = {'content-type': opts.dataType};
					return headers[header];
				};

				if (opts.dataType == 'json' || opts.dataType == 'script') {
					// see if user embedded response in textarea
					var ta = doc.getElementsByTagName('textarea')[0];
					if (ta)
						xhr.responseText = ta.value;
					else {
						// account for browsers injecting pre around json response
						var pre = doc.getElementsByTagName('pre')[0];
						if (pre)
							xhr.responseText = pre.innerHTML;
					}			  
				}
				else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
					xhr.responseXML = toXml(xhr.responseText);
				}
				data = $.httpData(xhr, opts.dataType);
			}
			catch(e){
				log('error caught:',e);
				ok = false;
				xhr.error = e;
				$.handleError(opts, xhr, 'error', e);
			}

			// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
			if (ok) {
				opts.success(data, 'success');
				if (g) $.event.trigger("ajaxSuccess", [xhr, opts]);
			}
			if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
			if (g && ! --$.active) $.event.trigger("ajaxStop");
			if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

			// clean up
			setTimeout(function() {
				$io.removeData('form-plugin-onload');
				$io.remove();
				xhr.responseXML = null;
			}, 100);
		};

		function toXml(s, doc) {
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
		};
	};
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *	is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *	used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
	return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
		e.preventDefault();
		$(this).ajaxSubmit(options);
	}).bind('click.form-plugin', function(e) {
		var target = e.target;
		var $el = $(target);
		if (!($el.is(":submit,input:image"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest(':submit');
			if (t.length == 0)
				return;
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX != undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
	});
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
	return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
	var a = [];
	if (this.length == 0) return a;

	var form = this[0];
	var els = semantic ? form.getElementsByTagName('*') : form.elements;
	if (!els) return a;
	for(var i=0, max=els.length; i < max; i++) {
		var el = els[i];
		var n = el.name;
		if (!n) continue;

		if (semantic && form.clk && el.type == "image") {
			// handle image inputs on the fly when semantic == true
			if(!el.disabled && form.clk == el) {
				a.push({name: n, value: $(el).val()});
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
			continue;
		}

		var v = $.fieldValue(el, true);
		if (v && v.constructor == Array) {
			for(var j=0, jmax=v.length; j < jmax; j++)
				a.push({name: n, value: v[j]});
		}
		else if (v !== null && typeof v != 'undefined')
			a.push({name: n, value: v});
	}

	if (!semantic && form.clk) {
		// input type=='image' are not found in elements array! handle it here
		var $input = $(form.clk), input = $input[0], n = input.name;
		if (n && !input.disabled && input.type == 'image') {
			a.push({name: n, value: $input.val()});
			a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
		}
	}
	return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
	//hand off to jQuery.param for proper encoding
	return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
	var a = [];
	this.each(function() {
		var n = this.name;
		if (!n) return;
		var v = $.fieldValue(this, successful);
		if (v && v.constructor == Array) {
			for (var i=0,max=v.length; i < max; i++)
				a.push({name: n, value: v[i]});
		}
		else if (v !== null && typeof v != 'undefined')
			a.push({name: this.name, value: v});
	});
	//hand off to jQuery.param for proper encoding
	return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *	  <input name="A" type="text" />
 *	  <input name="A" type="text" />
 *	  <input name="B" type="checkbox" value="B1" />
 *	  <input name="B" type="checkbox" value="B2"/>
 *	  <input name="C" type="radio" value="C1" />
 *	  <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *	   array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
	for (var val=[], i=0, max=this.length; i < max; i++) {
		var el = this[i];
		var v = $.fieldValue(el, successful);
		if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
			continue;
		v.constructor == Array ? $.merge(val, v) : val.push(v);
	}
	return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
	var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
	if (typeof successful == 'undefined') successful = true;

	if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1))
			return null;

	if (tag == 'select') {
		var index = el.selectedIndex;
		if (index < 0) return null;
		var a = [], ops = el.options;
		var one = (t == 'select-one');
		var max = (one ? index+1 : ops.length);
		for(var i=(one ? index : 0); i < max; i++) {
			var op = ops[i];
			if (op.selected) {
				var v = op.value;
				if (!v) // extra pain for IE...
					v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
				if (one) return v;
				a.push(v);
			}
		}
		return a;
	}
	return el.value;
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function() {
	return this.each(function() {
		$('input,select,textarea', this).clearFields();
	});
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function() {
	return this.each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (t == 'text' || t == 'password' || tag == 'textarea')
			this.value = '';
		else if (t == 'checkbox' || t == 'radio')
			this.checked = false;
		else if (tag == 'select')
			this.selectedIndex = -1;
	});
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
	return this.each(function() {
		// guard against an input with the name of 'reset'
		// note that IE reports the reset function as an 'object'
		if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
			this.reset();
	});
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
	if (b == undefined) b = true;
	return this.each(function() {
		this.disabled = !b;
	});
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
	if (select == undefined) select = true;
	return this.each(function() {
		var t = this.type;
		if (t == 'checkbox' || t == 'radio')
			this.checked = select;
		else if (this.tagName.toLowerCase() == 'option') {
			var $sel = $(this).parent('select');
			if (select && $sel[0] && $sel[0].type == 'select-one') {
				// deselect all other options
				$sel.find('option').selected(false);
			}
			this.selected = select;
		}
	});
};

// helper fn for console logging
// set $.fn.ajaxSubmit.debug to true to enable debug logging
function log() {
	if ($.fn.ajaxSubmit.debug) {
		var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
		if (window.console && window.console.log)
			window.console.log(msg);
		else if (window.opera && window.opera.postError)
			window.opera.postError(msg);
	}
};

})(jQuery);

/*
 * jQuery wizard plug-in 3.0.7 (18-SEPT-2012)
 *
 *
 * Copyright (c) 2012 Jan Sundman (jan.sundman[at]aland.net)
 *
 * http://www.thecodemine.org
 *
 * Licensed under the MIT licens:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */


(function($){
	$.widget("ui.formwizard", {

		_init: function() {
			$(".step").css({position:'relative'});
			var wizard = this;
			var formOptionsSuccess = this.options.formOptions.success;
			var formOptionsComplete = this.options.formOptions.complete;
			var formOptionsBeforeSend = this.options.formOptions.beforeSend;
			var formOptionsBeforeSubmit = this.options.formOptions.beforeSubmit;
			var formOptionsBeforeSerialize = this.options.formOptions.beforeSerialize;
			this.options.formOptions = $.extend(this.options.formOptions,{
				success	: function(responseText, textStatus, xhr){
					if(formOptionsSuccess){
						formOptionsSuccess(responseText, textStatus, xhr);
					}
					if(wizard.options.formOptions && wizard.options.formOptions.resetForm || !wizard.options.formOptions){
						wizard._reset();
					}
				},
				complete : function(xhr, textStatus){
					if(formOptionsComplete){
						formOptionsComplete(xhr, textStatus);
					}
					wizard._enableNavigation();
				},
				beforeSubmit : function(arr, theForm, options) {
					if(formOptionsBeforeSubmit){
						var shouldSubmit = formOptionsBeforeSubmit(arr, theForm, options);
						if(!shouldSubmit)
							wizard._enableNavigation();
						return shouldSubmit;
					}
				},
				beforeSend : function(xhr) {
					if(formOptionsBeforeSend){
						var shouldSubmit = formOptionsBeforeSend(xhr);
						if(!shouldSubmit)
							wizard._enableNavigation();
						return shouldSubmit;
					}
				},
				beforeSerialize: function(form, options) {
					if(formOptionsBeforeSerialize){
						var shouldSubmit = formOptionsBeforeSerialize(form, options);
						if(!shouldSubmit)
							wizard._enableNavigation();
						return shouldSubmit;
					}
				}
			});
			
			if (this.options.historyEnabled) {
				$.bbq.removeState("_" + $(this.element).attr('id'));
			}

			this.steps = this.element.find(".step").hide();

			this.firstStep = this.steps.eq(0).attr("id");
			this.activatedSteps = new Array();
			this.isLastStep = false;
			this.previousStep = undefined;
			this.currentStep = this.steps.eq(0).attr("id");
			this.nextButton	= this.element.find(this.options.next)
					.click(function() {
						return wizard._next();
					});

			this.nextButtonInitinalValue = this.nextButton.val();
			this.nextButton.val(this.options.textNext);

				this.backButton	= this.element.find(this.options.back)
					.click(function() {
						wizard._back();return false;
					});

				this.backButtonInitinalValue = this.backButton.val();
				this.backButton.val(this.options.textBack);

			if(this.options.validationEnabled && jQuery().validate  == undefined){
				this.options.validationEnabled = false;
				if( (window['console'] !== undefined) ){
					console.log("%s", "validationEnabled option set, but the validation plugin is not included");
				}
			}else if(this.options.validationEnabled){
				this.element.validate(this.options.validationOptions);
			}
			if(this.options.formPluginEnabled && jQuery().ajaxSubmit == undefined){
				this.options.formPluginEnabled = false;
				if( (window['console'] !== undefined) ){
					console.log("%s", "formPluginEnabled option set but the form plugin is not included");
				}
			}

			if(this.options.disableInputFields == true){
				$(this.steps).find(":input:not('.wizard-ignore')").attr("disabled","disabled");
			}

			if(this.options.historyEnabled){
				$(window).bind('hashchange', undefined, function(event){
					var hashStep = event.getState( "_" + $(wizard.element).attr( 'id' )) || wizard.firstStep;
					if(hashStep !== wizard.currentStep){
						if(wizard.options.validationEnabled && hashStep === wizard._navigate(wizard.currentStep)){
							if(!wizard.element.valid()){
								wizard._updateHistory(wizard.currentStep);
								wizard.element.validate().focusInvalid();

								return false;
							}
						}
						if(hashStep !== wizard.currentStep)
							wizard._show(hashStep);
					}
				});
			}

			//this.element.addClass("ui-formwizard");
			//this.element.find(":input").addClass("ui-wizard-content");
			//this.steps.addClass("ui-formwizard-content");
			//this.backButton.addClass("ui-formwizard-button ui-wizard-content");
			//this.nextButton.addClass("ui-formwizard-button ui-wizard-content");

			if(!this.options.disableUIStyles){
				//this.element.addClass("ui-helper-reset ui-widget ui-widget-content ui-helper-reset ui-corner-all");
				//this.element.find(":input").addClass("ui-helper-reset ui-state-default");
				//this.steps.addClass("ui-helper-reset ui-corner-all");
				//this.backButton.addClass("ui-helper-reset ui-state-default");
				//this.nextButton.addClass("ui-helper-reset ui-state-default");
			}
			this._show(undefined);
			return $(this);
		},

		_next : function(){
			if(this.options.validationEnabled){
				if(!this.element.valid()){
					this.element.validate().focusInvalid();
					return false;
				}
			}

			if(this.options.remoteAjax != undefined){
				var options = this.options.remoteAjax[this.currentStep];
				var wizard = this;
				if(options !== undefined){
					var success = options.success;
					var beforeSend = options.beforeSend;
					var complete = options.complete;

					options = $.extend({},options,{
						success: function(data, statusText){
							if((success !== undefined && success(data, statusText)) || (success == undefined)){
								wizard._continueToNextStep();
							}
						},
						beforeSend : function(xhr){
							wizard._disableNavigation();
							if(beforeSend !== undefined)
								beforeSend(xhr);
							$(wizard.element).trigger('before_remote_ajax', {"currentStep" : wizard.currentStep});
						},
						complete : function(xhr, statusText){
							if(complete !== undefined)
								complete(xhr, statusText);
							$(wizard.element).trigger('after_remote_ajax', {"currentStep" : wizard.currentStep});
							wizard._enableNavigation();
						}
					})
					this.element.ajaxSubmit(options);
					return false;
				}
			}

			return this._continueToNextStep();
		},

		_back : function(){
			if(this.activatedSteps.length > 0){
				if(this.options.historyEnabled){
					this._updateHistory(this.activatedSteps[this.activatedSteps.length - 2]);
				}else{
					this._show(this.activatedSteps[this.activatedSteps.length - 2], true);
				}
			}
			return false;
		},

		_continueToNextStep : function(){
			if(this.isLastStep){
				for(var i = 0; i < this.activatedSteps.length; i++){
					this.steps.filter("#" + this.activatedSteps[i]).find(":input").not(".wizard-ignore").removeAttr("disabled");
				}
				if(!this.options.formPluginEnabled){
					return true;
				}else{
					this._disableNavigation();
					this.element.ajaxSubmit(this.options.formOptions);
					return false;
				}
			}

			var step = this._navigate(this.currentStep);
			if(step == this.currentStep){
				return false;
			}
			if(this.options.historyEnabled){
				this._updateHistory(step);
			}else{
				this._show(step, true);
			}
			return false;
		},

		_updateHistory : function(step){
			var state = {};
			state["_" + $(this.element).attr('id')] = step;
			$.bbq.pushState(state);
		},

		_disableNavigation : function(){
			this.nextButton.attr("disabled","disabled");
			this.backButton.attr("disabled","disabled");
			if(!this.options.disableUIStyles){
				this.nextButton.removeClass("ui-state-active").addClass("ui-state-disabled");
				this.backButton.removeClass("ui-state-active").addClass("ui-state-disabled");
			}
		},

		_enableNavigation : function(){
			if(this.isLastStep){
				this.nextButton.val(this.options.textSubmit);
			}else{
				this.nextButton.val(this.options.textNext);
			}

			if($.trim(this.currentStep) !== this.steps.eq(0).attr("id")){
				this.backButton.removeAttr("disabled");
				if(!this.options.disableUIStyles){
					this.backButton.removeClass("ui-state-disabled").addClass("ui-state-active");
				}
			}

			this.nextButton.removeAttr("disabled");
			if(!this.options.disableUIStyles){
				this.nextButton.removeClass("ui-state-disabled").addClass("ui-state-active");
			}
		},

		_animate : function(oldStep, newStep, stepShownCallback){
			this._disableNavigation();
			var old = this.steps.filter("#" + oldStep);
			var current = this.steps.filter("#" + newStep);
			old.find(":input").not(".wizard-ignore").attr("disabled","disabled");
			current.find(":input").not(".wizard-ignore").removeAttr("disabled");
			var wizard = this;
			old.animate(wizard.options.outAnimation, wizard.options.outDuration, wizard.options.easing, function(){
				current.animate(wizard.options.inAnimation, wizard.options.inDuration, wizard.options.easing, function(){
					if(wizard.options.focusFirstInput)
						current.find(":input:first").focus();
					wizard._enableNavigation();

					stepShownCallback.apply(wizard);
				});
				return;
			});
		},

		_checkIflastStep : function(step){
			this.isLastStep = false;
			if($("#" + step).hasClass(this.options.submitStepClass) || this.steps.filter(":last").attr("id") == step){
				this.isLastStep = true;
			}
		},

		_getLink : function(step){
			var link = undefined;
			var links = this.steps.filter("#" + step).find(this.options.linkClass);

			if(links != undefined){
				if(links.filter(":radio,:checkbox").size() > 0){
					link = links.filter(this.options.linkClass + ":checked").val();
				}else{
					link = $(links).val();
				}
			}
			return link;
		},

		_navigate : function(step){
			var link = this._getLink(step);
			if(link != undefined){
				if((link != "" && link != null && link != undefined) && this.steps.filter("#" + link).attr("id") != undefined){
					return link;
				}
				return this.currentStep;
			}else if(link == undefined && !this.isLastStep){
				var step1 =  this.steps.filter("#" + step).next().attr("id");
				return step1;
			}
		},

		_show : function(step){
			var backwards = false;
			var triggerStepShown = step !== undefined;
			if(step == undefined || step == ""){
					this.activatedSteps.pop();
					step = this.firstStep;
					this.activatedSteps.push(step);
			}else{
				if($.inArray(step, this.activatedSteps) > -1){
					backwards = true;
					this.activatedSteps.pop();
				}else {
					this.activatedSteps.push(step);
				}
			}

			if(this.currentStep !== step || step === this.firstStep){
				this.previousStep = this.currentStep;
				this._checkIflastStep(step);
				this.currentStep = step;
				var stepShownCallback = function(){if(triggerStepShown){$(this.element).trigger('step_shown', $.extend({"isBackNavigation" : backwards},this._state()));}}
				if(triggerStepShown){
					$(this.element).trigger('before_step_shown', $.extend({"isBackNavigation" : backwards},this._state()));
				}
				this._animate(this.previousStep, step, stepShownCallback);
			};


		},

	   _reset : function(){
			this.element.resetForm()
			$("label,:input,textarea",this).removeClass("error");
			for(var i = 0; i < this.activatedSteps.length; i++){
				this.steps.filter("#" + this.activatedSteps[i]).hide().find(":input").attr("disabled","disabled");
			}
			this.activatedSteps = new Array();
			this.previousStep = undefined;
			this.isLastStep = false;
			if(this.options.historyEnabled){
				this._updateHistory(this.firstStep);
			}else{
				this._show(this.firstStep);
			}

		},

		_state : function(state){
			var currentState = { "settings" : this.options,
				"activatedSteps" : this.activatedSteps,
				"isLastStep" : this.isLastStep,
				"isFirstStep" : this.currentStep === this.firstStep,
				"previousStep" : this.previousStep,
				"currentStep" : this.currentStep,
				"backButton" : this.backButton,
				"nextButton" : this.nextButton,
				"steps" : this.steps,
				"firstStep" : this.firstStep
			}

			if(state !== undefined)
				return currentState[state];

			return currentState;
		},

	  /*Methods*/

		show : function(step){
			if(this.options.historyEnabled){
				this._updateHistory(step);
			}else{
				this._show(step);
			}
		},

		state : function(state){
			return this._state(state);
		},

		reset : function(){
			this._reset();
		},

		next : function(){
			this._next();
		},

		back : function(){
			this._back();
		},

		destroy: function() {
			this.element.find("*").removeAttr("disabled").show();
			this.nextButton.unbind("click").val(this.nextButtonInitinalValue).removeClass("ui-state-disabled").addClass("ui-state-active");
			this.backButton.unbind("click").val(this.backButtonInitinalValue).removeClass("ui-state-disabled").addClass("ui-state-active");
			this.backButtonInitinalValue = undefined;
			this.nextButtonInitinalValue = undefined;
			this.activatedSteps = undefined;
			this.previousStep = undefined;
			this.currentStep = undefined;
			this.isLastStep = undefined;
			this.options = undefined;
			this.nextButton = undefined;
			this.backButton = undefined;
			this.formwizard = undefined;
			this.element = undefined;
			this.steps = undefined;
			this.firstStep = undefined;
		},

		update_steps : function(){
			this.steps = this.element.find(".step").addClass("ui-formwizard-content");
			this.firstStep = this.steps.eq(0).attr("id");
			this.steps.not("#" + this.currentStep).hide().find(":input").addClass("ui-wizard-content").attr("disabled","disabled");
			this._checkIflastStep(this.currentStep);
			this._enableNavigation();
			if(!this.options.disableUIStyles){
				this.steps.addClass("ui-helper-reset ui-corner-all");
				this.steps.find(":input").addClass("ui-helper-reset ui-state-default");
			}
		},

		options: {
	   		historyEnabled	: false,
			validationEnabled : false,
			validationOptions : undefined,
			formPluginEnabled : false,
			linkClass	: ".link",
			submitStepClass : "submit_step",
			back : ":reset",
			next : ":submit",
			textSubmit : 'Submit',
			textNext : 'Next',
			textBack : 'Back',
			remoteAjax : undefined,
			inAnimation : {opacity: 'show'},
			outAnimation: {opacity: 'hide'},
			inDuration : 400,
			outDuration: 400,
			easing: 'swing',
			focusFirstInput : false,
			disableInputFields : true,
			formOptions : { reset: true, success: function(data) { if( (window['console'] !== undefined) ){console.log("%s", "form submit successful");}},
			disableUIStyles : false
		}
   }
 });
})(jQuery);


function autoTab(current, next) {
    if (current.getAttribute && current.value.length == current.getAttribute("maxlength"))
        next.focus();
}
$(".numeric").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});
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
/*!
 * jQuery Validation Plugin v1.13.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {

    $.extend($.fn, {
        // http://jqueryvalidation.org/validate/
        validate: function (options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);

            if (validator.settings.onsubmit) {

                this.validateDelegate(":submit", "click", function (event) {
                    if (validator.settings.submitHandler) {
                        validator.submitButton = event.target;
                    }
                    // allow suppressing validation by adding a cancel class to the submit button
                    if ($(event.target).hasClass("cancel")) {
                        validator.cancelSubmit = true;
                    }

                    // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ($(event.target).attr("formnovalidate") !== undefined) {
                        validator.cancelSubmit = true;
                    }
                });

                // validate the form on submit
                this.submit(function (event) {
                    if (validator.settings.debug) {
                        // prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden;
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>")
                                    .attr("name", validator.submitButton.name)
                                    .val($(validator.submitButton).val())
                                    .appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm, event);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },
        // http://jqueryvalidation.org/valid/
        valid: function () {
            var valid, validator;

            if ($(this[0]).is("form")) {
                valid = this.validate().form();
            } else {
                valid = true;
                validator = $(this[0].form).validate();
                this.each(function () {
                    valid = validator.element(this) && valid;
                });
            }
            return valid;
        },
        // attributes: space separated list of attributes to retrieve and remove
        removeAttrs: function (attributes) {
            var result = {},
                $element = this;
            $.each(attributes.split(/\s/), function (index, value) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        // http://jqueryvalidation.org/rules/
        rules: function (command, argument) {
            var element = this[0],
                settings, staticRules, existingRules, data, param, filtered;

            if (command) {
                settings = $.data(element.form, "validator").settings;
                staticRules = settings.rules;
                existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        // remove messages from rules, but allow them to be set separately
                        delete existingRules.messages;
                        staticRules[element.name] = existingRules;
                        if (argument.messages) {
                            settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        }
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        filtered = {};
                        $.each(argument.split(/\s/), function (index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                            if (method === "required") {
                                $(element).removeAttr("aria-required");
                            }
                        });
                        return filtered;
                }
            }

            data = $.validator.normalizeRules(
            $.extend(
                {},
                $.validator.classRules(element),
                $.validator.attributeRules(element),
                $.validator.dataRules(element),
                $.validator.staticRules(element)
            ), element);

            // make sure required is at front
            if (data.required) {
                param = data.required;
                delete data.required;
                data = $.extend({ required: param }, data);
                $(element).attr("aria-required", "true");
            }

            // make sure remote is at back
            if (data.remote) {
                param = data.remote;
                delete data.remote;
                data = $.extend(data, { remote: param });
            }

            return data;
        }
    });

    // Custom selectors
    $.extend($.expr[":"], {
        // http://jqueryvalidation.org/blank-selector/
        blank: function (a) {
            return !$.trim("" + $(a).val());
        },
        // http://jqueryvalidation.org/filled-selector/
        filled: function (a) {
            return !!$.trim("" + $(a).val());
        },
        // http://jqueryvalidation.org/unchecked-selector/
        unchecked: function (a) {
            return !$(a).prop("checked");
        }
    });

    // constructor for validator
    $.validator = function (options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };

    // http://jqueryvalidation.org/jQuery.validator.format/
    $.validator.format = function (source, params) {
        if (arguments.length === 1) {
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return n;
            });
        });
        return source;
    };

    $.extend($.validator, {

        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function (element) {
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.hideThese(this.errorsFor(element));
                }
            },
            onfocusout: function (element) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function (element, event) {
                if (event.which === 9 && this.elementValue(element) === "") {
                    return;
                } else if (element.name in this.submitted || element === this.lastElement) {
                    this.element(element);
                }
            },
            onclick: function (element) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);

                    // or option elements, check parent select in that case
                } else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            },
            highlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },

        // http://jqueryvalidation.org/jQuery.validator.setDefaults/
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        },

        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date ( ISO ).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },

        autoCreateRanges: false,

        prototype: {

            init: function () {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();

                var groups = (this.groups = {}),
                    rules;
                $.each(this.settings.groups, function (key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function (index, name) {
                        groups[name] = key;
                    });
                });
                rules = this.settings.rules;
                $.each(rules, function (key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
                        eventType = "on" + event.type.replace(/^validate/, ""),
                        settings = validator.settings;
                    if (settings[eventType] && !this.is(settings.ignore)) {
                        settings[eventType].call(validator, this[0], event);
                    }
                }
                $(this.currentForm)
                    .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                        "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                        "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                        "[type='week'], [type='time'], [type='datetime-local'], " +
                        "[type='range'], [type='color'], [type='radio'], [type='checkbox']",
                        "focusin focusout keyup", delegate)
                    // Support: Chrome, oldIE
                    // "select" is provided as event.target when clicking a option
                    .validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", delegate);

                if (this.settings.invalidHandler) {
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                }

                // Add aria-required to any Static/Data/Class required fields before first validation
                // Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
                $(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true");
            },

            // http://jqueryvalidation.org/Validator.form/
            form: function () {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },

            checkForm: function () {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()) ; elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },

            // http://jqueryvalidation.org/Validator.element/
            element: function (element) {
                var cleanElement = this.clean(element),
                    checkElement = this.validationTargetFor(cleanElement),
                    result = true;

                this.lastElement = checkElement;

                if (checkElement === undefined) {
                    delete this.invalid[cleanElement.name];
                } else {
                    this.prepareElement(checkElement);
                    this.currentElements = $(checkElement);

                    result = this.check(checkElement) !== false;
                    if (result) {
                        delete this.invalid[checkElement.name];
                    } else {
                        this.invalid[checkElement.name] = true;
                    }
                }
                // Add aria-invalid status for screen readers
                $(element).attr("aria-invalid", !result);

                if (!this.numberOfInvalids()) {
                    // Hide error containers on last error
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },

            // http://jqueryvalidation.org/Validator.showErrors/
            showErrors: function (errors) {
                if (errors) {
                    // add items to error list and map
                    $.extend(this.errorMap, errors);
                    this.errorList = [];
                    for (var name in errors) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    // remove items from success list
                    this.successList = $.grep(this.successList, function (element) {
                        return !(element.name in errors);
                    });
                }
                if (this.settings.showErrors) {
                    this.settings.showErrors.call(this, this.errorMap, this.errorList);
                } else {
                    this.defaultShowErrors();
                }
            },

            // http://jqueryvalidation.org/Validator.resetForm/
            resetForm: function () {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements()
                        .removeClass(this.settings.errorClass)
                        .removeData("previousValue")
                        .removeAttr("aria-invalid");
            },

            numberOfInvalids: function () {
                return this.objectLength(this.invalid);
            },

            objectLength: function (obj) {
                /* jshint unused: false */
                var count = 0,
                    i;
                for (i in obj) {
                    count++;
                }
                return count;
            },

            hideErrors: function () {
                this.hideThese(this.toHide);
            },

            hideThese: function (errors) {
                errors.not(this.containers).text("");
                this.addWrapper(errors).hide();
            },

            valid: function () {
                return this.size() === 0;
            },

            size: function () {
                return this.errorList.length;
            },

            focusInvalid: function () {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                        .filter(":visible")
                        .focus()
                        // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                        .trigger("focusin");
                    } catch (e) {
                        // ignore IE throwing errors when focusing hidden elements
                    }
                }
            },

            findLastActive: function () {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function (n) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },

            elements: function () {
                var validator = this,
                    rulesCache = {};

                // select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                .find("input, select, textarea")
                .not(":submit, :reset, :image, [disabled]")
                .not(this.settings.ignore)
                .filter(function () {
                    if (!this.name && validator.settings.debug && window.console) {
                        console.error("%o has no name assigned", this);
                    }

                    // select only the first element for each name, and only those with rules specified
                    if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                        return false;
                    }

                    rulesCache[this.name] = true;
                    return true;
                });
            },

            clean: function (selector) {
                return $(selector)[0];
            },

            errors: function () {
                var errorClass = this.settings.errorClass.split(" ").join(".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },

            reset: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },

            prepareForm: function () {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },

            prepareElement: function (element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },

            elementValue: function (element) {
                var val,
                    $element = $(element),
                    type = element.type;

                if (type === "radio" || type === "checkbox") {
                    return $("input[name='" + element.name + "']:checked").val();
                } else if (type === "number" && typeof element.validity !== "undefined") {
                    return element.validity.badInput ? false : $element.val();
                }

                val = $element.val();
                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },

            check: function (element) {
                element = this.validationTargetFor(this.clean(element));

                var rules = $(element).rules(),
                    rulesCount = $.map(rules, function (n, i) {
                        return i;
                    }).length,
                    dependencyMismatch = false,
                    val = this.elementValue(element),
                    result, method, rule;

                for (method in rules) {
                    rule = { method: method, parameters: rules[method] };
                    try {

                        result = $.validator.methods[method].call(this, val, element, rule.parameters);

                        // if a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result === "dependency-mismatch" && rulesCount === 1) {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;

                        if (result === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }

                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },

            // return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            // return the generic message if present and no method specific message is present
            customDataMessage: function (element, method) {
                return $(element).data("msg" + method.charAt(0).toUpperCase() +
                    method.substring(1).toLowerCase()) || $(element).data("msg");
            },

            // return the custom message for the given element name and validation method
            customMessage: function (name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor === String ? m : m[method]);
            },

            // return the first defined argument, allowing empty strings
            findDefined: function () {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        return arguments[i];
                    }
                }
                return undefined;
            },

            defaultMessage: function (element, method) {
                return this.findDefined(
                    this.customMessage(element.name, method),
                    this.customDataMessage(element, method),
                    // title is never undefined, so handle empty string as undefined
                    !this.settings.ignoreTitle && element.title || undefined,
                    $.validator.messages[method],
                    "<strong>Warning: No message defined for " + element.name + "</strong>"
                );
            },

            formatAndAdd: function (element, rule) {
                var message = this.defaultMessage(element, rule.method),
                    theregex = /\$?\{(\d+)\}/g;
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element,
                    method: rule.method
                });

                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },

            addWrapper: function (toToggle) {
                if (this.settings.wrapper) {
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                }
                return toToggle;
            },

            defaultShowErrors: function () {
                var i, elements, error;
                for (i = 0; this.errorList[i]; i++) {
                    error = this.errorList[i];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements() ; elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },

            validElements: function () {
                return this.currentElements.not(this.invalidElements());
            },

            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element;
                });
            },

            showLabel: function (element, message) {
                var place, group, errorID,
                    error = this.errorsFor(element),
                    elementID = this.idOrName(element),
                    describedBy = $(element).attr("aria-describedby");
                if (error.length) {
                    // refresh error/success class
                    error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    // replace message on existing label
                    error.html(message);
                } else {
                    // create error element
                    error = $("<" + this.settings.errorElement + ">")
                        .attr("id", elementID + "-error")
                        .addClass(this.settings.errorClass)
                        .html(message || "");

                    // Maintain reference to the element to be placed into the DOM
                    place = error;
                    if (this.settings.wrapper) {
                        // make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (this.labelContainer.length) {
                        this.labelContainer.append(place);
                    } else if (this.settings.errorPlacement) {
                        this.settings.errorPlacement(place, $(element));
                    } else {
                        place.insertAfter(element);
                    }

                    // Link error back to the element
                    if (error.is("label")) {
                        // If the error is a label, then associate using 'for'
                        error.attr("for", elementID);
                    } else if (error.parents("label[for='" + elementID + "']").length === 0) {
                        // If the element is not a child of an associated label, then it's necessary
                        // to explicitly apply aria-describedby

                        errorID = error.attr("id");
                        // Respect existing non-error aria-describedby
                        if (!describedBy) {
                            describedBy = errorID;
                        } else if (!describedBy.match(new RegExp("\b" + errorID + "\b"))) {
                            // Add to end of list if not already present
                            describedBy += " " + errorID;
                        }
                        $(element).attr("aria-describedby", describedBy);

                        // If this element is grouped, then assign to all elements in the same group
                        group = this.groups[element.name];
                        if (group) {
                            $.each(this.groups, function (name, testgroup) {
                                if (testgroup === group) {
                                    $("[name='" + name + "']", this.currentForm)
                                        .attr("aria-describedby", error.attr("id"));
                                }
                            });
                        }
                    }
                }
                if (!message && this.settings.success) {
                    error.text("");
                    if (typeof this.settings.success === "string") {
                        error.addClass(this.settings.success);
                    } else {
                        this.settings.success(error, element);
                    }
                }
                this.toShow = this.toShow.add(error);
            },

            errorsFor: function (element) {
                var name = this.idOrName(element),
                    describer = $(element).attr("aria-describedby"),
                    selector = "label[for='" + name + "'], label[for='" + name + "'] *";
                // aria-describedby should directly reference the error element
                if (describer) {
                    selector = selector + ", #" + describer.replace(/\s+/g, ", #");
                }
                return this
                    .errors()
                    .filter(selector);
            },

            idOrName: function (element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },

            validationTargetFor: function (element) {
                // if radio/checkbox, validate first element in group instead
                if (this.checkable(element)) {
                    element = this.findByName(element.name).not(this.settings.ignore)[0];
                }
                return element;
            },

            checkable: function (element) {
                return (/radio|checkbox/i).test(element.type);
            },

            findByName: function (name) {
                return $(this.currentForm).find("[name='" + name + "']");
            },

            getLength: function (value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },

            depend: function (param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },

            dependTypes: {
                "boolean": function (param) {
                    return param;
                },
                "string": function (param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function (param, element) {
                    return param(element);
                }
            },

            optional: function (element) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },

            startRequest: function (element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },

            stopRequest: function (element, valid) {
                this.pendingRequest--;
                // sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0) {
                    this.pendingRequest = 0;
                }
                delete this.pending[element.name];
                if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },

            previousValue: function (element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, "remote")
                });
            }

        },

        classRuleSettings: {
            required: { required: true },
            email: { email: true },
            url: { url: true },
            date: { date: true },
            dateISO: { dateISO: true },
            number: { number: true },
            digits: { digits: true },
            creditcard: { creditcard: true }
        },

        addClassRules: function (className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[className] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },

        classRules: function (element) {
            var rules = {},
                classes = $(element).attr("class");

            if (classes) {
                $.each(classes.split(" "), function () {
                    if (this in $.validator.classRuleSettings) {
                        $.extend(rules, $.validator.classRuleSettings[this]);
                    }
                });
            }
            return rules;
        },

        attributeRules: function (element) {
            var rules = {},
                $element = $(element),
                type = element.getAttribute("type"),
                method, value;

            for (method in $.validator.methods) {

                // support for <input required> in both html5 and older browsers
                if (method === "required") {
                    value = element.getAttribute(method);
                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if (value === "") {
                        value = true;
                    }
                    // force non-HTML5 browsers to return bool
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }

                // convert the value to a number for number inputs, and for text for backwards compability
                // allows type="date" and others to be compared as strings
                if (/min|max/.test(method) && (type === null || /number|range|text/.test(type))) {
                    value = Number(value);
                }

                if (value || value === 0) {
                    rules[method] = value;
                } else if (type === method && type !== "range") {
                    // exception: the jquery validate 'range' method
                    // does not test for the html5 'range' type
                    rules[method] = true;
                }
            }

            // maxlength may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }

            return rules;
        },

        dataRules: function (element) {
            var method, value,
                rules = {}, $element = $(element);
            for (method in $.validator.methods) {
                value = $element.data("rule" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase());
                if (value !== undefined) {
                    rules[method] = value;
                }
            }
            return rules;
        },

        staticRules: function (element) {
            var rules = {},
                validator = $.data(element.form, "validator");

            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },

        normalizeRules: function (rules, element) {
            // handle dependency check
            $.each(rules, function (prop, val) {
                // ignore rule when param is explicitly false, eg. required:false
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });

            // evaluate parameters
            $.each(rules, function (rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });

            // clean number parameters
            $.each(["minlength", "maxlength"], function () {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(["rangelength", "range"], function () {
                var parts;
                if (rules[this]) {
                    if ($.isArray(rules[this])) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    } else if (typeof rules[this] === "string") {
                        parts = rules[this].replace(/[\[\]]/g, "").split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });

            if ($.validator.autoCreateRanges) {
                // auto-create ranges
                if (rules.min && rules.max) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength && rules.maxlength) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }

            return rules;
        },

        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function (data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function () {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },

        // http://jqueryvalidation.org/jQuery.validator.addMethod/
        addMethod: function (name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },

        methods: {

            // http://jqueryvalidation.org/required-method/
            required: function (value, element, param) {
                // check if dependency is met
                if (!this.depend(param, element)) {
                    return "dependency-mismatch";
                }
                if (element.nodeName.toLowerCase() === "select") {
                    // could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return $.trim(value).length > 0;
            },

            // http://jqueryvalidation.org/email-method/
            email: function (value, element) {
                // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
                // Retrieved 2014-01-14
                // If you have a problem with this implementation, report a bug against the above spec
                // Or use custom methods to implement your own email validation
                return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },

            // http://jqueryvalidation.org/url-method/
            url: function (value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },

            // http://jqueryvalidation.org/date-method/
            date: function (value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },

            // http://jqueryvalidation.org/dateISO-method/
            dateISO: function (value, element) {
                return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
            },

            // http://jqueryvalidation.org/number-method/
            number: function (value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },

            // http://jqueryvalidation.org/digits-method/
            digits: function (value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },

            // http://jqueryvalidation.org/creditcard-method/
            // based on http://en.wikipedia.org/wiki/Luhn/
            creditcard: function (value, element) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }
                // accept only spaces, digits and dashes
                if (/[^0-9 \-]+/.test(value)) {
                    return false;
                }
                var nCheck = 0,
                    nDigit = 0,
                    bEven = false,
                    n, cDigit;

                value = value.replace(/\D/g, "");

                // Basing min and max length on
                // http://developer.ean.com/general_info/Valid_Credit_Card_Types
                if (value.length < 13 || value.length > 19) {
                    return false;
                }

                for (n = value.length - 1; n >= 0; n--) {
                    cDigit = value.charAt(n);
                    nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9) {
                            nDigit -= 9;
                        }
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }

                return (nCheck % 10) === 0;
            },

            // http://jqueryvalidation.org/minlength-method/
            minlength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length >= param;
            },

            // http://jqueryvalidation.org/maxlength-method/
            maxlength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length <= param;
            },

            // http://jqueryvalidation.org/rangelength-method/
            rangelength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },

            // http://jqueryvalidation.org/min-method/
            min: function (value, element, param) {
                return this.optional(element) || value >= param;
            },

            // http://jqueryvalidation.org/max-method/
            max: function (value, element, param) {
                return this.optional(element) || value <= param;
            },

            // http://jqueryvalidation.org/range-method/
            range: function (value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },

            // http://jqueryvalidation.org/equalTo-method/
            equalTo: function (value, element, param) {
                // bind to the blur event of the target in order to revalidate whenever the target field is updated
                // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
                var target = $(param);
                if (this.settings.onfocusout) {
                    target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },

            // http://jqueryvalidation.org/remote-method/
            remote: function (value, element, param) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }

                var previous = this.previousValue(element),
                    validator, data;

                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;

                param = typeof param === "string" && { url: param } || param;

                if (previous.old === value) {
                    return previous.valid;
                }

                previous.old = value;
                validator = this;
                this.startRequest(element);
                data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    url: param,
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    context: validator.currentForm,
                    success: function (response) {
                        var valid = response === true || response === "true",
                            errors, message, submitted;

                        validator.settings.messages[element.name].remote = previous.originalMessage;
                        if (valid) {
                            submitted = validator.formSubmitted;
                            validator.prepareElement(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            delete validator.invalid[element.name];
                            validator.showErrors();
                        } else {
                            errors = {};
                            message = response || validator.defaultMessage(element, "remote");
                            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                            validator.invalid[element.name] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            }

        }

    });

    $.format = function deprecated() {
        throw "$.format has been deprecated. Please use $.validator.format instead.";
    };

    // ajax mode: abort
    // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
    // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

    var pendingRequests = {},
        ajax;
    // Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function (settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        ajax = $.ajax;
        $.ajax = function (settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
                port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = ajax.apply(this, arguments);
                return pendingRequests[port];
            }
            return ajax.apply(this, arguments);
        };
    }

    // provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
    // handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target

    $.extend($.fn, {
        validateDelegate: function (delegate, type, handler) {
            return this.bind(type, function (event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });

}));