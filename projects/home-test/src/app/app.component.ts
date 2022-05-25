import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'app-lib';
import { BigNumber } from 'bignumber.js';
import { environment } from '../environments/environment';
import { BootService } from './services/boot.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isAndroid;
    menuMouseOn = false;
    topOpen = false;
    menu = environment.menu;

    itemListBoxOne: any[] = [
        { imgUrl: '1', name: 'Payment Mining', tip: 'Pay in your choice of currency', tip1: 'Get paid to pay with Payment Mining' },
        { imgUrl: '2', name: 'Stablecoin Swaps', tip: 'Low Fees', tip1: 'Minimum Slippage', tip2: 'Low Risk' },
        {
            imgUrl: '3',
            name: 'Liquidity Mining',
            tip: 'Earn KST',
            tip1: 'Earn great APY on stablecoins'
        }
    ];

    Audited: any[] = [
        { imgUrl: 'certik' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'lingling' },
        { imgUrl: 'anchain' }
    ];

    Strategic: any[] = [
        { imgUrl: 'zhidao' },
        { imgUrl: 'anchain' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'anchain' },
        { imgUrl: 'zhidao' }
    ];

    Partners: any[] = [
        { imgUrl: 'zhidao' },
        { imgUrl: 'anchain' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'anchain' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'anchain' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'zhidao' },
        { imgUrl: 'anchain' },
        { imgUrl: 'zhidao' }
    ];

    amount = 0;
    amount2 = 0;
    amount3 = 0;
    showNumber = 0;
    ffInfo: any;

    constructor(public lang: LanguageService, public boot: BootService) {

    }

    ngOnInit(): void {
        // 获取用户端信息
        const ua = navigator.userAgent.toLowerCase();
        const info = {
            // 匹配IE浏览器
            ie: /msie/.test(ua) && !/opera/.test(ua),
            // 匹配Opera浏览器
            op: /opera/.test(ua),
            // 匹配Safari浏览器
            sa: /version.*safari/.test(ua),
            // 匹配Chrome浏览器
            ch: /chrome/.test(ua),
            // 匹配Firefox浏览器
            ff: /gecko/.test(ua) && !/webkit/.test(ua)
        };
        this.ffInfo = info;
        console.log(info);
        let arr = new Array();
        arr.push(this.boot.getTvl());
        arr.push(this.boot.getKSTMinted());
        arr.push(this.boot.getUnclaimedKST());
        Promise.all(arr).then(res => {
            let amount = res[0].toFixed(2, BigNumber.ROUND_DOWN);
            let amount2 = res[1].minus(10000000).toFixed(2, BigNumber.ROUND_DOWN);
            let amount3 = res[2].toFixed(2, BigNumber.ROUND_DOWN);
            this.numberChange1(80, 10, 0, amount);
            this.numberChange2(80, 10, 0, amount2);
            this.numberChange3(80, 10, 0, amount3);
        });
        const isMobile = (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i));
        const u = navigator.userAgent;
        this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    }

    onMenuMouseEnter() {
        this.menuMouseOn = true;
    }

    onMenuMouseLeave() {
        this.menuMouseOn = false;
    }

    onMenuClick() {
        this.topOpen = !this.topOpen;
    }

    changeLanguageFn() {
        this.lang.changeLanguage(this.lang.curLanguage === 'zh' ? 'en' : 'zh');
    }

    numberChange1(speed, times, start, end) {
        this.showNumber = end;
        const params = {
            speed: speed, // 变换速度
            times: times, // 变换次数
            start: start, // 起始数量
            end: end // 到达数量
        };
        // 分割后要遍历显示的数组
        const splitArr = [];

        // end 和 start之间的间隔
        const gap = Math.abs(params.end - params.start);
        // 判断是增加还是减少
        const add = params.end - params.start > 0;

        // 叠加数
        let splitNum = gap / params.times;
        // end字符串，用于判断变化过程是否显示小数
        const endStr = String(params.end);

        // end是否为浮点数，用途就是展示效果是否显示小数
        const isFloat = endStr.indexOf('.') !== -1;

        // 整数叠加数小于1的可能，间隔最小就为1，次数也为end-start的绝对值
        !isFloat && (splitNum < 1) && (splitNum = 1) && (params.times = gap);

        for (let i = 0; i < params.times; i++) {
            let tempNum = add ? (params.start + splitNum * i) : (params.start - splitNum * i);

            // 小数的位数
            let decimalNum = 0;
            // 如果是浮点数，就获取小数的位数
            isFloat && (decimalNum = endStr.length - endStr.indexOf('.') - 1);

            // 最后是否保留小数位
            splitArr.push(isFloat ? (parseInt((tempNum * 10 ** decimalNum).toString()) / (10 ** decimalNum)) : parseInt(tempNum));
        }
        // 如果增加，并且数组最后一位比end小，则push最后一位；如果减少，并且数组最后一位比end大，则push最后一位
        ((add && (splitArr[splitArr.length - 1] < params.end)) || (!add && (splitArr[splitArr.length - 1] > params.end))) && splitArr.push(params.end);

        let _index = 0;

        let _this = this;
        // 定时显示
        let intervalId = setInterval(function () {

            if (_index < splitArr.length) {
                _this.amount = (splitArr[_index++]);
            } else {
                clearInterval(intervalId);
            }
        }, params.speed);
    }

    numberChange2(speed, times, start, end) {
        this.showNumber = end;
        const params = {
            speed: speed, // 变换速度
            times: times, // 变换次数
            start: start, // 起始数量
            end: end // 到达数量
        };
        // 分割后要遍历显示的数组
        const splitArr = [];

        // end 和 start之间的间隔
        const gap = Math.abs(params.end - params.start);
        // 判断是增加还是减少
        const add = params.end - params.start > 0;

        // 叠加数
        let splitNum = gap / params.times;
        // end字符串，用于判断变化过程是否显示小数
        const endStr = String(params.end);

        // end是否为浮点数，用途就是展示效果是否显示小数
        const isFloat = endStr.indexOf('.') !== -1;

        // 整数叠加数小于1的可能，间隔最小就为1，次数也为end-start的绝对值
        !isFloat && (splitNum < 1) && (splitNum = 1) && (params.times = gap);

        for (let i = 0; i < params.times; i++) {
            let tempNum = add ? (params.start + splitNum * i) : (params.start - splitNum * i);

            // 小数的位数
            let decimalNum = 0;
            // 如果是浮点数，就获取小数的位数
            isFloat && (decimalNum = endStr.length - endStr.indexOf('.') - 1);

            // 最后是否保留小数位
            splitArr.push(isFloat ? (parseInt((tempNum * 10 ** decimalNum).toString()) / (10 ** decimalNum)) : parseInt(tempNum));
        }
        // 如果增加，并且数组最后一位比end小，则push最后一位；如果减少，并且数组最后一位比end大，则push最后一位
        ((add && (splitArr[splitArr.length - 1] < params.end)) || (!add && (splitArr[splitArr.length - 1] > params.end))) && splitArr.push(params.end);

        let _index = 0;

        let _this = this;
        // 定时显示
        let intervalId = setInterval(function () {

            if (_index < splitArr.length) {
                _this.amount2 = (splitArr[_index++]);
            } else {
                clearInterval(intervalId);
            }
        }, params.speed);
    }

    numberChange3(speed, times, start, end) {
        this.showNumber = end;
        const params = {
            speed: speed, // 变换速度
            times: times, // 变换次数
            start: start, // 起始数量
            end: end // 到达数量
        };
        // 分割后要遍历显示的数组
        const splitArr = [];

        // end 和 start之间的间隔
        const gap = Math.abs(params.end - params.start);
        // 判断是增加还是减少
        const add = params.end - params.start > 0;

        // 叠加数
        let splitNum = gap / params.times;
        // end字符串，用于判断变化过程是否显示小数
        const endStr = String(params.end);

        // end是否为浮点数，用途就是展示效果是否显示小数
        const isFloat = endStr.indexOf('.') !== -1;

        // 整数叠加数小于1的可能，间隔最小就为1，次数也为end-start的绝对值
        !isFloat && (splitNum < 1) && (splitNum = 1) && (params.times = gap);

        for (let i = 0; i < params.times; i++) {
            let tempNum = add ? (params.start + splitNum * i) : (params.start - splitNum * i);

            // 小数的位数
            let decimalNum = 0;
            // 如果是浮点数，就获取小数的位数
            isFloat && (decimalNum = endStr.length - endStr.indexOf('.') - 1);

            // 最后是否保留小数位
            splitArr.push(isFloat ? (parseInt((tempNum * 10 ** decimalNum).toString()) / (10 ** decimalNum)) : parseInt(tempNum));
        }
        // 如果增加，并且数组最后一位比end小，则push最后一位；如果减少，并且数组最后一位比end大，则push最后一位
        ((add && (splitArr[splitArr.length - 1] < params.end)) || (!add && (splitArr[splitArr.length - 1] > params.end))) && splitArr.push(params.end);

        let _index = 0;

        let _this = this;
        // 定时显示
        let intervalId = setInterval(function () {

            if (_index < splitArr.length) {
                _this.amount3 = (splitArr[_index++]);
            } else {
                clearInterval(intervalId);
            }
        }, params.speed);
    }

    /* 数字金额逢三加， 比如 123,464.23 */
    numberToCurrency(value): any {
        if (!value) {
            return '0.00';
        }
        // 将数值截取，保留两位小数
        // value = value.toFixed(2);
        // 获取整数部分
        const intPart = Math.trunc(value);
        // 整数部分处理，增加,
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        // 预定义小数部分
        let floatPart = '.00';
        // 将数值截取为小数部分和整数部分
        const valueArray = value.toString().split('.');
        if (valueArray.length === 2) { // 有小数部分
            floatPart = valueArray[1].toString(); // 取得小数部分
            return intPartFormat + '.' + floatPart;
        }
        return intPartFormat;
    }
}
