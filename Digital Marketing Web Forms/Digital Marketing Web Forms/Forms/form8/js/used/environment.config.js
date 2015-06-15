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