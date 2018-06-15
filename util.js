CanvasRenderingContext2D.prototype.drawAtom = function(image,sx,sy,dx,dy) { 
    return ctx.drawImage(image,sx*16,sy*16,16,16,dx,dy,32,32);
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
    stone: {x:1,y:0,name:'stone'},
    metal: {x:1,y:1,name:'metal'},
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

    this.rotate = function(cx,cy,vel) {
        for (var i = this.atoms.length - 1; i >= 0; i--) {
            this.atoms[i].rotate(cx,cy,vel)
        };
    };

    this.rotate2 = function(cx,cy,vel) {
        for (var i = this.atoms.length - 1; i >= 0; i--) {
            this.atoms[i].rotate2(cx,cy,vel)
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

    this.vel = 10

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

    this.rotate = function(cx,cy,vel) {
    	this.vel = Math.PI/(vel*2)
        this.rot = vel
        this.cx = cx
        this.cy = cy
    };

    this.rotate2 = function(cx,cy,vel) {
    	this.vel = Math.PI/(vel*2)
        this.rot = -vel
        this.cx = cx
        this.cy = cy
    };

    this.update = function() {
        if(this.t<0){
            this.sx = 0
            this.sy = 0
        }
        if (this.rot>0) {
            distx = (this.x - this.cx)
            disty = (this.y - this.cy)
            this.x = Math.cos(this.vel)*distx-Math.sin(this.vel)*disty+this.cx;
            this.y = Math.sin(this.vel)*distx+Math.cos(this.vel)*disty+this.cy;
            this.rot-= 1
        }if (this.rot<0) {
            distx = (this.x - this.cx)
            disty = (this.y - this.cy)
            this.x = Math.cos(-this.vel)*distx-Math.sin(-this.vel)*disty+this.cx;
            this.y = Math.sin(-this.vel)*distx+Math.cos(-this.vel)*disty+this.cy;
            this.rot+= 1
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

    this.vel = 10

    this.moveRight = function() {
        if(this.t>0) return
        this.sx = 1/this.vel;
        this.t = this.vel
    };
    this.moveDown = function() {
        if(this.t>0) {return}
        this.sy = 1/this.vel;
        this.t = this.vel
    };
    this.moveLeft = function() {
        if(this.t>0) return
        this.sx = -1/this.vel;
        this.t = this.vel
    };
    this.moveUp = function() {
        if(this.t>0) return
        this.sy = -1/this.vel;
        this.t = this.vel
    };

    this.rotate = function() {
        if(this.child!=null){
            this.child.rotate(this.x,this.y,this.vel)
            this.t=this.vel
        }
    };

    this.rotate2 = function() {
        if(this.child!=null){
            this.child.rotate2(this.x,this.y,this.vel)
            this.t=this.vel
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

function Spawn(type,x,y,vel){
	this.cycle = 0
    this.type = type
    this.x = x
    this.y = y

    this.vel = vel

    this.update = function() {
    	if(this.cycle==0){
            subs_list.push(new Substance([new Atom(this.type,this.x,this.y)]))
            this.cycle = this.vel

        }else{
            fill = false
            for (var i = subs_list.length - 1; i >= 0; i--) {
                if(subs_list[i].atoms[0].x==this.x && subs_list[i].atoms[0].y==this.y){
                    fill = true
                    break
                }
            };
            if (fill==false) {
                this.cycle--
            };
        }
    }
}