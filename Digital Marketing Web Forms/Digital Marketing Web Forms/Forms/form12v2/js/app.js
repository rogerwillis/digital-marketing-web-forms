var $country = $("#country"),
    $state = $("#state"),
    $zipCode = $("input[name=zip]"),
    $city = $('#city'),
    $milState = $("#military-states"),
    $militaryStates = $('#military-states'),
    $milInstallations = $("#military-installation"),
    milPathActivated = null,
    eduPathActivated = null,
    isMil = null,
    age = $('#age');

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


        $("#firstName").val('Roger');
        $("#lastName").val('Willis');
        $("#age").val('21');
        $("#phone").val('602-315-4874');
        $("#email, #email2").val('roger@rogerwillis.com');
        // $("#zipCodePre, #zipCode").val('85027');
        $("#txtCity").val('Phoenix');
        $("#ddlStatePre").val('AZ');

        //Placeholders
        $('#phone').mask('(999) 999-9999', { placeholder: 'x' });
        $('#hs-grad-date,#mil-separation-date').mask('99/99/9999', { placeholder: 'x' });
        $('#zipCode, #zipCodePre').mask('99999', { placeholder: 'x' });
    }
};

var steps = {
    init: function () {

        $("#demoForm").formwizard({
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
        $("#demoForm").formwizard("update_steps");
    },
    enableAsSubmitStep: function (id) {
        $("div").find(".submit_step").removeClass('submit_step');
        $('#' + id).addClass('submit_step');
    }
}

var address = {
    zipCodeComplete: function () {
        $('#zipCodePre').zipCompleter({
            'afterUpdate': function () {
                console.log('update 1st zip');
                $("#zipCode").val($("#zipCodePre").val());
            }
        });
        $('#zipCode').zipCompleter({
            'afterUpdate': function () {
                console.log('update pre zip');
                $('#zipCodPre').val($('#zipCode').val());
            }
        });
    },
    getCountries: function () {

        $country.countries();
        this.countryChange();

    },
    countryChange: function () {

        $country.change(function () {
            if ($country.val() != 'US') {
                console.log('Not US');
            } else {
                console.log('US');
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
}

var education = {
    educationCheck: function () { },
    showEduPath: function () {
        eduPathActivated = true;
        $("#rbMilitaryNo").val("education");
        steps.enableAsSubmitStep('education');
        steps.updateSteps();
    },
    hideEduPath: function () {
        steps.enableAsSubmitStep('military-education');
        steps.updateSteps();
    },
    getStates: function () {

    },
    clearEducationFields: function () {
    }
}

var military = {
    militaryCheck: function () {
        var self = this;
        $("input:radio[name=military], #age").change(function () {
            if ($('form input[type=radio][name=military]:checked').attr('rel') == 'Yes') { self.showMilitaryPath(); }

                //NO MILITARY AND AGE < 20
            else if (age.val() < 19) {
                //TAKE EDUCATION PATH

                education.showEduPath();
                self.hideMilitaryPath();

                if (milPathActivated == true) {
                    military.clearMilitaryFields();
                }
            }



                //NO MILITARY AND AGE > 20
            else if (age.val() > 19) {
                //SUBMIT NOW!

                self.hideMilitaryPath();
                military.clearMilitaryFields();
                education.hideEduPath();

                if (eduPathActivated == true || milPathActivated == true) {
                    military.clearMilitaryFields();
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
    hideMilitaryPath: function () {
        console.log('hidemilpath');
    },
    getStates: function () {
        $militaryStates.highschoolstates();
        this.militaryStateChange();
    },
    militaryStateChange: function () {
        var self = this;

        $milState.change(function () {
            if(!$('.container-installation-not-listed').hasClass('hidden'))
            {
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
            $('#hs-not-listed').val('');


        } else {

            $('.container-installation-not-listed').addClass('hidden');
            $('#hs-not-listed').val('');
        }
    },
    clearMilitaryFields: function () {
        $milInstallations.militarybases('clearlist');
        $militaryStates.highschoolstates('clearlist');
        $('.container-installation-not-listed').val('');
    }

}

//Fire Stuff!
pageLoad.init();
pageLoad.prePopulate();