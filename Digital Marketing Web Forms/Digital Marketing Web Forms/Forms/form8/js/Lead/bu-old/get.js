$(function () {
    $("#getLeads").click(function () {
        // We're using a Knockout model. This clears out the existing comments.
        viewModel.leads([]);

        $.get('/api/leads', function (data) {
            // Update the Knockout model (and thus the UI) with the comments received back 
            // from the Web API call.
            viewModel.leads(data);
        });

    });
});