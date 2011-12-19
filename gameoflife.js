			Array.matrix = function(m, n, initial) { 
				var i, j, t,  mat = [];
				for(i = 0; i < m; i++) {
					t = [];
					for(j = 0; j< n; j++) {
						t[j] = initial;
					}
					mat[i] = t;
				}
				return mat;
			};
			var game = {
				running : false,
				runner : {},
				config: {},
				paper:  {},
				init : function(cnf) {
					this.paper  = Raphael("holder", 1000, 900);
					this.setConfig(cnf);
					this.createGrid();
					this.setup(cnf);
					this.eventHandling();
					this.start();
				},
				eventHandling : function() {
					var that = this;

					//$(holder).click(function(e){
					//		that.running ? that.stop() : that.start();
					//		console.log('stop');
					//		}) ;
					this.grid.elems.hover(function(){
							that.stop();
							//console.log('hoverin');
							}, function(){
							that.start();
							});
					this.grid.elems.mouseover(function(e){
							if(!that.running) {
							   console.log(e);
							}
							});
					this.grid.elems.click(function(e){
						console.log('click');
						if(!that.running){
							that.toggle(this.attr('_x'), this.attr('_y'));
						}
					});
	       			},
				grid: {
					    frame:{},
				            elems:{},
					    gui:{},
					    currentGen:{},
					    nextGen:{}
				      },
				setConfig : function (conf) {
						    this.config = conf
						    this.grid.gui = Array.matrix(this.config.cells, this.config.cells,null);
						    this.grid.currentGen = Array.matrix(this.config.cells, this.config.cells, false);
						    this.grid.nextGen = Array.matrix(this.config.cells, this.config.cells, false);

	    			},
				createGrid : function() {
						     var x = this.config.origin.x;
						     var y = this.config.origin.y;
						     var maxx = this.config.cells * this.config.size + x;
						     var maxy = maxx - x + y;
						     this.grid.frame = this.paper.rect(x,y,maxx - x, maxy -y).attr(this.config.style.gridattr);
						     this.paper.setStart();
						     for(var i  = 0;i < this.config.cells; i++) {
							     for(var j = 0; j < this.config.cells; j++) {
								     var el = this.paper.rect(x,y,this.config.size, this.config.size).attr(this.config.style.gridattr);
								     el.attrs._x = i;
								     el.attrs._y = j;
									this.grid.gui[i][j] = el;
									x+= this.config.size;
							     }
							x = this.config.origin.x;     
							y+= this.config.size;
						     }
						     this.grid.elems = this.paper.setFinish();
						     //this.grid.frame.toFront().attr({fill: "#cc6232",opacity:0});
						     this.grid.frame.attr({fill: "#cc6232",opacity:0});
						     
				},
				setup : function(cnf) {
						var i, el;
						for(i = 0; i < cnf.setup.length; i++ ) {
							el = cnf.setup[i];
							this.live(this.grid.currentGen,el[0], el[1]);
						}

					},
				live : function(gen, x, y) {
					       gen[x][y] = true;
					       this.grid.gui[x][y].attr(this.config.style.lifeattr);
				       },
				die : function(gen,x,y) {
					       gen[x][y] = false;
					       this.grid.gui[x][y].attr(this.config.style.deathattr);
				      },
				toggle : function(x, y) {
						 var gen = this.grid.currentGen;
						if(gen[x][y]) {
							this.die(gen, x, y);
						} else {
							this.live(gen, x, y);
						}
					 },
				start : function() {
						this.running = true;
						var game = this;
						var helper = function() {
							game.tick();
						};
						this.runner = setInterval(helper, this.config.speed);
					},
				stop : function() {
					       this.running = false;
					       clearInterval(this.runner);

				       },
				tick : function() {
				//	console.log('tick');
					var i, j, a;
					for(i=0;i<this.grid.gui.length;i++) {
						for(j=0;j < this.grid.gui[i].length;j++) {
							if(this.willLive(this.grid.currentGen,i,j)) {
								this.live(this.grid.nextGen, i,j);
							} else {
								this.die(this.grid.nextGen, i, j);
							}
						}
					}
					a = this.grid.currentGen;
					this.grid.currentGen = this.grid.nextGen;
					this.grid.nextGen = a;
				       },
				willLive: function(grid, x, y)  {
					var alive,xl, yl, dx, dy,mx, my,perm,i,lifearound = 0;
					alive = grid[x][y];
					xl = grid.length -1 ;
					yl = grid[x].length -1;
					dx = (x + 1) % xl;
					dy = (y + 1) % yl;
					mx = x == 0 ? xl -1 : x -1;
					my = y == 0 ? yl - 1 : y -1;
					perm = [[dx,y],[x,dy],[mx,y],[x,my],[dx,dy],[mx,my],[dx,my],[mx,dy]];
					i = 0;
					while(i < perm.length ) {
						
						if(grid[perm[i][0]][perm[i][1]]) {
							lifearound++;
						}
						i++;
					}
					//console.log(x + ", "+ y + ": " +lifearound);
					return (alive && lifearound == 2) || (lifearound === 3);

					
				}
				

			};
