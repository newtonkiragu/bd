$(function () {

    var flame = $('#flame');
    var txt = $('h1');

    flame.on({
        click: function () {
            flame.removeClass('burn').addClass('puff');
            console.log("off")
            $('.smoke').each(function () {
                $(this).addClass('puff-bubble');
            });
            console.log("smoking cold")
            $('#glow').remove();
            console.log("and after light, came darkness")
            txt.show().html("It <b>will</b> come true..").delay(750).fadeOut(500);
            console.log("have faith")
            $('#candle').animate({
                'opacity': '.5'
            }, 100);
        }
    })

});