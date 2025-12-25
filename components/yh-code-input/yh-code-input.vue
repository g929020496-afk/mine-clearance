<template>
	<view class="code-input-wrap">
		<view class="code-input-item" :class="{border:mode === 'border'}" :style="itemStyle" v-for="(item,index) in codeLength" :key="index">
			<view class="dot" v-if="dot && codeList.length > index"></view>
			<text v-else >{{codeList[index]}}</text>
			<view class="cursor" :style="cursorStyle" v-if="isFocus && codeList.length === index"></view>
			<view class="line" v-if="mode === 'line'" :style="lineStyle"></view>
		</view>
		<input class="input" 
		    :maxlength="maxlength" 
			:type="inputType" 
			:value="inputValue"  
			:adjustPosition="adjustPosition"
			:disabled="disabledKeyboard"
			@input="input" 
			@focus="isFocus = true" 
			@blur="isFocus = false"
			/>
	</view>
</template>

<script>
	export default {
		props:{
			// #ifdef VUE2
			value: {
				type: [String, Number],
				default: ""
			},
			// #endif
			// #ifdef VUE3
			modelValue: {
				type: [String, Number],
				default: ""
			},
			// #endif
			dot:{//是否输入框内容用圆点替换 
				type: Boolean,
				default: false
			},
			adjustPosition: {// 键盘弹起时，是否自动上推页面
				type: Boolean,
			    default: true
			},
			disabledKeyboard: {//是否隐藏原生键盘
			    type: Boolean,
			    default: false
			},
			inputType:{//输入框类型
				type:String,
				default:"number"
			},
			maxlength:{//最大长度
				type:Number,
				default:6
			},
			color:{
				type:String,
				default:"#000"
			},
			itemW:{//输入框宽
				type:String,
				default:'60rpx'
			},
			itemH:{//输入框高
				type:String,
				default:'60rpx'
			},
			itemBg:{//输入框背景色 
				type:String,
				default:'#f5f5f5'
			},
			itemRound:{//输入框圆角
				type:String,
				default:'4rpx'
			},
			itemFontSize:{//输入内容文字大小
				type:String,
				default:'28rpx'
			},
			bold:{
				type:String,
				default:'500'
			},
			cursorW:{//聚焦线宽
				type:String,
				default:'2rpx'
			},
			cursorH:{//聚焦线高
				type:String,
				default:'40rpx'
			},
			cursorBg:{//聚焦线背景
				type:String,
				default:'#000'
			},
			lineW:{//底线宽
				type:String,
				default:'100%'
			},
			lineH:{//底线高
				type:String,
				default:'6rpx'
			},
			lineBg:{//底线背景
				type:String,
				default:'#000'
			},
			lineRound:{//底线圆角
				type:String,
				default:'0rpx'
			},
			gutter:{//输入框间隙
				type:String,
				default:'10rpx'
			},
			mode:{//输入框模式 box 为背景色样式 line 为下划线样式 border 边框样式
				type:String,
				default:'box' 
			},
			borderColor:{
				type:String,
				default:'#A8A8A8' 
			},
		},
		// #ifdef VUE3
		emits: ['update:modelValue','finish','change'],
		// #endif
		// #ifdef MP
		options: {
		  styleIsolation: 'shared'
		},
		// #endif
		data(){
			return {
				inputValue:"",
				isFocus:false
			}
		},
		watch:{
			// #ifdef VUE2
			value:
			// #endif
			// #ifdef VUE3
			modelValue:
			// #endif
			{
			   handler(v){
				   this.inputValue = String(v).substring(0, this.maxlength)
			   },
			   immediate:true
			}
		},
		computed:{
			codeLength(){
				return new Array(+this.maxlength)
			},
			codeList(){
				return String(this.inputValue).split('')
			},
			itemStyle(){
				return {
					width:this.itemW,
					height:this.itemH,
					backgroundColor:this.mode === 'box' || this.itemBg ? this.itemBg : 'transparent',
					marginRight:this.gutter,
					borderRadius:this.itemRound,
					fontSize:this.itemFontSize,
					fontWeight:this.bold,
					'--color':this.color,
					'--border-color':this.borderColor
				}
			},
			cursorStyle(){
				return {
					width:this.cursorW,
					height:this.cursorH,
					backgroundColor:this.cursorBg
				}
			},
			lineStyle(){
				return {
					width:this.lineW,
					height:this.lineH,
					backgroundColor:this.lineBg,
					borderRadius:this.lineRound
				}
			},
		},
		methods:{
			input(e){
				const value = e.detail.value
				this.inputValue = value
				this.$emit('change', value)
				// #ifdef VUE2
				this.$emit('input', value)
				// #endif
				// #ifdef VUE3
				this.$emit('update:modelValue', value)
				// #endif
				if (String(value).length >= +this.maxlength) {
					this.$emit('finish', value)
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.code-input-wrap{
		position: relative;
		display: flex;
		overflow: hidden;
		box-sizing: border-box;
		.code-input-item{
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--color);
			&.border{
				border: 1rpx solid var(--border-color);
			}
			&:last-of-type{
				margin-right: 0 !important;
			}
			.cursor{
				opacity: 1;
				animation: cursor-flicker 1s infinite;
			}
			/* #ifndef APP-NVUE */
			@keyframes cursor-flicker{
				0%{
					opacity: 1;
				}
				50%{
					opacity: 0;
				}
				100%{
					opacity: 1;
				}
			}
			/* #endif */
		
			.line{
				position: absolute;
				bottom: 0;
				left: 0;
			}
			.dot {
				width: 7px;
				height: 7px;
				border-radius: 100px;
				background-color: var(--color);
			}
			
		}
		.input{
			width: 1500rpx;
			position: absolute;
			height: 100%;
			left: -750rpx;
			top: 0;
			text-align: left;
			background-color: transparent;
			color: transparent;
			opacity: 0;
			// caret-color: transparent !important;
			
			&:deep(.uni-input-input){
				user-select: none;
				-webkit-user-select: none;
				&::selection {
					background: transparent;
					color: transparent;
				}
			}
		}
	}
	
</style>