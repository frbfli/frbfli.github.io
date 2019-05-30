document.body.addEventListener('touchmove', function(event) {
    //if (event.source == document.body)
    event.preventDefault();
}, false);

var c = document.getElementById("map");
var ctx = c.getContext("2d");
var masterWidth = window.innerWidth;


c.width = masterWidth;
c.height = masterWidth;;

$('#c').width = masterWidth;
$('#c').height = masterWidth;

$('#container').width(masterWidth);
$('#container').height(masterWidth);

var scale = masterWidth / 360;

var terrainDistance = 60 * scale;
var sizeMultiplier = 10 * scale;

var Terrain = function(type, x, y, size, midX, midY) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
    this.midX = midX;
    this.midY = midY;
}

var terrainArray = [];

var types = [
    "obstruction",
    "barrier",
    "fast",
    "rough",
    "forest"
];

var terrainType = [];

var checkAttempt = 0;

function randomGen(min, max) {
    var num = Math.floor(Math.random() * (1 + max - min)) + min;
    return num;
}

function setTerrain() {
    var n = randomGen(4, 6);

    var ob = Math.ceil(n / 2);

    var barrier = 0;
    var forest = 0;
    var fast = 0;
    var rough = 0;

    for (var i = 0; i < n; i++) {
        if (i < ob) {
            terrainType[i] = "obstruction";
        } else {
            terrainType[i] = types[randomGen(0, types.length - 1)];
            while (barrier > 0 && terrainType[i] == "barrier" || forest > 0 && terrainType[i] == "forest" || fast > 3 && terrainType[i] == "fast") {
                terrainType[i] = types[randomGen(0, types.length - 1)];
            }
            if (terrainType[i] == "barrier") {
                barrier++;
            } else if (terrainType[i] == "forest") {
                forest++;
            } else if (terrainType[i] == "fast") {
                fast++;
            }
        }
        genCoords(terrainType[i]);
    }
}

function genCoords(tempTerrain) {
    var x, y, size, coin;
    var canPlace = false;
    var checkAttemptValue;

    var checkPlace;
    if (tempTerrain == "fast") {
        coin = Math.floor(Math.random() * 2) + 1;
        if (coin < 2) {
            x = (Math.floor(Math.random() * 30) + 1) * scale;
        } else {
            x = (Math.floor(Math.random() * (360 - 330 + 1)) + 330) * scale;
        }
        size = 3;
        checkAttempValue = 200;
    } else {
        x = (Math.floor(Math.random() * (360 * scale)) + 1);
        switch (tempTerrain) {
            case 'rough':
                size = 6;
                break;
            case 'forest':
                size = 6;
                break;
            case 'barrier':
                size = 4;
                break;
            default:
                size = 3;
                break;
        }
    }
    y = (Math.floor(Math.random() * (260 - 100 + 1)) + 100) * scale;
    var tempCoords = [];
    tempCoords.x = x;
    tempCoords.y = y;
    tempCoords.size = size;
    tempCoords = fixTerrain(tempCoords);
    if (terrainArray.length != 0) {
        checkPlace = checkCollision(tempCoords);
        if (checkPlace) {
            terrainArray.push(new Terrain(tempTerrain, tempCoords.x, tempCoords.y, tempCoords.size, tempCoords.midX, tempCoords.midY));
            checkAttempt = 0;
        } else {
            checkAttempt += 1;
            if (checkAttempt <= 50) {
                genCoords(tempTerrain);
            }
        }
    } else {
        terrainArray.push(new Terrain(tempTerrain, tempCoords.x, tempCoords.y, tempCoords.size, tempCoords.midX, tempCoords.midY));
        checkAttempt = 0;
    }
}

function fixTerrain(t) {
    if (t.x + (t.size * sizeMultiplier) >= (360 * scale)) {
        t.x = (360 * scale) - (t.size * sizeMultiplier);
    }
    if (t.y + (t.size * sizeMultiplier) >= (260 * scale)) {
        t.y = (260 * scale) - (t.size * sizeMultiplier);
    }

    t.midX = (t.x + ((t.size * sizeMultiplier) / 2));
    t.midY = (t.y + ((t.size * sizeMultiplier) / 2));

    return t;
}

function paintTerrain() {
    var image;
    for (i in terrainArray) {
        switch (terrainArray[i].type) {
            case 'fast':
                image = "fg";
                break;
            case 'rough':
                image = "rg";
                break;
            case 'forest':
                image = "fo";
                break;
            case 'obstruction':
                image = "ob";
                break;
            case 'barrier':
                image = "ba";
                break;
        }

        var img = document.getElementById(image);
        ctx.drawImage(img, terrainArray[i].x, terrainArray[i].y);

    }
}

function checkCollision(c) {
    var t = terrainArray;
    var checkHere;
    // var size2 = c.size * sizeMultiplier;
    var size2 = 0;
    var rect2 = {
        x: c.x - terrainDistance,
        y: c.y - terrainDistance,
        w: size2 + terrainDistance,
        h: size2 + terrainDistance
    }
    for (i in terrainArray) {
        var size1 = terrainArray[i].size * sizeMultiplier;
        var rect1 = {
            x: terrainArray[i].x - terrainDistance,
            y: terrainArray[i].y - terrainDistance,
            w: size1 + terrainDistance,
            h: size1 + terrainDistance
        }
        checkHere = rectsColliding(rect1, rect2);
        if (!checkHere) {
            return checkHere;
        }
    }
    return checkHere;
}

function rectsColliding(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y) {
        return false;
    } else {
        return true;
    }
}

function preLoad() {

	setListeners();

    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;

    var contentWidth = document.getElementById('container').offsetWidth;
    var contentHeight = contentWidth;
    var buffer = 0;

    if (contentHeight > windowHeight) {
        buffer = contentWidth - windowHeight;
        contentHeight = windowHeight;
        contentWidth = contentHeight;
    }

    document.getElementById('container').style.height = contentHeight;
    document.getElementById('container').style.width = contentWidth;

    generate();

}

function generate() {
    terrainArray = [];
    terrainType = [];
    checkAttempt = 0;

    ctx.clearRect(0, 0, c.width, c.height);
    setTerrain();
    if (terrainArray.length >= 4) {
        paintTerrain();
    } else {
        generate();
    }
}

function menuChange(x) {
    x.classList.toggle('change');
    $('.infoWindowOverlay').toggleClass('show');
    $('.infoWindow').toggleClass('show');
    $('.heartContainer').toggleClass('show');
    $('.heartWindow').removeClass('show');
}

function heartChange(x) {
	x.classList.toggle('change');
	$('.heartWindow').toggleClass('show');
}

function setListeners() {
	$('.infoWindowOverlay').click(function() {
		$('.infoWindowOverlay').removeClass('show');
	    $('.infoWindow').removeClass('show');
	    $('.heartContainer').removeClass('show');
	    $('.heartWindow').removeClass('show');
	    $('.menuContainer').removeClass('change');
	})
}
