var game = new Phaser.Game(800, 600, Phaser.AUTO, "container");
//配置对象，用于存储全局变量
var config = {
	menu:{},
	loading:{},
	stage1:{
		world_width:1600
	},
	gameover:{},
	charactor:{
		_obj:{},//phaser对象
		_health:100,//生命值
		_score:0,//得分
		_gravity:500,//重力
		_lifes:3,
		_bj:0.2,
		_bjsh:10
	},
	enemy:{
		_health:200
	},
	animations:{},
	timeIndex:0
};
game.state.add("loading", loading);
game.state.add("stage1",stage1);
game.state.add("sgameover", sgameover);
//game.state.start("testStage1");
game.state.start("loading");