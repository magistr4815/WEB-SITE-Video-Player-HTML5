$(function() {

	const vid = document.getElementById("myvideo"); //на jq не работает, верней работает через get(0), бред
	const pos = document.getElementById("position");
	const vol = document.getElementById("volume"); // объект нашего ползунка звука (изначально мы задали 100 в html)
	var full_mode = false, menu_hide = true;
	var inter,int;
	var vol_fix = vid.volume;

	function time_normal(time) // ФУНКЦИЯ ВРЕМЕНИ преобразующая секунды из 69,324234 в 1:09
	{
		var min = 0, sec = 0, sec_crop = 0;
		sec = Math.trunc(time);
		if(sec >= 60) //>60
		{
            sec_crop = sec % 60; // остаток от деления на 60 (находим секунды)
            //document.write(sec_crop);
            min = (sec - sec_crop)/60; // целое от деления (находим минуты)
            //document.write(min);
    	}
  		else //<60
        {
            sec_crop = sec % 60;
        }
      
        if(sec_crop < 10) // что бы выводился ноль посередене, если число секунд меньше 10
        {
          	return min + ':0' + sec_crop;
        }
        else
        {
            return min + ':' + sec_crop;
        }
	}

	function btn_tumbler() //ФУНКЦИЯ ПЕРЕКЛЮЧЕНИИЯ ТЕКСТА КНОПКИ ПЛЕЙ
	{
		var a;
		if(this.paused) 
		{
			a = '<svg class="icon icon-play3"><use xlink:href="#icon-play3"></use></svg>';

		}
		else
		{
			a = '<svg class="icon icon-pause2"><use xlink:href="#icon-pause2"></use></svg>';
		}
		$("#play_pause").html(a);
		//btn.textContent = a;
	}

	function play_pause_video() //ФУН ТУМБЛЕР ПЛЕЙ ПАУЗ ВИДЕО
	{
    	if(vid.paused) 
    	{
    		vid.play();
    		inter = setInterval(posit,1000/66); // 1000/66 - якобы оптимальное число для смены кадров - визуально

    	} 
    	else 
    	{
    		vid.pause();
    		clearInterval(inter);
    	} 
	}

	function posit() // ИНТЕРВАЛ ДЛЯ ПОЛЗУНКА
	{
	    pos.value = vid.currentTime; //изменение положение ползунка
	    $(".to").text(time_normal(vid.currentTime)); //изменение времени

	    if(pos.max == vid.currentTime) //ПРОВЕРКА, ВДРУГ ВИДЕО ЗАКОНЧИЛОСЬ
    		{
    			vid.pause(); //ТОГДА СТОП
    			clearInterval(inter); // И ОЧИЩАЕМ ИНТЕРВАЛ
    		}
	}

	function full () // ФУЛЛ СКРИН
	{
		if ( full_mode ) { // проверка на то, находится ли пользователь в полноэкранном режиме или нет
			if(vid.exitFullscreen) {
				vid.exitFullscreen();
			} else if(vid.mozCancelFullScreen) {
				vid.mozCancelFullScreen();
			} else if(vid.webkitExitFullscreen) {
				vid.webkitExitFullscreen();
			}
		} else {
			if(vid.requestFullscreen) {
				vid.requestFullscreen();
			} else if(vid.mozRequestFullScreen) {
				vid.mozRequestFullScreen();
			} else if(vid.webkitRequestFullscreen) {
				vid.webkitRequestFullscreen();
			} else if(vid.msRequestFullscreen) {
					vid.msRequestFullscreen();
			}
		}
		full_mode = !full_mode;
	}

	// с пробелом беда, так как если я захожу в фулл скрин и нажимаю пробел, он сворачивает видео тли наоборот разворачивает
	// $(document).keydown(function( event ) {
	// 		  	if ( event.which == 32 ) 
	// 		  	{ // пробел

	// 		   	play_pause_video();
	// 		  }
	// 		});

		
	vid.oncanplay = function() { //ПРОВЕРКА. ГОТОВО ЛИ ВИДЕО? ПРОГРУЗИЛОСЬ ЛИ?
	    pos.min = 0;
		pos.max = vid.duration; //присваиваем максимальное положение ползунку по длинне видео
		$(".from").text(time_normal(vid.duration)); //присваеваем значению from длинну видео во временном эквиваленте
		 
		//ПЕРЕМЕЩЕНИЕ ПОЛЗУНКА  
		$("#position").on('mousedown',function() {  //при зажатии мыши
	    	vid.pause(); // видео останавливается
	    	clearInterval(inter); //останавливается вызов функции c интервалом

		});

		//ПЕРЕМЕЩЕНИЕ ПОЛЗУНКА
		$("#position").on('mouseup',function() { // сразу же после отпуска мыши
			if( vid.paused == true) /*если видео было остановленно - запускаем его (проверка эта нужна, ибо в ином слечае работает не корректно)*/
			{

				vid.play(); // запускаем видео
		    	inter = setInterval(posit,1000/66); // 1000/66 - якобы оптимальное число для смены кадров - визуально
			}
			vid.currentTime = pos.value; // соотносим место в видео потоке со значением в ползунке
		});

		$(".container_player").mousemove(function() { //скрытие меню после  2х сек бездействия и появление

			menu_hide = false; //меню не скрыто если мы навелись
			clearTimeout(int); //удаляем интервал
			$(".menu").removeClass("hide_menu"); //удаляем класс

			if(menu_hide == false) // сразу же проверяем что меню видно, его нужно скрыть
				{
					function hide () 
					{ 
						$(".menu").addClass("hide_menu");
					}
					int = setTimeout(hide, 7000); // скрываем его с задержкой
				}
		});
		// КОНЕЦ ПЕРЕМЕЩЕНИЕ ПОЛЗУНКА

	}; //oncanplay


	// в функции проверки видео на готовность, нектороные события через JQ не работают
	$("#myvideo").click(function() { //КЛИК ПО ВИДЕО
		play_pause_video();
	});
	vid.addEventListener('play',btn_tumbler); //нет такого события в JQ
	vid.addEventListener('pause',btn_tumbler); //нет такого события в JQ
	$("#play_pause").click(function() { //КЛИК ПО КНОПКЕ ПЛЕЙ
		play_pause_video();
	});

	document.addEventListener("fullscreenchange", function() {

    if ( document.fullscreen ) {
        full_mode = true;
    }
    else
    {
    	full_mode = false;
    }

	});

	$("#full").on('click',function() {	//FULL SCREEN
		full();
	});

	$("#myvideo").on('dblclick',function() {	//FULL SCREEN
		full();
	});

	//ЗВУК
	$("#volume").mousemove(function() {  //событие работает когда курсор дивигается над ползунком, но при этом
		//значение звука не именяется, так как мы не трогаем кликом сам ползунок.
		var v = vol.value/100;
		vid.volume = v;
		//$("#qwe").text(v);
		//определение ползунка и изменение картинки в зависимости от значния
		if(v == 0)
		{
			$("#mute").html('<svg class="icon icon-volume-mute"><use xlink:href="#icon-volume-mute"></use></svg>');
		}
		else if(v >= 0.01 && v <= 0.7)
		{
			$("#mute").html('<svg class="icon icon-volume-low"><use xlink:href="#icon-volume-low"></use></svg>');
		}
		else if(v > 0.7 && v <=100) 
		{
			$("#mute").html('<svg class="icon icon-volume-medium"><use xlink:href="#icon-volume-medium">');
		}
	});

	$("#mute").click(function() { // тумблер мьюта
		
		if(vid.volume > 0) // если громкость больше 0
		{
			vol_fix = vid.volume; // то запоминаем это значение и обнуляем все
			$("#mute").html('<svg class="icon icon-volume-mute"><use xlink:href="#icon-volume-mute"></use></svg>');
			vid.volume = 0;
			vol.value = 0;
		}
		else //если громкость = 0
		{
			$("#mute").html('<svg class="icon icon-volume-medium"><use xlink:href="#icon-volume-medium"></use></svg>');
			vid.volume = vol_fix; // изменяем на то значение которое было до обнуления
			vol.value = vol_fix*100; // в том числе и значение ползунка
		}
		
	});
})