var $country = $("#country"),
    isUS = true,
    $state = $("#state"),
    $zipCode = $("input[name=zip]"),
    $city = $('#city'),
    $milState = $("#military-states"),
    $militaryStates = $('#military-states'),
    $milInstallations = $("#military-installation"),
    milPathActivated = null,
    eduPathActivated = null,
    gedActivated = null,
    $eduEducationLevel = $('#ddlEducation'),
    $eduHSGradDate = $('#hs-grad-date'),
    $eduHSNotListed = $('#hs-not-listed,#chkNoHighSchoolAttended');
    $eduHSState = $('#hs-state'),
    $eduHSCity = $('#hs-city'),
    $eduHSName = $('#high-school-name'),
    isMil = null,
    age = $('#age');


    var uiValidate = function () {

        //VALIDATION INIT ---------------------------------------w---------

        var $validator = $("#utiForm").validate({
            //'onkeyup': false,
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
                txtInstallationNotListed: {
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

    var pageLoad = {
        init: function () {
            steps.init();
      
            this.prePopulate();
            military.militaryCheck();
        },
        prePopulate: function () {
            address.getStates();
            address.zipCodeComplete();
            address.getCountries();


            //$("#firstName").val('Roger');
            //$("#lastName").val('Willis');
            //$("#age").val('12');
            //$("#phone").val('602-315-4874');
            //$("#email, #email2").val('roger@rogerwillis.com');
            // $("#zipCodePre, #zipCode").val('85027');
            //$("#txtCity").val('Phoenix');
            //$("#ddlStatePre").val('AZ');

            //Placeholders
            $('#phone').mask('(999) 999-9999', {
                placeholder: 'x'
            });
            $('#age').mask('99', {
                placeholder: 'x'
            });

            $('#mil-separation-date,#hs-grad-date').mask('99/9999', {
                placeholder: 'mm/yyyy'
            });
            $('#zipCode, #zipCodePre').mask('99999', {
                placeholder: 'x'
            });

        }
    };

    var steps = {
        init: function () {
            console.log('IS US ==' + isUS);
            $("#utiForm").formwizard({
                formPluginEnabled: true,
                validationEnabled: true,
                disableUIStyles: true,
                focusFirstInput: true,
                formOptions: {
                    success: function (data) { alert('test submit...'); },
                    beforeSubmit: function (data) { $("#data").html("data sent to the server: " + $.param(data)); },
                    dataType: 'json',
                    resetForm: true
                }
            }
            );


        },
        updateSteps: function () {
            $("#utiForm").formwizard("update_steps");
        },
        enableAsSubmitStep: function (id) {
            $("div").find(".submit_step").removeClass('submit_step');
            $('#' + id).addClass('submit_step');
        }
};

    var address = {
        zipCodeComplete: function () {
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
        },
        getCountries: function () {

            $country.countries();
            this.countryChange();

        },
        toggleCountry: function () {
            var self = this;
            if (isUS == false) {

                self.postalCodeChange();
                $('.zip-label').text('Postal Code');
                $('.state-region-label').text('Region');
                $('#zipCode, #zipCodePre, #state').addClass('hidden').val('');
                $('#city').val('');
                $('#postalCode,#postalCodePre, #region').removeClass('hidden');


            } else {
                $('.zip-label').text('Zip Code');
                $('.state-region-label').text('State:');
                $('#zipCode, #zipCodePre, #state').removeClass('hidden');
                $('#city').val('');
                $('#postalCode,#postalCodePre, #region').addClass('hidden').val('');

            }

        },
        postalCodeChange: function () {


            //On Postal Code Change
            $("#postalCodePre").change(function () {

                $("#postalCode").val($(this).val());

            });
            $("#postalCode").change(function () {

                $("#postalCodePre").val($(this).val());

            });

        },
        countryChange: function () {
            var self = this;
            $country.change(function () {
                if ($country.val() != 'US') {
                    isUS = false;
                    self.toggleCountry();
                    education.clearAllFields();
                    education.hideEduPath();
                    console.log('IS US ==' + isUS);
                } else {
                    isUS = true;
                    self.toggleCountry();
                    console.log('IS US ==' + isUS);
                }

            });

        },
        getStates: function () {
            $('#state').highschoolstates();
            this.stateChange();
        },
        stateChange: function () {
            $state.change(function () {
                $zipCode.val('');
            });
        },
        cityChange: function () {

        },
        clear: function () {

        }
    };


var education = {
    gradTypeChange: function() {
        var self = this;
        $eduEducationLevel.change(function() {

            if ($eduEducationLevel.val() != '') {
                if (gedActivated == true) {
                    education.clearNeverAttendedHS();
                    if ($('.if-ged').hasClass('hidden')) {
                        $('.if-ged').removeClass('hidden');
                    }
                }

                if ($eduEducationLevel.val() != 'Home School' && $eduEducationLevel.val() != 'No Equivalent') {

                    $('.container-education').removeClass('hidden');

                    self.gedCheck();

                } else if ($eduEducationLevel.val() == 'Home School' || $eduEducationLevel.val() == 'No Equivalent') {
                    $('.container-education').addClass('hidden');
                } else {
                    self.clearAllFields();
                    $('.container-education').addClass('hidden');
                }



            }

        });
        this.eduStateChange();

    },
    showEduPath: function() {
        eduPathActivated = true;
        $eduHSState.highschoolstates();
        $eduHSCity.highschoolcity();
        $eduHSName.highschoolnames();
        $("#rbMilitaryNo").val("education");
        steps.enableAsSubmitStep('education');
        steps.updateSteps();
        this.gradTypeChange();
    },
    hideEduPath: function() {
        steps.enableAsSubmitStep('personal-info');
        steps.updateSteps();
    },
    getStates: function() {
        $('#hs-state').highschoolstates();
        this.eduStateChange();
    },
    eduStateChange: function() {
        var self = this;

        $eduHSState.change(function() {
            if ($eduHSState.val() != '') {
                $eduHSName.highschoolnames('clearlist');
                $('#hs-not-listed').val('');
                $('.container-hs-not-listed').addClass('hidden');
                $eduHSCity.highschoolcity('lookup', $eduHSState.val());
                self.eduHSCityChange();

            } else {
                console.log('clear edu fields');
                self.clearAllFields();
            }

            //else if ($(this).val() == 0) {

            //    console.log('display hs not listed box');
            //}

        });

    },
    eduHSCityChange: function() {
        var self = this;
        $eduHSCity.change(function() {


            if ($eduHSCity.val() != '' || $eduHSCity.val() != 0) {

                $eduHSName.highschoolnames('lookup', $eduHSState.val(), $eduHSCity.val());
                self.eduHSNameChange();
            }

        });

    },
    eduHSNameChange: function() {
        var self = this;
        $eduHSName.change(function() {
            if ($eduHSName.val() != '' || $eduHSName.val() != 0) {
                self.hsNotListedCheck();
            }
        });
    },
    hsNotListedCheck: function() {
        if ($eduHSName.val() == 0) {

            $('.container-hs-not-listed').removeClass('hidden');
            $('#hs-not-listed').val('');


        } else {

            $('.container-hs-not-listed').addClass('hidden');
            $('#hs-not-listed').val('');
        }
    },
    gedCheck: function() {
        var self = this;

        if ($eduEducationLevel.val() == 'GED') {
            gedActivated = true;
            $('.container-hs-never-attended').removeClass('hidden');
            self.neverAttendedHSChange();

        } else {
            $('.container-hs-never-attended').addClass('hidden');
        }

    },
    neverAttendedHSChange: function() {
        var self = this;
        $('#chkNoHighSchoolAttended').change(
            function() {

                self.enableDisableGEDFields();

            });
    },
    enableDisableGEDFields: function() {
        var self = this;

        if ($('#chkNoHighSchoolAttended').prop('checked')) {
            $('.if-ged').addClass('hidden');
            $eduHSState.highschoolstates('clearlist').attr('disabled', true);
            $eduHSCity.highschoolcity('clearlist').attr('disabled', true);
            $eduHSName.highschoolnames('clearlist').attr('disabled', true);
            $('.container-hs-not-listed').addClass('hidden');
            $('#hs-not-listed').val('');
            $eduHSGradDate.val('').attr('disabled', true);
        } else {
            self.getStates();
            $eduHSState.highschoolstates('clearlist').attr('disabled', false);
            $eduHSCity.highschoolcity('clearlist').attr('disabled', false);
            $eduHSName.highschoolnames('clearlist').attr('disabled', false);
            $('.container-hs-not-listed').removeClass('hidden');

            $eduHSGradDate.val('').attr('disabled', false);
            $('.if-ged').removeClass('hidden');
        }
    },
    clearNeverAttendedHS: function() {
        $('#chkNoHighSchoolAttended').prop('checked', false);
        this.enableDisableGEDFields();
    },
    clearGradDate: function () {
        if (eduPathActivated == true) {
            $eduHSGradDate.val('');
        }
    },
    clearState: function () {
        if (eduPathActivated == true) {

            $eduHSState.val('');
        }
    },
    clearCity: function () {
        if (eduPathActivated == true) {
            $eduHSCity.highschoolcity('clearlist');
        }
    },
    clearHSName: function () {
        if (eduPathActivated == true) {
            $eduHSName.highschoolnames('clearlist');
        }
    },
    clearHSNotListed: function () {
        if (eduPathActivated == true) {
            $eduHSNotListed.val('');
        }
    },
    clearAllFields: function () {
        var self = this;
        if (eduPathActivated == true) {
            $('.container-education,.container-hs-not-listed').addClass('hidden');
            self.clearGradDate();
            self.clearState();
            self.clearCity();
            self.clearHSName();
            self.clearHSNotListed();
        }
    }
};

var military = {
    militaryCheck: function () {

        var self = this;
        $("input:radio[name=military], #age").change(function () {
            if ($('form input[type=radio][name=military]:checked').attr('rel') == 'Yes') { self.showMilitaryPath(); }

                //NO MILITARY AND AGE < 20
            else if (age.val() < 19) {
                //TAKE EDUCATION PATH
                //isMil = false;

                if (isUS == true) {
                    education.showEduPath();

                    if (milPathActivated == true) {
                        military.clearMilitaryFields();
                    }

                    if (eduPathActivated == true) {
                        education.clearAllFields();
                    }
                } else {

                    console.log('IS US ==' + isUS);
                    steps.enableAsSubmitStep('personal-info');
                    steps.updateSteps();

                }

            }



                //NO MILITARY AND AGE > 20
            else if (age.val() > 19) {
                //SUBMIT NOW!
                //isMil = false;

                if (isUS == true) {

                    education.hideEduPath();
                    if (eduPathActivated == true || milPathActivated == true) {

                        military.clearMilitaryFields();
                    }

                    if (eduPathActivated == true) {
                        education.clearAllFields();
                    }
                }

                else {

                    console.log('IS US ==' + isUS);
                    steps.enableAsSubmitStep('personal-info');
                    steps.updateSteps();

                }


            }
        });

    },
    showMilitaryPath: function () {
        milPathActivated = true;
        $("#rbMilitaryYes").val("military");
        steps.enableAsSubmitStep('military');
        steps.updateSteps();
        this.getStates();

    },
    getStates: function () {
        $militaryStates.highschoolstates();
        this.militaryStateChange();
    },
    militaryStateChange: function () {
        var self = this;

        $milState.change(function () {
            if (!$('.container-installation-not-listed').hasClass('hidden')) {
                $('.container-installation-not-listed').addClass('hidden');
            }


            if ($milState.val() != 0) {

                self.getMilitaryInstallations();


            } else {
                $milInstallations.militarybases('clearlist');
            }


        });


    },
    getMilitaryInstallations: function () {
        $milInstallations.militarybases();
        $milInstallations.militarybases('lookupByState', $milState.val());
        this.militaryInstallationChange();

    },
    militaryInstallationChange: function () {
        var self = this;
        $milInstallations.change(function () {
            self.baseListedCheck();
        });

    },
    baseListedCheck: function () {
        if ($milInstallations.val() == 0) {

            $('.container-installation-not-listed').removeClass('hidden');
            $('#mil-not-listed').val('');


        } else {

            $('.container-installation-not-listed').addClass('hidden');
            $('#mil-not-listed').val('');
        }
    },
    clearMilitaryFields: function () {
        if (milPathActivated == true && $militaryStates.val() != "") {
            $milInstallations.militarybases('clearlist');
            $militaryStates.highschoolstates('clearlist');
            $('#mil-separation-date,#hs-not-listed,.container-installation-not-listed, #mil-not-listed,#mil-separation-date').val('');
        }
    }

}



//Fire Stuff!
uiValidate();
pageLoad.init();
pageLoad.prePopulate();
