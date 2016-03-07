	var SELECTEDCOLOR = 'rgb(255, 118, 15)';
	var MUSICHOVERCOLOR= 'rgb(252, 226, 206)';
	var MUSICPLAYCOLOR='rgb(255, 118, 15)';
	var allMusicList = '';
	var allMusicCount=0;
	var currentrecordobject =new Object();
	var currentselectrecordobject =new Object();
	var MusicPostionLTSlider=0;
	var SINGLESONGWIDTH=34;
	var CURRENTPLAYSTATUS = false;
	var MusicLoopType=0;//0不循环，1列表2单曲3无序
	var configvar=new Object();
	    configvar.general = new Object();
		configvar.interface= new Object();
		configvar.musicplay= new Object();
	var dragfileslist=new Array();
	var MusicListConstColor = "rgba(249, 249, 249";

	function configvarobject(){
		return configvar;
	}
	function getglobalvar(str)
	{
		eval("var x = "+str);
		if(x==undefined){
			x = "";
		}
		return x;
	}
	function documentget(id){
	   return document.getElementById(id);
	}
	function MinWindows() {
	    ShowNotifyIcon();
		MinWindow();
		//OpenMusicFileDialog();
	}
	function SetBackGroundCanvasSize()
	{
		$("#backgroundimage").attr(
			{width : $("#backgroundimage").width(),height: $("#backgroundimage").height()}
			);
	}

	function onsize()
	{
		var windowhw = GetWindowSize();
		documentget("containerwarrp").style.height =(windowhw.height)+'px';
		documentget("musiclist").style.height =(windowhw.height-173)+'px';
		//document.getElementById("setting").style.height =(document.documentElement.clientHeight)+'px';
		documentget("setting").style.height = "100%"
	}
	function initappconfiginfo(appinfostr)
	{
		var str = unescape(appinfostr);
		var json = JSON.parse(str);
		GetAPPConfigInfo(str);
	}
	
	window.onresize = function(){
		onsize();
	}
	window.onload =function(){
		onsize();
	}
	function OpenMusicFileDialog()
	{
		//location.reload();
		OpenFileDialog();
	}
	function resizeScroll() {
		$("#musiclist").getNiceScroll().resize();
	}
	$(document).bind('contextmenu',function(e){
		return false;
	});

	$(document).ready(function()
	{
		setconfigvar();
		//musicstop();
		$("#backgroundcolor").minicolors({
				position: 'top left',
				change: function(hex, opacity) {
					configvar.interface.backgroundcolor= hex;
					DrawBackGroundColor(hex);
				}
		});

		MusicPostionLTSlider = new LTSlider('volumelayertop_id','volumelayerbuttom_id','body_middle_li_right');
		getmusicfiletopanel();
		$("#musiclist").niceScroll({cursorcolor:"rgba(206, 202, 202, 0.85)"});


		if (configvar.general.alwaytray) {
				ShowNotifyIcon();
		};
		SetBackGroundCanvasSize();
		DrawBackGroundColor(configvar.interface.backgroundcolor);

		if(configvar.interface.transparent)
		{

			SetLayerWindow(true);
			//$("#backgroundimage").css("opacity",configvar.interface.transparentrange/10);
			settransparent(configvar.interface.transparentrange);
		}

		$("#caonimade4208").mouseleave(function() {
			$("#musiclooptype").fadeOut("fast","linear");
		});
		$("#caonimade4207").mouseleave(function() {
			$("#volumebar").fadeOut("fast","linear");
		});

		if (configvar.general.autoplay) {
			findmusicbyguid(configvar.musicplay.lastplaymusic);
		}

		$('#volumebar').mousewheel(MOUSEWHEELChangeMusicVolume);

		window.addEventListener('drop', function(ev){
			ev.preventDefault();
		}, false);
	});
	function findmusicbyguid(guid){
		var isplay = false;
		eval("var _allmusiclist =["+allMusicList+"]");
		for (var i = 0; i <_allmusiclist.length; i++) {
			var info = _allmusiclist[i];
			if(info.guid==guid)
			{
				currentrecordobject = info;
				setscrollpos(info.guid);
				musicplay(info.filepath,info.elementid,info.filename,info.filetime,info.author,info.guid);				
				isplay =true;
				return;
			}
		}
		if(!isplay && _allmusiclist.length>0){
			var info = _allmusiclist[0];
			currentrecordobject = info;
			setscrollpos(info.guid);
			musicplay(info.filepath,info.elementid,info.filename,info.filetime,info.author,info.guid);
		}
	}
	function listhover(obj)
	{
		obj.style.backgroundColor ='#FFF';
	}
	function listout(obj)
	{
		obj.style.backgroundColor ='';
	}
	function settingboxshow(id){
	    //$("#body_middle_li_right").hide();
	    $("#"+id).width("100%");
		$("#"+id).css("-webkit-transform", "translateX(0%)");
		$("#GOGOGO").niceScroll({cursorcolor:"rgba(206, 202, 202, 0.85)"});
	}

	function seteffecttext(obj){
		configvar.musicplay.effect = $(obj).attr("effectid");
		$(".effect_div_ul1>li").first().html($(obj).html());
	}
	function showpoptopmenu()
	{
		$("#setting_musiceffect_ul").stop()
		$("#setting_musiceffect_ul").fadeToggle("slow");
	}
	function settingboxhide(id){
		//window.location.reload();
	    $("#"+id).css("width", "100%");
		$("#"+id).css("-webkit-transform", "translateX(100%)");
		/*
		if(id=='setting'){

			saveconfig(configvar);
		}*/
	}

	function cancellistbgcolor(){
		$(".list_single_one").each(function(i){
			this.style.backgroundColor = "";
			$(this).children().first().children("img").attr("src","images/blankwave.png");
		});
		$(".list_single").each(function(i){
			this.style.backgroundColor = "";
			$(this).children().first().children("img").attr("src","images/blankwave.png");
		});
	}

	function setplaycontrolshow(filename,filetime,author)
	{
		$(".currentshowfilename").html(filename);
		$(".currentshowauth").html(author);
		$(".currentshowtotletime").html(filetime);
		$(".currentshowfiletime").text('00:00');
	}

	function setcurrentsliderandtime(time,sliderper){
		MusicPostionLTSlider.setcurrentsliderandtime(time,sliderper);
	}

	function setcover(str)
	{
		var coverimg = "../cover/src/"+str;
		var coverblur ="../cover/blur/"+str;

		
		if(str=='nocover.png' || str==''){
			coverimg = "../template/images/nocover.png";
			coverblur ="";
		}
		$("#coverimage").attr("src",coverimg);
		$("#coverimage").hide();
		$("#coverimage").fadeIn("5000");

		if(configvar.interface.backgroundmode){
		 	DrawBackGroundImage(coverblur);
		}else{
			DrawBackGroundImage('');
		}
	}

	function musicstop()
	{
		CURRENTPLAYSTATUS = false;
		MusicStop();
		setplaycontrolshow('','00:00','');
		cancellistbgcolor();
		$(".waveimg").each(function(i){
			this.src = "images/blankwave.png";
		});
		$("#playbutton").removeClass();
		$("#playbutton").addClass('playbuttonpanel');
		$("#volumelayertop_id").css('width','0');
		setcover('');
		

	}
	function externmusicplay(){
		CloseListContextMenu();
		//musicstop();
		
		musicplay(currentrecordobject.filepath,currentrecordobject.elementid,
			currentrecordobject.filename,currentrecordobject.filetime,currentrecordobject.author,currentrecordobject.guid);
	}

	function musicplay(filepath,elementid,filename,filetime,author,guid)
	{
		/*
		if(currentrecordobject.elementid!=undefined &&
			currentrecordobject.elementid!=null){
			$("#"+currentrecordobject.elementid).parent().children().first().children("img").attr("src","images/blankwave.png");
			$("#"+currentrecordobject.elementid).parent().css("backgroundColor","#FAFAFA");
	    }
	    */
	    cancellistbgcolor();
		currentrecordobject = {"filepath":filepath,"elementid":elementid,"filename":filename,"filetime":filetime,"author":author,"guid":guid};
		$("#"+elementid).parent().children().first().children("img").attr("src","images/wave.gif");
		$("#"+elementid).parent().css("backgroundColor",MUSICPLAYCOLOR);

		//MusicPlayNow(filepath,filename);
		CURRENTPLAYSTATUS = true;
		$("#coverimage").attr("src","images/loading.gif");
		currentselectrecordobject = null;
		MusicPlayNow(currentrecordobject);
		
		$("#playbutton").removeClass();
		$("#playbutton").addClass('stopbuttonpanel');
		ChangeMusicVolume(configvar.musicplay.volumerange);
		setplaycontrolshow(filename,filetime,author);
		//矫正时间
		if(filetime=='00:0-1' || author=='')
		{
				setTimeout(function(){
				var mobject = GetMusicInfo(filepath);

				if(filetime=='00:0-1'){
				$("#"+elementid).next().text(mobject.times);
				$(".currentshowtotletime").text(mobject.times);
				currentrecordobject.filetime = mobject.times;

				$(".currentshowfilename").text(mobject.title);
				currentrecordobject.title = mobject.title;
				$("#"+elementid).text(mobject.title);
				}

				$("#"+elementid).next().next().text(mobject.author);
				$(".currentshowauth").text(mobject.author)
				currentrecordobject.author = mobject.author;


				editmusiclistformcurrentrecord();
			}, 1000)
		}
	}
	//设置内置封面
	function setmusicover(cover,b)
	{

	}
	function writemusictofile(str,isappend)
	{
		WriteFile(str,isappend);
	}
	function getmusicfiletopanel()
	{
		GetFile();
	}
	function createsavelist(str)
	{
		str = JSON.stringify(str);
		str = str.substr(0,str.length-1);
		str = str.substr(1,str.length-1);
		return str;
	}

	function addtomusiclist(jsonstr,add)
	{
		var evalstr = "var outjson = [" + jsonstr+"]";
		eval(evalstr);
		var d = outjson.length;
		var htmlstr='';
		var classstr='list_single_one';
		//alert(JSON.stringify(outjson));
		for(index=0;index<d;index++)
		{
			var single =outjson[index];
			if(index==0)
			{
				classstr ='list_single';
			}
			single.elementid = "music_"+single.guid;
			htmlstr+='<div name="singlesong" guid="'+single.guid+'" class="'+classstr+'" onmousedown="showlistcontext(event,\''+escape(JSON.stringify(single))+'\',this)">';
			htmlstr+='	<div class="list_single_d1"><img src="images/blankwave.png" class="waveimg"/></div>';
			htmlstr+='	<div class="list_single_d2">'+(allMusicCount+1)+'</div>';
			var elementtitle = single.filename;
			if(single.author!='')
			{
				elementtitle+='&nbsp;&nbsp;&nbsp;&nbsp;'+single.author;
			}
			htmlstr+='	<div class="list_single_d3" ondblclick="musicplay(\''+single.filepath+'\',this.id,\''+single.filename+'\',\''+single.filetime+'\',\''+single.author+'\',\''+single.guid+'\')" id="music_'+single.guid+'" title="'+elementtitle+'">'+single.filename+'</div>';
			htmlstr+='	<div class="list_single_d4">'+single.filetime+'</div>';
			htmlstr+='	<div class="list_single_d5">'+single.author+'</div>';
			htmlstr+='</div>';
			allMusicCount++;
		}
		if(allMusicList==''){
			allMusicList+=createsavelist(outjson);
			}
		else{
			allMusicList+=","+createsavelist(outjson);
		}

		$("#musiclist").html($("#musiclist").html()+htmlstr);
		if(add){
			savemusiclist(allMusicList,0);
	    }
		resizeScroll();
	}
	function editmusiclistformcurrentrecord()
	{
		var str = "";
	    eval("var _allmusiclist =["+unescape(allMusicList)+"]");
	   	for(index=0;index<_allmusiclist.length;index++)
		{
			if(_allmusiclist[index].guid==currentrecordobject.guid)
			{

				_allmusiclist[index] = currentrecordobject;
			}
		}
		var str = JSON.stringify(_allmusiclist);
		savemusiclist(str.substring(1,str.length-1),0);
		//JSON.stringify();
	}

	function deletemusicfrommusiclist()
	{
		var str = "";
	    eval("var _allmusiclist =["+unescape(allMusicList)+"]");
	   	for(index=0;index<_allmusiclist.length;index++)
		{
			if(_allmusiclist[index].guid!=currentselectrecordobject.guid)
			{

				var _info = _allmusiclist[index];
				_info.filepath = _info.filepath.replace("\\\\","%5C%5C%5C%5C");
				var _s = '{"filename":"'+_info.filename+'","filepath":"'+_info.filepath+'","filetime":"'+_info.filetime+'","author":"'+_info.author+'","guid":"'+_info.guid+'"}';
				_s+=','
				str+=_s;
			}
		}
		str = str.substr(0,str.length-1);
		allMusicList = '';

		$("div[name='singlesong']").each(function(i){
		   		if($(this).attr('guid')==currentselectrecordobject.guid)
		   		{
		   			$(this).remove();
		   			if($(this).attr('guid')==currentrecordobject.guid)
		   			musicstop();
		   		}
		 });
		$("#musiclist").html('');
		allMusicCount=0;
		addtomusiclist(str,true);
		
		if (CURRENTPLAYSTATUS) {
			$("#"+currentrecordobject.elementid).parent().children().first().children("img").attr("src","images/wave.gif");
			$("#"+currentrecordobject.elementid).parent().css("backgroundColor",MUSICPLAYCOLOR);
			setscrollpos(currentrecordobject.guid);
		}
		//savemusiclist(allMusicList);

	}
	function savemusiclist(str,isappend)
	{
		writemusictofile(str,isappend);
	}
	function emptylistokcallback(){
		musicstop();
		$("#musiclist").html('');
		allMusicList = '';
		allMusicCount=0;
		currentrecordobject =new Object();
		savemusiclist('',0);
	}
	function emptylistcancelcallback(){}
	function emptylist()
	{
		alertdialogshow('确定要清除列表?',true,emptylistokcallback,emptylistcancelcallback);
	}
	function openmusicfilefolder()
	{
		OpenFileFolder(unescape(unescape(currentrecordobject.filepath)).replace(/\\\\/g,"\\"));
	}
	(function(b){
    var LTSlider = function(tlayer,blayer,offsetint){
			var defaultx = 0; //鼠标起始位置横坐标
			var defaulty = 0; //鼠标起始位置纵坐标
			var IsKeydown = false ;
			var defaultclientWidth = 0; // 上面的那个层的宽度
			var bottomlayer = blayer; //下面的那个层ID
			var toplayer = tlayer;//上面的那个层ID

			$("#"+bottomlayer).mousedown(function(e){
				if(!CURRENTPLAYSTATUS)return;

				IsKeydown=true;
				defaultx = e.pageX;
				$("#"+toplayer).css("width", e.pageX-document.getElementById(offsetint).offsetLeft);
				defaultclientWidth = document.getElementById(tlayer).clientWidth;
			});
			$("#"+bottomlayer).mouseup(function(e){
				if(!CURRENTPLAYSTATUS)return;
				defaultx = 0;
				defaulty = 0;
				IsKeydown = false ;
				defaultclientWidth = 0;
				var prc = parseInt($("#"+tlayer).css("width"))/parseInt($("#"+blayer).css("width"));
				//alert(prc);
				SetMusicPosition(prc);
			});
			$(document).mouseup(function(e){
				if(!CURRENTPLAYSTATUS)return;
				defaultx = 0;
				defaulty = 0;
				IsKeydown = false ;
				defaultclientWidth = 0;
			});

			$(document).mousemove(function(ee){
				if (!ee) ee = window.event;

				if(IsKeydown){
					var postionwidth=defaultclientWidth + (ee.pageX - defaultx)
					var bottomlayerwidth = document.getElementById(bottomlayer).clientWidth;
					if(postionwidth>=bottomlayerwidth){
						$("#"+toplayer).css("width","100%");
					}else{
						if(postionwidth<=0)
							$("#"+toplayer).css("width","0%");
						else
							$("#"+toplayer).css("width", parseInt((postionwidth/bottomlayerwidth)*100)+"%");
					}
				}
			});

            this.setcurrentsliderandtime = function(time,sliderper)
            {
            	if(IsKeydown) return;

				$(".currentshowfiletime").html(time.toString());
				var s = sliderper.toString()+"%";
				$("#volumelayertop_id").css("width",s);
            }

	}
	b.LTSlider = LTSlider;
})(this);


function showlistcontext(e,jsonstr,obj)
{
	var str = unescape(jsonstr);
	try{
		$("#"+currentselectrecordobject.elementid).parent().css("backgroundColor",'');
	}catch(e){}
	currentselectrecordobject = JSON.parse(str);
	$(obj).css("backgroundColor",SELECTEDCOLOR);
	try{
		if(CURRENTPLAYSTATUS){
			$("#"+currentrecordobject.elementid).parent().css("backgroundColor",MUSICPLAYCOLOR);
		}
    }catch(e){}
	if(e.which==3)
	{
		ShowUserListContextMenu(e.screenX,e.screenY,180,160)
	}
}

function CloseListContextMenu(){

}
function DrawBackGroundImage(imgpath)
{
  if(imgpath=='')
  {
	DrawBackGroundColor(configvar.interface.backgroundcolor);
	return;
  }

  var c = document.getElementById('backgroundimage')
  var ctx = c.getContext('2d');
  var img = new Image();
  img.src = imgpath;
  img.onload = function()
  {
    ctx.drawImage(img,0,0,$("#backgroundimage").width(),$("#backgroundimage").height());
  }
}
function DrawBackGroundColor(colorstr)
{
  var c = document.getElementById('backgroundimage')
  var ctx = c.getContext('2d');
  ctx.fillStyle=colorstr;
  ctx.fillRect(0,0,$("#backgroundimage").width(),$("#backgroundimage").height());
}

function stackBlurBackGround(w,h,b){
	//stackBlurCanvasRGBA('backgroundimage',0,0,w,h,b);
}
function setttingscroll(elementid,index){
	h = $("#"+elementid).height();
	var v = -(index*h);
	$(".scrollsetttingbox").children().each(function(i, val) {
	     if(i==index){
	      	$(this).animate({opacity:1},1000);
	     }
	     else
	     {
	    	$(this).animate({opacity:0},1000);;
	     }
	});
	$(".scrollsetttingbox").animate({top: v}, 1000);
}

function showdragfilemask(b)
{
	var v= false;
	if(typeof(b)=='string'){v=true};

	if(v){

		$("#dragfilemask").show();
		dragfileshow(b,'')
	}else{
		$("#dragfilemask").fadeOut('fast');
		return;
	}
}

function setdragfileslist(json)
{
	dragfileslist.push(json);
}

function  dragfileshow(filename,filepath){
	$("#dropfileslistmessage_title").text(filename);
	$("#dropfileslistmessage_path").text(filepath);
}
function alertdialogstring(messagebox,b,okfun,canelfun)
{
	var str = "";
	str+='<div class="artdialog">';
	str+='	<p class="artdialog_p1">提示消息</p>';
	str+='	<p class="artdialog_p2"><span>'+messagebox+'</span></p>';
	str+='	<p>';
	str+='		<div>';
	str+='			<a onclick="alertdialogclose('+okfun.name+')" class="button orange bigrounded">确定</a>';

	if(b){
		str+='		<a onclick="alertdialogclose('+canelfun.name+')" class="button orange bigrounded">取消</a>';

	}
	str+='	    </div>';
	str+='	</p>';
	str+='</div>';
	return  str;
}
function fileexistsalertokcallback(){
	
}
function nullfunction(){}

function alertdialogclose(fun)
{
	fun();
	EnableChangeWindowSize(true);
	$(".artdialog").hide();
	$(".artdialog").remove();
	$("#dragfilemask").hide();
	$("#dragfilemask").css("opacity",1);
}

function alertdialogshow(messagebox,isdbbuttn,okcallback,cancelcallback)
{
	EnableChangeWindowSize(false);
	$("#dragfilemask").show();
	$("#dragfilemask").css("opacity",0);
	var obj = GetWindowSize();
	var f2= cancelcallback==null?null:cancelcallback.name;
	var evalstr='$("#backgroundimage").after(alertdialogstring(\''+messagebox+'\','+isdbbuttn+','+okcallback.name+','+f2+'))';
	eval(evalstr);		
	$(".artdialog").css("left",(obj.width/2)-(parseInt($(".artdialog").css("width"))/2));
	$(".artdialog").css("top",(obj.height/2)-(parseInt($(".artdialog").css("height"))/2));
	$(".artdialog").show();
}
function setdragfilemarktitleandpath(i)
{
	//alert(i);
	var k=0;
	if(i==undefined)
	{
		setTimeout(function(){
			setdragfilemarktitleandpath(0);
		}, 0)
	    return;
	}

	if(i==dragfileslist.length)
	{
		var dfl = ','+dragfileslist.join(',');
		savemusiclist(dfl,1);
		dragfileslist =new Array();
		showdragfilemask(false);
		dragfileshow('','');
		return;
	}
	setTimeout(function(){
		var o = dragfileslist[i];
		var obj = eval('('+o+')');
		//alert(obj.filename);

		dragfileshow(obj.filename,obj.filepath);
		addtomusiclist(o,false);
		i=i+1;

		var posoffset = SINGLESONGWIDTH*(i+allMusicCount);
		$("#musiclist").getNiceScroll().doScrollPos(0, posoffset);


		setdragfilemarktitleandpath(i);
	},100);
}

function playevent(obj)
{
	if(currentrecordobject.filepath!='' && currentrecordobject.filepath!=null)
	{
		if(obj=='playbuttonpanel'){
			if(!$("#music_"+currentrecordobject.guid).length){
				eval("var _allmusiclist =["+unescape(allMusicList)+"]");
				if(_allmusiclist.length==0)
					return;

				currentrecordobject=_allmusiclist[0];
				playevent(obj);
				return;
			}
			externmusicplay();
		}
		else
		{
			musicstop();
		}
	}
	else
	{
		eval("var _allmusiclist =["+unescape(allMusicList)+"]");
		if(_allmusiclist.length==0)
			return;

		if(currentrecordobject.guid==undefined || currentrecordobject.guid==''
			|| currentrecordobject.guid==null)
		{
			currentrecordobject=_allmusiclist[0];
			playevent(obj);
		}
	}
}

function loopmusic()
{


}


function nextevent()
{
	getnextorpreinfo(2);
	setscrollpos(currentrecordobject.guid);
	externmusicplay();
}
function preevent(obj)
{
   getnextorpreinfo(1);
   setscrollpos(currentrecordobject.guid);
   externmusicplay();
}

function GetRandomNum(Min,Max)
{
	var Range = Max - Min;
	var Rand = Math.random();
	return(Min + Math.round(Rand * Range));
}
function getnextorpreinfo(t)
{
	eval("var _allmusiclist =["+unescape(allMusicList)+"]");
	if(_allmusiclist.length==0)
		return;

	if(currentrecordobject.guid==undefined || currentrecordobject.guid==''
		|| currentrecordobject.guid==null)
	{
		currentrecordobject=_allmusiclist[0];
		return;
	}

	if(t==3){
		var random = GetRandomNum(0,_allmusiclist.length-1);
		currentrecordobject = _allmusiclist[random];
		return;
	}
   	for(index=0;index<_allmusiclist.length;index++)
	{
		if(_allmusiclist[index].guid==currentrecordobject.guid)
		{
			if(t==1)
			{
				if(_allmusiclist[index-1]!=undefined)
					currentrecordobject = _allmusiclist[index-1];
				else
					currentrecordobject = _allmusiclist[_allmusiclist.length-1];
			}
			if(t==2)
			{
				if(_allmusiclist[index+1]!=undefined)
					currentrecordobject = _allmusiclist[index+1];
				else
					currentrecordobject = _allmusiclist[0];


				//alert("SDFSDF"+JSON.stringify(currentrecordobject));
			}
			break;
		}
	}
}


function setscrollpos(guid)
{
	eval("var _allmusiclist =["+unescape(allMusicList)+"]");
   	for(index=0;index<_allmusiclist.length;index++)
	{
		if(_allmusiclist[index].guid==currentrecordobject.guid)
		{
			var posoffset = SINGLESONGWIDTH*index;
			$("#musiclist").getNiceScroll().doScrollPos(0, posoffset);
			break;
		}
	}
}


function showvolumebardiv(sid,did,w,h,loffset,toffset)
{
	$("#"+did).fadeToggle("fast","linear");
}

function MOUSEWHEELChangeMusicVolume(event,delta)
{
	var v = configvar.musicplay.volumerange;
	if(delta>0)//上
	{
		if(v+1>10) v= 10;
		else v++;
	}else if(delta<0)
	{
		if(v-1<0) v= 0;
		else v--;
	}else{return;}
	ChangeMusicVolume(v)
	event.stopPropagation();
	event.preventDefault();
}

function ChangeMusicVolume(v)
{
   SetMusicVolume(v);
   configvar.musicplay.volumerange = v;
   $("#volumerange").val(configvar.musicplay.volumerange);
}


jQuery(document).ready(function($) {
		var menulistbgfun = function(obj,w,str){
			$(obj).next().css("width",w);
			$(obj).next().css("backgroundColor",str);
		}
		$(".menulisttext").mouseover(function() {
			menulistbgfun(this,100,'rgba(255, 0, 0, 1)')
		});
		$(".menulisttext").mouseout(function() {
			menulistbgfun(this,50,'rgba(255, 0, 0, 0)')
		});
	});

	function aaa(h,index){
		$(".contentwarrp").stop();
		var v = 0;
		v = -(index*h);
		$(".contentwarrp").animate({top: v}, 1000);
	}
	function closewindow(clicktype)
	{
		//是否点击的页面上的关闭按钮
		if(clicktype==1)
		{
			if(configvar.general.closetotray)
			{
				//DeleteNotifyIcon();
				ShowNotifyIcon();
				MinWindow();
				return;
			}
		}
		var windowhw = GetWindowSize();
		configvar.interface.windowwidth = windowhw.width;
		configvar.interface.windowheight = windowhw.height;
		configvar.musicplay.lastplaymusic = currentrecordobject.guid==undefined?"":currentrecordobject.guid;
		CloseApp();
		WriteAppConfigFile(JSON.stringify(configvar),function(){
			QuitApp();
		});
	}

	function setconfigvar()
	{
	    LoadConfigVar(function(configstr){
	    	try{

	    		try{
					configvar = JSON.parse(configstr);
				}
				catch(e)
				{

				}
				if(configvar.general.closetotray==undefined)
				{
					configvar.general.closetotray =false;
				}

				if(configvar.general.autoplay==undefined)
				{
					configvar.general.autoplay =false;
				}
				if(configvar.general.alwaytray==undefined)
				{
					configvar.general.alwaytray =false;
				}

				documentget("closetotray").checked=configvar.general.closetotray==true?'checked':'';
				documentget("autoplay").checked=configvar.general.autoplay==true?'checked':'';
				documentget("alwaytray").checked=configvar.general.alwaytray==true?'checked':'';
				if(configvar.interface.backgroundimg==undefined)
				{
					configvar.interface.backgroundimg = 'bg1';
				}
				initsetting_selectbackgroundimage(configvar.interface.backgroundimg);

				if(configvar.interface.transparent==undefined)
				{
					configvar.interface.transparent =false;
				}
				if(configvar.interface.musiclisttransparent==undefined)
				{
					configvar.interface.musiclisttransparent =false;
				}
				if(configvar.interface.backgroundmode==undefined)
				{
					configvar.interface.backgroundmode=false;
				}

				documentget("musiclisttransparent").checked=configvar.interface.musiclisttransparent==true?'checked':'';
				documentget("transparent").checked=configvar.interface.transparent==true?'checked':'';
				documentget("backgroundmode").checked=configvar.interface.backgroundmode==true?'checked':'';

				if(configvar.interface.transparent){
					initsettransparentrange_div();
				}
				if(configvar.interface.transparentrange==undefined){
						configvar.interface.transparentrange=255;
				}
				$("#transparentrange").val(configvar.interface.transparentrange);
				if(configvar.interface.backgroundcolor==undefined)
				{
					configvar.interface.backgroundcolor ='#FFFFFF';
				}
				if(configvar.musicplay.loop==undefined)
				{
					configvar.musicplay.loop = 0;
				}
				selectlooptype(null,configvar.musicplay.loop);
				if(configvar.musicplay.volumerange==undefined)
				{
					configvar.musicplay.volumerange = 5;
				}
				ChangeMusicVolume(configvar.musicplay.volumerange);

				$("#volumerange").val(configvar.musicplay.volumerange);

				var loopobj = [["closetotray","alwaytray","autoplay"],["transparent","musiclisttransparent","backgroundmode"]];
				for(var i=0;i<loopobj.length;i++){
					if(i==0)
					{
						for (var j=0; j<loopobj[i].length;j++) {
							if(!eval("configvar.general."+loopobj[i][j]))
							{
								var id = loopobj[i][j];
								var name = $("#"+id+"_icon").attr("srcimg");
								$("#"+id+"_icon").attr("src",name.split('.')[0]+'_h.png')
							}
						}
					}
					else
					{
						for (var j=0; j<loopobj[i].length;j++) {
							if(!eval("configvar.interface."+loopobj[i][j]))
							{
								var id = loopobj[i][j];
								var name = $("#"+id+"_icon").attr("srcimg");
								$("#"+id+"_icon").attr("src",name.split('.')[0]+'_h.png')
							}
						}
					}
				}
					$("#backgroundcolor").minicolors('value',configvar.interface.backgroundcolor);
		   }
		   catch(e){;}
	    })
	}


	function settransparent(v)
	{
		configvar.interface.transparentrange = v;
		v = (v/10)==0?0.01:v/10;
		$("#backgroundimage").css("opacity",v);
		if(configvar.interface.musiclisttransparent){
			$("#musiclist").css({
						'background-color': ''+MusicListConstColor+','+v+')',
			});
		}
	}
	function settransparentrange_div(b)
	{
		$("#transparent").attr("disabled","disabled");
		var obj =$("#hidden_transparent_div");
		$("#setting").after('<div id="loadingdiv" class="loadingdiv"></div>');
		if(b){
			obj.show();
			$("#contentinterface").animate({'height':parseInt($("#contentinterface").css("height"))+62},'slow','swing',function(){
				obj.animate({'opacity':1.0},'slow','swing',function(){
					$("#loadingdiv").remove();
					$("#transparent").removeAttr("disabled");

				});
			})
		}else{
			obj.animate({'opacity':0},'slow','swing',function(){
				$("#contentinterface").animate({'height':parseInt($("#contentinterface").css("height"))-62},'slow','swing',function(){
					obj.hide();
					$("#loadingdiv").remove();
					$("#transparent").removeAttr("disabled");
				})
			});
		}
	}
	function initsetfileregister(extstr){
		var extarr = extstr.split(',');
		if(extarr.length==0)return;
		$("#setting_fileregister_ul>li>div").each(function(){
			for(i in extarr)
			{
				if($(this).attr("type")==extarr[i])
				{
					$(this).children('span').first().html('<img src="images/true1.png"/>');
				}
			}
		})
	}
	function initsettransparentrange_div()
	{
		$("#hidden_transparent_div").show();
		$("#contentinterface").css('height',parseInt($("#contentinterface").css("height"))+62);
		//$("#transparentrange_div").css('opacity',1.0);
	}

	//设置播放类型
	function selectlooptype(obj,type)
	{
		var typearr = ['不 循 环','单曲循环','列表循环','随机播放'];
		$("#musiclooptype>ul>li").each(function(i){
			if(type==i){
				$(this).text(typearr[i]+'√');
			}else{
				$(this).text(typearr[i]);
		    }
		});
		configvar.musicplay.loop = type;
		MusicLoopType = type;
	}
	function abc()
	{
		if (event.wheelDelta >= 120){

			var c = $(".contentwarrp").position().top+20;
			if(c>0)
			{
				$(".contentwarrp").css('top',0);
				return;
			}
		}
		if (event.wheelDelta <= -120){
			var c = $(".contentwarrp").position().top-20;
			if(c<-900)
			{
				$(".contentwarrp").css('top',-900);
				return;
			}
		}
	  $(".contentwarrp").css("top",c);
	}

	function contentlistcheckboxchange(obj,perfix)
	{
		var name = $("#"+obj.id+"_icon").attr("srcimg");
		if(!obj.checked)
		{
			if(obj.id=='transparent')
			{
				SetLayerWindow(false);
				$("#backgroundimage").css("opacity",1);
				settransparentrange_div(false);
			}
			if(obj.id=='musiclisttransparent')
			{
				configvar.interface.musiclisttransparent=false
				$("#musiclist").css({
					'background-color': ''+MusicListConstColor+',1)',
				});
			}
			if(obj.id=='backgroundmode')
			{
				configvar.interface.backgroundmode=false;
			}
			if(obj.id=='alwaytray')
			{
				DeleteNotifyIcon();
			}
			$("#"+obj.id+"_icon").attr("src",name.split('.')[0]+'_h.png');
		}
		else
		{
			if(obj.id=='transparent')
			{
				SetLayerWindow(true);
				$("#backgroundimage").css("opacity",configvar.interface.transparentrange);
				settransparentrange_div(true);
			}
			if(obj.id=='musiclisttransparent')
			{
				configvar.interface.musiclisttransparent=true;
				$("#musiclist").css({
					'background-color': ''+MusicListConstColor+','+configvar.interface.transparentrange/10+')',
				});
			}
			if(obj.id=='backgroundmode')
			{
				configvar.interface.backgroundmode=false;
			}
			if(obj.id=='alwaytray')
			{
				ShowNotifyIcon();
			}
			$("#"+obj.id+"_icon").attr("src",name);
		}
		eval("configvar."+perfix+"."+obj.id +"="+obj.checked);

	}

	function grayscale(src){
               var canvas = document.createElement('canvas');
               var ctx = canvas.getContext('2d');
               var imgObj = new Image();
               imgObj.src = src;
               canvas.width = imgObj.width;
               canvas.height = imgObj.height;
               ctx.drawImage(imgObj, 0, 0);
               var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
               for(var y = 0; y < imgPixels.height; y++){
                       for(var x = 0; x < imgPixels.width; x++){
                               var i = (y * 4) * imgPixels.width + x * 4;
                               var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                               imgPixels.data[i] = avg;
                               imgPixels.data[i + 1] = avg;
                               imgPixels.data[i + 2] = avg;
                       }
               }
               ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
               return canvas.toDataURL();
    }
    function setting_selectbackgroundimage(obj){
		$("#setting_backgroundimage_ul>li>div>span").each(function(index, val) {
			$(this).html("");
		});
		$(obj).children('span').first().html('<img src="images/true.png"/>');
		configvar.interface.backgroundimg = $(obj).attr("bgname");
    }
    function initsetting_selectbackgroundimage(imageurl)
    {
	    $("#setting_backgroundimage_ul>li>div").each(function() {
			if($(this).attr("bgname")==imageurl)
				$(this).children('span').html('<img src="images/true.png"/>');
			else
				$(this).children('span').html("");
		});
    }
    function setting_selectfileregister(obj){
    	var o = $(obj).children('span').first();
    	if(o.html()!='')
    	{
    		o.html('');
    		var arr = configvar.musicplay.fileregister.split(',');
    		configvar.musicplay.fileregister = '';
    		for (i in arr) {
    			if(arr[i]!=$(obj).attr("type")){
    				if(configvar.musicplay.fileregister=='')
    					configvar.musicplay.fileregister+=arr[i];
    				else
    					configvar.musicplay.fileregister+=","+arr[i];
    			}
    		}
    	}
    	else{
			o.html('<img src="images/true1.png"/>');
			configvar.musicplay.fileregister = configvar.musicplay.fileregister+","+$(obj).attr("type");
		}
    }

var timercontrol = function(t,fun){
	var timer = 0;
}

///////////////extern call start/////////////////////////
	function extern_musicloop()
	{

		//musicstop();
		if(!CURRENTPLAYSTATUS)
		{

			return;	
		}
		musicstop();
		if(MusicLoopType==0){
			return;
		}
		if(MusicLoopType==1){
			   externmusicplay();
			   return;
		}
		if(MusicLoopType==2){
			nextevent();
			return;
		}
		if(MusicLoopType==3){
			getnextorpreinfo(3)
			setscrollpos(currentrecordobject.guid);
   			externmusicplay();
   			return;
		}
	}
	function extern_contextmenuplay(){
		currentrecordobject = currentselectrecordobject;
		setscrollpos(currentrecordobject.guid);
		externmusicplay();
	}
	function extern_contextmenuopenfilefloder(){
		OpenFileFolder(currentselectrecordobject.filepath);
	}
///////////////extern call end/////////////////////////