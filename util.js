CanvasRenderingContext2D.prototype.drawAtom = function(image,sx,sy,dx,dy) { 
    return ctx.drawImage(image,sx*16,sy*16,16,16,dx*40+4,dy*40+4,32,32);
}

CanvasRenderingContext2D.prototype.drawGrab = function(image,sx,sy,dx,dy) { 
    return ctx.drawImage(image,sx*20,sy*20,20,20,dx,dy,40,40);
}

atomsheet = new Image()
atomsheet.src = "atoms.png"

mach = new Image()
mach.src = "equipament.png"

Atoms = {
    fire: {x:0,y:0,name:'fire'},
    water: {x:0,y:1,name:'water'},
    stone: {x:1,y:0,name:'stone'}
}

function Substance(list){
    this.atoms = list

    this.move = function(sx,sy) {
        for (var i = this.atoms.length - 1; i >= 0; i--) {
            this.atoms[i].x+=sx
            this.atoms[i].y+=sy
        };
    };

    this.normalize = function() {
        for (var i = this.atoms.length - 1; i >= 0; i--) {
            this.atoms[i].normalize()
        };
    };

    this.rotate = function(cx,cy) {
        for (var i = this.atoms.length - 1; i >= 0; i--) {
            this.atoms[i].rotate(cx,cy)
        };
    };
}

function Atom(type,x,y) {
    this.x = x
    this.y = y
    this.type = type
    this.childs = []

    this.sx = 0
    this.sy = 0
    this.rot = 0
    this.t = 0

    this.move = function(sx,sy) {
        this.x+=sx
        this.y+=sy
    };

    this.normalize = function() {
        this.sx = 0
        this.sy = 0
        this.rot = 0
        this.t = 0
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
    };

    this.rotate = function(cx,cy) {
        this.rot = 20
        this.cx = cx
        this.cy = cy
    };

    this.update = function() {
        if(this.t<0){
            this.sx = 0
            this.sy = 0
        }
        if(this.rot<=0 && this.t==0){
            this.rot = 0
        }
        if (this.rot>0) {
            distx = (this.x - this.cx)
            disty = (this.y - this.cy)
            this.x = Math.cos(Math.PI/40)*distx-Math.sin(Math.PI/40)*disty+this.cx;
            this.y = Math.sin(Math.PI/40)*distx+Math.cos(Math.PI/40)*disty+this.cy;
            this.rot-= 1
        };
        this.x+=this.sx
        this.y+=this.sy
        if(this.t>0) this.t-=1
    };
}

function Grabber(x,y) {
    this.x = x
    this.y = y
    this.closed = false
    this.child = null

    this.sx = 0
    this.sy = 0
    this.t = 0

    this.moveRight = function() {
        if(this.t>0) return
        this.sx = 0.05;
        this.t = 20
    };
    this.moveDown = function() {
        if(this.t>0) {return}
        this.sy = 0.05;
        this.t = 20
    };
    this.moveLeft = function() {
        if(this.t>0) return
        this.sx = -0.05;
        this.t = 20
    };
    this.moveUp = function() {
        if(this.t>0) return
        this.sy = -0.05;
        this.t = 20
    };

    this.rotate = function() {
        if(this.child!=null){
            this.child.rotate(this.x,this.y)
            this.t=20
        }
    };

    this.update = function() {
        if(this.t==0){
            this.sx = 0
            this.sy = 0
            this.x = Math.round(this.x)
            this.y = Math.round(this.y)
            if(this.child!=null) this.child.normalize()
        }
        if(this.child!=null) this.child.move(this.sx,this.sy)
        this.x+=this.sx
        this.y+=this.sy
        if(this.t>0) this.t-=1
    };
}