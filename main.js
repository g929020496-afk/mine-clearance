import App from './App'
import store from './store'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$adpid = "1111111111"
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}

import Decimal from "decimal.js";
const calculate = (a, operator, b) => {
	const decimalA = new Decimal(a);
	const decimalB = new Decimal(b);
	switch (operator) {
		case '+':
			return decimalA.plus(decimalB).toString();
		case '-':
			return decimalA.minus(decimalB).toString();
		case '*':
			return decimalA.times(decimalB).toString();
		case '/':
			return decimalA.dividedBy(decimalB).toString();
		default:
			throw new Error('Unsupported operator');
	}
}
Vue.prototype.$calculate = calculate;

App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$adpid = "1111111111"
	app.config.globalProperties.$backgroundAudioData = {
		playing: false,
		playTime: 0,
		formatedPlayTime: '00:00:00'
	}
	return {
		app
	}
}
// #endif
