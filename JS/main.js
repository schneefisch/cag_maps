// -------------------------
var target;

function removeAllOtherActive() {
    // todo
}

function loadPage(pageName, event) {
    target.empty();
    target.load(pageName);
    $("#bs-navbar").collapse('hide');
    removeAllOtherActive();
    $(event.target).addClass('active');
}

function initializeNavigation() {
    // listen to button-click

    // finde das <div id="include_content"> in welches die Inhalte eingefuegt werden sollen
    target = $("#include_content");
    target.load("HTML/map.html");

    // Home-button
    $("#nav_home").click(function(event) {
        loadPage("HTML/map.html", event);
    });

    // Steine Button
    $("#nav_stones").click(function(event) {
        loadPage("HTML/Liste.html", event);
    });

    // Entwickler Button
    $("#nav_developers").click(function(event) {
        loadPage("HTML/Developers.html", event);
    });

    // Impressum Button
    $(".nav_impressum").click(function(event) {
        loadPage("HTML/impressum.html", event);
    });

    // Kontakt Button
    $(".nav_referenz").click(function(event) {
        loadPage("HTML/datenschutz.html", event);
    });
}