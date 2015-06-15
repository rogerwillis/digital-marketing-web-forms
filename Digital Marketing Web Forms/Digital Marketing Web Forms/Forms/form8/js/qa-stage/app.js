/// Functions


var copyrightDate = function () {
    //set copyright year dynamically
    var d = new Date();
    var year = d.getFullYear();
    $(".year").text(year);

}

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

var digitFormat = function () {
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

var setMaxFieldLengths = function () {
    $('#firstName, #lastName, #email, #txtAddress, #txtCity, #txtHighSchoolNotListed, #txtInstallationNotListed').attr('maxlength', '100');
    $('#postalCodePre, #postalCode').attr('maxlength', '10');
    $('#zipCodePre, #zipCode').attr('maxlength', '5');
};

var autoTabbing = function () {
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

    //Form Widget Plugin Options
    var uiForm;

    uiForm = $('form').uiForm({

        // url: activeEnvironment.active + '/api/leads',
        posted: function (evt) {

            var host = "http://" + window.location.host;

            window.location.replace(host + "/forms/form8/thankyou/");
            //window.location.replace("thankyou.html");

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
        var dobDay = $("select[name='dob[Day]']").val();;
        var dobYear = $("select[name='dob[Year]']").val();;

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

    //Form Wizard
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
            focusFirstInput: true,
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
    //Form Wizard Progress
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
        if ($(this).val() === "US") { showUsFields(); } else { showNonUsFields(); }
    });


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