/**
 * @author : Ryan Divis <rdivis@solutionstream.com>, 2013
 * Bootstrap Adapter Settings for UTI Completer (typahead or autocompleter)
 *
 * Each function extended to the prototype will allow us to override base functionality
 * and adapt the completer to any javascript library. The main functions that should be
 * overridden are 'setup' and 'formatData'
 * 
 */
$.extend($.Ahead.prototype,{
	setup : function(){
		var self = this;
		this.ahead()
			.typeahead({
                source : function(query,process){
                	process(self.getResults(query));
                },
                updater : function(item){
                	var ui = [];
                	ui['item'] = self.map[item];
                	self.onSelect(ui);
                	return ui.item.label;
                },
                minLength : self.options.minLength
            });  
	}
});