(function($) {

    var uti = {
      edu: {
          leads : {}
      }
    };


    (function() {

        this.MOCK_ADAPTER = 0;
        this.HIGHSCHOOL_ADAPTER = 1;
        this.MILITARY_ADAPTER = 2;

        this.AdapterFactory =  {
            getAdapter : function(adapter) {
                switch (adapter) {
                    case uti.edu.leads.MOCK_ADAPTER:
                        return uti.edu.leads.MockAdapter;
                    case uti.edu.leads.HIGHSCHOOL_ADAPTER:
                        return uti.edu.leads.HighSchoolAdapter;
                    case uti.edu.leads.MILITARY_ADAPTER:
                        return uti.edu.leads.MilitaryAdapter;
                    default:
                        return uti.edu.leads.MockAdapter;
                }
            }
        };

        this.MockAdapter = {

        };

        this.HighSchoolAdapter = {

        };

        this.MilitaryAdapter = {

        };

    }).apply(uti.edu.leads);

})(jQuery);
