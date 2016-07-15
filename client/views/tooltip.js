Template.tooltip.events({
	"mouseenter #tooltip-icon": function(event, template){
		event.target.parentElement.children[1].className = "show";
	},

	"mouseleave #tooltip-icon": function(event, template){
		event.target.parentElement.children[1].className = "";
	},
});