
var dappAddressTest = 'n1hvRMVhHp3EeM8r39QHgEZWhUQn8z8nvcN';
var dappAddress ="n1qzdrK1gwWScdoGWqE7UeVNknT3ZxuvKmE";


var nebulas = require("nebulas"),
Account = nebulas.Account,
neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

//检测浏览器是否安装星云钱包
if(typeof(webExtensionWallet) === "undefined") {
    alert('星云钱包环境未运行，请安装钱包插件或开启');
}else{
    console.log('星云钱包环境运行成功');
}

var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();
var serialNumber;
var to = dappAddressTest;
var value = "0";
var callFunction = "";
var callArgs = "";
var intervalQuery = null;

function funcIntervalQuery() {
	alert(5566);
    nebPay.queryPayInfo(serialNumber).then(function (resp) {
    	alert(7788);
        console.log("tx result: " + resp)   //resp is a JSON string
        var respObject = JSON.parse(resp)
        if(respObject.code === 0){
            clearInterval(intervalQuery)
        }
    })
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

(function ($) {
	var container;
	// 可选颜色
	var colors = ['#96C2F1', '#BBE1F1', '#E3E197', '#F8B3D0', '#FFCC00'];
	
	var createItem = function(obj){
		var color = colors[parseInt(Math.random() * 5, 10)]
		var $item = $('<div class="item"><a href="#">关闭</a><p>'+ obj.text +'</p><span class="time">'+obj.datetime+'</span></div>').css({ 'background': color}).appendTo(container).drag(obj.id,parseInt(obj.posx),parseInt(obj.posy));
	};
	
	function setpos(resp){
		alert(resp);
	}
	
	// 定义拖拽函数
    $.fn.drag = function (id,posx,posy) {
        var $this = $(this);
        var parent = $this.parent();		
        var pw = parent.width();
        var ph = parent.height();
        var thisWidth = $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);
        var thisHeight = $this.height() + parseInt($this.css('padding-top'), 10) + parseInt($this.css('padding-bottom'), 10);

        var x, y, positionX, positionY;
        var isDown = false; 

        //var randY = parseInt(Math.random() * (ph - thisHeight), 10);
        //var randX = parseInt(Math.random() * (pw - thisWidth), 10);
        var randX = posx;
        var randY = posy;


        parent.css({
            "position": "relative",
            "overflow": "hidden"
        });
		
        $this.css({
            "cursor": "move",
            "position": "absolute"
        }).css({
            top: randY,
            left: randX
        }).mousedown(function (e) {
            parent.children().css({
                "zIndex": "0"
            });
            $this.css({
                "zIndex": "1"
            });
            isDown = true;
            x = e.pageX;
            y = e.pageY;
            positionX = $this.position().left;
            positionY = $this.position().top;
            return false;
        });
		
		$this.mouseup(function (e) {
			if((!event.target.text)|| event.target.text!="关闭") {
				var xPage = e.pageX;
	            var moveX = positionX + xPage - x;

	            var yPage = e.pageY;
	            var moveY = positionY + yPage - y;

	            if (isDown == false) {
	               return;
	            }
	            if (moveX < 0) {
	               moveX = 0;
	            }
	            if (moveX > (pw - thisWidth)) {
	                   moveX = pw - thisWidth;
	            }
	            if (moveY < 0) {
	                moveY = 0;
	            }
	            if (moveY > (ph - thisHeight)) {
	                moveY = ph - thisHeight;
            	}
            	
            	callFunction = "setpos";
		        callArgs = "[\""+id+"\","+moveX+","+moveY+"]";
		        console.log(callArgs);
		        alert(to);

		        nebPay.call(to, value, callFunction, callArgs, { 
		        	 listener: setpos
		        });
			}
        })
		
		
        $(document).mouseup(function (e) {
            isDown = false;
        }).mousemove(function (e) {
            var xPage = e.pageX;
            var moveX = positionX + xPage - x;

            var yPage = e.pageY;
            var moveY = positionY + yPage - y;

            if (isDown == true) {
                $this.css({
                    "left": moveX,
                    "top": moveY
                });
            } else {
                return;
            }
            if (moveX < 0) {
                $this.css({
                    "left": "0"
                });
            }
            if (moveX > (pw - thisWidth)) {
                $this.css({
                    "left": pw - thisWidth
                });
            }
            if (moveY < 0) {
                $this.css({
                    "top": "0"
                });
            }
            if (moveY > (ph - thisHeight)) {
                $this.css({
                    "top": ph - thisHeight
                });
            }
        });
    };
	
	function outputObj(obj) {  
    var description = "";  
    for (var i in obj) {  
        description += i + " = " + obj[i] + "\n";  
    }  
    alert(description);  
}
	

	function display(resp){
		var jlist = JSON.parse(resp.result);
		console.log("result:  "+resp.result);
  		for (var i=0;i<jlist.length;i++){
			createItem(jlist[i]);
  		}
			
	}

	// 初始化
	var init = function () {
		
		container = $('#container');
		 
		// 绑定关闭事件
		container.on('click','a',function () {
			$(this).parent().remove();
		}).height($(window).height() -204);

	//	var tests = ['道友，还处在凝气期吗？道友，还处在凝气期吗？道友，还处在凝气期吗？道友，还处在凝气期吗？道友，还处在凝气期吗？道友，还处在凝气期吗？道友，还处在凝气期吗？道友，还处在凝气期吗？', 'I have a dream...', '路漫漫其修远兮。。。', '与自己为敌，与自己为友', '脚本源码下载', '脚本之家', '既然选择了远方，便只顾风雨兼程！'];
	//	$.each(tests, function (i,v) {
	//		createItem(v);
	//	})
	
	 
		
        callFunction = "getall";
        callArgs = "[]";

        nebPay.simulateCall(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: display        //设置listener, 处理交易返回信息
        });
		
		
		// 绑定输入框
		$('#input').keydown(function (e) {
			var $this = $(this);
			if(e.keyCode == '13') {
				var val = $this.val();
				if(value) {
					callFunction = "save";
					var datetime = getNowFormatDate();
        			callArgs = "[\""+val+"\",\""+datetime+"\",0,0]";
        			alert(callArgs);
        			serialNumber = nebPay.call(to, value, callFunction, callArgs,{});
					$this.val('');
					
					intervalQuery = setInterval(function () {
			            funcIntervalQuery();
			        }, 2000);
				}
			}
		});
		
	};
	
	$(function() {
		init();
	});
	
})(jQuery);

	