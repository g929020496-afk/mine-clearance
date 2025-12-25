<template>
	<view class="content">
		<RuiMinesweeper/>
	</view>
</template>

<script>
	import RuiMinesweeper from '@/components/rui-minesweeper/rui-minesweeper.vue';
	export default {
		components: {
			RuiMinesweeper
		},
		data() {
			return {}
		},
		onLoad() {},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
sss