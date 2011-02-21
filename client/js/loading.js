var domain = 'Mystalia Online';
jQuery.fn.exists = function(){return jQuery(this).length>0;}
var clientconnected = false;
var ismapeditor = false;
var selectedclass = 0;

function DoLogin(data){
	if(data != 'false'){
		$('#charselect').html(data);
		SetCharSelectSprite(0);
		SetCharSelectSprite(1);
		SetCharSelectSprite(2);
		$( "#charselect" ).dialog( "open" );
		$( "#login-form" ).dialog( "close" );
	}else{ alert('Login Error'); }
}

function DoLogout(){
	$.ajax({ url: "ajax/accounts.php", data:'logout=1' });
}

// After Images Have Loaded.
$(window).load(function(){
	$('#loading-form-status').html('Welcome To '+domain+'<br /><ul><li>Loading Images... Loaded</li><li>Connecting to server...</li></ul>');
	socket.connect();
	startBlink();
	setTimeout(function(){
	if(clientconnected == false){
		$('#loading-form-status').html('Welcome To '+domain+'<br /><ul><li>Loading Images... Loaded</li><li>Connecting to server... Failed</li></ul>');
	}
  },5000);
});

// Enable tabs.
$(function() {
	$( "#rightuitabs" ).tabs({
	   show: OnTabChange
	});
});

// Set Keyboard Events.
$(document).keyup(function (e) {
	if(e.which == 20){ if(Player_Speed[User_Player] == 400){ Player_Speed[User_Player] = 200; }else{ Player_Speed[User_Player] = 400; } }
	Player_Moving[User_Player] = false;
}).keydown(function (e) {
	if(Sprite_Animation_Moving[User_Player] == false && isGameInFocus() == true){
		if(e.which == 87 || e.which == 119) {
			Player_Direction[User_Player] = 'up'; MovePlayer(User_Player,true);
		}
		if(e.which == 65 || e.which == 97) {
			Player_Direction[User_Player] = 'left'; MovePlayer(User_Player,true);
		}
		if(e.which == 83 || e.which == 115) {
			Player_Direction[User_Player] = 'down'; MovePlayer(User_Player,true);
		}
		if(e.which == 68 || e.which == 100) {
			Player_Direction[User_Player] = 'right'; MovePlayer(User_Player,true);
		}
		
		if(e.which == 102 || e.which == 70){ SendData('attack=1'); AttackAnimation(User_Player); }
	}
});

$(window).ready(function(){

	// Login form
	$( "#loading-form" ).dialog({
		autoOpen: true,
		height: 170,
		width: 250,
		modal: true,
		closeOnEscape: false,
		buttons: {
			"Retry": function(){ socket.connect(); $('#loading-form-status').html('Welcome To '+domain+'<br /><ul><li>Loading Images... Loaded</li><li>Connecting to server...</li></ul>'); setTimeout(function(){
			if(clientconnected == false){
				$('#loading-form-status').html('Welcome To '+domain+'<br /><ul><li>Loading Images... Loaded</li><li>Connecting to server... Failed</li></ul>');
			}
		  },5000); }
		}
	});
	
	// Login form
	$( "#login-form" ).dialog({
	autoOpen: false,
	height: 170,
	width: 250,
	modal: true,
	closeOnEscape: false,
	buttons: {
		"Login": function() {
			SendData('login='+$('#username').val()+':'+$('#password').val());
		},
		"Register": function(){
			$( this ).dialog( "close" );
			$('#register-form').dialog( "open" );
		}
		}
	});

	// Register form
	$( "#register-form" ).dialog({
	autoOpen: false,
	height: 240,
	width: 250,
	modal: true,
	buttons: {
		"Register": function() {
			if($('#regpassword').val() == $('#confirmpassword').val()){
			
				var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				var address = $('#email').val();
				if(reg.test(address) == false) { alert('Invalid Email Address'); }else{
					if($('#regusername').val() != "" && $('#regpassword').val() != ""){
						SendData('register='+$('#regusername').val()+':'+$('#regpassword').val()+':'+$('#email').val());
					}
				}
				
			}else{ alert('Password Confirmation Failed'); }
		},
		Cancel: function() {
			$('#regpassword').val('');
			$('#regusername').val('');
			$('#confirmpassword').val('');
			$('#email').val('');
			
			$( this ).dialog( "close" );
			$('#login-form').dialog( "open" );
		},
		"Back": function(){
			$( this ).dialog( "close" );
			$('#login-form').dialog( "open" );
		}
		}
	});

	// Character select form
	$( "#charselect" ).dialog({
	autoOpen: false,
	height: 180,
	width: 250,
	modal: true,
	hide: "fade",
	buttons: {
		"Logout": function(){
			DoLogout();
			alert("Successfully Logged Out");
			$( "#charselect" ).dialog( "close" );
			$( "#login-form" ).dialog( "open" );
		},
		"Create New": function(){
			$( "#charselect" ).dialog( "close" );
			$( "#charcreate" ).dialog( "open" );
			SendData('getclasses=x');
		}}
	});

	// Character creation form
	$( "#charcreate" ).dialog({
	autoOpen: false,
	height: 400,
	width: 250,
	modal: true,
	buttons: {
		"Create": function(){
			SendData('createchar='+$('#charname').val()+':'+selectedclass);
		},
		Cancel: function() {
			$( "#charcreate" ).dialog( "close" );
			$( "#charselect" ).dialog( "open" );
		}}
	});

	$('#playeroutput').html('Welcome To '+domain);
	$('#loading-form-status').html('Welcome To '+domain+'<br /><ul><li>Loading Images...</li></ul>');
	preload_image_object = new Image();
	image_url = new Array();
	image_url[0] = "gfx/t1.png";
	image_url[1] = "gfx/Sprites.png";
	for(var i=0; i<=image_url.length-1; i++){
		preload_image_object.src = image_url[i];
	}
});