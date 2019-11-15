const c = document.getElementById("myCanvas");
let w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext('2d'),

    hw = w / 2, // half-width
    hh = h / 2,

    opts = {
        strings: ['HAPPY', 'BIRTHDAY!', name],
        charSize: 30,
        charSpacing: 35,
        lineHeight: 40,

        cx: w / 2,
        cy: h / 2,

        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 5,
        fireworkAddedLineWidth: 8,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 5,
        fireworkAddedShards: 5,
        fireworkShardPrevPoints: 3,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: .1,
        upFlow: -.1,
        letterContemplatingWaitTime: 360,
        balloonSpawnTime: 20,
        balloonBaseInflateTime: 10,
        balloonAddedInflateTime: 10,
        balloonBaseSize: 20,
        balloonAddedSize: 20,
        balloonBaseVel: .4,
        balloonAddedVel: .4,
        balloonBaseRadian: -(Math.PI / 2 - .5),
        balloonAddedRadian: -1,
    },
    calc = {
        totalWidth: opts.charSpacing * Math.max(opts.strings[0].length, opts.strings[1].length)
    },

    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,

    letters = [];
let center_x = w / 2;
let center_y = h / 2;
const TwoPI = Math.PI * 2;


ctx.font = opts.charSize + 'px Verdana';

function Letter( char, x, y ){
    this.char = char;
    this.x = x;
    this.y = y;

    this.dx = -ctx.measureText( char ).width / 2;
    this.dy = +opts.charSize / 2;

    this.fireworkDy = this.y - hh;

    var hue = x / calc.totalWidth * 360;

    this.color = 'hsl(hue,80%,50%)'.replace( 'hue', hue );
    this.lightAlphaColor = 'hsla(hue,80%,light%,alp)'.replace( 'hue', hue );
    this.lightColor = 'hsl(hue,80%,light%)'.replace( 'hue', hue );
    this.alphaColor = 'hsla(hue,80%,50%,alp)'.replace( 'hue', hue );

    this.reset();
}
Letter.prototype.reset = function(){

    this.phase = 'firework';
    this.tick = 0;
    this.spawned = false;
    this.spawningTime = opts.fireworkSpawnTime * Math.random() |0;
    this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() |0;
    this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
    this.prevPoints = [ [ 0, hh, 0 ] ];
};
Letter.prototype.step = function(){

    if( this.phase === 'firework' ){

        if( !this.spawned ){

            ++this.tick;
            if( this.tick >= this.spawningTime ){

                this.tick = 0;
                this.spawned = true;
            }

        } else {

            ++this.tick;

            var linearProportion = this.tick / this.reachTime,
                armonicProportion = Math.sin( linearProportion * TauQuarter ),

                x = linearProportion * this.x,
                y = hh + armonicProportion * this.fireworkDy;

            if( this.prevPoints.length > opts.fireworkPrevPoints )
                this.prevPoints.shift();

            this.prevPoints.push( [ x, y, linearProportion * this.lineWidth ] );

            var lineWidthProportion = 1 / ( this.prevPoints.length - 1 );

            for( var i = 1; i < this.prevPoints.length; ++i ){

                var point = this.prevPoints[ i ],
                    point2 = this.prevPoints[ i - 1 ];

                ctx.strokeStyle = this.alphaColor.replace( 'alp', i / this.prevPoints.length );
                ctx.lineWidth = point[ 2 ] * lineWidthProportion * i;
                ctx.beginPath();
                ctx.moveTo( point[ 0 ], point[ 1 ] );
                ctx.lineTo( point2[ 0 ], point2[ 1 ] );
                ctx.stroke();

            }

            if( this.tick >= this.reachTime ){

                this.phase = 'contemplate';

                this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() |0;
                this.circleCreating = true;
                this.circleFading = false;

                this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() |0;
                this.tick = 0;
                this.tick2 = 0;

                this.shards = [];

                var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() |0,
                    angle = Tau / shardCount,
                    cos = Math.cos( angle ),
                    sin = Math.sin( angle ),

                    x = 1,
                    y = 0;

                for( var i = 0; i < shardCount; ++i ){
                    var x1 = x;
                    x = x * cos - y * sin;
                    y = y * cos + x1 * sin;

                    this.shards.push( new Shard( this.x, this.y, x, y, this.alphaColor ) );
                }
            }

        }
    } else if( this.phase === 'contemplate' ){

        ++this.tick;

        if( this.circleCreating ){

            ++this.tick2;
            var proportion = this.tick2 / this.circleCompleteTime,
                armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace( 'light', 50 + 50 * proportion ).replace( 'alp', proportion );
            ctx.beginPath();
            ctx.arc( this.x, this.y, armonic * this.circleFinalSize, 0, Tau );
            ctx.fill();

            if( this.tick2 > this.circleCompleteTime ){
                this.tick2 = 0;
                this.circleCreating = false;
                this.circleFading = true;
            }
        } else if( this.circleFading ){

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );

            ++this.tick2;
            var proportion = this.tick2 / this.circleFadeTime,
                armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace( 'light', 100 ).replace( 'alp', 1 - armonic );
            ctx.arc( this.x, this.y, this.circleFinalSize, 0, Tau );
            ctx.fill();

            if( this.tick2 >= this.circleFadeTime )
                this.circleFading = false;

        } else {

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
        }

        for( var i = 0; i < this.shards.length; ++i ){

            this.shards[ i ].step();

            if( !this.shards[ i ].alive ){
                this.shards.splice( i, 1 );
                --i;
            }
        }

        if( this.tick > opts.letterContemplatingWaitTime ){

            this.phase = 'balloon';

            this.tick = 0;
            this.spawning = true;
            this.spawnTime = opts.balloonSpawnTime * Math.random() |0;
            this.inflating = false;
            this.inflateTime = opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random() |0;
            this.size = opts.balloonBaseSize + opts.balloonAddedSize * Math.random() |0;

            var rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

            this.vx = Math.cos( rad ) * vel;
            this.vy = Math.sin( rad ) * vel;
        }
    } else if( this.phase === 'balloon' ){

        ctx.strokeStyle = this.lightColor.replace( 'light', 80 );

        if( this.spawning ){

            ++this.tick;
            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );

            if( this.tick >= this.spawnTime ){
                this.tick = 0;
                this.spawning = false;
                this.inflating = true;
            }
        } else if( this.inflating ){

            ++this.tick;

            var proportion = this.tick / this.inflateTime,
                x = this.cx = this.x,
                y = this.cy = this.y - this.size * proportion;

            ctx.fillStyle = this.alphaColor.replace( 'alp', proportion );
            ctx.beginPath();
            generateBalloonPath( x, y, this.size * proportion );
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo( x, y );
            ctx.lineTo( x, this.y );
            ctx.stroke();

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );

            if( this.tick >= this.inflateTime ){
                this.tick = 0;
                this.inflating = false;
            }

        } else {

            this.cx += this.vx;
            this.cy += this.vy += opts.upFlow;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            generateBalloonPath( this.cx, this.cy, this.size );
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo( this.cx, this.cy );
            ctx.lineTo( this.cx, this.cy + this.size );
            ctx.stroke();

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.cx + this.dx, this.cy + this.dy + this.size );

            if( this.cy + this.size < -hh || this.cx < -hw || this.cy > hw  )
                this.phase = 'done';

        }
    }
};
function Shard( x, y, vx, vy, color ){

    var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

    this.vx = vx * vel;
    this.vy = vy * vel;

    this.x = x;
    this.y = y;

    this.prevPoints = [ [ x, y ] ];
    this.color = color;

    this.alive = true;

    this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function(){

    this.x += this.vx;
    this.y += this.vy += opts.gravity;

    if( this.prevPoints.length > opts.fireworkShardPrevPoints )
        this.prevPoints.shift();

    this.prevPoints.push( [ this.x, this.y ] );

    var lineWidthProportion = this.size / this.prevPoints.length;

    for( var k = 0; k < this.prevPoints.length - 1; ++k ){

        var point = this.prevPoints[ k ],
            point2 = this.prevPoints[ k + 1 ];

        ctx.strokeStyle = this.color.replace( 'alp', k / this.prevPoints.length );
        ctx.lineWidth = k * lineWidthProportion;
        ctx.beginPath();
        ctx.moveTo( point[ 0 ], point[ 1 ] );
        ctx.lineTo( point2[ 0 ], point2[ 1 ] );
        ctx.stroke();

    }

    if( this.prevPoints[ 0 ][ 1 ] > hh )
        this.alive = false;
};
function generateBalloonPath( x, y, size ){

    ctx.moveTo( x, y );
    ctx.bezierCurveTo( x - size / 2, y - size / 2,
        x - size / 4, y - size,
        x,            y - size );
    ctx.bezierCurveTo( x + size / 4, y - size,
        x + size / 2, y - size / 2,
        x,            y );
}

const colors = ['#FF0000', '#E8D45B', '#8CFF00'];

// I know the abs is not needed... but oh well
let max_distance = Math.abs(Math.max(center_x, center_y));
let min_distance = Math.abs(Math.min(center_x, center_y));

function Firefly(){
    this.velocity = 0;
    let random_angle = Math.random() * TwoPI;
    this.x = center_x +  Math.sin(random_angle) * ((Math.random() * (max_distance - min_distance) + min_distance));
    this.y = center_y + Math.cos(random_angle) * ((Math.random() * (max_distance - min_distance) + min_distance));



    this.angle_of_attack = Math.atan2(  this.y - center_y ,  this.x - center_x);
    this.vel =  ( Math.random() * 5 ) + 5 ;

    this.color = colors[ ~~(colors.length * Math.random()) ];


    this.xvel = this.vel * Math.cos( this.angle_of_attack );
    this.yvel = this.vel * Math.sin( this.angle_of_attack );
    this.size = 2 + Math.random() * 2;

    this.phase_diff = Math.random() * TwoPI;

}



Firefly.prototype.move = function(dt){
    if( isOnHeart(this.x, this.y)){
        this.size -= 0.001;
        return;
    }
    this.x += this.xvel * dt;
    this.y += this.yvel * dt;
};

Firefly.prototype.render = function(ctx, now){
    if( this.size < 1) {
        return;
    }
    ctx.globalAlpha = Math.max(Math.abs(Math.sin( (now + this.phase_diff) / (~~(this.size * 100)) )), 0.4);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20 / this.size;
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.size, 0, TwoPI, false);
    ctx.closePath();
    ctx.fill();
};

let max_fireflies = 1000;
let canvas = document.getElementById('can');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var fireflies = [];


var last = Date.now();
var dt = 0, now = 0;
var alive_fireflies = 0;
var last_emit = 0;

function anim(){

    window.requestAnimationFrame( anim );


    now = Date.now();
    dt = (last - now) / 10;
    last = now;
    fireflies.forEach(function(f){
        f.move(dt);
        f.render(ctx, now);
    });

    fireflies = fireflies.filter(function(f){
        return (f.size > 1);
    });

    alive_fireflies = fireflies.length;

    if( alive_fireflies < max_fireflies && last_emit - now < - 100){
        fireflies.push( new Firefly());
        last_emit = now;
    }
    ctx.translate( hw, hh );

    // var done = true;
    // for( var l = 0; l < letters.length; ++l ){
    //
    //     letters[ l ].step();
    //     if( letters[ l ].phase !== 'done' )
    //         done = false;
    // }
//
    ctx.translate( -hw, -hh );
//
//     if( done )
//         for( var l = 0; l < letters.length; ++l )
//             letters[ l ].reset();
//     }
//
// for( var i = 0; i < opts.strings.length; ++i ){
//     for( var j = 0; j < opts.strings[ i ].length; ++j ){
//         letters.push( new Letter( opts.strings[ i ][ j ],
//             j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[ i ].length * opts.charSize / 2,
//             i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2 ) );
//     }
}

anim();

function isOnHeart(x,y){
    x = ((x - center_x) / (min_distance * 1.2)) * 1.8;
    y = ((y - center_y) / (min_distance)) * - 1.8;

    var x2 = x * x;
    var y2 = y * y;
    // Simplest Equation of love
    return (Math.pow((x2 + y2 - 1), 3) - (x2 * (y2 * y)) <= 0);
}

window.addEventListener( 'resize', function(){

    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;

    hw = w / 2;
    hh = h / 2;

    ctx.font = opts.charSize + 'px Verdana';
});
