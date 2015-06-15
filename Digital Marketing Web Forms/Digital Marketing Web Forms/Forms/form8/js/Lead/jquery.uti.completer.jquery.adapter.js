/**
 * @author : Ryan Divis <rdivis@solutionstream.com>, 2013
 * jQuery Adapter Settings for UTI Completer (typahead or autocompleter)
 *
 * Each function extended to the prototype will allow us to override base functionality
 * and adapt the completer to any javascript library. The main functions that should be
 * overridden are 'setup' and 'formatData'
 *
 * @function getResults : overriding this functionality because jQuery UI will load
 * every result set 1 behind the current query if the 'response' callback is not
 * called after success in the ajax call
 * 
 */
$.extend($.Ahead.prototype,{
        setup : function(){
                var self = this;
                this.ahead()
                        .autocomplete({
                source : $.proxy(self.getResults,self),
                select : function(event,ui){
                    ui.item = self.map[ui.item.label];
                    var func = $.proxy(self.onSelect,self,event,ui);
                    func();
                    return false;
                },
                //state: self.options.state,
                //city: self.options.city,
                minLength : self.options.minLength
            });
        },
        getResults : function(request,response){
            if(!request) return false;
            var self = this;

            //handle ajax request
            url = this.options.source;

            getData = { startofname: request.term };

            if (self.options.data === false)
            {
                url = url + "/" + request.term;
                getData = false;
            }
            $.ajax({
                    url : url,
                    type : 'get',
                    data : getData,
                    dateType : 'json',
                    success : function(data)
                    {
                            response(self.formatData(data));
                    }
            });
        }
});