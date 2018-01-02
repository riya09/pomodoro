var minSp=document.getElementById('min'),//get dom of minute text
    secSp=document.getElementById('sec'),//get dom of second text
    audio=new Audio('alarm.mp3'),//declare and load audio file
    min=minSp.innerText,//set minute to value of dom
    mode=[true,false,false],//initially setting focus mode and all other to false,
    mode_time=[25,5,15],
    notify=false,sec=0,
    stopwatch,startbtn=false,stopbtn=true,tmp,
    //text for notification depending on which mode-focus,short break or long break the user was on
    content=['Take a break,stretch and drink water.','Time to get back to work!',
            'Hope that long break refreshed you up,time to go focus more.'];
    
function write_txt(get_min,get_sec){
    if(get_sec<10)secSp.innerText='0'+get_sec;
    else secSp.innerText=get_sec;
    if(get_min<10) minSp.innerText='0'+get_min;
    else minSp.innerText=get_min;
}
//timer function
function start_timer(){
    sec--;
    if(min==0 && sec==0){
        clearInterval(stopwatch);
        set_notification();
        audio.play();
    }
    else if(sec<=0){
        min--;
        sec=59;
    }
    write_txt(min,sec);//writes change value every second the value changes
}
//on reset or preferred button clicked the minute button will be updated
function set_mode(setMinute){
    clearInterval(stopwatch);
    min=setMinute;
    sec=0;
    write_txt(min,0);
    startbtn=false;
    document.getElementById('ctrl-image').src='images/play.png'
}
//start and stop button toggle
document.getElementById('start').addEventListener('click',function(){
    if(!startbtn){
        if(min>0){
		audio.currentTime=0.0;
		stopwatch=setInterval(start_timer,1000);
	}
        startbtn=true;
        stopbtn=false;
        document.getElementById('ctrl-image').src='images/stop.png';
    }
    else if(!stopbtn){
        clearInterval(stopwatch);
        startbtn=false;
        stopbtn=true;
        document.getElementById('ctrl-image').src='images/play.png'
    }
})
function reset_setting(elem){
    mode_time[0]=parseInt(document.getElementById('work').value);
    if(mode_time[0]<25)mode_time[0]=25;
    if(mode_time[0]>60)mode_time[0]=60;
    mode_time[1]=parseInt(document.getElementById('sbreak').value);
    if(mode_time[1]<5)mode_time[1]=5;
    if(mode_time[1]>10)mode_time[1]=10;
    mode_time[2]=parseInt(document.getElementById('lbreak').value);
    if(mode_time[2]<15)mode_time[2]=15;
    if(mode_time[2]>30)mode_time[2]=30;
    //if a focus mode is changed or reset the text and minute value changes
    if(mode[0]){
        set_mode(mode_time[0]);
    }
    else if(mode[1]){
        set_mode(mode_time[1]);
    }
    else if(mode[2]){
        set_mode(mode_time[2]);
    }
    document.getElementById('setting-option').style.visibility='hidden';
    document.getElementById('setting-option').style.opacity='0';
}
//adding event listener to each button of focus,short and long time
Array.from(document.getElementsByClassName('pbutton')).forEach(function(elem,index,arr){
    elem.addEventListener('click',function(){ //the clicked button is elem
        if(!mode[index]){ //if it has not been selected already, the following operation will take place
            for(var i=0;i<mode.length;i++){
                if(i==index){
                    mode[i]=true; //setting the current button to true, so that multiple clicks does not affect the timer
                    set_mode(mode_time[i]);//sets time depending on the button clicked
                    elem.style.backgroundColor='#e33232';
                    tmp=content[i];
                }
                else{
                    mode[i]=false;//sets all other .pbutton class to false
                    arr[i].style.backgroundColor='#363B42';
                }
            }
        }
        console.log(mode);
    })
})
//on click on setting button, setting div will pop up on top  
document.getElementById('change-setting').addEventListener('click',function(){
    document.getElementById('setting-option').style.visibility='visible';
    document.getElementById('setting-option').style.opacity='1';
})
//on close the setting div will be set to hidden
document.getElementById('close').addEventListener('click',function(){
    document.getElementById('setting-option').style.visibility='hidden';
    document.getElementById('setting-option').style.opacity='0';
})
//set details of notification
function set_notification(){
    if(notify){
		var n = new Notification('Time Up', { 
			body: tmp
		});
    }
}
//ask for notification permission when window load
window.addEventListener('load',function(){
    if(window.Notification && Notification.permission !== "denied") {
	Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
        console.log('notification allowed');
        notify=true;
	   });
    }
})
