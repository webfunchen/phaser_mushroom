//预加载关卡
function loading(game) {
	this.preload = function () {
		//设置缩放模式
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.load.image('bg1', 'assets/bg.jpg');
		game.load.image('wall', 'assets/block.png');
		game.load.image('loading', 'assets/loading.gif');
		game.load.image('gameover', 'assets/gameover.png');
		//预加载精灵图
		game.load.spritesheet('charactor', 'assets/cha.png', 32, 32);
		game.load.spritesheet('enemy1', 'assets/mos.png', 30, 32);
		game.load.spritesheet('frame', 'assets/frame.png', 45, 47);
		game.load.spritesheet('skill1', 'assets/skill2.png', 50, 47);
		game.load.image('food', 'assets/food.png');
	};
	this.create = function () {
		game.add.image(game.width / 2 - 110, game.height / 2 - 10, 'loading');
	};
	this.init = function () {
		config.loading.loadingText = game.add.text(game.width / 2 - 50, game.height / 2 + 30, "进度:0%", {
			fontSize: '14px',
			fill: '#fff'
		});
		game.load.onFileComplete.add(function () {
			var progress = game.load.progress; //1%-100%
			config.loading.loadingText.text = "进度:" + progress + "%";
			if (progress == 100) {
				//加载而完成后切换到state1
				setTimeout(function () {
					game.state.start("stage1");
				}, 300);
			}
			//loadingText.Text("进度:"+progress+"%");
		});
	}
}

function stage1(game) {
		var self = this;
		self.world_width = config.stage1.world_width;
		this.create = function () {
			game.add.image(0, 0, 'bg1');
			game.world.setBounds(0, 0, self.world_width, game.height); //如果需要使用摄像机聚焦，就必须用这个设置世界视野大小
			config.cursors = game.input.keyboard.createCursorKeys();
			self.cha_fun = new createPeo();
			self.wall_fun = new self.createWall();
			self.enemy_fun=new createEnemy();
			self.food_fun=new createFood();
			document.getElementById("user-lives-num").innerHTML=config.charactor._lifes;
			//self.frame_fun=new createFrame();
		};
		this.update = function () {
			config.timeIndex=+1;
			if(config.timeIndex>1000){config.timeIndex=0;}
			game.physics.startSystem(Phaser.Physics.ARCADE); //指定物理引擎
			game.camera.focusOn(config.charactor._obj);
			game.physics.arcade.collide(config.charactor._obj, config.stage1.wall); //设置这句话后不会穿墙
			game.physics.arcade.collide(config.charactor._obj, config.stage1.wallt); //墙两边的端点
			game.physics.arcade.collide(config.skill, config.stage1.wallt); //墙两边的端点
			game.physics.arcade.collide(config.skill, config.stage1.wall); //墙两边的端点
			game.physics.arcade.collide(config.stage1.food, config.stage1.wallt); //墙两边的端点
			game.physics.arcade.collide(config.stage1.food, config.stage1.wall); //墙两边的端点
			game.physics.arcade.collide(config.enemy, config.stage1.wall,function(a,b){
				self.enemy_fun.autoMove();
			}); //设置这句话后不会穿墙
			game.physics.arcade.collide(config.enemy, config.stage1.wallt,function(a,b){
				if(a.dir==0)
				{a.x-=10;}
				else
				{a.x+=10;}
				a.dir=1-a.dir;
			});
			//食物跟角色的碰撞
			game.physics.arcade.collide(config.charactor._obj,config.stage1.food,function(a,b){
				b.destroy();
				config.charactor._score+=1;
				document.getElementById("score-num").innerHTML=config.charactor._score;
				self.food_fun.suiji();
			});
			//技能和怪物的碰撞
			game.physics.arcade.overlap(config.enemy, config.skill,function(a,b){
				/*a.destroy();
				b.destroy()*/
				b.hurt=parseInt(Math.random()*30);
				var bj=config.charactor._bj,bjsh=config.charactor._bjsh;//定义暴击率和暴击伤害
				if(Math.random()<bj)
				{
					b.hurt=b.hurt*bjsh;
				}
				else
				{
					b.hurt=b.hurt;
				}
				if(b.seconds%10==0)
				{
					if(a.health>0)
					{a.health-=b.hurt;}
					else
					{
						b.kill();
					}
					self.enemy_fun.checkdead(a);
					self.enemy_fun.showhurt(a,b.hurt);
				}
				b.seconds+=1;
			});
			self.cha_fun.addControl();
			game.physics.arcade.overlap(config.enemy,config.charactor._obj, function(a,b){
				//b.destroy();
				//重新随机生成一个怪物
				//self.enemy_fun.createOne([[Math.random()*config.stage1.world_width,0]]);
				config.charactor.hittimes+=1;
				if(config.charactor.hittimes%10==0)
				{
					//每撞10次产生伤害
					config.charactor._health-=10;
					self.cha_fun.showhurt(config.charactor._obj,10);
				}
				//b.kill();
				//b.healthGUI.destroy();
			});
		};
		this.createWall = function () {
			var _this = this;
			_this.w = 32;
			_this.h = 32;
			_this.createOne=function(start,end,height){
				//以32位单位，从第start个开始，end个结束,height为高度
				for (var i = start; i < end; i++) {
					if(i==start||i==end-1)
					{
						var onewall = config.stage1.wallt.create(i * _this.w, height, 'wall');//创建两端的节点
					}
					else
					{
						var onewall = config.stage1.wall.create(i * _this.w, height, 'wall');
					}
					
					onewall.body.immovable = true;
				}
			}
			_this.buildWall=function(){
				//创建墙体
				_this.createOne(0,self.world_width/_this.w,game.height-_this.h);
				_this.createOne(5,50,450);
				_this.createOne(0,48,350);
				_this.createOne(5,50,250);
				_this.createOne(5,48,150);
				_this.createOne(0,3,100);

			}
			_this.init = function () {
				config.stage1.wall = game.add.group();
				config.stage1.wall.enableBody = true;
				config.stage1.wallt = game.add.group();
				config.stage1.wallt.enableBody = true;
				_this.buildWall();
			}
			_this.init();
		}
	}
	//游戏结束画面
function sgameover(game) {
	this.create = function () {
		game.add.image(game.width / 2 - 96, game.height / 2 - 22, 'gameover');

		game.add.text(game.width / 2 - 60, game.height / 2 + 50, "你吃了" + config.charactor._score + "个蘑菇", {
			fontSize: "16px",
			fill: "#fff"
		})
	}
}