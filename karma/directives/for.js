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
                 <div class="for_div2" :for="el in arr">
                   <label>{{el}}xxx</label>
                </div>
            </div>
             */
        });

        jsInst = JSpring([function ($scope, $, module) {
            done();
        }, {
                arr : ['aa', 'bb', 'cc']
        }, '#for_inst']);
        container = document.getElementById('for_inst');
        var forDiv = document.getElementsByClassName('for_div');
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

    it('多个for，多次更新数据', function (done) {
        body.innerHTML = heredoc(function () {
            /*
            <div id="for_inst">
                 <div class="for_div" :for="el in arr">
                    <label :text="el"></label>
                 </div>
                 <div class="for_div2" :for="el in arr2">
                     <span>
                        <label :text="el"></label>
                     </span>
                 </div>
                  <ul class="for_ul">
                     <li :for="el in arr2">
                          <label :text="el"></label>
                     </li>
                    <li :for="el in arr">
                         <label :text="el"></label>
                    </li>
                 </ul>
                 <div class="for_div2" :for="el in arr2">
                    <label>{{el}}xxx</label>
                 </div>
                  <div class="for_div2" :for="el in arr">
                    <label>{{el}}xxx</label>
                 </div>
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

});