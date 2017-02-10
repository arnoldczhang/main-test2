var expect = chai.expect;
function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
};

function fireClick(el) {
    if (el.click) {
        el.click()
    } else {
        //https://developer.mozilla.org/samples/domref/dispatchEvent.html
        var evt = document.createEvent('MouseEvents')
        evt.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
        !el.dispatchEvent(evt);
    }
};

describe('for', function () {
    var body = document.body, container, jsInst;

    beforeEach(function () {
        ;
    })

    afterEach(function () {
        body.innerHTML = '';
    })

    it('简单for', function (done) {
        body.innerHTML = heredoc(function () {
            /*
            <div id="for_inst">
                 <div class="for_div" :for="el in arr">
                   <label>{{el}}</label>
                </div>
                 <ul id="for_ul">
                   <li :for="el in arr">
                        <label :text="el"></label>
                   </li>
                </ul>
                <div class="for_div3" :for="el in arrObj trackBy key">
                   <label>{{key}} : {{el}}</label>
                </div>
                <ul>
                    
                </ul>
                 <div class="for_div2" :for="el in arr">
                   <label>{{el}}xxx</label>
                </div>
                <ul>
                    
                </ul>
                 <div class="for_div4" :for="el in arrStr trackBy i">
                   <label>{{i}} : {{el}}</label>
                </div>
            </div>
             */
        });

        jsInst = JSpring([function ($scope, $, module) {
            ;
        }, {
                arr : ['aa', 'bb', 'cc'],
                arrStr : 'abc',
                arrObj : {
                    aa : 1,
                    bb : 2,
                    cc : 3
                }
        }, '#for_inst']);
        container = document.getElementById('for_inst');
        var forDiv = document.getElementsByClassName('for_div');
        var forDiv3 = document.getElementsByClassName('for_div3');
        var forDiv4 = document.getElementsByClassName('for_div4');
        var forUl = document.getElementById('for_ul');
        var forLi = document.getElementsByTagName('li');

        expect(forDiv.length).to.equal(3);
        expect(forLi.length).to.equal(3);

        expect(forDiv[0].querySelector('label').textContent).to.equal('aa');
        expect(forDiv[1].querySelector('label').textContent).to.equal('bb');
        expect(forDiv[2].querySelector('label').textContent).to.equal('cc');

        expect(forLi[0].querySelector('label').textContent).to.equal('aa');
        expect(forLi[1].querySelector('label').textContent).to.equal('bb');
        expect(forLi[2].querySelector('label').textContent).to.equal('cc');

        expect(forDiv3[0].querySelector('label').textContent).to.equal('aa : 1');
        expect(forDiv3[1].querySelector('label').textContent).to.equal('bb : 2');
        expect(forDiv3[2].querySelector('label').textContent).to.equal('cc : 3');

        expect(forDiv4[0].querySelector('label').textContent).to.equal('0 : a');
        expect(forDiv4[1].querySelector('label').textContent).to.equal('1 : b');
        expect(forDiv4[2].querySelector('label').textContent).to.equal('2 : c');

        done();
    });

    it('简单for，多次更新数据', function (done) {
        body.innerHTML = heredoc(function () {
            /*
            <div id="for_inst">
                 <div class="for_div" :for="el in arr">
                   <label>{{el}}</label>
                </div>
                 <ul id="for_ul">
                   <li :for="el in arr">
                        <label :text="el"></label>
                   </li>
                </ul>
            </div>
             */
        });

        jsInst = JSpring([function ($scope, $, module) {
            setTimeout(function () {
                $scope.arr.$set(1, 'bbb');
                setTimeout(function () {
                    $scope.arr = ['aaa', 'bbbb'];
                    setTimeout(function () {
                        $scope.arr = ['a'];
                        setTimeout(function () {
                            $scope.arr = ['a', 'b', 'c', 'd'];
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, {
                arr : ['aa', 'bb', 'cc']
        }, '#for_inst']);
        container = document.getElementById('for_inst');
        var forDiv = document.getElementsByClassName('for_div');
        var forLi = document.getElementsByTagName('li');

        setTimeout(function () {
            expect(forDiv[0].querySelector('label').textContent).to.equal('aa');
            expect(forDiv[1].querySelector('label').textContent).to.equal('bbb');
            expect(forDiv[2].querySelector('label').textContent).to.equal('cc');

            expect(forLi[0].querySelector('label').textContent).to.equal('aa');
            expect(forLi[1].querySelector('label').textContent).to.equal('bbb');
            expect(forLi[2].querySelector('label').textContent).to.equal('cc');
            setTimeout(function () {
                expect(forDiv.length).to.equal(2);
                expect(forLi.length).to.equal(2);

                expect(forDiv[0].querySelector('label').textContent).to.equal('aaa');
                expect(forDiv[1].querySelector('label').textContent).to.equal('bbbb');

                expect(forLi[0].querySelector('label').textContent).to.equal('aaa');
                expect(forLi[1].querySelector('label').textContent).to.equal('bbbb');
                setTimeout(function () {
                    expect(forDiv.length).to.equal(1);
                    expect(forLi.length).to.equal(1);

                    expect(forDiv[0].querySelector('label').textContent).to.equal('a');

                    expect(forLi[0].querySelector('label').textContent).to.equal('a');
                    setTimeout(function () {
                        expect(forDiv.length).to.equal(4);
                        expect(forLi.length).to.equal(4);

                        expect(forDiv[0].querySelector('label').textContent).to.equal('a');
                        expect(forDiv[1].querySelector('label').textContent).to.equal('b');
                        expect(forDiv[2].querySelector('label').textContent).to.equal('c');
                        expect(forDiv[3].querySelector('label').textContent).to.equal('d');

                        expect(forLi[0].querySelector('label').textContent).to.equal('a');
                        expect(forLi[1].querySelector('label').textContent).to.equal('b');
                        expect(forLi[2].querySelector('label').textContent).to.equal('c');
                        expect(forLi[3].querySelector('label').textContent).to.equal('d');
                        done();
                    }, 200);
                }, 200);
            }, 200);
        }, 250);
    });

    it('简单for，多个自定义属性，多次更新数据', function (done) {
        body.innerHTML = heredoc(function () {
            /*
            <div id="for_inst">
                  <div class="for_div"
                         :show="el > 2"
                         :if="el > 1"
                         :data="dataFn(el)"
                         :for="el in arr"
                         :class="{'aa bb' : el == 1, 'cc dd' : el == 2, 'ee' : el == 3, 'ff' : el > 0 }"
                         :attr="{true : 'name:my name is ' + el, false : 'name : your name is ' + el}[el > 2]"
                         :style="styleObj"
                         >
                    <label>{{el}}</label>
                    <ul>
                        <li class="for_li1">{{$index}}</li>
                    </ul>
                 </div>
                 <ul>
                     <li>1111</li>
                 </ul>
                  <ul id="for_ul">
                    <li class="for_li2" :for="el in arr">
                         <label :text="el"></label>
                    </li>
                 </ul>
            </div>
             */
        });

        var jsInst2 = JSpring([function ($scope, $, module) {
            setTimeout(function () {
                $scope.styleObj.backgroundColor = 'green';
                $scope.arr = [3, 6, 9, 12, 15];
                $scope.dataFn = function (el) {
                    return {
                        name : el + 'abc'
                    };
                };
                setTimeout(function () {
                    $scope.arr = [];
                    setTimeout(function () {
                        $scope.arr = [1, 1, 2, 2, 3, 6];
                        $scope.styleObj = {
                            color : 'red',
                            fontSize : '14px'
                        };
                        $scope.dataFn = function (el) {
                            return {
                                pinyin : 'aoe-' + el
                            };
                        };
                        setTimeout(function () {
                            $scope.arr = [4, 1, 2];
                            setTimeout(function () {
                                $scope.arr = [];
                                setTimeout(function () {
                                    $scope.arr = [5, 6, 7, 8];
                                    $scope.dataFn = function (el) {
                                        return {
                                            pinyin : 'akb-' + el
                                        };
                                    };
                                }, 200);
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, {
                arr : [1, 2, 3],
                dataFn : function (el) {
                    return {
                        id : el + 'aaa',
                        cityId : el + 'shanghai'
                    }
                },
                styleObj : {
                    backgroundColor : 'red'
                }
        }, '#for_inst']);
        container = document.getElementById('for_inst');
        var forDiv = document.getElementsByClassName('for_div');
        var forUl = document.getElementById('for_ul');
        var forLi = document.getElementsByTagName('li');
        var forLi1 = document.getElementsByClassName('for_li1');
        var forLi2 = document.getElementsByClassName('for_li2');

        expect(forDiv.length).to.equal(2);
        expect(forLi1.length).to.equal(2);
        expect(forLi2.length).to.equal(3);

        expect(forDiv[0].style.display).to.equal('none');
        expect(forDiv[1].style.display).to.equal('block');

        expect(forDiv[0].dataset['id']).to.equal('2aaa');
        expect(forDiv[0].dataset['cityId']).to.equal('2shanghai');
        expect(forDiv[1].dataset['id']).to.equal('3aaa');
        expect(forDiv[1].dataset['cityId']).to.equal('3shanghai');

        expect(forDiv[0].getAttribute('name')).to.equal('your name is 2');
        expect(forDiv[1].getAttribute('name')).to.equal('my name is 3');

        expect(forDiv[0].className).to.equal('for_div cc dd ff');
        expect(forDiv[1].className).to.equal('for_div ee ff');

        expect(forDiv[0].style.backgroundColor).to.equal('red');
        expect(forDiv[1].style.backgroundColor).to.equal('red');

        expect(forDiv[0].querySelector('label').textContent).to.equal('2');
        expect(forDiv[1].querySelector('label').textContent).to.equal('3');

        expect(forLi1[0].textContent).to.equal('1');
        expect(forLi1[1].textContent).to.equal('2');

        expect(forLi2[0].querySelector('label').textContent).to.equal('1');
        expect(forLi2[1].querySelector('label').textContent).to.equal('2');
        expect(forLi2[2].querySelector('label').textContent).to.equal('3');

        setTimeout(function () {
            var forDiv = document.getElementsByClassName('for_div');
            var forUl = document.getElementById('for_ul');
            var forLi = document.getElementsByTagName('li');
            var forLi1 = document.getElementsByClassName('for_li1');
            var forLi2 = document.getElementsByClassName('for_li2');

            expect(forDiv.length).to.equal(5);
            expect(forLi1.length).to.equal(5);
            expect(forLi2.length).to.equal(5);

            expect(forDiv[0].dataset['id']).to.equal(void 0);
            expect(forDiv[0].dataset['cityId']).to.equal(void 0);
            expect(forDiv[1].dataset['id']).to.equal(void 0);
            expect(forDiv[1].dataset['cityId']).to.equal(void 0);
            expect(forDiv[2].dataset['id']).to.equal(void 0);
            expect(forDiv[2].dataset['cityId']).to.equal(void 0);
            expect(forDiv[3].dataset['id']).to.equal(void 0);
            expect(forDiv[3].dataset['cityId']).to.equal(void 0);
            expect(forDiv[4].dataset['id']).to.equal(void 0);
            expect(forDiv[4].dataset['cityId']).to.equal(void 0);

            expect(forDiv[0].dataset['name']).to.equal('3abc');
            expect(forDiv[1].dataset['name']).to.equal('6abc');
            expect(forDiv[2].dataset['name']).to.equal('9abc');
            expect(forDiv[3].dataset['name']).to.equal('12abc');
            expect(forDiv[4].dataset['name']).to.equal('15abc');

            expect(forDiv[0].getAttribute('name')).to.equal('my name is 3');
            expect(forDiv[1].getAttribute('name')).to.equal('my name is 6');
            expect(forDiv[2].getAttribute('name')).to.equal('my name is 9');
            expect(forDiv[3].getAttribute('name')).to.equal('my name is 12');
            expect(forDiv[4].getAttribute('name')).to.equal('my name is 15');

            expect(forDiv[0].className).to.equal('for_div ee ff');
            expect(forDiv[1].className).to.equal('for_div ff');
            expect(forDiv[2].className).to.equal('for_div ff');
            expect(forDiv[3].className).to.equal('for_div ff');
            expect(forDiv[4].className).to.equal('for_div ff');

            expect(forDiv[0].style.backgroundColor).to.equal('green');
            expect(forDiv[1].style.backgroundColor).to.equal('green');
            expect(forDiv[2].style.backgroundColor).to.equal('green');
            expect(forDiv[3].style.backgroundColor).to.equal('green');
            expect(forDiv[4].style.backgroundColor).to.equal('green');

            expect(forDiv[0].querySelector('label').textContent).to.equal('3');
            expect(forDiv[1].querySelector('label').textContent).to.equal('6');
            expect(forDiv[2].querySelector('label').textContent).to.equal('9');
            expect(forDiv[3].querySelector('label').textContent).to.equal('12');
            expect(forDiv[4].querySelector('label').textContent).to.equal('15');

            expect(forLi1[0].textContent).to.equal('0');
            expect(forLi1[1].textContent).to.equal('1');
            expect(forLi1[2].textContent).to.equal('2');
            expect(forLi1[3].textContent).to.equal('3');
            expect(forLi1[4].textContent).to.equal('4');

            expect(forLi2[0].querySelector('label').textContent).to.equal('3');
            expect(forLi2[1].querySelector('label').textContent).to.equal('6');
            expect(forLi2[2].querySelector('label').textContent).to.equal('9');
            expect(forLi2[3].querySelector('label').textContent).to.equal('12');
            expect(forLi2[4].querySelector('label').textContent).to.equal('15');

            setTimeout(function () {
                var forDiv = document.getElementsByClassName('for_div');
                var forUl = document.getElementById('for_ul');
                var forLi = document.getElementsByTagName('li');
                var forLi1 = document.getElementsByClassName('for_li1');
                var forLi2 = document.getElementsByClassName('for_li2');

                expect(forDiv.length).to.equal(0);
                expect(forLi1.length).to.equal(0);
                expect(forLi2.length).to.equal(0);

                setTimeout(function () {
                    var forDiv = document.getElementsByClassName('for_div');
                    var forUl = document.getElementById('for_ul');
                    var forLi = document.getElementsByTagName('li');
                    var forLi1 = document.getElementsByClassName('for_li1');
                    var forLi2 = document.getElementsByClassName('for_li2');

                    expect(forDiv.length).to.equal(4);
                    expect(forLi1.length).to.equal(4);
                    expect(forLi2.length).to.equal(6);

                    expect(forDiv[0].dataset['id']).to.equal(void 0);
                    expect(forDiv[0].dataset['cityId']).to.equal(void 0);
                    expect(forDiv[1].dataset['id']).to.equal(void 0);
                    expect(forDiv[1].dataset['cityId']).to.equal(void 0);
                    expect(forDiv[2].dataset['id']).to.equal(void 0);
                    expect(forDiv[2].dataset['cityId']).to.equal(void 0);
                    expect(forDiv[3].dataset['id']).to.equal(void 0);
                    expect(forDiv[3].dataset['cityId']).to.equal(void 0);

                    expect(forDiv[0].dataset['name']).to.equal(void 0);
                    expect(forDiv[1].dataset['name']).to.equal(void 0);
                    expect(forDiv[2].dataset['name']).to.equal(void 0);
                    expect(forDiv[3].dataset['name']).to.equal(void 0);

                    expect(forDiv[0].dataset['pinyin']).to.equal('aoe-2');
                    expect(forDiv[1].dataset['pinyin']).to.equal('aoe-2');
                    expect(forDiv[2].dataset['pinyin']).to.equal('aoe-3');
                    expect(forDiv[3].dataset['pinyin']).to.equal('aoe-6');

                    expect(forDiv[0].getAttribute('name')).to.equal('your name is 2');
                    expect(forDiv[1].getAttribute('name')).to.equal('your name is 2');
                    expect(forDiv[2].getAttribute('name')).to.equal('my name is 3');
                    expect(forDiv[3].getAttribute('name')).to.equal('my name is 6');

                    expect(forDiv[0].className).to.equal('for_div cc dd ff');
                    expect(forDiv[1].className).to.equal('for_div cc dd ff');
                    expect(forDiv[2].className).to.equal('for_div ee ff');
                    expect(forDiv[3].className).to.equal('for_div ff');

                    expect(forDiv[0].style.backgroundColor).to.equal('');
                    expect(forDiv[1].style.backgroundColor).to.equal('');
                    expect(forDiv[2].style.backgroundColor).to.equal('');
                    expect(forDiv[3].style.backgroundColor).to.equal('');

                    expect(forDiv[0].style.color).to.equal('red');
                    expect(forDiv[1].style.color).to.equal('red');
                    expect(forDiv[2].style.color).to.equal('red');
                    expect(forDiv[3].style.color).to.equal('red');

                    expect(forDiv[0].style.fontSize).to.equal('14px');
                    expect(forDiv[1].style.fontSize).to.equal('14px');
                    expect(forDiv[2].style.fontSize).to.equal('14px');
                    expect(forDiv[3].style.fontSize).to.equal('14px');

                    expect(forDiv[0].querySelector('label').textContent).to.equal('2');
                    expect(forDiv[1].querySelector('label').textContent).to.equal('2');
                    expect(forDiv[2].querySelector('label').textContent).to.equal('3');
                    expect(forDiv[3].querySelector('label').textContent).to.equal('6');

                    expect(forLi1[0].textContent).to.equal('2');
                    expect(forLi1[1].textContent).to.equal('3');
                    expect(forLi1[2].textContent).to.equal('4');
                    expect(forLi1[3].textContent).to.equal('5');

                    expect(forLi2[0].querySelector('label').textContent).to.equal('1');
                    expect(forLi2[1].querySelector('label').textContent).to.equal('1');
                    expect(forLi2[2].querySelector('label').textContent).to.equal('2');
                    expect(forLi2[3].querySelector('label').textContent).to.equal('2');
                    expect(forLi2[4].querySelector('label').textContent).to.equal('3');
                    expect(forLi2[5].querySelector('label').textContent).to.equal('6');

                    setTimeout(function () {
                        var forDiv = document.getElementsByClassName('for_div');
                        var forUl = document.getElementById('for_ul');
                        var forLi = document.getElementsByTagName('li');
                        var forLi1 = document.getElementsByClassName('for_li1');
                        var forLi2 = document.getElementsByClassName('for_li2');

                        expect(forDiv.length).to.equal(2);
                        expect(forLi1.length).to.equal(2);
                        expect(forLi2.length).to.equal(3);

                        expect(forDiv[0].dataset['id']).to.equal(void 0);
                        expect(forDiv[0].dataset['cityId']).to.equal(void 0);
                        expect(forDiv[1].dataset['id']).to.equal(void 0);
                        expect(forDiv[1].dataset['cityId']).to.equal(void 0);

                        expect(forDiv[0].dataset['name']).to.equal(void 0);
                        expect(forDiv[1].dataset['name']).to.equal(void 0);

                        expect(forDiv[0].dataset['pinyin']).to.equal('aoe-4');
                        expect(forDiv[1].dataset['pinyin']).to.equal('aoe-2');

                        expect(forDiv[0].getAttribute('name')).to.equal('my name is 4');
                        expect(forDiv[1].getAttribute('name')).to.equal('your name is 2');

                        expect(forDiv[0].className).to.equal('for_div ff');
                        expect(forDiv[1].className).to.equal('for_div cc dd ff');

                        expect(forDiv[0].style.backgroundColor).to.equal('');
                        expect(forDiv[1].style.backgroundColor).to.equal('');

                        expect(forDiv[0].style.color).to.equal('red');
                        expect(forDiv[1].style.color).to.equal('red');

                        expect(forDiv[0].style.fontSize).to.equal('14px');
                        expect(forDiv[1].style.fontSize).to.equal('14px');

                        expect(forDiv[0].style.display).to.equal('block');
                        expect(forDiv[1].style.display).to.equal('none');

                        expect(forDiv[0].querySelector('label').textContent).to.equal('4');
                        expect(forDiv[1].querySelector('label').textContent).to.equal('2');

                        expect(forLi1[0].textContent).to.equal('0');
                        expect(forLi1[1].textContent).to.equal('2');

                        expect(forLi2[0].querySelector('label').textContent).to.equal('4');
                        expect(forLi2[1].querySelector('label').textContent).to.equal('1');
                        expect(forLi2[2].querySelector('label').textContent).to.equal('2');

                        setTimeout(function () {
                            var forDiv = document.getElementsByClassName('for_div');
                            var forUl = document.getElementById('for_ul');
                            var forLi = document.getElementsByTagName('li');
                            var forLi1 = document.getElementsByClassName('for_li1');
                            var forLi2 = document.getElementsByClassName('for_li2');

                            expect(forDiv.length).to.equal(0);
                            expect(forLi1.length).to.equal(0);
                            expect(forLi2.length).to.equal(0);

                            setTimeout(function () {
                                var forDiv = document.getElementsByClassName('for_div');
                                var forUl = document.getElementById('for_ul');
                                var forLi = document.getElementsByTagName('li');
                                var forLi1 = document.getElementsByClassName('for_li1');
                                var forLi2 = document.getElementsByClassName('for_li2');

                                expect(forDiv.length).to.equal(4);
                                expect(forLi1.length).to.equal(4);
                                expect(forLi2.length).to.equal(4);

                                expect(forDiv[0].dataset['id']).to.equal(void 0);
                                expect(forDiv[0].dataset['cityId']).to.equal(void 0);
                                expect(forDiv[1].dataset['id']).to.equal(void 0);
                                expect(forDiv[1].dataset['cityId']).to.equal(void 0);
                                expect(forDiv[2].dataset['id']).to.equal(void 0);
                                expect(forDiv[2].dataset['cityId']).to.equal(void 0);
                                expect(forDiv[3].dataset['id']).to.equal(void 0);
                                expect(forDiv[3].dataset['cityId']).to.equal(void 0);

                                expect(forDiv[0].dataset['name']).to.equal(void 0);
                                expect(forDiv[1].dataset['name']).to.equal(void 0);
                                expect(forDiv[2].dataset['name']).to.equal(void 0);
                                expect(forDiv[3].dataset['name']).to.equal(void 0);

                                expect(forDiv[0].dataset['pinyin']).to.equal('akb-5');
                                expect(forDiv[1].dataset['pinyin']).to.equal('akb-6');
                                expect(forDiv[2].dataset['pinyin']).to.equal('akb-7');
                                expect(forDiv[3].dataset['pinyin']).to.equal('akb-8');

                                expect(forDiv[0].getAttribute('name')).to.equal('my name is 5');
                                expect(forDiv[1].getAttribute('name')).to.equal('my name is 6');
                                expect(forDiv[2].getAttribute('name')).to.equal('my name is 7');
                                expect(forDiv[3].getAttribute('name')).to.equal('my name is 8');

                                expect(forDiv[0].className).to.equal('for_div ff');
                                expect(forDiv[1].className).to.equal('for_div ff');
                                expect(forDiv[2].className).to.equal('for_div ff');
                                expect(forDiv[3].className).to.equal('for_div ff');

                                expect(forDiv[0].style.backgroundColor).to.equal('');
                                expect(forDiv[1].style.backgroundColor).to.equal('');
                                expect(forDiv[2].style.backgroundColor).to.equal('');
                                expect(forDiv[3].style.backgroundColor).to.equal('');

                                expect(forDiv[0].style.color).to.equal('red');
                                expect(forDiv[1].style.color).to.equal('red');

                                expect(forDiv[0].style.fontSize).to.equal('14px');
                                expect(forDiv[1].style.fontSize).to.equal('14px');

                                expect(forDiv[0].style.display).to.equal('block');
                                expect(forDiv[1].style.display).to.equal('block');
                                expect(forDiv[2].style.display).to.equal('block');
                                expect(forDiv[3].style.display).to.equal('block');

                                expect(forDiv[0].querySelector('label').textContent).to.equal('5');
                                expect(forDiv[1].querySelector('label').textContent).to.equal('6');
                                expect(forDiv[2].querySelector('label').textContent).to.equal('7');
                                expect(forDiv[3].querySelector('label').textContent).to.equal('8');

                                expect(forLi1[0].textContent).to.equal('0');
                                expect(forLi1[1].textContent).to.equal('1');
                                expect(forLi1[2].textContent).to.equal('2');
                                expect(forLi1[3].textContent).to.equal('3');

                                expect(forLi2[0].querySelector('label').textContent).to.equal('5');
                                expect(forLi2[1].querySelector('label').textContent).to.equal('6');
                                expect(forLi2[2].querySelector('label').textContent).to.equal('7');
                                expect(forLi2[3].querySelector('label').textContent).to.equal('8');
                                
                                done();
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, 250)
    });

    it('多个嵌套for，多次更新数据', function (done) {
        body.innerHTML = heredoc(function () {
            /*
            <div id="for_inst">
                  <div class="for_div" :for="el in arr">
                    <label :text="el"></label>
                    <div class="for_div2" :for="el in arr2">
                        <span>
                           <b :text="el"></b>
                        </span>
                    </div>
                 </div>
                 <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                 </ul>
                 <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                 </ul>
                 <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                 </ul>
                 <div class="for_div3" :for="el in arr2">
                     <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                     </ul>
                     <span>
                        <ul>
                           <li>1</li>
                           <li>2</li>
                           <li>3</li>
                        </ul>
                        <label :text="el"></label>
                     </span>
                     <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                     </ul>
                 </div>
                  <ul class="for_ul">
                     <li :for="el in arr2">
                          <label :text="el"></label>
                     </li>
                    <li :for="el in arr">
                        <ul>
                           <li>1</li>
                           <li>2</li>
                           <li>3</li>
                        </ul>
                         <label :text="el"></label>
                    </li>
                    <ul>
                       <li>1</li>
                       <li>2</li>
                       <li>3</li>
                    </ul>
                 </ul>
                 <div class="for_div4" :for="el in arr2">
                    <label>{{el}}xxx</label>
                     <ul class="for_ul2">
                        <li :for="el in arr2">
                             <label :text="el"></label>
                             <ul class="for_ul3" :for="el in arr2">
                                 <li>
                                    <b :text="el"></b>
                                 </li>
                             </ul>
                        </li>
                       <li :for="el in arr">
                            <label :text="el"></label>
                       </li>
                    </ul>
                 </div>
                  <div class="for_div5" :for="el in arr">
                    <label>{{el}}yyy</label>
                 </div>
            </div>
             */
        });

        jsInst = JSpring([function ($scope, $, module) {
            setTimeout(function () {
                $scope.arr.$set(1, 'bbb');
                $scope.arr2.$set(1, 'BBB');
                setTimeout(function () {
                    $scope.arr = ['aaa', 'bbbb'];
                    $scope.arr2 = ['AAA', 'BBBB', 'CCC'];
                    setTimeout(function () {
                        $scope.arr = ['a'];
                        $scope.arr2 = ['A', 'BB'];
                        setTimeout(function () {
                            $scope.arr = ['a', 'b', 'c', 'd'];
                            $scope.arr2 = ['A', 'B', 'C'];
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, {
                arr : ['aa', 'bb', 'cc'],
                arr2 : ['AA', 'BB']
        }, '#for_inst']);

        container = document.getElementById('for_inst');
        var forDiv = document.getElementsByClassName('for_div');
        var forDiv2 = document.getElementsByClassName('for_div2');
        var forDiv3 = document.getElementsByClassName('for_div3');
        var forDiv4 = document.getElementsByClassName('for_div4');
        var forDiv5 = document.getElementsByClassName('for_div5');
        var forUl = document.getElementsByClassName('for_ul');
        var forUl2 = document.getElementsByClassName('for_ul2');
        var forUl3 = document.getElementsByClassName('for_ul3');

        var arr = jsInst.$scope.arr;
        var arr2 = jsInst.$scope.arr2;
        var ulLen = 1;

        expect(forDiv.length).to.equal(arr.length);
        expect(forDiv2.length).to.equal(arr.length * arr2.length);
        expect(forDiv3.length).to.equal(arr2.length);
        expect(forUl[0].children.length).to.equal(arr.length + arr2.length + ulLen);
        expect(forDiv4.length).to.equal(arr2.length);
        expect(forUl2.length).to.equal(arr2.length);
        expect(forUl2[0].children.length).to.equal(arr.length + arr2.length);
        expect(forUl3.length).to.equal(arr2.length * arr2.length * arr2.length);
        expect(forDiv5.length).to.equal(arr.length);

        expect(forDiv[0].querySelector('label').textContent).to.equal('aa');
        expect(forDiv[1].querySelector('label').textContent).to.equal('bb');
        expect(forDiv[2].querySelector('label').textContent).to.equal('cc');

        expect(forDiv2[0].querySelector('span b').textContent).to.equal('AA');
        expect(forDiv2[1].querySelector('span b').textContent).to.equal('BB');
        expect(forDiv2[2].querySelector('span b').textContent).to.equal('AA');
        expect(forDiv2[3].querySelector('span b').textContent).to.equal('BB');

        expect(forDiv3[0].querySelector('span label').textContent).to.equal('AA');
        expect(forDiv3[1].querySelector('span label').textContent).to.equal('BB');

        expect(forUl[0].children[0].querySelector('label').textContent).to.equal('AA');
        expect(forUl[0].children[1].querySelector('label').textContent).to.equal('BB');
        expect(forUl[0].children[2].querySelector('label').textContent).to.equal('aa');
        expect(forUl[0].children[3].querySelector('label').textContent).to.equal('bb');
        expect(forUl[0].children[4].querySelector('label').textContent).to.equal('cc');

        expect(forDiv4[0].querySelector('label').textContent).to.equal('AAxxx');
        expect(forDiv4[1].querySelector('label').textContent).to.equal('BBxxx');

        expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('AA');
        expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('BB');
        expect(forUl2[1].children[0].querySelector('label').textContent).to.equal('AA');
        expect(forUl2[1].children[1].querySelector('label').textContent).to.equal('BB');

        expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('aa');
        expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('bb');
        expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('cc');
        expect(forUl2[1].children[2].querySelector('label').textContent).to.equal('aa');
        expect(forUl2[1].children[3].querySelector('label').textContent).to.equal('bb');
        expect(forUl2[1].children[4].querySelector('label').textContent).to.equal('cc');

        expect(forUl3[0].querySelector('li b').textContent).to.equal('AA');
        expect(forUl3[1].querySelector('li b').textContent).to.equal('BB');
        expect(forUl3[2].querySelector('li b').textContent).to.equal('AA');
        expect(forUl3[3].querySelector('li b').textContent).to.equal('BB');
        expect(forUl3[4].querySelector('li b').textContent).to.equal('AA');
        expect(forUl3[5].querySelector('li b').textContent).to.equal('BB');
        expect(forUl3[6].querySelector('li b').textContent).to.equal('AA');
        expect(forUl3[7].querySelector('li b').textContent).to.equal('BB');

        expect(forDiv5[0].querySelector('label').textContent).to.equal('aayyy');
        expect(forDiv5[1].querySelector('label').textContent).to.equal('bbyyy');
        expect(forDiv5[2].querySelector('label').textContent).to.equal('ccyyy');

        setTimeout(function () {
            var arr = jsInst.$scope.arr;
            var arr2 = jsInst.$scope.arr2;

            expect(forDiv.length).to.equal(arr.length);
            expect(forDiv2.length).to.equal(arr.length * arr2.length);
            expect(forDiv3.length).to.equal(arr2.length);
            expect(forUl[0].children.length).to.equal(arr.length + arr2.length + ulLen);
            expect(forDiv4.length).to.equal(arr2.length);
            expect(forUl2.length).to.equal(arr2.length);
            expect(forUl2[0].children.length).to.equal(arr.length + arr2.length);
            expect(forUl3.length).to.equal(arr2.length * arr2.length * arr2.length);
            expect(forDiv5.length).to.equal(arr.length);

            expect(forDiv[1].querySelector('label').textContent).to.equal('bbb');
            expect(forDiv2[1].querySelector('span b').textContent).to.equal('BBB');
            expect(forDiv3[1].querySelector('span label').textContent).to.equal('BBB');
            expect(forUl[0].children[1].querySelector('label').textContent).to.equal('BBB');
            expect(forUl[0].children[3].querySelector('label').textContent).to.equal('bbb');
            expect(forDiv4[1].querySelector('label').textContent).to.equal('BBBxxx');
            expect(forUl2[1].children[1].querySelector('label').textContent).to.equal('BBB');
            expect(forUl2[1].children[3].querySelector('label').textContent).to.equal('bbb');
            expect(forUl3[1].querySelector('li b').textContent).to.equal('BBB');
            expect(forUl3[3].querySelector('li b').textContent).to.equal('BBB');
            expect(forDiv5[1].querySelector('label').textContent).to.equal('bbbyyy');

            setTimeout(function () {
                var arr = jsInst.$scope.arr;
                var arr2 = jsInst.$scope.arr2;

                expect(forDiv.length).to.equal(arr.length);
                expect(forDiv2.length).to.equal(arr.length * arr2.length);
                expect(forDiv3.length).to.equal(arr2.length);
                expect(forUl[0].children.length).to.equal(arr.length + arr2.length + ulLen);
                expect(forDiv4.length).to.equal(arr2.length);
                expect(forUl2.length).to.equal(arr2.length);
                expect(forUl2[0].children.length).to.equal(arr.length + arr2.length);
                expect(forUl3.length).to.equal(arr2.length * arr2.length * arr2.length);
                expect(forDiv5.length).to.equal(arr.length);

                expect(forDiv[0].querySelector('label').textContent).to.equal('aaa');
                expect(forDiv[1].querySelector('label').textContent).to.equal('bbbb');

                expect(forDiv2[0].querySelector('span b').textContent).to.equal('AAA');
                expect(forDiv2[1].querySelector('span b').textContent).to.equal('BBBB');
                expect(forDiv2[2].querySelector('span b').textContent).to.equal('CCC');
                expect(forDiv2[3].querySelector('span b').textContent).to.equal('AAA');
                expect(forDiv2[4].querySelector('span b').textContent).to.equal('BBBB');
                expect(forDiv2[5].querySelector('span b').textContent).to.equal('CCC');

                expect(forDiv3[0].querySelector('span label').textContent).to.equal('AAA');
                expect(forDiv3[1].querySelector('span label').textContent).to.equal('BBBB');
                expect(forDiv3[2].querySelector('span label').textContent).to.equal('CCC');

                expect(forUl[0].children[0].querySelector('label').textContent).to.equal('AAA');
                expect(forUl[0].children[1].querySelector('label').textContent).to.equal('BBBB');
                expect(forUl[0].children[2].querySelector('label').textContent).to.equal('CCC');
                expect(forUl[0].children[3].querySelector('label').textContent).to.equal('aaa');
                expect(forUl[0].children[4].querySelector('label').textContent).to.equal('bbbb');

                expect(forDiv4[0].querySelector('label').textContent).to.equal('AAAxxx');
                expect(forDiv4[1].querySelector('label').textContent).to.equal('BBBBxxx');
                expect(forDiv4[2].querySelector('label').textContent).to.equal('CCCxxx');

                expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('AAA');
                expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('BBBB');
                expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('CCC');
                expect(forUl2[1].children[0].querySelector('label').textContent).to.equal('AAA');
                expect(forUl2[1].children[1].querySelector('label').textContent).to.equal('BBBB');
                expect(forUl2[1].children[2].querySelector('label').textContent).to.equal('CCC');

                expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('aaa');
                expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('bbbb');
                expect(forUl2[1].children[3].querySelector('label').textContent).to.equal('aaa');
                expect(forUl2[1].children[4].querySelector('label').textContent).to.equal('bbbb');

                expect(forUl3[0].querySelector('li b').textContent).to.equal('AAA');
                expect(forUl3[1].querySelector('li b').textContent).to.equal('BBBB');
                expect(forUl3[2].querySelector('li b').textContent).to.equal('CCC');
                expect(forUl3[3].querySelector('li b').textContent).to.equal('AAA');
                expect(forUl3[4].querySelector('li b').textContent).to.equal('BBBB');
                expect(forUl3[5].querySelector('li b').textContent).to.equal('CCC');
                expect(forUl3[6].querySelector('li b').textContent).to.equal('AAA');
                expect(forUl3[7].querySelector('li b').textContent).to.equal('BBBB');
                expect(forUl3[8].querySelector('li b').textContent).to.equal('CCC');

                expect(forDiv5[0].querySelector('label').textContent).to.equal('aaayyy');
                expect(forDiv5[1].querySelector('label').textContent).to.equal('bbbbyyy');

                setTimeout(function () {
                    var arr = jsInst.$scope.arr;
                    var arr2 = jsInst.$scope.arr2;

                    expect(forDiv.length).to.equal(arr.length);
                    expect(forDiv2.length).to.equal(arr.length * arr2.length);
                    expect(forDiv3.length).to.equal(arr2.length);
                    expect(forUl[0].children.length).to.equal(arr.length + arr2.length + ulLen);
                    expect(forDiv4.length).to.equal(arr2.length);
                    expect(forUl2.length).to.equal(arr2.length);
                    expect(forUl2[0].children.length).to.equal(arr.length + arr2.length);
                    expect(forUl3.length).to.equal(arr2.length * arr2.length * arr2.length);
                    expect(forDiv5.length).to.equal(arr.length);

                    expect(forDiv[0].querySelector('label').textContent).to.equal('a');

                    expect(forDiv2[0].querySelector('span b').textContent).to.equal('A');
                    expect(forDiv2[1].querySelector('span b').textContent).to.equal('BB');

                    expect(forDiv3[0].querySelector('span label').textContent).to.equal('A');
                    expect(forDiv3[1].querySelector('span label').textContent).to.equal('BB');

                    expect(forUl[0].children[0].querySelector('label').textContent).to.equal('A');
                    expect(forUl[0].children[1].querySelector('label').textContent).to.equal('BB');
                    expect(forUl[0].children[2].querySelector('label').textContent).to.equal('a');

                    expect(forDiv4[0].querySelector('label').textContent).to.equal('Axxx');
                    expect(forDiv4[1].querySelector('label').textContent).to.equal('BBxxx');

                    expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('A');
                    expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('BB');
                    expect(forUl2[1].children[0].querySelector('label').textContent).to.equal('A');
                    expect(forUl2[1].children[1].querySelector('label').textContent).to.equal('BB');

                    expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[1].children[2].querySelector('label').textContent).to.equal('a');

                    expect(forUl3[0].querySelector('li b').textContent).to.equal('A');
                    expect(forUl3[1].querySelector('li b').textContent).to.equal('BB');
                    expect(forUl3[2].querySelector('li b').textContent).to.equal('A');
                    expect(forUl3[3].querySelector('li b').textContent).to.equal('BB');
                    expect(forUl3[4].querySelector('li b').textContent).to.equal('A');
                    expect(forUl3[5].querySelector('li b').textContent).to.equal('BB');
                    expect(forUl3[6].querySelector('li b').textContent).to.equal('A');
                    expect(forUl3[7].querySelector('li b').textContent).to.equal('BB');

                    expect(forDiv5[0].querySelector('label').textContent).to.equal('ayyy');

                    setTimeout(function () {
                        var arr = jsInst.$scope.arr;
                        var arr2 = jsInst.$scope.arr2;

                        expect(forDiv.length).to.equal(arr.length);
                        expect(forDiv2.length).to.equal(arr.length * arr2.length);
                        expect(forDiv3.length).to.equal(arr2.length);
                        expect(forUl[0].children.length).to.equal(arr.length + arr2.length + ulLen);
                        expect(forDiv4.length).to.equal(arr2.length);
                        expect(forUl2.length).to.equal(arr2.length);
                        expect(forUl2[0].children.length).to.equal(arr.length + arr2.length);
                        expect(forUl3.length).to.equal(arr2.length * arr2.length * arr2.length);
                        expect(forDiv5.length).to.equal(arr.length);

                        expect(forDiv[0].querySelector('label').textContent).to.equal('a');
                        expect(forDiv[1].querySelector('label').textContent).to.equal('b');
                        expect(forDiv[2].querySelector('label').textContent).to.equal('c');
                        expect(forDiv[3].querySelector('label').textContent).to.equal('d');

                        expect(forDiv2[0].querySelector('span b').textContent).to.equal('A');
                        expect(forDiv2[1].querySelector('span b').textContent).to.equal('B');
                        expect(forDiv2[2].querySelector('span b').textContent).to.equal('C');
                        expect(forDiv2[3].querySelector('span b').textContent).to.equal('A');
                        expect(forDiv2[4].querySelector('span b').textContent).to.equal('B');
                        expect(forDiv2[5].querySelector('span b').textContent).to.equal('C');
                        expect(forDiv2[6].querySelector('span b').textContent).to.equal('A');
                        expect(forDiv2[7].querySelector('span b').textContent).to.equal('B');
                        expect(forDiv2[8].querySelector('span b').textContent).to.equal('C');
                        expect(forDiv2[9].querySelector('span b').textContent).to.equal('A');
                        expect(forDiv2[10].querySelector('span b').textContent).to.equal('B');
                        expect(forDiv2[11].querySelector('span b').textContent).to.equal('C');

                        expect(forDiv3[0].querySelector('span label').textContent).to.equal('A');
                        expect(forDiv3[1].querySelector('span label').textContent).to.equal('B');
                        expect(forDiv3[2].querySelector('span label').textContent).to.equal('C');

                        expect(forUl[0].children[0].querySelector('label').textContent).to.equal('A');
                        expect(forUl[0].children[1].querySelector('label').textContent).to.equal('B');
                        expect(forUl[0].children[2].querySelector('label').textContent).to.equal('C');
                        expect(forUl[0].children[3].querySelector('label').textContent).to.equal('a');
                        expect(forUl[0].children[4].querySelector('label').textContent).to.equal('b');
                        expect(forUl[0].children[5].querySelector('label').textContent).to.equal('c');
                        expect(forUl[0].children[6].querySelector('label').textContent).to.equal('d');

                        expect(forDiv4[0].querySelector('label').textContent).to.equal('Axxx');
                        expect(forDiv4[1].querySelector('label').textContent).to.equal('Bxxx');
                        expect(forDiv4[2].querySelector('label').textContent).to.equal('Cxxx');

                        expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('A');
                        expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('B');
                        expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('C');
                        expect(forUl2[1].children[0].querySelector('label').textContent).to.equal('A');
                        expect(forUl2[1].children[1].querySelector('label').textContent).to.equal('B');
                        expect(forUl2[1].children[2].querySelector('label').textContent).to.equal('C');

                        expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('a');
                        expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('b');
                        expect(forUl2[0].children[5].querySelector('label').textContent).to.equal('c');
                        expect(forUl2[0].children[6].querySelector('label').textContent).to.equal('d');
                        expect(forUl2[1].children[3].querySelector('label').textContent).to.equal('a');
                        expect(forUl2[1].children[4].querySelector('label').textContent).to.equal('b');
                        expect(forUl2[1].children[5].querySelector('label').textContent).to.equal('c');
                        expect(forUl2[1].children[6].querySelector('label').textContent).to.equal('d');

                        expect(forUl3[0].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[1].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[2].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[3].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[4].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[5].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[6].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[7].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[8].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[9].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[10].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[11].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[12].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[13].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[14].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[15].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[16].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[17].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[18].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[19].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[20].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[21].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[22].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[23].querySelector('li b').textContent).to.equal('C');
                        expect(forUl3[24].querySelector('li b').textContent).to.equal('A');
                        expect(forUl3[25].querySelector('li b').textContent).to.equal('B');
                        expect(forUl3[26].querySelector('li b').textContent).to.equal('C');

                        expect(forDiv5[0].querySelector('label').textContent).to.equal('ayyy');
                        expect(forDiv5[1].querySelector('label').textContent).to.equal('byyy');
                        expect(forDiv5[2].querySelector('label').textContent).to.equal('cyyy');
                        expect(forDiv5[3].querySelector('label').textContent).to.equal('dyyy');
                        done();
                    }, 200);
                }, 200);
            }, 200);
        }, 250);
    });

    it('多个嵌套for，复杂数据，多次更新数据', function (done) {
        body.innerHTML = heredoc(function () {
            /*
            <div id="for_inst">
                  <div class="for_div" :for="el in arr">
                    <label :text="el.arr2[0]"></label>
                    <div class="for_div2" :for="el in el.arr2">
                        <span>
                           <b :text="el"></b>
                        </span>
                    </div>
                 </div>
                 <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                 </ul>
                 <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                 </ul>
                 <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                 </ul>
                 <div class="for_div3" :for="el in arr[0].arr2">
                     <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                     </ul>
                     <span>
                        <ul>
                           <li>1</li>
                           <li>2</li>
                           <li>3</li>
                        </ul>
                        <label :text="el"></label>
                     </span>
                     <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                     </ul>
                 </div>
                  <ul class="for_ul">
                    <li :for="el in arr">
                        <ul>
                           <li>1</li>
                           <li>2</li>
                           <li>3</li>
                        </ul>
                        <label>{{el.arr2[0]}}</label>
                        <div :for="el in el.arr2">
                            <label :text="el"></label>
                        </div>
                    </li>
                    <ul>
                       <li>1</li>
                       <li>2</li>
                       <li>3</li>
                    </ul>
                 </ul>
                 <div class="for_div4" :for="oel in arr">
                    <label>{{oel.arr2[0]}}xxx</label>
                     <ul class="for_ul2">
                        <li :for="el in oel.arr2">
                             <label :text="el"></label>
                             <ul class="for_ul3" :for="el in oel.arr2">
                                 <li>
                                    <b :text="el"></b>
                                 </li>
                             </ul>
                        </li>
                        <ul>
                           <li>1</li>
                           <li>2</li>
                           <li>3</li>
                        </ul>
                       <li :for="el in arr">
                            <label :text="el.arr2[0]"></label>
                       </li>
                    </ul>
                 </div>
                  <div class="for_div5" :for="el in arr">
                    <label>{{el.arr2[0]}}yyy</label>
                 </div>
            </div>
             */
        });

        jsInst = JSpring([function ($scope, $, module) {
            setTimeout(function () {
                $scope.arr[0].arr2.$set(0, 'aa');
                $scope.arr[1].arr2.$set(0, 'aaa');
                $scope.arr[2].arr2.$set(0, 'aaaa');
                setTimeout(function () {
                    $scope.arr = [
                        {
                            arr2 : ['a', 'b', 'c', 'd', 'e']
                        }
                    ];

                    setTimeout(function () {
                        $scope.arr = [
                            {
                                arr2 : []
                            },
                            {
                                arr2 : ['aa']
                            },
                            {
                                arr2 : ['a', 'b', 'c', 'd']
                            },
                            {
                                arr2 : ['a', 'b', 'c']
                            }
                        ];
                        setTimeout(function () {
                            $scope.arr = [
                                {
                                    arr2 : ['a', 'b', 'c', 'd', 'e', 'f', 'g'] 
                                }
                            ];
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, {
                arr : [
                {
                    arr2 : ['a', 'b', 'c']
                },
                {
                    arr2 : ['a']
                },
                {
                    arr2 : ['a', 'b', 'c', 'd']
                }
                ]
        }, '#for_inst']);

        container = document.getElementById('for_inst');
        var forDiv = document.getElementsByClassName('for_div');
        var forDiv2 = document.getElementsByClassName('for_div2');
        var forDiv3 = document.getElementsByClassName('for_div3');
        var forDiv4 = document.getElementsByClassName('for_div4');
        var forDiv5 = document.getElementsByClassName('for_div5');
        var forUl = document.getElementsByClassName('for_ul');
        var forUl2 = document.getElementsByClassName('for_ul2');
        var forUl3 = document.getElementsByClassName('for_ul3');

        var arr = jsInst.$scope.arr;
        var sum = 0;
        arr.forEach(function (el, i) {
            sum += el.arr2.length;
        });
        var sum2 = 0;
        arr.forEach(function (el, i) {
            sum2 += el.arr2.length * el.arr2.length;
        });
        var ulLen = 1;

        expect(forDiv.length).to.equal(arr.length);
        expect(forDiv2.length).to.equal(sum);
        expect(forDiv3.length).to.equal(arr[0].arr2.length);
        expect(forUl[0].children.length).to.equal(arr.length + ulLen);
        expect(forDiv4.length).to.equal(arr.length);
        expect(forUl2.length).to.equal(arr.length);
        expect(forUl2[0].children.length).to.equal(arr[0].arr2.length + arr.length + ulLen);
        expect(forUl3.length).to.equal(sum2);
        expect(forDiv5.length).to.equal(arr.length);

        expect(forDiv[0].querySelector('label').textContent).to.equal('a');
        expect(forDiv[1].querySelector('label').textContent).to.equal('a');
        expect(forDiv[2].querySelector('label').textContent).to.equal('a');

        expect(forDiv2[0].querySelector('span b').textContent).to.equal('a');
        expect(forDiv2[1].querySelector('span b').textContent).to.equal('b');
        expect(forDiv2[2].querySelector('span b').textContent).to.equal('c');

        expect(forDiv2[3].querySelector('span b').textContent).to.equal('a');

        expect(forDiv2[4].querySelector('span b').textContent).to.equal('a');
        expect(forDiv2[5].querySelector('span b').textContent).to.equal('b');
        expect(forDiv2[6].querySelector('span b').textContent).to.equal('c');
        expect(forDiv2[7].querySelector('span b').textContent).to.equal('d');

        expect(forDiv3[0].querySelector('span label').textContent).to.equal('a');
        expect(forDiv3[1].querySelector('span label').textContent).to.equal('b');
        expect(forDiv3[2].querySelector('span label').textContent).to.equal('c');

        expect(forUl[0].children[0].querySelector('label').textContent).to.equal('a');
        expect(forUl[0].children[1].querySelector('label').textContent).to.equal('a');
        expect(forUl[0].children[2].querySelector('label').textContent).to.equal('a');

        expect(forUl[0].children[0].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');
        expect(forUl[0].children[0].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
        expect(forUl[0].children[0].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');

        expect(forUl[0].children[1].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');

        expect(forUl[0].children[2].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');
        expect(forUl[0].children[2].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
        expect(forUl[0].children[2].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');

        expect(forDiv4[0].querySelector('label').textContent).to.equal('axxx');
        expect(forDiv4[1].querySelector('label').textContent).to.equal('axxx');
        expect(forDiv4[2].querySelector('label').textContent).to.equal('axxx');

        expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('a');
        expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('b');
        expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('c');

        expect(forUl3[0].querySelector('li b').textContent).to.equal('a');
        expect(forUl3[1].querySelector('li b').textContent).to.equal('b');
        expect(forUl3[2].querySelector('li b').textContent).to.equal('c');
        expect(forUl3[3].querySelector('li b').textContent).to.equal('a');
        expect(forUl3[4].querySelector('li b').textContent).to.equal('b');
        expect(forUl3[5].querySelector('li b').textContent).to.equal('c');
        expect(forUl3[6].querySelector('li b').textContent).to.equal('a');
        expect(forUl3[7].querySelector('li b').textContent).to.equal('b');
        expect(forUl3[8].querySelector('li b').textContent).to.equal('c');
        expect(forUl3[9].querySelector('li b').textContent).to.equal('a');
        expect(forUl3[10].querySelector('li b').textContent).to.equal('a');
        expect(forUl3[11].querySelector('li b').textContent).to.equal('b');
        expect(forUl3[12].querySelector('li b').textContent).to.equal('c');
        expect(forUl3[13].querySelector('li b').textContent).to.equal('d');

        expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('a');
        expect(forUl2[0].children[5].querySelector('label').textContent).to.equal('a');
        expect(forUl2[0].children[6].querySelector('label').textContent).to.equal('a');

        expect(forDiv5[0].querySelector('label').textContent).to.equal('ayyy');
        expect(forDiv5[1].querySelector('label').textContent).to.equal('ayyy');
        expect(forDiv5[2].querySelector('label').textContent).to.equal('ayyy');

        setTimeout(function () {
            var arr = jsInst.$scope.arr;
            var sum = 0;
            arr.forEach(function (el, i) {
                sum += el.arr2.length;
            });
            var sum2 = 0;
            arr.forEach(function (el, i) {
                sum2 += el.arr2.length * el.arr2.length;
            });
            var ulLen = 1;

            expect(forDiv.length).to.equal(arr.length);
            expect(forDiv2.length).to.equal(sum);
            expect(forDiv3.length).to.equal(arr[0].arr2.length);
            expect(forUl[0].children.length).to.equal(arr.length + ulLen);
            expect(forDiv4.length).to.equal(arr.length);
            expect(forUl2.length).to.equal(arr.length);
            expect(forUl2[0].children.length).to.equal(arr[0].arr2.length + arr.length + ulLen);
            expect(forUl3.length).to.equal(sum2);
            expect(forDiv5.length).to.equal(arr.length);

            expect(forDiv[0].querySelector('label').textContent).to.equal('aa');
            expect(forDiv[1].querySelector('label').textContent).to.equal('aaa');
            expect(forDiv[2].querySelector('label').textContent).to.equal('aaaa');

            expect(forDiv2[0].querySelector('span b').textContent).to.equal('aa');
            expect(forDiv2[1].querySelector('span b').textContent).to.equal('b');
            expect(forDiv2[2].querySelector('span b').textContent).to.equal('c');

            expect(forDiv2[3].querySelector('span b').textContent).to.equal('aaa');

            expect(forDiv2[4].querySelector('span b').textContent).to.equal('aaaa');
            expect(forDiv2[5].querySelector('span b').textContent).to.equal('b');
            expect(forDiv2[6].querySelector('span b').textContent).to.equal('c');
            expect(forDiv2[7].querySelector('span b').textContent).to.equal('d');

            expect(forDiv3[0].querySelector('span label').textContent).to.equal('aa');
            expect(forDiv3[1].querySelector('span label').textContent).to.equal('b');
            expect(forDiv3[2].querySelector('span label').textContent).to.equal('c');

            expect(forUl[0].children[0].querySelector('label').textContent).to.equal('aa');
            expect(forUl[0].children[1].querySelector('label').textContent).to.equal('aaa');
            expect(forUl[0].children[2].querySelector('label').textContent).to.equal('aaaa');

            expect(forUl[0].children[0].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('aa');
            expect(forUl[0].children[0].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
            expect(forUl[0].children[0].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');

            expect(forUl[0].children[1].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('aaa');

            expect(forUl[0].children[2].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('aaaa');
            expect(forUl[0].children[2].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
            expect(forUl[0].children[2].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');

            expect(forDiv4[0].querySelector('label').textContent).to.equal('aaxxx');
            expect(forDiv4[1].querySelector('label').textContent).to.equal('aaaxxx');
            expect(forDiv4[2].querySelector('label').textContent).to.equal('aaaaxxx');

            expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('aa');
            expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('b');
            expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('c');

            expect(forUl3[0].querySelector('li b').textContent).to.equal('aa');
            expect(forUl3[1].querySelector('li b').textContent).to.equal('b');
            expect(forUl3[2].querySelector('li b').textContent).to.equal('c');
            expect(forUl3[3].querySelector('li b').textContent).to.equal('aa');
            expect(forUl3[4].querySelector('li b').textContent).to.equal('b');
            expect(forUl3[5].querySelector('li b').textContent).to.equal('c');
            expect(forUl3[6].querySelector('li b').textContent).to.equal('aa');
            expect(forUl3[7].querySelector('li b').textContent).to.equal('b');
            expect(forUl3[8].querySelector('li b').textContent).to.equal('c');
            expect(forUl3[9].querySelector('li b').textContent).to.equal('aaa');
            expect(forUl3[10].querySelector('li b').textContent).to.equal('aaaa');
            expect(forUl3[11].querySelector('li b').textContent).to.equal('b');
            expect(forUl3[12].querySelector('li b').textContent).to.equal('c');
            expect(forUl3[13].querySelector('li b').textContent).to.equal('d');

            expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('aa');
            expect(forUl2[0].children[5].querySelector('label').textContent).to.equal('aaa');
            expect(forUl2[0].children[6].querySelector('label').textContent).to.equal('aaaa');

            expect(forDiv5[0].querySelector('label').textContent).to.equal('aayyy');
            expect(forDiv5[1].querySelector('label').textContent).to.equal('aaayyy');
            expect(forDiv5[2].querySelector('label').textContent).to.equal('aaaayyy');

            setTimeout(function () {
                var arr = jsInst.$scope.arr;
                var sum = 0;
                arr.forEach(function (el, i) {
                    sum += el.arr2.length;
                });
                var sum2 = 0;
                arr.forEach(function (el, i) {
                    sum2 += el.arr2.length * el.arr2.length;
                });
                var ulLen = 1;

                expect(forDiv.length).to.equal(arr.length);
                expect(forDiv2.length).to.equal(sum);
                expect(forDiv3.length).to.equal(arr[0].arr2.length);
                expect(forUl[0].children.length).to.equal(arr.length + ulLen);
                expect(forDiv4.length).to.equal(arr.length);
                expect(forUl2.length).to.equal(arr.length);
                expect(forUl2[0].children.length).to.equal(arr[0].arr2.length + arr.length + ulLen);
                expect(forUl3.length).to.equal(sum2);
                expect(forDiv5.length).to.equal(arr.length);

                expect(forDiv[0].querySelector('label').textContent).to.equal('a');

                expect(forDiv2[0].querySelector('span b').textContent).to.equal('a');
                expect(forDiv2[1].querySelector('span b').textContent).to.equal('b');
                expect(forDiv2[2].querySelector('span b').textContent).to.equal('c');
                expect(forDiv2[3].querySelector('span b').textContent).to.equal('d');
                expect(forDiv2[4].querySelector('span b').textContent).to.equal('e');

                expect(forDiv3[0].querySelector('span label').textContent).to.equal('a');
                expect(forDiv3[1].querySelector('span label').textContent).to.equal('b');
                expect(forDiv3[2].querySelector('span label').textContent).to.equal('c');
                expect(forDiv3[3].querySelector('span label').textContent).to.equal('d');
                expect(forDiv3[4].querySelector('span label').textContent).to.equal('e');

                expect(forUl[0].children[0].querySelector('label').textContent).to.equal('a');

                expect(forUl[0].children[0].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');
                expect(forUl[0].children[0].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
                expect(forUl[0].children[0].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');
                expect(forUl[0].children[0].querySelectorAll('div')[3].querySelector('label').textContent).to.equal('d');
                expect(forUl[0].children[0].querySelectorAll('div')[4].querySelector('label').textContent).to.equal('e');

                expect(forDiv4[0].querySelector('label').textContent).to.equal('axxx');

                expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('a');
                expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('b');
                expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('c');
                expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('d');
                expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('e');

                expect(forUl3[0].querySelector('li b').textContent).to.equal('a');
                expect(forUl3[1].querySelector('li b').textContent).to.equal('b');
                expect(forUl3[2].querySelector('li b').textContent).to.equal('c');
                expect(forUl3[3].querySelector('li b').textContent).to.equal('d');
                expect(forUl3[4].querySelector('li b').textContent).to.equal('e');
                expect(forUl3[5].querySelector('li b').textContent).to.equal('a');
                expect(forUl3[6].querySelector('li b').textContent).to.equal('b');
                expect(forUl3[7].querySelector('li b').textContent).to.equal('c');
                expect(forUl3[8].querySelector('li b').textContent).to.equal('d');
                expect(forUl3[9].querySelector('li b').textContent).to.equal('e');
                expect(forUl3[10].querySelector('li b').textContent).to.equal('a');
                expect(forUl3[11].querySelector('li b').textContent).to.equal('b');
                expect(forUl3[12].querySelector('li b').textContent).to.equal('c');
                expect(forUl3[13].querySelector('li b').textContent).to.equal('d');
                expect(forUl3[14].querySelector('li b').textContent).to.equal('e');
                expect(forUl3[15].querySelector('li b').textContent).to.equal('a');

                expect(forUl2[0].children[6].querySelector('label').textContent).to.equal('a');

                expect(forDiv5[0].querySelector('label').textContent).to.equal('ayyy');

                setTimeout(function () {
        
                    var arr = jsInst.$scope.arr;
                    var sum = 0;
                    arr.forEach(function (el, i) {
                        sum += el.arr2.length;
                    });
                    var sum2 = 0;
                    arr.forEach(function (el, i) {
                        sum2 += el.arr2.length * el.arr2.length;
                    });
                    var ulLen = 1;

                    expect(forDiv.length).to.equal(arr.length);
                    expect(forDiv2.length).to.equal(sum);
                    expect(forDiv3.length).to.equal(arr[0].arr2.length);
                    expect(forUl[0].children.length).to.equal(arr.length + ulLen);
                    expect(forDiv4.length).to.equal(arr.length);
                    expect(forUl2.length).to.equal(arr.length);
                    expect(forUl2[0].children.length).to.equal(arr[0].arr2.length + arr.length + ulLen);
                    expect(forUl3.length).to.equal(sum2);
                    expect(forDiv5.length).to.equal(arr.length);

                    expect(forDiv[0].querySelector('label').textContent).to.equal('');
                    expect(forDiv[1].querySelector('label').textContent).to.equal('aa');
                    expect(forDiv[2].querySelector('label').textContent).to.equal('a');
                    expect(forDiv[3].querySelector('label').textContent).to.equal('a');

                    expect(forDiv2[0].querySelector('span b').textContent).to.equal('aa');
                    expect(forDiv2[1].querySelector('span b').textContent).to.equal('a');
                    expect(forDiv2[2].querySelector('span b').textContent).to.equal('b');
                    expect(forDiv2[3].querySelector('span b').textContent).to.equal('c');
                    expect(forDiv2[4].querySelector('span b').textContent).to.equal('d');
                    expect(forDiv2[5].querySelector('span b').textContent).to.equal('a');
                    expect(forDiv2[6].querySelector('span b').textContent).to.equal('b');
                    expect(forDiv2[7].querySelector('span b').textContent).to.equal('c');

                    expect(forUl[0].children[0].querySelector('label').textContent).to.equal('');
                    expect(forUl[0].children[1].querySelector('label').textContent).to.equal('aa');
                    expect(forUl[0].children[2].querySelector('label').textContent).to.equal('a');
                    expect(forUl[0].children[3].querySelector('label').textContent).to.equal('a');

                    expect(forUl[0].children[1].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('aa');
                    expect(forUl[0].children[2].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');
                    expect(forUl[0].children[2].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
                    expect(forUl[0].children[2].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');
                    expect(forUl[0].children[2].querySelectorAll('div')[3].querySelector('label').textContent).to.equal('d');
                    expect(forUl[0].children[3].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');
                    expect(forUl[0].children[3].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
                    expect(forUl[0].children[3].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');

                    expect(forDiv4[0].querySelector('label').textContent).to.equal('xxx');
                    expect(forDiv4[1].querySelector('label').textContent).to.equal('aaxxx');
                    expect(forDiv4[2].querySelector('label').textContent).to.equal('axxx');
                    expect(forDiv4[3].querySelector('label').textContent).to.equal('axxx');

                    expect(forUl2[1].children[0].querySelector('label').textContent).to.equal('aa');
                    expect(forUl2[2].children[0].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[2].children[1].querySelector('label').textContent).to.equal('b');
                    expect(forUl2[2].children[2].querySelector('label').textContent).to.equal('c');
                    expect(forUl2[2].children[3].querySelector('label').textContent).to.equal('d');
                    expect(forUl2[3].children[0].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[3].children[1].querySelector('label').textContent).to.equal('b');
                    expect(forUl2[3].children[2].querySelector('label').textContent).to.equal('c');

                    expect(forUl3[0].querySelector('li b').textContent).to.equal('aa');
                    expect(forUl3[1].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[2].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[3].querySelector('li b').textContent).to.equal('c');
                    expect(forUl3[4].querySelector('li b').textContent).to.equal('d');
                    expect(forUl3[5].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[6].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[7].querySelector('li b').textContent).to.equal('c');
                    expect(forUl3[8].querySelector('li b').textContent).to.equal('d');
                    expect(forUl3[9].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[10].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[11].querySelector('li b').textContent).to.equal('c');
                    expect(forUl3[12].querySelector('li b').textContent).to.equal('d');
                    expect(forUl3[13].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[14].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[15].querySelector('li b').textContent).to.equal('c');
                    expect(forUl3[16].querySelector('li b').textContent).to.equal('d');
                    expect(forUl3[17].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[18].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[19].querySelector('li b').textContent).to.equal('c');
                    expect(forUl3[20].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[21].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[22].querySelector('li b').textContent).to.equal('c');
                    expect(forUl3[23].querySelector('li b').textContent).to.equal('a');
                    expect(forUl3[24].querySelector('li b').textContent).to.equal('b');
                    expect(forUl3[25].querySelector('li b').textContent).to.equal('c');

                    expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('');
                    expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('aa');
                    expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[1].children[2].querySelector('label').textContent).to.equal('');
                    expect(forUl2[1].children[3].querySelector('label').textContent).to.equal('aa');
                    expect(forUl2[1].children[4].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[1].children[5].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[2].children[5].querySelector('label').textContent).to.equal('');
                    expect(forUl2[2].children[6].querySelector('label').textContent).to.equal('aa');
                    expect(forUl2[2].children[7].querySelector('label').textContent).to.equal('a');
                    expect(forUl2[2].children[8].querySelector('label').textContent).to.equal('a');

                    expect(forDiv5[0].querySelector('label').textContent).to.equal('yyy');
                    expect(forDiv5[1].querySelector('label').textContent).to.equal('aayyy');
                    expect(forDiv5[2].querySelector('label').textContent).to.equal('ayyy');
                    expect(forDiv5[3].querySelector('label').textContent).to.equal('ayyy');

                    setTimeout(function () {
                        var arr = jsInst.$scope.arr;
                        var sum = 0;
                        arr.forEach(function (el, i) {
                            sum += el.arr2.length;
                        });
                        var sum2 = 0;
                        arr.forEach(function (el, i) {
                            sum2 += el.arr2.length * el.arr2.length;
                        });
                        var ulLen = 1;

                        expect(forDiv.length).to.equal(arr.length);
                        expect(forDiv2.length).to.equal(sum);
                        expect(forDiv3.length).to.equal(arr[0].arr2.length);
                        expect(forUl[0].children.length).to.equal(arr.length + ulLen);
                        expect(forDiv4.length).to.equal(arr.length);
                        expect(forUl2.length).to.equal(arr.length);
                        expect(forUl2[0].children.length).to.equal(arr[0].arr2.length + arr.length + ulLen);
                        expect(forUl3.length).to.equal(sum2);
                        expect(forDiv5.length).to.equal(arr.length);

                        expect(forDiv[0].querySelector('label').textContent).to.equal('a');

                        expect(forDiv2[0].querySelector('span b').textContent).to.equal('a');
                        expect(forDiv2[1].querySelector('span b').textContent).to.equal('b');
                        expect(forDiv2[2].querySelector('span b').textContent).to.equal('c');
                        expect(forDiv2[3].querySelector('span b').textContent).to.equal('d');
                        expect(forDiv2[4].querySelector('span b').textContent).to.equal('e');
                        expect(forDiv2[5].querySelector('span b').textContent).to.equal('f');
                        expect(forDiv2[6].querySelector('span b').textContent).to.equal('g');

                        expect(forDiv3[0].querySelector('span label').textContent).to.equal('a');
                        expect(forDiv3[1].querySelector('span label').textContent).to.equal('b');
                        expect(forDiv3[2].querySelector('span label').textContent).to.equal('c');
                        expect(forDiv3[3].querySelector('span label').textContent).to.equal('d');
                        expect(forDiv3[4].querySelector('span label').textContent).to.equal('e');
                        expect(forDiv3[5].querySelector('span label').textContent).to.equal('f');
                        expect(forDiv3[6].querySelector('span label').textContent).to.equal('g');

                        expect(forUl[0].children[0].querySelector('label').textContent).to.equal('a');

                        expect(forUl[0].children[0].querySelectorAll('div')[0].querySelector('label').textContent).to.equal('a');
                        expect(forUl[0].children[0].querySelectorAll('div')[1].querySelector('label').textContent).to.equal('b');
                        expect(forUl[0].children[0].querySelectorAll('div')[2].querySelector('label').textContent).to.equal('c');
                        expect(forUl[0].children[0].querySelectorAll('div')[3].querySelector('label').textContent).to.equal('d');
                        expect(forUl[0].children[0].querySelectorAll('div')[4].querySelector('label').textContent).to.equal('e');
                        expect(forUl[0].children[0].querySelectorAll('div')[5].querySelector('label').textContent).to.equal('f');
                        expect(forUl[0].children[0].querySelectorAll('div')[6].querySelector('label').textContent).to.equal('g');

                        expect(forDiv4[0].querySelector('label').textContent).to.equal('axxx');

                        expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('a');
                        expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('b');
                        expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('c');
                        expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('d');
                        expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('e');
                        expect(forUl2[0].children[5].querySelector('label').textContent).to.equal('f');
                        expect(forUl2[0].children[6].querySelector('label').textContent).to.equal('g');

                        expect(forUl3[0].querySelector('li b').textContent).to.equal('a');
                        expect(forUl3[1].querySelector('li b').textContent).to.equal('b');
                        expect(forUl3[2].querySelector('li b').textContent).to.equal('c');
                        expect(forUl3[3].querySelector('li b').textContent).to.equal('d');
                        expect(forUl3[4].querySelector('li b').textContent).to.equal('e');
                        expect(forUl3[5].querySelector('li b').textContent).to.equal('f');
                        expect(forUl3[6].querySelector('li b').textContent).to.equal('g');
                        expect(forUl3[7].querySelector('li b').textContent).to.equal('a');
                        expect(forUl3[8].querySelector('li b').textContent).to.equal('b');
                        expect(forUl3[9].querySelector('li b').textContent).to.equal('c');
                        expect(forUl3[10].querySelector('li b').textContent).to.equal('d');
                        expect(forUl3[11].querySelector('li b').textContent).to.equal('e');
                        expect(forUl3[12].querySelector('li b').textContent).to.equal('f');
                        expect(forUl3[13].querySelector('li b').textContent).to.equal('g');

                        expect(forUl2[0].children[0].querySelector('label').textContent).to.equal('a');
                        expect(forUl2[0].children[1].querySelector('label').textContent).to.equal('b');
                        expect(forUl2[0].children[2].querySelector('label').textContent).to.equal('c');
                        expect(forUl2[0].children[3].querySelector('label').textContent).to.equal('d');
                        expect(forUl2[0].children[4].querySelector('label').textContent).to.equal('e');
                        expect(forUl2[0].children[5].querySelector('label').textContent).to.equal('f');
                        expect(forUl2[0].children[6].querySelector('label').textContent).to.equal('g');

                        expect(forDiv5[0].querySelector('label').textContent).to.equal('ayyy');
                        done();
                    }, 200);
                }, 200);
            }, 200);
        }, 250);
    });  

});