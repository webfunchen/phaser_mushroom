//创建敌人
function createEnemy() {
		var _this = this;
		this.w = 30;
		this.h = 32;
		this.health = config.enemy._health;
		_this.createOne = function (arr) {
			arr.forEach(function (v, k) {
				var oneenemy = config.enemy.create(v[0], v[1], 'enemy1');
				oneenemy.body.gravity.y = 800;
				oneenemy.body.bounce.y = 0;
				oneenemy.animations.add("enemy1_left", [3, 4, 5]);
				oneenemy.animations.add("enemy1_right", [6, 7, 8]);
				oneenemy.dir = parseInt(Math.random() * 100) % 2;
				oneenemy.health = _this.health;
				oneenemy.healthGUI = game.add.text(oneenemy.x + 5, oneenemy.y - 15, _this.health, {
					fontSize: '12px',
					fill: '#0f0'
				});
			});
			//oneenemy.body.immovable = true;
		}
		_this.showhealth = function (obj) {
			obj.healthGUI.text = obj.health;
			obj.healthGUI.x = obj.x + 5;
			obj.healthGUI.y = obj.y - 15;
		};
		//随机产生一个怪物
		_this.suiji = function () {
				var x = parseInt(Math.random() * 100 % 49),
					y = parseInt(Math.random() * 100 % 15);
				x == 5 || x == 6 || x == 7 ? x = 10 : "";
				_this.createOne([[x * 32, y * 32]]);
			}
			//死亡的话操作
		_this.dead = function (obj) {
				config.animations.frame_fun.addone(obj.x, obj.y - 10);
				obj.kill();
				obj.healthGUI.destroy();
				//如果死亡，则随机产生一个怪物;
				_this.suiji();
			}
			//显示伤害
		_this.showhurt = function (obj, hurts) {
			if (hurts > 30) {
				var hurttext = "致命一击 -" + hurts;
				var hurt = game.add.text(obj.x, obj.y - 10, hurttext, {
					fontSize: "14px",
					fill: '#fcd038',
					align: "center"
				});
				hurt.anchor.set(0.5);//设置居中
				//添加动画
				//to(properties, duration, ease, autoStart, delay, repeat, yoyo) 
				var tween = game.add.tween(hurt);
				tween.from({
					y: obj.y - 30,
					fontSize: "20px"
				}, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, false);
				setTimeout(function () {
					hurt.destroy();
					//tween.destroy();
				}, 600);
			} else {
				var hurttext = "-" + hurts,
					fontsize = "12px";
				var hurt = game.add.text(obj.x, obj.y - 30, hurttext, {
					fontSize: fontsize,
					fill: '#f5f813'
				});
				var tween = game.add.tween(hurt);
				tween.to({
					y: obj.y - 50,
					fontSize: 12
				}, 900, Phaser.Easing.Bounce.Out, true, 0, 0, false);
				setTimeout(function () {
					hurt.destroy();
					//tween.destroy();
				}, 500);
			}

		};
		//检测是否死亡
		_this.checkdead = function (obj) {
			if (obj.health <= 0) {
				obj.health = 0;
				_this.dead(obj)
			}
		}
		_this.autoMove = function (dir) {
			//动画必须要在update构造函数里执行
			config.enemy.children.forEach(function (v, k) {
				_this.showhealth(v);
				if (v.dir == 0) {
					v.body.velocity.x = 80;
					v.animations.play("enemy1_right", 15);
				} else {
					v.body.velocity.x = -80;
					v.animations.play("enemy1_left", 15);
				}
				if (v.x <= 0) {
					v.dir == 1 ? v.dir = 0 : v.dir = 1;
					v.x = 3;
				}
				if (v.x >= config.stage1.world_width - _this.w) {
					v.dir == 0 ? v.dir = 1 : v.dir = 0;
					v.x = config.stage1.world_width - _this.w - 3;
				}
			});
		}
		_this.init = function () {
			config.enemy = game.add.group();
			config.enemy.enableBody = true;
			_this.createOne([[200, 0], [150, 300], [1200, 90], [500, 100], [700, 500], [900, 300], [1000, 300], [600, 400], [700, 500]]);
			config.animations.frame_fun = new createFrame();
			//_this.createOne([[400, 0], [100, 450], [180, 405]]);
			/*
			随机生成怪物
			var temparr=[];
			for(var i=0;i<6;i++)
			{
				temparr.push([Math.random()*1600,Math.random()*550]);
			}
			_this.createOne(temparr)*/
		}
		_this.init();
	}
	//创建主角色
function createPeo() {
		var _this = this;
		config.charactor._health = 100;
		config.charactor.hittimes = 0;
		//显示血量
		_this.showhealth = function () {
				config.charactor.blood.text = config.charactor._health;
				config.charactor.blood.x = config.charactor._obj.x + 5;
				config.charactor.blood.y = config.charactor._obj.y - 15;
				if (config.charactor._health <= 0) {
					_this.dead();
				}
			}
			//显示伤害
		_this.dead = function () {
			if (config.charactor._lifes > 0) {
				config.charactor._lifes -= 1;
				config.charactor._health = 100;
				config.charactor.hittimes = 0;
				config.charactor._obj.x = 0;
				config.charactor._obj.y = 0;
				document.getElementById("user-lives-num").innerHTML = config.charactor._lifes;
			} else {
				game.state.start("sgameover");
			}


		}
		_this.showhurt = function (obj, hurts) {
			var hurt = game.add.text(obj.x, obj.y - 30, "-" + hurts, {
				fontSize: '16px',
				fill: '#f906e5'
			});
			//添加动画
			var tween = game.add.tween(hurt);
			tween.to({
				y: obj.y - 50
			}, 900, Phaser.Easing.Bounce.Out, true, 0, 0, false);
			setTimeout(function () {
				hurt.destroy();
				//tween.destroy();
			}, 500);
		};
		_this.createAnim = function () {
			config.charactor._obj.animations.add("walkleft", [3, 4, 5]);
			config.charactor._obj.animations.add("walkright", [6, 7, 8]);
			config.charactor._obj.animations.add("walkup", [9, 10, 11]);
		}
		_this.addControl = function () {
			//添加按键控制
			//config.cursors = game.input.keyboard.createCursorKeys();
			_this.showhealth();
			config.charactor._obj.body.velocity.x = 0;
			if (config.cursors.left.isDown) {
				config.charactor._obj.body.velocity.x = -150;
				config.charactor._obj.animations.play("walkleft", 20);
				config.charactor._obj.dir = 0;
			} else if (config.cursors.right.isDown) {
				config.charactor._obj.body.velocity.x = 150;
				config.charactor._obj.animations.play("walkright");
				config.charactor._obj.dir = 1;
			}
			if (config.cursors.up.isDown) {
				if (!self._isrunning) {
					self._isrunning = true;
					config.charactor._obj.body.velocity.y = -300;
					config.charactor._obj.animations.play("walkup", 20);
					clearTimeout(self._isjump);
					self._isjump = setTimeout(function () {
						self._isrunning = false;
					}, 1000);
				}
			} else if (config.cursors.fire.isDown) {
				//console.log('fire');
				if (config.charactor._obj.dir == 1)
					_this.skill_fun.addone(config.charactor._obj.x + 32, config.charactor._obj.y - 30, config.charactor._obj.dir);
				else if (config.charactor._obj.dir == 0)
					_this.skill_fun.addone(config.charactor._obj.x - 20, config.charactor._obj.y - 30, config.charactor._obj.dir);
			}
		}
		_this.init = function () {
			config.charactor._obj = game.add.sprite(10, 0, "charactor", 1);
			//设置角色的重力
			game.physics.arcade.enable(config.charactor._obj);
			config.charactor._obj.body.bounce.y = 0.2;
			config.charactor._obj.body.gravity.y = config.charactor._gravity;
			config.charactor._obj.body.collideWorldBounds = true;

			//设置角色动画
			_this.createAnim();
			_this.skill_fun = new createSkill();
			config.cursors = game.input.keyboard.addKeys({
				'up': 38,
				'down': 40,
				'left': 37,
				'right': 39,
				'fire': 32
			});
			//初始化血条
			config.charactor.blood = game.add.text(config.charactor._obj.x + 5, config.charactor._obj.y - 15, config.charactor._health, {
				fontSize: '14px',
				fill: '#fff'
			});
		}
		_this.init();
	}
	//创建火焰
function createFrame() {
		//创建火焰，用于敌方死亡
		var _this = this;
		config.frame = game.add.group();
		this.addone = function (x, y) {
			var oneframe = config.frame.create(x, y, 'frame');
			oneframe.animations.add("anim_frame", [0, 1, 2, 3, 4, 5, 6, 7, 8]);
			oneframe.animations.play("anim_frame", 40, true);
			//产生火焰2s后火焰自动消失
			setTimeout(function () {
				oneframe.destroy();
			}, 2000);
		}
	}
	//创建技能
function createSkill() {
		var _this = this;
		this.time_jiange = 2000;
		this.isruning = false;
		config.skill = game.add.group();
		this.last = 1500; //技能持续时间
		this.delay = 500; //技能释放的间隔时间
		this.hurt = 20;
		this.addone = function (x, y, dir) {
			if (!_this.isruning) {
				_this.isruning = true;
				var skill = config.skill.create(x, y, 'skill1');
				game.physics.arcade.enable(skill);
				skill.body.bounce.x = 0.5;
				skill.body.bounce.y = 0.2;
				skill.body.gravity.y = 300;
				dir == 0 ? skill.body.gravity.x = -300 : skill.body.gravity.x = 300;
				skill.animations.add("skill_frame", [0, 1, 2, 3, 1, 2, 3, 4, 5, 6]);
				skill.animations.play("skill_frame", 20, true);
				skill.seconds = 0;
				skill.hurt = _this.hurt;
				//产生技能10s后火焰自动消失
				setTimeout(function () {
					skill.destroy();
				}, _this.last);
				setTimeout(function () {
					_this.isruning = false;
				}, _this.delay);
			}

		}
	}
	//创建食物
function createFood() {
	var _this = this;

	this.createOne = function (x, y) {
		//x,y已32为单位
		var food = config.stage1.food.create(x * 32, y * 32, 'food');
		game.physics.arcade.enable(food);
		food.body.bounce.y = 0.2;
		food.body.gravity.y = 300;
	}
	this.suiji = function () {
		var x = parseInt(Math.random() * 100 % 49),
			y = parseInt(Math.random() * 100 % 15);
		_this.createOne(x,y);
	}
	this.init = function () {
		config.stage1.food = game.add.group();
		_this.createOne(3, 1);
		_this.createOne(6, 1);
		_this.createOne(12, 1);
		_this.createOne(30, 1);
		_this.createOne(9, 5);
		_this.createOne(15, 5);
		_this.createOne(30, 5);
		_this.createOne(40, 5);
		_this.createOne(15, 10);
		_this.createOne(10, 10);
		_this.createOne(25, 10);
		_this.createOne(20, 10);
		_this.createOne(10, 16);
		_this.createOne(20, 16);
		_this.createOne(30, 16);
		_this.createOne(40, 16);
		_this.createOne(10, 16);
		_this.createOne(32, 16);
	}
	this.init();
}