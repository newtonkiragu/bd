$(function () {

    var flame = $('#flame');
    var txt = $('#wish');
    // var username = $('#username')

    flame.on({
        click: function () {
            flame.removeClass('burn').addClass('puff');
            console.log("off");
            $('.smoke').each(function () {
                $(this).addClass('puff-bubble');
            });
            console.log("smoking cold");
            $('#glow').remove();
            console.log("and after light, came darkness")
            txt.show().html("It <b>will</b> come true...").delay(750).fadeOut(750);
            console.log(txt);
            console.log("have faith");
            $('#candle').animate({
                'opacity': '.5'
            }, 100);
            // username.show().html("Happy Birthday " + name);
            // console.log(username);
            document.getElementById("myCanvas").style.display = "block";
            document.getElementById('candle').style.display = "none";
        }
    })

});