$(function () {

    var flame = $('#flame');
    var txt = $('#wish');
    var txt2 = $('#wish1');
    var myCanvas = $('#myCanvas');
    var txt1 = document.getElementById("wish1");
    // var username = $('#username')

    flame.on({
        click: function () {
            flame.removeClass('burn').addClass('puff');
            $('.smoke').each(function () {
                $(this).addClass('puff-bubble');
            });
            $('#glow').remove();
            txt.show().html("It <b>will</b> come true...").fadeOut(2000);
            $('#candle').animate({
                'opacity': '.5'
            }, 100);
            document.getElementById("can").style.display = "block";
            document.getElementById('candle').style.display = "none";
            txt2.fadeIn(3500);
            // myCanvas.fadeIn(3500);
        }
    })

});
