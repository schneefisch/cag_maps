//function Load(){
//    var loc = "HTML/Karte.html";
//    document.getElementById('iframe').setAttribute('src', loc);
//}
//
//function Load1(){
//    var loc1 = "HTML/Liste.html";
//    document.getElementById('iframe').setAttribute('src', loc1);
//}
//
//function Load2(){
//    var loc2 = "HTML/Developers.html";
//    document.getElementById('iframe').setAttribute('src', loc2);
//}

// -------------------------


function initializeNavigation() {
    // listen to button-click

    // finde das <div id="include_content"> in welches die Inhalte eingefuegt werden sollen
    var target = $("#include_content");

    // Home-button
    $("#nav_home").click(function() {
        target.empty();
    });

    // Steine Button
    $("#nav_stones").click(function() {
        target.empty();
        target.load("HTML/Liste.html");
    });

    // Entwickler Button
    $("#nav_developers").click(function() {
        target.empty();
        target.load("HTML/Developers.html");
    });

    // Impressum Button
    $("#nav_impressum").click(function() {
        target.empty();
        target.load("HTML/impressum.html");
    });
    }