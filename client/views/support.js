Template.support.events({
    "submit .bug": function (event) {
        var title = event.target.title.value;
        if (title == "") {
            alert("please specify a title. ");
            return;
        }
        var desc = event.target.description.value;
        Meteor.call("submit_bug", title, desc,
            function (e, result) {document.location.href = "/";}
        );
        alert("Bug Submitted!");
        
    }
});