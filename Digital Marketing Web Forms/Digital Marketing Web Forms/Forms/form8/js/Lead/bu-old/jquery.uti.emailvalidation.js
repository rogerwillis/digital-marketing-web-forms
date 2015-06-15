/// <reference path="../../_view-references.js" />
/// <reference path="~/Scripts/jquery-1.10.1.intellisense.js" />
/**
 * @author : sroberts
 * UTI email validation.
 */
(function ($, undefined) {

    $.widget('uti.emailValidation', {

        //name: 'email_validator',
        options: {
            source: '/api/returnemails',
            title: 'Email Error',
            workingIndicator: '.workingIndicator',
            emailInput: '#email'
        },
        _create: function () {

            // this.validate();

        },
        _setOption: function (key, value) {

            this._super(key, value);
        },

        _setOptions: function (options) {
            this._super(options);
            this.validate();
        },

        validate: function () {
            var validator = this;
            $.ajax({
                type: 'get',
                url: this.options.source,
                data: { email: $(this.options.emailInput).val() },
                dataType: 'json',
                async: true,
                beforeSend: function () {
                    if ($(validator.options.workingIrndicator).length > 0) {
                        $(validator.options.workingIndicator).show();
                    };
                },

                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus); alert("Error: " + errorThrown);
                    console.log("hit error");
                },


                success: function (data) {
                    data = data[0];
                    validator.result = data;
                    validator.valid = data.Ok;
                    var prospectName = $("#firstName").val();
                    var modalOk = ' <div class="modal-footer" style="text-align:center;"><button type="button" class="btn btn-danger btn-lg" data-dismiss="modal">Close</button></div>';

                   
                    var addModal = function () {
                        $(".modal-info").text(prospectName + "," + validator.result.StatusDesc + ".");
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

                    //Check Status Codes... refactor this... 
                    //if (validator.result.StatusCode == "115" || validator.result.StatusCode == "145" || validator.result.StatusCode == "150" ||
                    //    validator.result.StatusCode == "200" || validator.result.StatusCode == "325" || validator.result.StatusCode == "400" || validator.result.StatusCode == "500") {
                    //    addModal();
                    //}
                    if (validator.result.StatusCode != "50" || validator.result.StatusCode != "45") {
                        addModal();
                    }
               

                }
            });
        },
        //afterValidate: function () {

        //    if (!this.valid) {
        //        this.element.addClass('error');

        //        $(".validation-response").text(this.result.StatusDesc).show();
        //    }
        //}

    });

}(jQuery));
