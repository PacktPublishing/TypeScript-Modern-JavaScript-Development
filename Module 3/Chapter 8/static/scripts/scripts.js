(function() {
var exports = {};
var __small$_9 = (function() {
var exports = {};
"use strict";
var Empty = (function () {
    function Empty() {
    }
    return Empty;
}());
exports.Empty = Empty;
var Rectangle = (function () {
    function Rectangle(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = width; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rectangle;
}());
exports.Rectangle = Rectangle;
var RectangleOutline = (function () {
    function RectangleOutline(x, y, width, height, thickness) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = width; }
        if (thickness === void 0) { thickness = 1; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.thickness = thickness;
    }
    return RectangleOutline;
}());
exports.RectangleOutline = RectangleOutline;
var Circle = (function () {
    function Circle(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = width; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Circle;
}());
exports.Circle = Circle;
var CircleOutline = (function () {
    function CircleOutline(x, y, width, height, thickness) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = width; }
        if (thickness === void 0) { thickness = 1; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.thickness = thickness;
    }
    return CircleOutline;
}());
exports.CircleOutline = CircleOutline;
var Line = (function () {
    function Line(path, thickness) {
        this.path = path;
        this.thickness = thickness;
    }
    return Line;
}());
exports.Line = Line;
var Text = (function () {
    function Text(text, font) {
        this.text = text;
        this.font = font;
    }
    return Text;
}());
exports.Text = Text;
var Color = (function () {
    function Color(color, picture) {
        this.color = color;
        this.picture = picture;
    }
    return Color;
}());
exports.Color = Color;
var Translate = (function () {
    function Translate(x, y, picture) {
        this.x = x;
        this.y = y;
        this.picture = picture;
    }
    return Translate;
}());
exports.Translate = Translate;
var Rotate = (function () {
    function Rotate(angle, picture) {
        this.angle = angle;
        this.picture = picture;
    }
    return Rotate;
}());
exports.Rotate = Rotate;
var Scale = (function () {
    function Scale(x, y, picture) {
        this.x = x;
        this.y = y;
        this.picture = picture;
    }
    return Scale;
}());
exports.Scale = Scale;
var Pictures = (function () {
    function Pictures(pictures) {
        this.pictures = pictures;
    }
    return Pictures;
}());
exports.Pictures = Pictures;

return exports;
})();
var __small$_7 = (function() {
var exports = {};
"use strict";
var KeyEvent = (function () {
    function KeyEvent(kind, keyCode) {
        this.kind = kind;
        this.keyCode = keyCode;
    }
    return KeyEvent;
}());
exports.KeyEvent = KeyEvent;
function createEventSource(element) {
    var queue = [];
    var handleKeyEvent = function (kind) { return function (e) {
        e.preventDefault();
        queue.push(new KeyEvent(kind, e.keyCode));
    }; };
    var keypress = handleKeyEvent(0 /* Press */);
    var keyup = handleKeyEvent(1 /* Release */);
    element.addEventListener("keydown", keypress);
    element.addEventListener("keyup", keyup);
    function events() {
        var result = queue;
        queue = [];
        return result;
    }
    return events;
}
exports.createEventSource = createEventSource;

return exports;
})();
var __small$_1 = (function() {
var exports = {};
var __small$_6 = (function() {
var exports = {};
"use strict";
;
function drawPicture(context, item) {
    context.save();
    if (item instanceof __small$_9.RectangleOutline) {
        var x = item.x, y = item.y, width = item.width, height = item.height, thickness = item.thickness;
        context.strokeRect(x - width / 2, y - height / 2, width, height);
    }
    else if (item instanceof __small$_9.Rectangle) {
        var x = item.x, y = item.y, width = item.width, height = item.height;
        context.fillRect(x - width / 2, y - height / 2, width, height);
    }
    else if (item instanceof __small$_9.CircleOutline || item instanceof __small$_9.Circle) {
        var x = item.x, y = item.y, width = item.width, height = item.height;
        if (width !== height) {
            context.scale(1, height / width);
        }
        context.beginPath();
        context.arc(x, y, width / 2, 0, Math.PI * 2);
        context.closePath();
        if (item instanceof __small$_9.CircleOutline) {
            context.lineWidth = item.thickness;
            context.stroke();
        }
        else {
            context.fill();
        }
    }
    else if (item instanceof __small$_9.Line) {
        var path = item.path, thickness = item.thickness;
        context.lineWidth = thickness;
        context.beginPath();
        if (path.length === 0)
            return;
        var head = path[0], tail = path.slice(1);
        var headX = head[0], headY = head[1];
        context.moveTo(headX, headY);
        for (var _i = 0, tail_1 = tail; _i < tail_1.length; _i++) {
            var _a = tail_1[_i], x = _a[0], y = _a[1];
            context.lineTo(x, y);
        }
        context.stroke();
    }
    else if (item instanceof __small$_9.Text) {
        var text = item.text, font = item.font;
        context.scale(1, -1);
        context.font = font;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, 0, 0);
    }
    else if (item instanceof __small$_9.Color) {
        var color = item.color, picture = item.picture;
        context.fillStyle = color;
        context.strokeStyle = color;
        drawPicture(context, picture);
    }
    else if (item instanceof __small$_9.Translate) {
        var x = item.x, y = item.y, picture = item.picture;
        context.translate(x, y);
        drawPicture(context, picture);
    }
    else if (item instanceof __small$_9.Rotate) {
        var angle = item.angle, picture = item.picture;
        context.rotate(angle);
        drawPicture(context, picture);
    }
    else if (item instanceof __small$_9.Scale) {
        var x = item.x, y = item.y, picture = item.picture;
        context.scale(x, y);
        drawPicture(context, picture);
    }
    else if (item instanceof __small$_9.Pictures) {
        var pictures = item.pictures;
        for (var _b = 0, pictures_1 = pictures; _b < pictures_1.length; _b++) {
            var picture = pictures_1[_b];
            drawPicture(context, picture);
        }
    }
    context.restore();
}
exports.drawPicture = drawPicture;
function drawPath(context, path) {
    context.beginPath();
    if (path.length === 0)
        return;
    var head = path[0], tail = path.slice(1);
    var headX = head[0], headY = head[1];
    context.moveTo(headX, headY);
    for (var _i = 0, tail_2 = tail; _i < tail_2.length; _i++) {
        var point = tail_2[_i];
        var x = point[0], y = point[1];
        context.lineTo(x, y);
    }
}

return exports;
})();
"use strict";
;
;
function game(canvas, eventElement, fps, state, drawState, timeHandler, eventHandler) {
    if (timeHandler === void 0) { timeHandler = function (x) { return x; }; }
    var eventSource = __small$_7.createEventSource(eventElement);
    var context = canvas.getContext("2d");
    setInterval(step, 1000 / fps);
    var drawAnimationFrame = -1;
    draw();
    function step() {
        var previous = state;
        for (var _i = 0, _a = eventSource(); _i < _a.length; _i++) {
            var event_2 = _a[_i];
            state = eventHandler(state, event_2);
        }
        state = timeHandler(state);
        if (previous !== state && drawAnimationFrame === -1) {
            drawAnimationFrame = requestAnimationFrame(draw);
        }
    }
    function draw() {
        drawAnimationFrame = -1;
        var width = canvas.width, height = canvas.height;
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(Math.round(width / 2), Math.round(height / 2));
        context.scale(1, -1);
        __small$_6.drawPicture(context, drawState(state, width, height));
        context.restore();
    }
}
exports.game = game;

return exports;
})();
var __small$_8 = (function() {
var exports = {};
"use strict";
function flatten(source) {
    return (_a = []).concat.apply(_a, source);
    var _a;
}
exports.flatten = flatten;
function update(old, changes) {
    var result = Object.create(Object.getPrototypeOf(old));
    for (var _i = 0, _a = Object.keys(old); _i < _a.length; _i++) {
        var key = _a[_i];
        result[key] = old[key];
    }
    for (var _b = 0, _c = Object.keys(changes); _b < _c.length; _b++) {
        var key = _c[_b];
        result[key] = changes[key];
    }
    return result;
}
exports.update = update;
function randomInt(min, max) {
    return min + Math.floor(Math.round(Math.random() * (max - min + 1)));
}
exports.randomInt = randomInt;
function chance(x) {
    return Math.random() < x;
}
exports.chance = chance;
function square(x) {
    return x * x;
}
exports.square = square;
function distance(x1, y1, x2, y2) {
    return Math.sqrt(square(x1 - x2) + square(y1 - y2));
}
exports.distance = distance;
function isInt(x) {
    return Math.abs(Math.round(x) - x) < 0.001;
}
exports.isInt = isInt;

return exports;
})();
var __small$_2 = (function() {
var exports = {};
"use strict";
;
(function (Difficulty) {
    Difficulty[Difficulty["Easy"] = 0] = "Easy";
    Difficulty[Difficulty["Hard"] = 1] = "Hard";
    Difficulty[Difficulty["Extreme"] = 2] = "Extreme";
})(exports.Difficulty || (exports.Difficulty = {}));
var Difficulty = exports.Difficulty;
(function (Movement) {
    Movement[Movement["None"] = 0] = "None";
    Movement[Movement["Left"] = 1] = "Left";
    Movement[Movement["Right"] = -1] = "Right";
    Movement[Movement["Top"] = 2] = "Top";
    Movement[Movement["Bottom"] = -2] = "Bottom";
})(exports.Movement || (exports.Movement = {}));
var Movement = exports.Movement;
function isOppositeMovement(a, b) {
    return a + b === 0;
}
exports.isOppositeMovement = isOppositeMovement;
(function (Side) {
    Side[Side["Left"] = 1] = "Left";
    Side[Side["Right"] = 2] = "Right";
    Side[Side["Top"] = 4] = "Top";
    Side[Side["Bottom"] = 8] = "Bottom";
    Side[Side["LeftTop"] = 16] = "LeftTop";
    Side[Side["RightTop"] = 32] = "RightTop";
    Side[Side["LeftBottom"] = 64] = "LeftBottom";
    Side[Side["RightBottom"] = 128] = "RightBottom";
})(exports.Side || (exports.Side = {}));
var Side = exports.Side;
var defaultLevel = parseLevel([
    "WWWWWWWWWWWWWWW",
    "W....E........W",
    "W.WWWWW.WWWWW.W",
    "W.W...W.W...W.W",
    "WE..W.....W...W",
    "W.W...W.W...W.W",
    "W.WWWWW.WWWWW.W",
    "W.............W",
    "WWWW.WW WW.WWWW",
    "W....W   W....W",
    "W.WW.W P W.WW.W",
    "W.WW.WW WW.WWEW",
    "W.............W",
    "WWWWWWWWWWWWWWW"
]);
function parseLevel(data) {
    var grid = data.map(function (row) { return row.split(""); });
    return {
        walls: mapBoard(toWall),
        dots: mapBoard(toObject(".")),
        enemies: mapBoard(toEnemy),
        player: mapBoard(toObject("P"))[0],
        width: grid[0].length,
        height: grid.length,
        inputMovement: Movement.None,
        currentMovement: Movement.None,
        difficulty: Difficulty.Easy
    };
    function mapBoard(callback) {
        var mapped = grid.map(function (row, y) { return row.map(function (field, x) { return callback(field, x, y); }); });
        return __small$_8.flatten(mapped).filter(function (item) { return item !== undefined; });
    }
    function toObject(kind) {
        return function (value, x, y) {
            if (value !== kind)
                return undefined;
            return { x: x, y: y };
        };
    }
    function get(x, y) {
        var row = grid[y];
        if (!row)
            return undefined;
        return row[x];
    }
    function toWall(kind, x, y) {
        if (kind !== "W")
            return undefined;
        var neighbours = 0;
        if (get(x - 1, y) === "W")
            neighbours |= Side.Left;
        if (get(x + 1, y) === "W")
            neighbours |= Side.Right;
        if (get(x, y - 1) === "W")
            neighbours |= Side.Bottom;
        if (get(x, y + 1) === "W")
            neighbours |= Side.Top;
        if (get(x - 1, y - 1) === "W")
            neighbours |= Side.LeftBottom;
        if (get(x - 1, y + 1) === "W")
            neighbours |= Side.LeftTop;
        if (get(x + 1, y - 1) === "W")
            neighbours |= Side.RightBottom;
        if (get(x + 1, y + 1) === "W")
            neighbours |= Side.RightTop;
        return {
            x: x,
            y: y,
            neighbours: neighbours
        };
    }
    function toEnemy(kind, x, y) {
        if (kind !== "E")
            return undefined;
        return {
            x: x,
            y: y,
            toX: x,
            toY: y
        };
    }
}
function onGrid(_a) {
    var x = _a.x, y = _a.y;
    return __small$_8.isInt(x) && __small$_8.isInt(y);
}
exports.onGrid = onGrid;
var startGame = function (difficulty) { return function (state) { return ({
    menu: undefined,
    level: __small$_8.update(defaultLevel, { difficulty: difficulty })
}); }; };
exports.menuMain = {
    title: "Pac Man",
    options: [
        ["Easy", startGame(Difficulty.Easy)],
        ["Hard", startGame(Difficulty.Hard)],
        ["Extreme", startGame(Difficulty.Extreme)]
    ],
    selected: 0
};
exports.menuWon = {
    title: "You won!",
    options: [
        ["Back", function (state) { return ({ menu: exports.menuMain, level: state.level }); }]
    ],
    selected: 0
};
exports.menuLost = {
    title: "Game over!",
    options: [
        ["Back", function (state) { return ({ menu: exports.menuMain, level: state.level }); }]
    ],
    selected: 0
};
exports.defaultState = {
    menu: exports.menuMain,
    level: defaultLevel
};

return exports;
})();
var __small$_3 = (function() {
var exports = {};
"use strict";
;
;
var font = "Arial";
function draw(state, width, height) {
    return new __small$_9.Pictures([
        drawLevel(state.level, width, height),
        drawMenu(state.menu, width, height)
    ]);
}
exports.draw = draw;
function drawLevel(level, width, height) {
    var scale = Math.min(width / (level.width + 1), height / (level.height + 1));
    return new __small$_9.Scale(scale, scale, new __small$_9.Translate(-level.width / 2 + 0.5, -level.height / 2 + 0.5, new __small$_9.Pictures([
        drawObjects(level.walls, drawWall),
        drawObjects(level.walls, drawWallLines),
        drawObjects(level.dots, drawDot),
        drawObjects(level.enemies, drawEnemy),
        drawObject(drawPlayer)(level.player)
    ])));
    function drawObject(callback) {
        return function (item) {
            return new __small$_9.Translate(item.x, item.y, callback(item));
        };
    }
    function drawObjects(items, callback) {
        return new __small$_9.Pictures(items.map(drawObject(callback)));
    }
}
function drawMenu(menu, width, height) {
    if (menu === undefined)
        return new __small$_9.Empty();
    var selected = menu.selected;
    var background = new __small$_9.Color("rgba(40,40,40,0.8)", new __small$_9.Rectangle(0, 0, width, height));
    var title = new __small$_9.Translate(0, 200, new __small$_9.Scale(4, 4, new __small$_9.Color("#fff", new __small$_9.Text(menu.title, font))));
    var options = new __small$_9.Pictures(menu.options.map(showOption));
    return new __small$_9.Pictures([background, title, options]);
    function showOption(item, index) {
        var isSelected = index === selected;
        return new __small$_9.Translate(0, 100 - index * 50, new __small$_9.Pictures([
            new __small$_9.Color(isSelected ? "#ff0000" : "#000000", new __small$_9.Rectangle(0, 0, 200, 40)),
            new __small$_9.Color(isSelected ? "#000000" : "#ffffff", new __small$_9.Scale(1.6, 1.6, new __small$_9.Text(item[0], font)))
        ]));
    }
}
function drawWall() {
    return new __small$_9.Color("#111", new __small$_9.Rectangle(0, 0, 1, 1));
}
var leftTop = [-0.5, 0.5];
var leftBottom = [-0.5, -0.5];
var rightTop = [0.5, 0.5];
var rightBottom = [0.5, -0.5];
var wallLines = [
    [__small$_2.Side.Left, new __small$_9.Line([leftTop, leftBottom], 0.1)],
    [__small$_2.Side.Right, new __small$_9.Line([rightTop, rightBottom], 0.1)],
    [__small$_2.Side.Top, new __small$_9.Line([leftTop, rightTop], 0.1)],
    [__small$_2.Side.Bottom, new __small$_9.Line([leftBottom, rightBottom], 0.1)]
];
function drawWallLines(_a) {
    var neighbours = _a.neighbours;
    var lines = wallLines
        .filter(function (_a) {
        var side = _a[0];
        return (side & neighbours) === 0;
    })
        .map(function (_a) {
        var side = _a[0], line = _a[1];
        return line;
    });
    return new __small$_9.Color("#0021b3", new __small$_9.Pictures(lines));
}
function drawDot() {
    return new __small$_9.Color("#f0c0a8", new __small$_9.Circle(0, 0, 0.2, 0.2));
}
function drawPlayer() {
    return new __small$_9.Color("#ffff00", new __small$_9.Circle(0, 0, 0.8, 0.8));
}
function drawEnemy() {
    var shape = new __small$_9.Color("#ff0000", new __small$_9.Pictures([
        new __small$_9.Circle(0, 0.15, 0.6),
        new __small$_9.Rectangle(0, -0.05, 0.6, 0.4),
        new __small$_9.Translate(-0.15, -0.25, new __small$_9.Rotate(Math.PI / 4, new __small$_9.Rectangle(0, 0, 0.2, Math.SQRT2 * 0.15))),
        new __small$_9.Translate(0.15, -0.25, new __small$_9.Rotate(Math.PI / 4, new __small$_9.Rectangle(0, 0, 0.2, Math.SQRT2 * 0.15)))
    ]));
    var eyes = new __small$_9.Color("#fff", new __small$_9.Pictures([
        new __small$_9.Circle(-0.12, 0.15, 0.2),
        new __small$_9.Circle(0.12, 0.15, 0.2)
    ]));
    var pupils = new __small$_9.Color("#000", new __small$_9.Pictures([
        new __small$_9.Circle(-0.12, 0.15, 0.06),
        new __small$_9.Circle(0.12, 0.15, 0.06)
    ]));
    return new __small$_9.Pictures([shape, eyes, pupils]);
}

return exports;
})();
var __small$_4 = (function() {
var exports = {};
"use strict";
;
;
function step(state) {
    if (state.menu === undefined) {
        return stepLevel(state);
    }
    else {
        return state;
    }
}
exports.step = step;
function stepLevel(state) {
    var level = state.level;
    var enemies = level.enemies.map(function (enemy) { return stepEnemy(enemy, level.player, level.walls, level.difficulty); });
    var player = stepPlayer(level.player, level.currentMovement, level.walls);
    var dots = stepDots(level.dots, player);
    var currentMovement = __small$_2.onGrid(player) || __small$_2.isOppositeMovement(level.inputMovement, level.currentMovement) ? level.inputMovement : level.currentMovement;
    var menu = newMenu(player, dots, enemies);
    var newLevel = __small$_8.update(level, { enemies: enemies, dots: dots, player: player, currentMovement: currentMovement });
    return __small$_8.update(state, { level: newLevel, menu: menu });
}
function collidesWall(x, y, walls) {
    for (var _i = 0, walls_1 = walls; _i < walls_1.length; _i++) {
        var wall = walls_1[_i];
        if (Math.abs(wall.x - x) < 1 && Math.abs(wall.y - y) < 1) {
            return true;
        }
    }
    return false;
}
function stepEnemy(enemy, player, walls, difficulty) {
    var enemyStepSize = difficulty === __small$_2.Difficulty.Easy ? 0.0125 : 0.025;
    var x = enemy.x, y = enemy.y, toX = enemy.toX, toY = enemy.toY;
    if (__small$_8.chance(1 / (difficulty === __small$_2.Difficulty.Extreme ? 30 : 10))) {
        toX = Math.round(player.x) + __small$_8.randomInt(-2, 2);
        toY = Math.round(player.y) + __small$_8.randomInt(-2, 2);
    }
    if (!__small$_8.isInt(x)) {
        x += toX > x ? enemyStepSize : -enemyStepSize;
    }
    else if (!__small$_8.isInt(y)) {
        y += toY > y ? enemyStepSize : -enemyStepSize;
    }
    else {
        x = Math.round(x);
        y = Math.round(y);
        var options = [
            [x + enemyStepSize, y],
            [x - enemyStepSize, y],
            [x, y + enemyStepSize],
            [x, y - enemyStepSize]
        ];
        var possible = options
            .filter(function (_a) {
            var x = _a[0], y = _a[1];
            return !collidesWall(x, y, walls);
        })
            .sort(compareDistance);
        if (possible.length !== 0) {
            if (possible.length > 1 && __small$_8.chance(0.2)) {
                _a = possible[1], x = _a[0], y = _a[1];
            }
            _b = possible[0], x = _b[0], y = _b[1];
        }
    }
    return {
        x: x, y: y, toX: toX, toY: toY
    };
    function compareDistance(_a, _b) {
        var x1 = _a[0], y1 = _a[1];
        var x2 = _b[0], y2 = _b[1];
        return __small$_8.distance(toX, toY, x1, y1) - __small$_8.distance(toX, toY, x2, y2);
    }
    var _a, _b;
}
var playerStepSize = 0.04;
function stepPlayer(player, movement, walls) {
    var x = player.x, y = player.y;
    if (__small$_2.onGrid(player)) {
        x = Math.round(x);
        y = Math.round(y);
    }
    switch (movement) {
        case __small$_2.Movement.None:
            return player;
        case __small$_2.Movement.Left:
            x -= playerStepSize;
            break;
        case __small$_2.Movement.Right:
            x += playerStepSize;
            break;
        case __small$_2.Movement.Top:
            y += playerStepSize;
            break;
        case __small$_2.Movement.Bottom:
            y -= playerStepSize;
            break;
    }
    if (__small$_2.onGrid(player) && collidesWall(x, y, walls)) {
        return player;
    }
    return { x: x, y: y };
}
function stepDots(dots, player) {
    return dots.filter(function (dot) { return __small$_8.distance(dot.x, dot.y, player.x, player.y) >= 0.55; });
}
function newMenu(player, dots, enemies) {
    for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
        var enemy = enemies_1[_i];
        if (__small$_8.distance(enemy.x, enemy.y, player.x, player.y) <= 1) {
            return __small$_2.menuLost;
        }
    }
    if (dots.length === 0)
        return __small$_2.menuWon;
    return undefined;
}

return exports;
})();
var __small$_5 = (function() {
var exports = {};
"use strict";
;
;
;
var Keys;
(function (Keys) {
    Keys[Keys["Top"] = 38] = "Top";
    Keys[Keys["Left"] = 37] = "Left";
    Keys[Keys["Bottom"] = 40] = "Bottom";
    Keys[Keys["Right"] = 39] = "Right";
    Keys[Keys["Space"] = " ".charCodeAt(0)] = "Space";
})(Keys || (Keys = {}));
function getMovement(key) {
    switch (key) {
        case Keys.Top:
            return __small$_2.Movement.Top;
        case Keys.Left:
            return __small$_2.Movement.Left;
        case Keys.Bottom:
            return __small$_2.Movement.Bottom;
        case Keys.Right:
            return __small$_2.Movement.Right;
    }
    return undefined;
}
function eventHandler(state, event) {
    if (state.menu) {
        return eventHandlerMenu(state, event);
    }
    else {
        return eventHandlerPlaying(state, event);
    }
}
exports.eventHandler = eventHandler;
function eventHandlerMenu(state, event) {
    if (event instanceof __small$_7.KeyEvent && event.kind === 0 /* Press */) {
        var menu = state.menu;
        var selected = menu.selected;
        switch (event.keyCode) {
            case Keys.Top:
                selected--;
                if (selected < 0) {
                    selected = menu.options.length - 1;
                }
                return {
                    menu: __small$_8.update(menu, {
                        selected: selected
                    }),
                    level: state.level
                };
            case Keys.Bottom:
                selected++;
                if (selected >= menu.options.length) {
                    selected = 0;
                }
                return {
                    menu: __small$_8.update(menu, {
                        selected: selected
                    }),
                    level: state.level
                };
            case Keys.Space:
                var option = menu.options[menu.selected];
                return option[1](state);
            default:
                return state;
        }
    }
    return state;
}
function eventHandlerPlaying(state, event) {
    if (event instanceof __small$_7.KeyEvent) {
        var inputMovement = getMovement(event.keyCode);
        if (event.kind === 0 /* Press */) {
            if (inputMovement) {
                return __small$_8.update(state, {
                    level: __small$_8.update(state.level, { inputMovement: inputMovement })
                });
            }
        }
        else {
            if (inputMovement === state.level.inputMovement) {
                return __small$_8.update(state, {
                    level: __small$_8.update(state.level, { inputMovement: __small$_2.Movement.None })
                });
            }
        }
    }
    return state;
}

return exports;
})();
"use strict";
;
;
;
;
;
var canvas = document.getElementById("game");
__small$_1.game(canvas, document.body, 60, __small$_2.defaultState, __small$_3.draw, __small$_4.step, __small$_5.eventHandler);

return exports;
})();
