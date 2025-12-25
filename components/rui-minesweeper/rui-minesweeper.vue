<template>
<view>
	<view class="rui-flex-cc">
		<view class="rui-flex-ac">
			<view :class="{
				'rui-navbar-li': true,
				'rui-active': nav.ischeck
			}" 
			@click="changeGrade(idx)"
			v-for="(nav,idx) in navbars" :key="nav.keyId">
				{{nav.name}}
			</view>
		</view>
	</view>
	<view class="rui-flex-cc">
		<view class="rui-minesweeper-content">
			<view class="rui-minesweeper-header-content">
				<view class="rui-header-counter">{{ bombCount.toString().padStart(3, '0') }}</view>
				<view class="rui-header-btn" @click="start">
					<view v-if="isGameOver">
						<image v-if="isSuccess" :src="icon.iconFaceSuccess" class="rui-btn-icon"></image>
						<image v-else :src="icon.iconFaceFail" class="rui-btn-icon"></image>
					</view>
					<image v-else :src="icon.iconFaceNormal" class="rui-btn-icon"></image>
				</view>
				<view class="rui-header-counter">{{ sec.toString().padStart(3, '0') }}</view>
			</view>
			<!-- 雷区 -->
			<view class="rui-main-content">
				<view class="rui-row" v-for="(row,ridx) in cells" :key="row.keyId">
					<view class="rui-col" v-for="(col,cidx) in  row.list"
					@click="onClick(ridx, cidx)"
					@contextmenu.prevent="onFlag(ridx, cidx)"
					:key="col.keyId">
						<view v-if="isGameOver">
							<image v-if="!col.bomb" :src="icon[`icon${col.bombCount}`]" class="rui-icon"></image>
							<view v-else>
								<image v-if="col.opened" :src="icon.iconBlood" class="rui-icon"></image>
								<image v-else :src="icon.iconMine" class="rui-icon"></image>
							</view>
						</view>
						<view v-else>
							<image v-if="col.flag" :src="icon.iconFlag" class="rui-icon"></image>
							<image v-else-if="col.opened" :src="icon[`icon${col.bombCount}`]" class="rui-icon"></image>
							<image v-else-if="!col.opened" :src="icon.iconBlank" class="rui-icon"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 切换点击事件类型 -->
	<view class="rui-flex-cc">
		<view class="rui-flex-ac">
			<view :class="{
				'rui-navbar-li': true,
				'rui-active': typeItem.ischeck
			}" 
			@click="changeClickType(idx)"
			v-for="(typeItem,idx) in chooseClickTypes" :key="typeItem.keyId">
				{{typeItem.name}}
			</view>
		</view>
	</view>
</view>
</template>

<script>
	import icon from './icon';
	import { randomString, handleAroundPoints } from './utils';
	export default {
		name:"RuiMinesweeper",
		data() {
			return {
				icon,
				sec: 0,
				bombCount: 0,
				blankCount: 0,
				maxrow: 0,
				maxcol: 0,
				isGameOver: false, 
				isSuccess: false,
				cells: [],
				chooseClickTypes: [{
					name: '翻开',
					type: 0,
					keyId: `id-${randomString()}`,
					ischeck: true
				},{
					name: '插旗',
					type: 1,
					keyId: `id-${randomString()}`,
					ischeck: false
				}],
				navbars: [{
					name: '初级',
					row: 9,
					col: 9,
					bombCount: 10,
					keyId: `id-${randomString()}`,
					ischeck: true
				},{
					name: '中级',
					row: 16,
					col: 16,
					bombCount: 40,
					keyId: `id-${randomString()}`,
					ischeck: false
				},{
					name: '高级',
					row: 20,
					col: 20,
					bombCount: 40,
					keyId: `id-${randomString()}`,
					ischeck: false
				},{
					name: '自定义',
					row: 30,
					col: 30,
					bombCount: 150,
					keyId: `id-${randomString()}`,
					ischeck: false
				}],
			};
		},
		created(){
			this.start()
		},
		methods: {
			// 切换难度
			changeGrade(idx){
				let navbars = this.navbars;
				navbars.forEach(item => item.ischeck = false);
				navbars[idx].ischeck = true;
				this.start();
			},
			// 切换点击事件类型
			changeClickType(idx){
				let chooseClickTypes = this.chooseClickTypes;
				chooseClickTypes.forEach(item => item.ischeck = false);
				chooseClickTypes[idx].ischeck = true;
			},
			// 开始重置
			start(){
				let curGrade = this.navbars.find(item => item.ischeck);
				let { bombCount, row, col } = curGrade;
				this.sec = 0;
				this.isGameOver = false;
				this.isSuccess = false;
				this.maxrow = row;
				this.maxcol = col;
				this.bombCount = bombCount;
				this.blankCount = row * col - bombCount;
				// 初始化网格
				this.initCells(row, col);
				// 随机放置地雷
				this.fixUpMinesweepers();
				// 计算当前位置周边雷的个数
				this.findCurrentPointAroundMinesweeperCount();
			},
			// 初始化网格
			initCells(row, col){
				this.cells = Array.from({ length: row }, (r, ridx) => {
					return {
						keyId: `id-${randomString()}`,
						list: Array.from({length: col}, (c, cidx) => {
							return {
								keyId: `id-${randomString()}`,
								bomb: false, 
								bombCount: 0, 
								flag: false, 
								opened: false
							}
						})
					}
				})
			},
			// 随机放置地雷
			fixUpMinesweepers(){
				let cells = this.cells;
				for(let i = 0; i < this.bombCount; i++){
					let row = Math.floor(Math.random() * this.maxrow);
					let col = Math.floor(Math.random() * this.maxcol);
					if(!cells[row].list[col].bomb){
						cells[row].list[col].bomb = true;
					} else {
						i--;
					}
				}
			},
			// 计算当前位置周边雷的个数
			findCurrentPointAroundMinesweeperCount(){
				let cells = this.cells;
				for(let row = 0; row < this.maxrow; row++) {
					for(let col = 0; col < this.maxcol; col++) {
						handleAroundPoints({
							cells, 
							row, 
							col, 
							maxrow: this.maxrow,
							maxcol: this.maxcol,
							callback: cCell => cells[row].list[col].bombCount += cCell.bomb ? 1 : 0
						})
					}
				}
			},
			// 计时器一千秒
			onTick() {
				if (this.sec < 999){
					this.sec++;
				} else {
					// 时间完成，结束游戏
					this.onStop();
				}
			},
			// 结束游戏
			onStop() {
				this.isGameOver = true;
				if(this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			// 爆炸
			onExplode(){
				this.isSuccess = false;
				this.onStop();
			},
			// 成功
			onSuccess(){
				this.isSuccess = true;
				this.onStop();
			},
			// 插旗操作
			onFlag(row, col){
				const cell = this.cells[row].list[col];
				cell.flag = !cell.flag
				cell.flag ? this.bombCount-- : this.bombCount++; 
			},
			// 点击事件
			onClick(row, col) {
				let curTypeItem = this.chooseClickTypes.find(item => item.ischeck);
				if(!this.timer){
					this.timer = setInterval(this.onTick, 1000);
				}
				if(curTypeItem.type == 0){
					const cell = this.cells[row].list[col];
					if (cell.flag){
						return false;
					}
					if(cell.bomb){
						cell.opened = true;
						this.onExplode();
					} else {
						this.onOpen(row, col);
					}
				} else if(curTypeItem.type == 1){
					this.onFlag(row, col);
				}
			},
			// 开启当前位置
			onOpen(row, col) {
				const cell = this.cells[row].list[col];
				cell.opened = true;
				cell.flag = false;
				this.blankCount--;
				if (this.blankCount < 1) {
					this.onSuccess()
				} else if (cell.bombCount === 0) {
					this.openAround(row, col)
				}
			},
			// 开启当前位置的周边没有雷区和没有开启的位置
			openAround(row, col) {
				let cells = this.cells;
				handleAroundPoints({
					cells, 
					row, 
					col, 
					maxrow: this.maxrow,
					maxcol: this.maxcol,
					callback: (cCell, crow, ccol) => {
						if (!cCell.opened && !cCell.bomb && !cCell.flag){
							this.onOpen(crow, ccol);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$primary: #C0C0C0;
	$light: #EEEEEE;
	$dark: #969696;
	.rui-flex-cc{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.rui-flex-ac{
		display: flex;
		align-items: center;
	}
	.rui-icon{
		width: 25px;
		height: 25px;
		display: block;
	}
	.rui-navbar-li{
		color: #23527c;
		margin: 20px;
	}
	.rui-navbar-li.rui-active{
		color: #444;
		font-weight: 700;
	}
	.rui-minesweeper-content{
		background-color: $primary;
		margin: 20px auto;
		padding: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: default;
		user-select: none;
		.rui-minesweeper-header-content{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border: 3px inset $light;
			box-sizing: border-box;
			padding: 5px 10px;
			.rui-header-counter {
				background-color: black;
				color: red;
				font-family: Impact;
				min-width: 2em;
				text-align: center;
			}
			.rui-header-btn {
				border: 2px outset #eee;
				width: 25px;
				height: 25px;
				display: flex;
				align-items: center;
				justify-content: center;
				.rui-btn-icon{
					width: 21px;
					height: 21px;
					border-radius: 50%;
					display: block;
				}
			}
		}
		.rui-main-content{
			width: 100%;
			height: 100%;
			border: 3px inset #eee;
			box-sizing: border-box;
		}
		.rui-row{
			display: flex;
			align-items: center;
		}
		.rui-col {
			flex: none;
			width: 25px;
			height: 25px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.rui-col.no-event {
		  pointer-events: none;
		}
	}
</style>