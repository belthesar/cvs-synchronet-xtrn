'use strict';

// The Grab Bag v1.0 - a LORD 5.00 JS IGM by Mortifis 

var x1 = 0;
var y1 = 0;

function crandom(min, max) { 
	return random(max-min+1) + min; 
}

function bjack(who) // ripped from LORD 5.00 JS in order to change dialogue
{
	var startgold = player.gold;
	var ch;
	var suits = ['\x06', '\x03', '\x05', '\x04'];
	var scol = ['`r2', '`r2`4', '`r2', '`r2`4'];
	var faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

	function play_hand() {	//sam2
		var cards;
		var hands = {};
		var i;
		var bet;
		var res;
		var tmp;
		var mc = morechk;
		var shuffle_strs = ['/\\', '==', '\xcd\xcd'];

		function hand_total(hand, min) {
			var hti;
			var aces11 = 0;
			var ret = 0;

			if (min === undefined) {
				min = false;

			}
			for (hti = 0; hti < hand.length; hti += 1) {
				if (hand[hti].val === 0) {
					aces11 += 1;
				}
				ret += values[hand[hti].val];
				if (ret > 21) {
					if (aces11 > 0) {
						ret -= 10;
						aces11 -= 1;
					}
				}
			}
			if (min) {
				while (aces11 > 0) {
					ret -= 10;
					aces11 -= 1;
				}
			}
			return ret;
		}

		function shuffle() {
			var si;
			var j;
			var stmp;

			cards = [];
			for (j = 0; j < 4; j += 1) {
				for (si = 0; si < 13; si += 1) {
					cards.push({suit:j, val:si});
				}
			}
			for (si = cards.length; si > 1; si -= 1) {
				j = random(si);
				stmp = cards[si - 1];
				cards[si - 1] = cards[j];
				cards[j] = stmp;
			}
		}

		function show_total(play, total, split) {
			if (split === 0 && hands.player.length > 1) {
				split = 1;
			}
			if (play) {
				if (split === 1) {
					dk.console.gotoxy(0, 22);
					lw('`r0`2Hand1: `0'+total);
				}
				else if (split === 2) {
					dk.console.gotoxy(13, 22);
					lw('`r0`2Hand2: `0'+total);
				}
				else {
					dk.console.gotoxy(0, 22);
					lw('`r0`2You: `0'+total);
				}
			}
			else {
				dk.console.gotoxy(68, 22);
				lw('`r0`2Dealer: `0'+total);
			}
		}

		function wizclr_scr(num) {
			var y;

			switch(num) {
				case 1:
					background(0);
					for (y = 11; y <= 19; y += 1) {
						dk.console.gotoxy(1,y);
						sw('            ');
					}
					break;
				case 2:
					background(0);
					for (y = 11; y <= 19; y += 1) {
						dk.console.gotoxy(67,y);
						sw('            ');
					}
					break;
				case 3:
					background(2);
					for (y = 1; y <= 7; y += 1) {
						dk.console.gotoxy(24, y);
						sw('                              ');
					}
					break;
				case 4:
					background(2);
					for (y = 10; y <= 16; y += 1) {
						dk.console.gotoxy(16, y);
						sw('                       ');
					}
					break;
				case 5:
					background(2);
					for (y = 10; y <= 16; y += 1) {
						dk.console.gotoxy(40, y);
						sw('                       ');
					}
					break;
				case 6:
					background(1);
					dk.console.gotoxy(37, 18);
					sw('        ');
					break;
			}
		}

		function wizmore() {
			var wi;

			dk.console.gotoxy(4, 19);
			lw('`2<`0MORE`2>');
			getkey();
			for (wi = 0; wi < 6; wi += 1) {
				sw('\b');
			}
			for (wi = 0; wi < 6; wi += 1) {
				sw(' ');
			}
		}

		function get_cpic(card) {
			return scol[card.suit]+faces[card.val]+suits[card.suit];
		}

		function deal(who, count, show, split) {
			if (split === undefined) {
				split = false;
			}
			var cpic;
			var card;
			var di;
			var x;
			var y;
			var hand = hands[who === '1' ? 'dealer' : 'player'][split ? 1 : 0];
			var full;
			var first = false;
			var dtmp;

			for (di = 0; di < count; di += 1) {
				card = cards.shift();
				cpic = get_cpic(card);
				mswait(500);
				hand.push(card);
				if (who === 1 && hand.length === 2) {
					first = true;
				}
				full = !!((hand.length % 2) === 1);
				dtmp = hand.length;
				if (split) {
					dtmp = 14 - hand.length;
					if (hand.length % 2 === 1) {
						dtmp -= 2;
					}
				}
				x = 17 + parseInt((dtmp - 1) / 2, 10) * 8;
				if (who === 1) {
					x += 8;
				}
				y = (who === 1 ? 1 : 10) + ((dtmp % 2) * 2);
				background(2);
				foreground(0);
				dk.console.gotoxy(x-1, y);
				sw('\xd5\xcd\xcd\xcd\xcd\xcd\xb8');
				dk.console.gotoxy(x-1, y+1);
				if (first) {
					sw('\xb3\xb1\xb1\xb1\xb1\xb1');
					foreground(0);
					dk.console.gotoxy(x + 5, y+1);
					sw('\xb3');
				}
				else {
					lw('\xb3'+cpic);
					foreground(0);
					dk.console.gotoxy(x + 5, y+1);
					sw('\xb3');
				}
				if (full) {
					dk.console.gotoxy(x-1, y+2);
					sw('\xb3     \xb3');
					dk.console.gotoxy(x-1, y+3);
					sw('\xb3     \xb3');
					dk.console.gotoxy(x-1, y+4);
					sw('\xc0\xc4\xc4\xc4\xc4\xc4\xd9');
				}
			}
			if (show) {
				show_total(who === 2, hand_total(hand, false), split ? 2 : 0);
			}
			else {
				show_total(who === 2, '?', 0);
			}
			hands[who === '1' ? 'dealer' : 'player'][split ? 1 : 0] = hand;
		}

		function card_check() {
			var cch;
			var candouble = true;
			var cctmp;
			var ptotal;
			var dtotal;
			var dealcards = true;
			var hand = 0;

			if (hands.player[0][0].val === hands.player[0][1].val) {
				wizclr_scr(1);
				foreground(10);
				dk.console.gotoxy(1,11);
				sw('Would you');
				dk.console.gotoxy(1,12);
				sw('like to');
				dk.console.gotoxy(1,13);
				sw('split?');
				dk.console.gotoxy(67,11);
				lw('`2(`0Y`2)es (`0N`2)o. ');
				cch = getkey().toUpperCase();
				if (cch !== 'Y') {
					cch = 'N';
				}
				if (cch === 'Y') {
					if (player.gold < bet) {
						wizclr_scr(1);
						foreground(10);
						dk.console.gotoxy(1,11);
						sw('Hey! you');
						dk.console.gotoxy(1,12);
						sw('don\'t have');
						dk.console.gotoxy(1,13);
						sw('enough gold!');
						wizmore();
						candouble = false;
					}
					else {
						hands.player[1] = [hands.player[0].pop()];
						candouble = false;
						player.gold -= bet;
						dk.console.gotoxy(0,21);
						lw('`r0`2Gold on hand: `$'+pretty_int(player.gold));
						dk.console.gotoxy(37, 18);
						lw('`r2`4'+(bet * 2));
						dk.console.gotoxy(16, 10);
						lw('`r2`2       ');
						dk.console.gotoxy(16,11);
						sw('       ');
						foreground(0);
						dk.console.gotoxy(56, 12);
						sw('\xd5\xcd\xcd\xcd\xcd\xcd\xb8');
						dk.console.gotoxy(56, 13);
						lw('\xb3'+get_cpic(hands.player[1][0]));
						foreground(0);
						dk.console.gotoxy(62, 14);
						sw('\xb3');
						dk.console.gotoxy(56, 14);
						sw('\xb3     \xb3');
						dk.console.gotoxy(56, 15);
						sw('\xb3     \xb3');
						dk.console.gotoxy(56, 16);
						sw('\xc0\xc4\xc4\xc4\xc4\xc4\xd9');
						dk.console.gotoxy(0, 22);
						lw('`r0`2Hand1:       Hand2:  ');
						deal(2, 1, true);
						deal(2, 1, true, true);
					}
				}
			}
			if (hand_total(hands.player[0]) === 21 && hands.player[0].length === 2) {
				candouble = false;
			}
			if (candouble) {
				cctmp = hand_total(hands.player[0], true);
				if (cctmp > 8 && cctmp < 12) {
					while(true) {
						wizclr_scr(1);
						foreground(10);
						dk.console.gotoxy(1,11);
						sw('Would you');
						dk.console.gotoxy(1,12);
						sw('like to');
						dk.console.gotoxy(1,13);
						sw('double down?');
						dk.console.gotoxy(67,11);
						lw('`2(`0Y`2)es (`0N`2)o. ');
						cch = getkey().toUpperCase();
						if (cch === 'N') {
							break;
						}
						if (cch === 'Y') {
							if (player.gold < bet) {
								wizclr_scr(1);
								foreground(10);
								dk.console.gotoxy(1,11);
								sw('Hey! you');
								dk.console.gotoxy(1,12);
								sw('don\'t have');
								dk.console.gotoxy(1,13);
								sw('enough gold!');
								wizmore();
								break;
							}
							player.gold -= bet;
							bet *= 2;
							dk.console.gotoxy(0,21);
							lw('`r0`2Gold on hand:                  ');
							dk.console.gotoxy(0,21);
							lw('`r0`2Gold on hand: `$'+pretty_int(player.gold));
							dk.console.gotoxy(37, 19);
							lw('`r2`4'+bet);
							deal(2, 1, true);
							ptotal = hand_total(hands.player[0]);
							if (ptotal > 21) {
								return 'BUST';
							}
							dealcards = false;
							break;
						}
					}
				}
			}
			while(dealcards) {
				ptotal = hand_total(hands.player[hand]);
				if (hands.player.length > 1) {
					if (ptotal > 21) {
						wizclr_scr(1);
						dk.console.gotoxy(1, 11);
						lw('`0Sorry!');
						dk.console.gotoxy(1, 12);
						sw('That hand');
						dk.console.gotoxy(1, 13);
						sw('busted.');
						wizmore();
						if (hand === 1) {
							break;
						}
						hand += 1;
						ptotal = hand_total(hands.player[hand]);
					}
				}
				else {
					if (ptotal > 21) {
						return 'BUST';
					}
					if (hands.player[0].length === 2 && ptotal === 21) {
						return 'BLACKJACK';
					}
				}
				// start3
				wizclr_scr(1);
				wizclr_scr(2);
				foreground(10);
				dk.console.gotoxy(1,11);
				sw('Would you');
				dk.console.gotoxy(1,12);
				sw('like to hit');
				dk.console.gotoxy(1,13);
				sw('or stay?');
				if (hands.player.length > 1) {
					dk.console.gotoxy(1, 15);
					sw('Hand'+(hand+1));
				}
				dk.console.gotoxy(67, 11);
				lw('`2(`0H`2)it');
				dk.console.gotoxy(67, 12);
				lw('`2(`0S`2)tay');
				cch = getkey().toUpperCase();
				if (cch === 'S') {
					if (hands.player.length === 1) {
						break;
					}
					if (hand === 1) {
						break;
					}
					hand += 1;
				}
				else if (cch === 'H') {
					deal(2, 1, true, !(hand === 0));
				}
			}
			lw('`r2');
			foreground(0);
			dk.console.gotoxy(24, 1);
			sw('\xd5\xcd\xcd\xcd\xcd\xcd\xb8');
			dk.console.gotoxy(24, 2);
			sw('\xb3\xb1\xb1\xb1\xb1 \xb3');
			mswait(500);
			dk.console.gotoxy(24, 2);
			sw('\xb3\xb1\xb1\xb1  \xb3');
			mswait(500);
			dk.console.gotoxy(24, 2);
			sw('\xb3\xb1\xb1   \xb3');
			mswait(500);
			dk.console.gotoxy(24, 2);
			sw('\xb3     ');
			dk.console.gotoxy(24, 2);
			lw('\xb3'+get_cpic(hands.dealer[0][1]));
			foreground(0);
			dk.console.gotoxy(30, 2);
			sw('\xb3');
			show_total(false, hand_total(hands.dealer[0]), 0);
			while(true) {
				dtotal = hand_total(hands.dealer[0]);
				if (dtotal > 21) {
					if (hands.player.length > 1) {
						return 'WW';
					}
					return 'DBUST';
				}
				if (dtotal === 21 && hands.dealer[0].length === 2) {
					return 'DBLACKJACK';
				}
				if (dtotal < 17) {
					deal(1, 1, true);
				}
				else {
					break;
				}
			}
			if (hands.player.length === 1) {
				if (dtotal === ptotal) {
					return 'PUSH';
				}
				if (dtotal > ptotal) {
					return 'DWIN';
				}
				return 'WIN';
			}
			cctmp = '';
			ptotal = hand_total(hands.player[0]);
			if (dtotal === ptotal) {
				cctmp += 'P';
			}
			else if (dtotal > ptotal || ptotal > 21) {
				cctmp += 'D'; }
			else {
				cctmp += 'W';
			}
			ptotal = hand_total(hands.player[1]);
			if (dtotal === ptotal) {
				cctmp += 'P';
			}
			else if (dtotal > ptotal) {
				cctmp += 'D'; }
			else {
				cctmp += 'W';
			}
			return cctmp;
		}

		morechk = false;
hand:
		while(true) {
			shuffle();
			dk.console.gotoxy(1, 11);
			lw('`r0`%Shuffling.');
			for (i=0; i<9; i += 1) {
				mswait(100);
				dk.console.gotoxy(1, 12);
				sw(shuffle_strs[i%shuffle_strs.length]);
			}
			hands.dealer = [[]];
			hands.player = [[]];
			// DIFF: startgold was reset to player.gold here.
			// startgold = player.gold;
			dk.console.gotoxy(0, 21);
			lw('`r0`2Gold on hand: `$'+pretty_int(player.gold));
			dk.console.gotoxy(0, 22);
			lw('`r0                                                                              ');
			show_total(true, 0, 0);
			show_total(false, 0, 0);
			while(true) {
				wizclr_scr(1);
				foreground(10);
				dk.console.gotoxy(1, 11);
				sw('How much');
				dk.console.gotoxy(1, 12);
				sw('ya gonna');
				dk.console.gotoxy(1, 13);
				sw('wager?');
				foreground(4);
				background(2);
				dk.console.gotoxy(37, 19);
				bet = parseInt(getstr(38, 19, 8, 1, 15, '200', {integer:true, input_box:true, select:true}).trim(), 10);
				if (isNaN(bet) || bet === 0) {
					wizclr_scr(1);
					foreground(10);
					dk.console.gotoxy(1, 11);
					sw('Fine, maybe');
					dk.console.gotoxy(1, 12);
					sw('later.');
					wizmore();
					break hand;
				}
				if (bet < 200) {
					dk.console.gotoxy(1, 14);
					lw('`0`r0Too little!');
					wizmore();
					wizclr_scr(1);
				}
				else if (bet > player.level * 1000) {
					dk.console.gotoxy(1, 14);
					lw('`0`r0Too much!');
					wizmore();
					wizclr_scr(1);
				}
				else if (player.gold < bet) {
					wizclr_scr(1);
					foreground(10);
					dk.console.gotoxy(1, 11);
					sw('Hey! you');
					dk.console.gotoxy(1, 12);
					sw('don\'t have');
					dk.console.gotoxy(1, 13);
					sw('enough gold!');
					wizmore();
					break hand;
				}
				else {
					break;
				}
			}
			player.gold -= bet;
			dk.console.gotoxy(0, 21);
			lw('`r0`2Gold on hand: `$'+pretty_int(player.gold)+'            ');
			deal(1, 1, false);
			deal(2, 1, true);
			deal(1, 1, false);
			deal(2, 1, true);
			res = card_check();
			switch (res) {
				case 'BUST':
					foreground(10);
					wizclr_scr(1);
					dk.console.gotoxy(1,11);
					switch (random(3)) {
						case 0:
							sw('You busted!');
							dk.console.gotoxy(1,12);
							sw('Better luck');
							dk.console.gotoxy(1,13);
							sw('next time.');
							break;
						case 1:
							sw('Oh too bad!');
							dk.console.gotoxy(1,12);
							sw('Maybe next');
							dk.console.gotoxy(1,13);
							sw('hand? (haw!)');
							break;
						case 2:
							sw('You busted!');
							dk.console.gotoxy(1,12);
							sw('Have you');
							dk.console.gotoxy(1,13);
							sw('played this');
							dk.console.gotoxy(1,14);
							sw('game before?');
							break;
					}
					wizmore();
					break;
				case 'BLACKJACK':
					foreground(10);
					bet *= 3;
					player.gold += bet;
					if (player.gold > 2000000000) {
						player.gold = 2000000000;
					}
					wizclr_scr(1);
					dk.console.gotoxy(1,11);
					sw('You got a');
					dk.console.gotoxy(1,12);
					sw('Blackjack!?');
					dk.console.gotoxy(1,13);
					sw('Are you');
					dk.console.gotoxy(1,14);
					sw('cheating?!');
					dk.console.gotoxy(1,16);
					sw('You win');
					dk.console.gotoxy(1,17);
					lw('`$'+pretty_int(bet)+'`0');
					dk.console.gotoxy(1,18);
					sw('Gold.');
					wizmore();
					break;
				case 'DBUST':
					foreground(10);
					bet *= 2;
					player.gold += bet;
					if (player.gold > 2000000000) {
						player.gold = 2000000000;
					}
					wizclr_scr(1);
					dk.console.gotoxy(1,11);
					switch(random(3)) {
						case 0:
							sw('I busted!');
							dk.console.gotoxy(1,12);
							sw('See? You');
							dk.console.gotoxy(1,13);
							sw('win ');
							dk.console.gotoxy(1,15);
							lw('`$'+pretty_int(bet)+'`0');
							dk.console.gotoxy(1,16);
							sw('Gold.');
							break;
						case 1:
							sw('Looks like');
							dk.console.gotoxy(1,12);
							sw('I busted.');
							dk.console.gotoxy(1,14);
							sw('You win');
							dk.console.gotoxy(1,15);
							lw('`$'+pretty_int(bet)+'`0');
							dk.console.gotoxy(1,16);
							sw('Gold... Arg.');
							break;
						case 2:
							sw('I busted!');
							dk.console.gotoxy(1,12);
							sw('Damnit!');
							dk.console.gotoxy(1,14);
							sw('You win');
							dk.console.gotoxy(1,15);
							lw('`$'+pretty_int(bet)+'`0');
							dk.console.gotoxy(1,16);
							sw('Gold.');
							break;
					}
					wizmore();
					break;
				case 'DBLACKJACK':
					foreground(10);
					wizclr_scr(1);
					dk.console.gotoxy(1, 11);
					switch(random(3)) {
						case 0:
							sw('Dealer gets');
							dk.console.gotoxy(1,12);
							sw('Blackjack!');
							dk.console.gotoxy(1,13);
							sw('Aw, too bad');
							dk.console.gotoxy(1,14);
							sw('for the big');
							dk.console.gotoxy(1,15);
							sw('human.');
							break;
						case 1:
							sw('Blackjack!');
							dk.console.gotoxy(1,12);
							sw('I\'m hot');
							dk.console.gotoxy(1,13);
							sw('today!');
							break;
						case 2:
							sw('Dealer gets');
							dk.console.gotoxy(1,12);
							sw('Blackjack!');
							dk.console.gotoxy(1,13); 
							sw('Not your');
							dk.console.gotoxy(1,14);
							sw('day is it?');
							break;
					}
					wizmore();
					break;
				case 'PUSH':
					foreground(10);
					wizclr_scr(1);
					dk.console.gotoxy(1,11);
					sw('It\'s a push!');
					dk.console.gotoxy(1,12);
					sw('I guess it\'s');
					dk.console.gotoxy(1,13);
					sw('better than');
					dk.console.gotoxy(1,14);
					sw('losing.');
					player.gold += bet;
					if (player.gold > 2000000000) {
						player.gold = 2000000000;
					}
					wizmore();
					break;
				case 'DWIN':
					foreground(10);
					wizclr_scr(1);
					dk.console.gotoxy(1,11);
					sw('Looks like');
					dk.console.gotoxy(1,12);
					sw('you lose.');
					dk.console.gotoxy(1,13);
					sw('Oh well!');
					dk.console.gotoxy(1,14);
					sw('better luck');
					dk.console.gotoxy(1,15);
					sw('next time.');
					wizmore();
					break;
				case 'WIN':
					foreground(10);
					wizclr_scr(1);
					dk.console.gotoxy(1,11);
					bet *= 2;
					player.gold += bet;
					if (player.gold > 2000000000) {
						player.gold = 2000000000;
					}
					switch(random(3)) {
						case 0:
							sw('That beats');
							dk.console.gotoxy(1,12);
							sw('my hand!');
							dk.console.gotoxy(1,14);
							sw('You win');
							dk.console.gotoxy(1,15);
							lw('`$'+pretty_int(bet)+'`0');
							dk.console.gotoxy(1,16);
							sw('Gold, Loser.');
							break;
						case 1:
							sw('You win!');
							dk.console.gotoxy(1,12);
							sw('Are you');
							dk.console.gotoxy(1,13);
							sw('counting?');
							dk.console.gotoxy(1,15);
							sw('You win');
							dk.console.gotoxy(1,16);
							lw('`$'+pretty_int(bet)+'`0');
							dk.console.gotoxy(1,17);
							sw('Gold.');
							break;
						case 2:
							sw('You win!');
							dk.console.gotoxy(1,12);
							sw('Not too bad');
							dk.console.gotoxy(1,14);
							sw('for a kid...');
							dk.console.gotoxy(1,15);
							sw('You win');
							dk.console.gotoxy(1,16);
							lw('`$'+pretty_int(bet)+'`0');
							dk.console.gotoxy(1,17);
							sw('Gold.');
							break;
					}
					wizmore();
					break;
				case 'PP':
				case 'PD':
				case 'PW':
				case 'DP':
				case 'DD':
				case 'DW':
				case 'WP':
				case 'WD':
				case 'WW':
					tmp = 0;
					wizclr_scr(1);
					dk.console.gotoxy(1, 11);
					lln('`0I have '+hand_total(hands.dealer[0])+'.');
					mswait(1500);
					dk.console.gotoxy(1, 12);
					switch (res[0]) {
						case 'W':
							sw('Hand1 Wins!');
							tmp += bet * 2;
							break;
						case 'P':
							sw('Hand1 Push!');
							tmp += bet;
							break;
						case 'D':
							sw('Hand1 Loses!');
							break;
					}
					dk.console.gotoxy(1, 14);
					switch (res[1]) {
						case 'W':
							sw('Hand2 Wins!');
							tmp += bet * 2;
							break;
						case 'P':
							sw('Hand2 Push!');
							tmp += bet;
							break;
						case 'D':
							sw('Hand2 Loses!');
							break;
					}
					dk.console.gotoxy(1, 15);
					sw('You win');
					dk.console.gotoxy(1, 16);
					lw('`$'+tmp+'`0');
					dk.console.gotoxy(1, 17);
					sw('Gold.');
					player.gold += tmp;
					if (player.gold > 2000000000) {
						player.gold = 2000000000;
					}
					wizmore();
					break;
			}
			wizclr_scr(1);
			wizclr_scr(2);
			dk.console.gotoxy(1, 11);
			foreground(10);
			sw('Play again?');
			dk.console.gotoxy(67, 11);
			lw('`2(`0Y`2)es (`0N`2)o. ');
			ch = getkey().toUpperCase();
			if (ch !== 'Y') {
				ch = 'N';
			}
			if (ch === 'N') {
				break;
			}
			wizclr_scr(1);
			wizclr_scr(2);
			wizclr_scr(3);
			wizclr_scr(4);
			wizclr_scr(5);
			wizclr_scr(6);
		}
		foreground(10);
		if (player.gold > startgold) {
			wizclr_scr(1);
			dk.console.gotoxy(1,11);
			sw('Quitting');
			dk.console.gotoxy(1,12);
			sw('while your');
			dk.console.gotoxy(1,13);
			sw('ahead?');
			dk.console.gotoxy(1,14);
			sw('Smart move.');
		}
		else if (player.gold < startgold) {
			wizclr_scr(1);
			dk.console.gotoxy(1,11);
			sw('Come back');
			dk.console.gotoxy(1,12);
			sw('soon. We');
			dk.console.gotoxy(1,13);
			sw('enjoyed');
			dk.console.gotoxy(1,14);
			sw('your money!');
			dk.console.gotoxy(1,15);
			sw('::snicker::');
		}
		else {
			wizclr_scr(1);
			dk.console.gotoxy(1,11);
			sw('It\'s been');
			dk.console.gotoxy(1,12);
			sw('nice doing');
			dk.console.gotoxy(1,13);
			sw('business');
			dk.console.gotoxy(1,14);
			sw('with you...');
		}
		wizmore();
		dk.console.gotoxy(0,23);
		morechk = mc;
		curlinenum = 1;
	}

	while(true) {
		get_head('Playing Black Jack with '+who);
		sln('');
		lln('  `%'+who+' `0looks at you and asks `%"How about a Game of Black Jack, kid?"');
		sln('');
		sln('');
		lln('  `2(`0G`2)ive the game a chance');
		lln('  (`0T`2)ell '+who+' to screw off');
		do {
			command_prompt();
			ch = getkey().toUpperCase();
		} while('GT?'.indexOf(ch) === -1);
		sln('');
		foreground(0);
		switch(ch) {
			case '?':
				break;
			case 'T':
				sln('');
				lln('  `2"`0Your loss, kid.  Forget you ever saw me!`2"');
				sln('');
				more();
				return;
			case 'G':
				sln('');
				lln('  `0"Excellent!" `2'+who+' exclaims as he sits down at the table!');
			
				sln('');
				lln('  `2"`0As for the rules... I have to stay on a 17.  You can double down on a');
				lln('  9, 10 or 11, and I do allow splitting pairs multiple times.`2"');
				sln('');
				sln('  You rub your chin - with any luck you\'ll double your money...');
				sln('');
				more();
				sclrscr();
				lrdfile('BJTABLE');
				play_hand();
				return;
		}
	}
}


function load_monster(num) {
		var fname = game_or_exec('lenemy.bin');
		var f;
		var ret;

		if (file_exists(fname) && !settings.no_lenemy_bin) {
			f = new RecordFile(fname, Monster_Def);
			ret = f.get(num);
			f.file.close();
		}
		else {
			ret = {};
			Object.keys(monster_stats[num]).forEach(function(s) {
				ret[s] = monster_stats[num][s];
			});
		}
		beef_up(ret);
		return (ret);
}

function draw_man(x, y) { // partially ripped from Bark's House IGM
	if (x1 !== 0) {
		dk.console.gotoxy(x1, y1 - 1);
		lw('`r0 ');
		dk.console.gotoxy(x1 - 1, y1);
		sw('   ');
		dk.console.gotoxy(x1 - 1,y1 + 1);
		sw('   ');
	}
	dk.console.gotoxy(x, y - 1);
	lw('`r0`$o');
	dk.console.gotoxy(x - 1, y);
	lw('`$<`4\xdb`$>');
	dk.console.gotoxy(x - 1,y + 1);
	lw('`$/\'>');
	x1 = x;
	y1 = y;
}

function walk() {
draw_man(5,20);
		mswait(500);
		draw_man(10,20);
		mswait(500);
		draw_man(15,20);
		mswait(500);
		draw_man(20,20);
		mswait(500);
		draw_man(25,20);
		mswait(500);
		draw_man(30,20);
		mswait(500);
		draw_man(35,20);
		mswait(500);
		draw_man(40,20);
		mswait(500);
		draw_man(45,20);
		mswait(500);
		draw_man(50,20);
		mswait(500);
		dk.console.gotoxy(1,19);
		dk.console.cleareol();			
		dk.console.gotoxy(1,20);
		dk.console.cleareol();
		dk.console.gotoxy(1,21);
		dk.console.cleareol();			
	sln('');
}

function say_slow(str) // ripped from Barak's House IGM
{
	var i;

	for (i = 0; i < str.length; i++) {
		sw(str[i]);
		mswait(100);
	}
}

function say_slow2(str) // ripped from Barak's House IGM
{
	var i;

	for (i = 0; i < str.length; i++) {
		sw(str[i]);
		mswait(10);
	}
}

function sln2() {
	sln('');
	sln('');
}

function wait() // ripped from Barak's House IGM
{
	mswait(1000);
	sw('.');
}

function place_holder() { // don't need this any more
	sln('');
	lln('  `2Some random text to keep you occupied while');
	lln('  I code this shit up.  You get `%10 `0EXTRA EXPERIENCE!');	
	sln('');
	player.exp += 10;
	player.forest_fights += 2;
}

function sleep_here(w) {
	var out = new File(gamedir('out'+player.Record+'.lrd'));
	if (!out.open('a')) {
		throw('Unable to open '+out.name);
	}	
	out.writeln('grabbag/grabbag.js '+w);
	out.close();
	mswait(1500);
	lw('  `%Returning you to `$');
	say_slow2(system.name);
	mswait(1500);
	exit(0);
}

function wake_up_at_veldores() { // changed from Veldore to current Trainer 
	var trainer = undefined;
	if(player.level < 12) 
	{
		trainer = get_trainer(player.level);
	}
	else 
	{
		trainer = get_trainer(11);
	}
	get_head('Waking up at '+trainer.name+'\'s');
	lln('  `2You slowly open you eyes, and see '+trainer.name+' making coffee.');
	lln('  `2After a pleasant chat, you get up, don your `$'+player.arm);
	lln('  `2pick up your `$'+player.weapon+' `2and');
	lln('  head back to `8The `$Grab Bag');
	player.forest_fights += 2;
	player.laid +=1;
	log_line('  `5'+player.name+' `0slept at'+trainer.name+'\'s Cabin');
	more_nomail();
	main();
}

function wake_up() {
	var lover = '';
	var l_noun = '';
	var p_noun = '';
	
	if(player.sex === 'M') 
	{ 
		lover = '`5Violet'; 
		l_noun = 'She'; 
		p_noun = 'her'; 
	}
	else
	{ 
		lover = '`$Seth Able'; 
		l_noun = 'He'; 
		p_noun = 'his'; 
	}
	
	more_nomail();
	get_head('Waking up in '+lover+'\'s `%Bed');
	lln('  `2You slowly open you eyes, and see '+lover+' smiling');
	lln('  at you.  '+l_noun+' kisses your lips, then your neck, then');
	lln('  works '+p_noun+' way down your belly . ');
	wait(); wait(); wait();
	display_file(gamedir('/grabbag/menus.lrd'));
	mswait(2000);
	get_head('Waking up in '+lover+'\'s `%Bed');
	lln('  `2After a pleasant morning roll in the hay,');
	lln('  you get up, don your `$'+player.arm);
	lln('  `2pick up your `$'+player.weapon+' `2and');
	lln('  head back to `8The `$Grab Bag');
	player.forest_fights += 2;
	player.laid +=1;
	log_line('  `5'+player.name+' `0slept at '+lover+'\'s Cabin');
	more_nomail();
	main();
}

function jennie_invite() { // changed from Jennie to Violet
	var ch = '';
	get_head('Violet Invited you to Her Cabin');
	lln('  `5Violet `0invites you to her nearby Cabin');
	sln('');
	lln('  `0She takes you by your hand leds the way.');
	sln('');
	lln('  `0When you arrive, she immediately takes');
	lln('  her clothes off.  She then rips off your');
	lln('  '+player.arm+', you take the hint and get');
	lln('  naked with her!');
	more_nomail();
	sclrscr();
	display_file(gamedir('/grabbag/menus.lrd'));
	more_nomail();
	sclrscr();
	log_line('  `5'+player.name+' `0was invited to Violet\'s Cabin');	
	player.exp += 1000;
	player.laid += 1;
	get_head('Getting laid by `5Violet');	
	sln('');
	lln('  `0After many hours of world rocking sex,');
	lln('  `5Violet invites you to sleep over for');
	lln('  the night.');
	sln('');
	lln('  `2(`0A`2)ccept');
	lln('  `2(`0D`2)ecline');
	sln('');
	lw('  `2You decide to ... (`$D`2) `%');
	ch = getkey().toUpperCase();
	if ('AD'.indexOf(ch) == -1) {
		ch = 'D';
	}
	sln(ch);
	sln('');
	
	if(ch == 'A') {			
			sleep_here('w');
	}
	else 
	{
		lln('  `%"Thank you for the incredile sex, Violet, but I have');
		lw('  be getting back to my Killing and ');
		switch (player.clss) {
			case 1:
				lln('Death Knight shit."`0,');
			break;
			
			case 2:
				lln('Magic Casting bullshit."`0,');
			break;
			
			case 3:
				lln('Thieving type shit."`0,');
			break;
		}
		lln('  you say as you don your '+player.arm+' and head back to town.')
		sln('');
		more_nomail();
		good_bye('good');
	}
}

function seth_invite() {
	var ch = '';
	get_head('Seth Able Invited you to His Cabin');	
	lln('  `$Seth `0invites you to his nearby Cabin');
	sln('');
	lln('  `0He takes you by your hand leds the way.');
	sln('');
	lln('  `0When you arrive, he immediately takes');
	lln('  his clothes off.  He then rips off your');
	lln('  '+player.arm+', you take the hint and get');
	lln('  naked with him!');
	more_nomail();
	sclrscr();
	display_file(gamedir('/grabbag/menus.lrd'));
	more_nomail();
	sclrscr();
	log_line('  `5'+player.name+' `0was invited to Seth\'s Cabin');
	
	player.exp += 1000;
	player.laid += 1;
	get_head('Getting laid by `$Seth');	
	sln('');
	lln('  `0After many hours of world rocking sex,');
	lln('  `$Seth invites you to sleep over for');
	lln('  the night.');
	sln('');
	lln('  `2(`0A`2)ccept');
	lln('  `2(`0D`2)ecline');
	sln('');
	lw('  `2You decide to ... (`$D`2) `%');
	ch = getkey().toUpperCase();
	if ('AD'.indexOf(ch) == -1) {
		ch = 'D';
	}
	sln(ch);
	sln('');	
	
	if(ch == 'A') {			
		sleep_here('w');	
	}
	else 
	{
		lln('  `%"Thank you for the incredile sex, Seth, but I have');
		lw('  be getting back to my Killing and ');
		switch (player.clss) {
			case 1:
				lln('Death Knight shit."`0,');
			break;
			
			case 2:
				lln('Magic Casting bullshit."`0,');
			break;
			
			case 3:
				lln('Thieving type shit."`0,');
			break;
		}
		lln('  you say as you don your '+player.arm+' and head back to town.')
		sln('');
		more_nomail();
		good_bye('good');
	}	
}

function veldore_invite() { // finish_this
	get_head('Veldore invited you to His Cabin');
	amt = Math.round(player.exp/10);
	sln('');
	lln('  `2Veldore invites you in and pours you a cup of tea.');
	sln('');
	lln('  `2After a pleasant visit you decide to head back');
	lln('  to town.');
	sln('');					
	more_nomail();
	lln('  `2For being polite you recieve `%'+pretty_int(amt)+' Experience.');
	sln('');
	lln('  `2Your Charm increases by `$2');
	sln('');
	player.exp += amt;
	player.cha += 2;
	mswait(2000);
	good_bye();
}

function nymph_tales(nymph) {
	var tale = '';
	
	return tale;	
}

function more_nymph_story(nymph) { // finish_this ... v1.1 will have all wood nymphs as object nymphDefs
	var who = undefined;
	if(player.sex === 'M') who = 'Violet'; else who = 'Seth Able';
	lln('  `0All LORD Nymphs are Meliae Nymphs, nymphs of the Trees');
	lln('  `0Hyleoroi (watchers of woods) are the Fairies that offer blessings');
	sln('');
	lln('  What more do you need to know?');
	sln('');
	lln('  `2Just as you are about to ask more questions,');
	lln('  `$'+who+'  `2appears from behind a tree, grabs');
	lln('  hand and leads you away ...');
	sln('');
	more_nomail();
	if(player.sex === 'M') jennie_invite(); else seth_invite();
	sln('');
}

function nymph_sex(nymph) {
	var nrand = random(5);
	
	switch( nrand ) {
		case 0:
			lln('  `0You decide that preforming a little `$"mouth action"');
			lln('  `0on `6'+nymph+' `0would be interesting.  Moments');
			lln('  after you begin, you find that you have a mouth');
			lln('  full of wet wood chips.');
			sln('');
			lln('  `0You spit them out and try something more conventional.');
			sln('');			
		break;
		
		case 1:
			lln('  `6'+nymph+' `0throws you on the ground and mounts you');
			lln('  like a stallion!  Moments later, you scream in agony, you');
			lln('  seem to have gotten a splinter in your balls!');
			sln('');
			lln('  Somehow you are able to ignore the pain and keep going.');
		break;
		
		case 2:
			lln('  `0Being the type of warrior that takes charge, you');
			lln('  push `6'+nymph+' `0against a tree, bend her over and');
			lln('  start to give her what she begged you for.');
			sln('');
			lln('  Moments later, you notice that you are not alone, you');
			lln('  you look over your shoulder and see that `%Jennie `0is');
			lln('  watching you.  `%OH WELL! I\'LL DO HER LATER!"`0, you think');
			lln('  to yourself and keep going!');			
		break;
		
		case 3:
			lln('  `6'+nymph+' `0drops to her knees and takes you in a way');
			lln('  that only a Horny Wood Nymph is capable of.');
			sln('');
			lln('  Moments later, you scream in agony, `%her tongue is made');
			lln('  of splinters!  `0Somehow you are able to keep going.');
		break;
		
		case 4:
			lln('  `0You and `6'+nymph+' `0seem to be a perfect sexual match!');
			sln('');
			lln('  As you explore each other\'s bodies, you suddenly');
			lw('  feel something brush up against your bare ass `%');
			wait(); wait(); wait();
			sln('');
			lw('  `0You look and it\'s ');
			if(player.has_fairy) {
				lln('your fairy!');
				sln('');
				more_nomail();
				lln('  `%"THIS IS JUST GROSS, SERIOUSLY, A HUMAN AND A NYMPH');
				lln('  HAVING SEX?!"`0, it screams, and flies away in disgust!');
				lln('  `%"OH, WELL"`0, you think and keep going.');
				player.has_fairy = false;
			}
			else if(player.kids > 0) {
				lln('your kid!');
				sln('');
				lln('  `%"DAD, THAT\'S DISGUSTING!"`0, she yells as she runs off');
				lln('  into the woods. `%"OH WELL"`0, you think and keep going.');
				player.kids -= 1;
			}
			else
			{
				lln('a squirrell!');
				sln('');
				lln('  `0Suddenly, the squirrell bites your left nut, it');
				lln('  thought it was food!.  You scream in agony, but are');
				lln('  somehow able to keep going!');
			}
		break;	
	}
	sln('');
	more_nomail();
	lln('  `0After 18 minutes of the strangest, yet most satisfying');
	lln('  sex you have `$EVER `0experienced, you get dressed and');
	lln('  head back to town!');
	sln('');		
}

function nymph_story(nymph) {
	var ch = '';
	var years = undefined;
	years = Math.round((player.hp_max * 17));
	var amt = undefined;
	var dryads = '';
	var dryads1 = '';
	var dryads2 = '';
	dryads = '  Dryads are also known as `%\'Ladies of the Trees\'\r\n';
	dryads += '  `0and We are ALL `$VERY, VERY HORNY!!\r\n\r\n';
	dryads += '  `0Many, many centruries ago, we were all human like you.\r\n';
	dryads += '\r\n';
	
	dryads += '  Our husbands were all poisoned by `8Magic Mushrooms`0.\r\n';
	dryads += '  They ran off into the Forest, and became `%MONSTERS!\r\n\r\n';
	
	get_head('Getting to know '+nymph);
	
	lln('  `0I am happy you want to get to know me, but, what I');
	lln('  really need more is to feel your warm body against mine.');
	lln('  It has been such a long time that I have met anyone that');
	lln('  is able to touch me the way that you are able to.');
	sln('');
	more_nomail();	
	lln('  `0But, I see that you are reluctant, so I will tell you');
	lln('  about me.  My name is `6'+nymph+'. `0I am a `%Dryad, `0a');
	lln('  `$Wood Nymph`0, and I have been living here in these `$');
		
	if(nymph === 'Meliai') {
		lln('  Ash Trees `2for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);	
		more_nomail();						 	
	}
	if(nymph === 'Oreiades') {
		lln('  Mountain Trees `0for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);				
		more_nomail();						 		
	}
	if(nymph === 'Hamadryads') {
		lln('  Oak Trees `0for `%'+pretty_int(years)+' `0years.');
		sln(''); 
		lln(dryads);
		more_nomail();
		lln('  `0There are `%8 `0types of `$Wood Nymphs.  `0My kind');
		lln('  are the saddest of all because we are tied to one');
		lw('  tree, and if our tree dies, we die, ');
		say_slow2('I will die!');
		sln('');
		more_nomail();
	}
	if(nymph === 'Maliades') {
		lln('  Fruit Trees `0for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);				
		more_nomail();
		lln('  `0My kind are very `5fertile`0,');
	}
	if(nymph === 'Daphnaei') {
		lln('  Laurel Trees `0for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);		
		more_nomail();						 		
	}
	if(nymph === 'Alseides') {
		lln('  Sacred Groves `0for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);				
		more_nomail();						 		
	}
	if(nymph === 'Aulonides') {
		lln('  Glens `0for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);				
		more_nomail();						 		
	}
	if(nymph === 'Napaiai') {
		lln('  Vales `0for `%'+pretty_int(years)+' `0years.');
		sln('');
		lln(dryads);			
		more_nomail();						 		
	}								
	sln('');
	more_nomail();
	
	lln('  `%"Now that you know about me, will you PLEASE help me?"`2,');
	lln('  `6'+nymph+' `2begs shyly.');
	sln('');
	lln('  `2(`0B`2)e kind and pleasure `6'+nymph);
	lln('  `2(`0P`2)olitely Decline');
	lln('  `2(`0A`2)sk her to tell you more');
	lln('  `2(`0L`2)eave and head back to town');
	sln('');
	lw('  `0You decide to ... `2(`$B`2) `%');
	ch = getkey().toUpperCase();
	if ('BPLA'.indexOf(ch) == -1) {
		ch = 'B';
	}
	sln(ch);
	sln('');
	sln('');		
	switch ( ch ) {
		case 'L':
			lln('  `%"This is too boring, `$'+nymph+'`%"`2, you tell');
			lln('  her as you turn and walk back to town.');
			sln('');
			more_nomail();
			amt = Math.round(player.level * 10);			
			lln('  `0You lose `%2 Charm `0and gain `%'+pretty_int(amt)+' `0Experience');
			player.cha -= 2;
			log_line('  `5'+player.name+' `2pissed `6'+nymph+' `2off!');
			good_bye('annoying');			
		break;
		
		case 'P':
			lln('  `%"Look, '+nymph+' you\'re very beautiful and all,');
			lln('  and I am happy we met, hopefully we can see');
			lln('  see each other again, but I gotta go, bye!"');
			log_line('  `5'+player.name+' `0consoled the Wood Nymph `$'+nymph);
			sln('');
			more_nomail();
			amt = Math.round(player.level * 10);	
			lln('  `2You gain `22 Charm and '+pretty_int(amt)+' Experience!');
			player.cha += 2;
			player.exp += amt;
			sln('');
			good_bye('interesting');
		break;
		
		case 'B':
			lln('  `%"Um, sure, having sex with some animated wood chips');
			lln('  isn\'t the weirdest thing I have ever done"`0, you say');
			lln('  as you drop your '+player.weapon+' remove your '+player.arm);
			lln('  and get down to business!');
			sln('');
			more_nomail();
			nymph_sex(nymph);
			log_line('  `5'+player.name+' `2got laid by `6'+nymph);
			player.laid += 1;
			player.cha += 10;
			player.exp += player.level * 100;
			more_nomail();
			good_bye('satisfying');
			
		break;
		
		case 'A':
			lln('  `2She tells you more, etc ...');
			sln('');
			more_nomail();
			more_nymph_story(nymph);
			log_line('  `5'+player.name+' `2became friends with `6'+nymph);
			sln('');
			more_nomail();
			lln('  `$SOMEWHERE MAGIC HAS HAPPENED!');
			amt = Math.round(player.exp /10);
			player.exp += amt;
			player.bank += player.level * 1000;
			player.forest_fights += 3;
			good_bye('informative');
		break;
		
	}
}

function get_nymph() {
var nymph = '';

/*
	Meliai (ash trees), 
	Oreiades (mountain trees), 
	Hamadryads (usually oak or poplar trees),
	Maliades (fruit trees), 
	Daphnaei (laurel trees), 
	Alseides (located in sacred groves) 
	Aulonides (located in glens), 
	Napaiai (located in vales.)
*/
	var wood_nymph = random(8);
	switch( wood_nymph ) {
		case 0:
			nymph = 'Meliai';
		break;
		
		case 1:
			nymph = 'Oreiades';
		break;
		
		case 2:
			nymph = 'Hamadryads';
		break;
		
		case 3:
			nymph = 'Maliades';
		break;
		
		case 4:
			nymph = 'Daphnaei';
		break;
		
		case 5:
			nymph = 'Alseides';
		break;
		
		case 6:
			nymph = 'Aulonides';
		break;
		
		case 7:
			nymph = 'Napaiai';
		break;
	}
	return nymph;
}

function wood_nymph() {
	var ch = '';
	var nymph = get_nymph();
	
	get_head('Getting Seduced by a Naked Wood Nymph');
	
	lln('  `%"Hello?"`2, you cautiously reply.');	
	sln('');
	lln('  Moments later, a naked wood nymph appears.');
	sln('');
	more_nomail();
	lln('  `2Never before have you seen such a beautiful creature!');
	lln('  As you stare in awe, she approacehs you closer and asks,');
	sln('');
	lln('  `%"Could you please help me?  I have been lonely for so long"`2,');
	lln('  `2as she reaches down and gently caresses herself.');	
	sln('');
	lln('  `2(`0A`2)ccept her sexual advances');
	lln('  `2(`0G`2)et in her head and ask who she is');
	lln('  `2(`0P`2)olitely decline and head home');
	sln('');
	lw('  `2You decide to ... (`$A`2) `%');
	ch = getkey().toUpperCase();
	if ('AGP'.indexOf(ch) == -1) {
		ch = 'A';
	}
	sln(ch);
	sln('');	
	
	if(ch === 'A') {
		player.laid += 1;
		player.cha += 10;	
		player.exp += player.level * 10;
		get_head('Having Sex with '+nymph);
		if(player.sex === 'M')
		{
			lln('  `2You become so overwhelmed with sexual desire you throw');
			lln('  your `$'+player.weapon+' `2to the ground, rip off your');
			lln('  `$'+player.arm+' `2and fall into her embrace.');
			sln('');			
		}
		else
		{
			lln('  `2As you look at this beautiful Wood Nymph, your heart');
			lln('  begins to race.  The thoughts of having sex with this');
			lln('  gorgeous creature seems to grow more and more intense.');
			sln('');
			more_nomail(); 
			lln('  `2You become so overwhelmed with sexual desire you throw');
			lln('  your `$'+player.weapon+' `2to the ground, rip off');
			lln('  `$'+player.arm+' `2and fall into her embrace.');
			sln('');
			player.cha += 10;			
		}
		more_nomail();
		// TODO: create a record for future encounters
		lln('  `2After `%18 minutes `2of passionate love making, you');
		lln('  `2get up, get dressed and head back to town.');
		sln('');
		more_nomail();
		lln('  `2As you are leaving you hear `%"Thank you, '+player.name+',');
		lln('  I will never forget you. May my name, `$'+nymph+' `%never leave');
		lln('  you heart!"');
		sln('');
		more_nomail();				
		log_line('  `5'+player.name+' `0got seduced by the wood nymph, `%'+nymph+'!');	
		good_bye('exhilarating');
	}
	if(ch === 'G')
	{
		nymph_story(nymph);		
		sln('');
		good_bye('pleasant');
	}
	if(ch === 'P')
	{
		lln('  `%"Look, you are very beautiful but having sex with');
		lln('  some animated wood chips seems too weird, I gotta go"`2,');
		lln('  you say as you turn and walk back to town');
		sln('');
		more_nomail();
		amt = Math.round(player.exp/33);
		lln('  `$YOU GAIN '+pretty_int(amt)+' EXPERIENCE and LOSE 5 CHARM!')
		player.exp += amt;
		player.cha -= amt;
		if(player.cha < 1) player.cha = 1;
		sln('');
		more_nomail();
		good_bye('disappointing');
	}
	
/*
Dryads

Dryads are the �ladies of the trees� � female nymphs who inhabit the forests, groves, woods, 
and all other types of trees. The dry- part of dryad comes from the Greek word �oak� and used 
to refer to only oak tree nymphs, but now it has become the overeaching term for all wood nymphs. 
Dryads are known for being rather shy. They have long lives that can often be closely tied to 
where their home (aka: tree) is. Hamadryads are dryads who are so tied to their tree that if their 
tree dies, they die. If their tree grows or blossoms, so does the dryad.

Not all dryads are tied to a particular tree. Some are tied to a location or section of trees like 
a sacred grove, a glen, a vale, etc. Depending on which type of tree they inhabit or the location 
of those trees, 
dryads can go by different names just like the naiads:
*/	
	
}

function cabin_shit(who) {
	var ch = undefined;
	var troll = 0;
	var amt = 0;
	var other = '';
	var trainer = false;
	var is_trainer = undefined;
	
	if(who === 'Veldore') 
	{
		if (player.level < 12) 
		{
			trainer = get_trainer(player.level);				
		}
		else 
		{
			trainer = get_trainer(11);
		}
		who = trainer.name;
		is_trainer = true;
	}
	
	if(player.sex === 'M') other = 'Barak'; else other = 'Violet';
	get_head('Looking at a map to '+who+'\'s Cabin');
	lln('  `2You pick up the map and are surprised at what you');
	lln('  have found!  You comtemplate what you should do.');
	sln('');
	lln('  `2(`0F`2)ollow the map to '+who+'\'s Cabin');
	lln('  `2(`0L`2)eave it there and look for something else');
	lln('  `2(`0T`2)ake the map and try to sell it');
	sln('');
	lw('  `2You decide to... [`0F`2] :`%');
	ch = getkey().toUpperCase();
	if ('FLT'.indexOf(ch) == -1) {
		ch = 'F';
	}
	sln(ch);
	sln('');
	
	switch ( ch ) {
		
		case 'F':
			if(is_trainer) veldore_cabin(trainer);
			if(who === 'Jennie') jennie_cabin();
			if(who === 'Seth') seth_cabin();
		break;
		
		case 'L':
			lln('  `0You figure a map is useless so you discard');
			lln('  like it was a piece of used asswipe!');
			sln('');
			lln('  You continue on your way and stumple across');
			lw('   `%');
			
			switch (random(5)) {
			
				case 0:
					say_slow2('A RUBBER CHICKEN');
					sln('');
					player.weapon = 'Rubber Chicken';
				break;
				
				case 1:
					amt = player.level * 25;
					say_slow2('A BAG WITH '+pretty_int(amt)+' GOLD COINS');
					player.gold += amt;
				break;
				
				case 2:
					say_slow2(pretty_int(player.weapon_num)+' GEMS');
					player.gem += player.weapon_num;
				break;
				
				case 3:
					if(settings.clean_mode)
					{
						say_slow2('A USED SNOT RAG!');
					}
					else
					{
						say_slow2('A USED CONDOM');
					}
					sln('');
					lln('  `0YOU LOSE `$1 `0CHARM!');
					player.cha -+ 1;
				break;
				
				case 4:
					amt = Math.round(player.exp/10);
					say_slow2(pretty_int(amt)+' EXPERIENCE POINTS');
					player.exp += amt;
				break;
			}
			more_nomail();
			good_bye('good');	
		break;
		
		case 'T':
			get_head('Selling the Map to '+who+'\'s Cabin');			
			lln('  `2You decide that visiting `%'+who+' `2is a waste');
			sln('  of time, so you tuck the map away in your');			
			sln('  pocket and hope you find someone to sell it');
			sln('  to!');
			sln('');
			more_nomail();
			lln('  `2You seem to walk for hours when you notice you');
			sln('  made it all the way back to the edge of town!');
			sln('');
			var trand = random(5);
			
			switch ( trand ) {
				case 0:
					amt = player.level * 1000;
					troll = random(2);
					lln('  Just as you were losing hope of finding someone');
					sln('  to sell the map to, a squirrelly little troll');
					sln('  jumps out of the bushes!');
					sln('');
					more_nomail();
					get_head('Selling the Map to Squirrelly Troll');
					lln('  `%"I saw you found a map to '+who+'\'s Cabin, would');
					lln('  you like to sell it for, say `$'+pretty_int(amt)+' `%GOLD COINS?"');
					sln('');
					lw('  `2(`$Y`2)es or (`0N`2)o ? ');					
					ch = getkey().toUpperCase();
					if ('YN'.indexOf(ch) == -1) {
						ch = 'Y';
					}
					sln(ch);
					sln('');
					
					if(ch == 'N') {
						sln('');
						lln('  `%"FINE!"`2, he says as he slips away into the darkness.');
						sln('');
						lln('  `2You look at the ground and see that he dropped `$3 GEMS!');
						sln('');
						player.gem += 3;
						more_nomail();
						good_bye('disappointing');
					}
					
					if(troll = 0) {
						amt = Math.round(player.exp/10);
						lln('  `2You accept the offer, reach into your pocket to');
						lln('  retrieve the map, `%BUT?! `2IT\'S GONE!');
						sln('');
						lln('  `0The freaky looking Troll snears at you and disappears');
						lln('  into the Forest.');
						sln('');
						more_nomail();
						lln('  `2YOU GET `$'+pretty_int(amt)+' `2EXPERIENCE ANYWAY!');
						player.exp += amt;
						sln('');
						more_nomail();
						good_bye('good');
					}
					else
					{
						var extras = Math.round(player.exp/10);
						lln('  `2You accept the offer and hand the map over to the Troll!');
						sln('');
						lln('  You head back to town `$'+pretty_int(amt)+' `2GOLD COINS richer!');
						lln('  `2You also get `$'+pretty_int(extras)+' `2Experience.');
						player.gold += amt;
						player.exp += extras;
						sln('');
						more_nomail();
						good_bye('good');
					}
				break;
				
				case 1:
					lln('  `2Just as you are about to give up, an `6OLD HAG `2');
					sln('  jumps out from behind a tree, snatches the map from');
					sln('  your pocket and runs away.');
					sln('');
					lln('  `2You look down, and see that she dropped something.');
					sln('');
					lw('  `2You found `%');
					
					if(!player.horse) {
						say_slow2('A HORSE!');
						player.horse = true;
						more_nomail();
						good_bye('good');
					}
					else
					if(!player.amulet) {
						say_slow2('AN AMULET OF ACCURACY!');
						player.amulet = true;
						more_nomail();
						log_line('  `5'+player.name+' `0found an Amulet of Accuracy');
						good_bye('good');
					}
					else
					{						
						say_slow2(pretty_int(player.weapon_num)+' FOREST FIGHTS');
						player.forest_fights += player.level;
						more_nomail();
						good_bye('good');
					}
				break;
				
				case 2:	
					lln('  As you approach The Realm, you start to feel as');
					lln('  though you should have visited `0'+who+'\'s Cabin! `%');	
					sln('');			
					say_slow2('  YOU WASTED YOUR TRIP INTO THE FOREST!');
					sln('');
					more_nomail();
					player.forest_fights += 2;
					good_bye('disappointing');
				break;
				
				case 3:
					if(settings.clean_mode) {
						lln('  `2Wood Nymphs are too sexual for Clean Mode!');
						lln('');
						lln('  `2Tell your SysOp The Grab Bag is more fun if');
						lln('  clean mode is turned off; :-)');
						sln('');
						more_nomail();
						lln('  `0You Gain `$100 `0Experience and `$2 `0Charm');
						sln('');
						more_nomail();
						player.cha += 2;
						player.exp += 100;
						good_bye('boring');
					}
					else
					{ 
						lln('  `2Suddenly you hear a soft voice calling to you');
						lln('  from behind some bushes.');
						sln('');
						lln('  `2(`0I`2)nvestigate Further');
						lln('  `2(`0R`2)un Away');
						sln('');
						lw('  `2You decide to ... (`$I`2) `%');
						ch = getkey().toUpperCase();
						if ('IR'.indexOf(ch) == -1) {
							ch = 'I';
						}
						sln(ch);
						sln('');
						if(ch === 'I')
						{
							wood_nymph();
						}
						else
						{
							lln('  `2For some reason you are afraid of a softly');
							lln('  spoken wood nymph.  You, turn and run away as');
							lln('  your little legs can carry you!');
							sln('');
							lln('  `%** YOU LOSE 1 CHARM **');
							player.cha -= 1;
							player.forest_fights += 2;
							player.exp += 100;
							sln('');
							good_bye('disappointing');
						}
					}
				break;
				
				case 4:
					var invite = '';
					if(player.sex === 'M') invite = 'Violet'; else invite = 'Seth';
					lln('  `2Just as you are about to give up trying to find');
					lln('  someone to sell the map to, you hear rustling in');
					lw('  the bushes, you turn around and see `%');					
					
					var srand = random(3);
					//srand = 2; // kill this
					switch (srand) {
						
						case 0:							
							say_slow2(other+'!');
							sln('');
							more_nomail();
							lw('  `%"YOU CHEATING PUKE"`0, '+other+' yells as ');
							
							if(player.sex === 'M') lw('he'); else lw('she');
							lln(' lunges at you!');
							sln('');
							lln('  `0'+other+' has so much rage and anger that right before');
							lw('  your eyes, ');
							if(player.sex === 'M') lw('he'); else lw('she');
							lln(' Morphs into `4The Red Dragon!');
							sln('');
							more_nomail();
							player.bank += player.gold; // be nice and save their gold
							fight_dragon(false);							
							lln('  `0Just as your life starts to drain from you, you');
							lln('  jolt awake.  Was this just a dream?');
							lln('  Is `%'+other.toUpperCase()+' `0actually `4The Red Dragon?');
							sln('');
							lln('  `0No one will actually know for sure!');
							sln('');
							lln('  `$Just to be sure you\'re ok, you should first visit the bank');
							lln('  and then go see the Healer!');
							sln('');
							more_nomail();
							amt = Math.round(player.exp/10);
							lln('  `%YOU GAINED '+pretty_int(amt)+' EXPERIENCE!');
							log_line('  `5'+player.name+' `0realizes it was just a dream, or was it?');
							player.dead = false; // why die in an IGM
							player.exp += amt;
							player.hp = 1;
							
							good_bye('frightening');
						break;
						
						case 1:
							say_slow2(invite);
							sln('');
							sln('');
							more_nomail();
							lw('  `%"YOU CHEATING LITTLE PUKE"`0, '+invite+' yells as ');
							if(player.sex === 'M') lw('she'); else lw('he');							
							lln('  grabs');
							lln('  the map from your pocket and runs off into the bushes.');
							sln('');
							lln('  `2Well, shit, you think to yourself as you continue');
							lln('  on you way back to town');
							sln('');							
							amt = player.level * 10;
							lln('  `%You gain '+pretty_int(amt)+' Experience');
							player.exp += amt;
							player.forest_fights +=2;
							more_nomail();
							good_bye('disappointing');							
						break;
						
						case 2:							
							say_slow2(invite);
							more_nomail();						
							if(who != 'Veldore') {
							if(player.sex === 'M') jennie_invite(); else seth_invite();
							}
							else veldore_invite();							
						break;						
					}
					sln('');					
				break;				
			}			
		break;
	}
}

function follow(who) { // why is this even here? future random event? ... get followed by a wood nymph?
	var ch = undefined;	
}

function seth_cabin() {
	var ch = undefined;
	var amt = 0;
	var react = undefined;
	var f = new File(gamedir('bar.lrd'));
	if (!f.open('a')) {
		throw('Unable to open '+f.name);
	}	
	get_head('Going to Seth\'s Cabin');
	lln('  `2You decide that making an univited visit to');
	lln('  `%Seth\'s Cabin `2seems like a good idea.');
	sln('');
	walk();
	get_head('Arriving at Seth\'s Cabin');
	lln('  `2When you finally arrive you stop and contemplate');
	lln('  whether you should ... ');
	sln('');
	lln('  `2(`0K`2)nock on the door');
	lln('  `2(`0W`2)alk in like you\'re best friends');
	lln('  `2(`0H`2)ead back to town');
	sln('');
	lw('  `2You decide to ... (`$H`2): `%');
	ch = getkey().toUpperCase();
	if('KWH'.indexOf(ch) == -1) {
		ch = 'H';
	}
	sln(ch);
	sln('');
		
	if(ch === 'H') {
		lln('  `2You figure that perhaps you should have');
		lln('  been a little bit more courteous and not');
		lln('  have just shown up uninvited');
		sln('');
		more_nomail();
		amt = Math.round(player.exp/20);
		lln('  `0You gained `$'+pretty_int(amt)+' Experience `2and `$1 Charm!'); 
		player.cha += 1;
		player.exp += amt;
		sln('');
		good_bye();
	}
		
	if(ch === 'K') {			
		get_head('Knocking on Seth\'s Door');
		lln('  `2You politely kncok on Jennie\'s door.');
		sln('');
		mswait(2000);
		lln('  Moments later, the door opens and you are greeted');
		lw('  by a `%'); wait(); wait(); wait();		
		react = random(3);
						
		switch ( react ) {
			case 0: // seth is home and happy					
				if(player.level < 2 || player.cha < 10 || settings.clean_mode) {
					amt = Math.round(player.exp/10);
					say_slow2('  smiling Seth!');
					sln('');
					sln('');
					lln('  `2He invites you in and pours you a cup of tea.');
					sln('');
					lln('  `2After a pleasant visit you decide to head back');
					lln('  to town.');
					sln('');					
					more_nomail();
					lln('  `2For being polite you recieve `%'+pretty_int(amt)+' Experience.');
					sln('');
					lln('  `2Your Charm increases by `$2');
					sln('');
					player.exp += amt;
					player.cha += 2;
					mswait(2000);
					good_bye();
				}
				else if(player.level < 2 && player.cha > 10)
				{
					amt = Math.round(player.exp/10);
					say_slow2('  happy Seth!');
					sln('');
					sln('');
					lln('  `2He invites you in and pours you a cup of tea.');
					sln('');
						lln('  `2After a pleasant visit you decide to head back');
					lln('  to town.');
					sln('');					
					more_nomail();
					lln('  `2For being polite you recieve `%'+pretty_int(amt)+' Experience.');
					sln('');
					lln('  `2Your Charm increases by `$5');
					sln('');
					player.exp += amt;
					player.cha += 5;
					player.forest_fights += 2;
					player.gold += 1000;
					lln('  `2On your way back to town you find `$1000 Gold Coins');	
					mswait(2000);
					f.writeln('  `%Jennie:');
					f.writeln('  `2'+player.name+', why were you visiting Seth today?');
					f.close();				
					good_bye();	
				}
				else if(player.level > 3 || player.cha > 10 ) {
					if(player.cha < 100) { // seth is horny
						say_slow2(' a scantily clad Seth!');
						sln('');
						lln('`0');
						say_slow2('  She, invites you in and escorts you to her bed.');
						sln('');
						say_slow2('  Without saying a word, he removes his robe and');
						sln('');
						say_slow2('  helps you out of your '+player.arm);
						sln('');
						sln('');
						more_nomail();
						display_file(gamedir('/grabbag/menus.lrd'));
						mswait(1500);
						get_head('Getting down with Seth');
						lln('  `2After hours of passionate love making you get up,');
						lln('  get dressed and head back to town.`%');
						sln('');
						say_slow2('  SOMEWHERE MAGIC HAS HAPPENED!');
						sln('');
						sln('');						
						log_line('  `%'+player.name+' was seen leaving `$Seth\s Cabin `2smiling!');
						player.laid += 1;
						player.exp += player.level * 150;
						player.forest_fights += 2;
						player.cha += 10;
						mswait(2000);
						f.writeln('  `%Seth Able:');
						f.writeln('  `$'+player.name+', `2what were you doing at Seth\'s Cabin?');
						f.close();
						good_bye();
					}
					else // seth is horny, gets you pregnant 
					{
						say_slow2(' a totally naked Seth Able!');
						lln('`0');
						say_slow2('  Sethe, invites you in and escorts you to his bed.');
						sln('');
						say_slow2('  Without saying a word, she removes he robe and');
						sln('');
						say_slow2('  helps you out of your '+player.arm);
						sln('');
						sln('');
						more_nomail();
						display_file(gamedir('/grabbag/menus.lrd'));
						mswait(1500);
						get_head('Getting Down with Seth');
						lln('  `2After hours of passionate love making you get up,');
						lln('  get dressed and head back to town.`%');
						sln('');
						say_slow2('  SOMEWHERE MAGIC HAS HAPPENED!');
						sln('');
						sln('');						
						player.laid += 1;
						player.exp += player.level * 150;
						player.forest_fights += 2;
						player.cha += 10;												
						player.laid += 1;
						player.exp += player.level * 150;
						player.forest_fights += 2;
						player.cha += 10;
						player.kids += 1;
						log_line('  `$'+player.name+' `2was seen at the Market today.  Has she gained weight?');
						log_line('  `2In other news, `%Seth Able `0looks a little worried!');
						mswait(2000);
	
						f.writeln('  `%Jennie:');
						f.writeln('  `$'+player.name+', `2prepare to `4DIE! `2Seth Able knocked you up!');
						f.close();
						have_baby();						
						good_bye();
					}
				}
			break;
				
			case 1:  // seth gets mad
				say_slow2('  a very angrey Seth Able');
				sln('');
				sln('');
				lln('  `%Seth `2promptly kicks you in the groin,');
				lln('  you fall to the ground, crying like a baby!');
				sln('');
				more_nomail();
				sln('  He then, grabs you by you '+player.arm+' and');
				sln('  grags you off of his porch!');
				sln('');
				more_nomail();
				lln('  `2After you recover, you get up and head back');
				sln('  to town.');
				sln('');
				lln('  On the way, you find `$100 Gold Coins');
				sln('');
				player.gold += 100;
				good_bye();						
			break;
				
			case 2: // seth is not home
				say_slow2('  deafing silence!');
				lln('  `0');
				sln('');
				say_slow2('  Seth Able is not home!');
				sln('');
				lln('  `2You turn away from the door and head back to');
				lln('  with a glum feeling.');
				lln('');
				more_nomail();
				player.forest_fights += 2;
				player.exp += 100;
				player.cha += 1;
				good_bye();
			break;		
			}
		}
		
	if(ch === 'W') {
		get_head('Breaking into Seth Able\'s Cabin');
		lln('  `2You decide that knocking is above you so you');
		sln('  just open the door and walk in.');
		sln('');
		react = random(4);
		if(settings.clean_mode) react = 0; 
			
		switch ( react ) {
			case 0: // seth makes tea					
				lln('  `2He is happy to see  you in and pours you a');
				sln('  cup of tea.');
				sln('');
				lln('  `2After a pleasant visit you decide to head back');
				lln('  to town.');
				sln('');					
				more_nomail();
				lln('  `2For being a rude dick, you only recieve `%10 Experience.');
				sln('');
				lln('  `2Your Charm decreases by `$1');
				sln('');
				player.exp += 10;
				player.cha -= 1;
				mswait(2000);
				good_bye();
			break;
				
			case 1: // seth gets mad
				lln('  `%Seth `0sees you, screams and grabs his `$Battle Axe!');
				lln('  `0He lunges at you and strikes your `%'+player.arm);
				sln('');
				more_nomail();
				lln('  `2You quickly turn and run out through the open door.`%');
				sln('');
				amt = player.hp_max - 1;
				player.hp = 1;
				say_slow2('  You Lose '+pretty_int(amt)+' HIT POINTS');
				sln('');
				sln('');
				log_line('  `%Seth Able `0kicked `$'+player.name+'\'s `0ASS!');
				good_bye();
			break;
				
			case 2: // seth is horney
				lln('  `%Seth Able is just getting out of the wash barrel.');				
				lln('  `0His naked body shines as bright as an angel!');
				sln('');
				more_nomail();
				say_slow2('  Seth, invites you in and escorts you to his bed.');
				sln('');
				say_slow2('  Without saying a word, he removes her nighty and');
				sln('');
				say_slow2('  helps you out of your '+player.arm);
				sln('');
				sln('');
				more_nomail();
				display_file(gamedir('/grabbag/menus.lrd'));
				mswait(1500);
				get_head('Getting down with Seth Able');
				lln('  `2After hours of passionate love making you get up,');
				lln('  get dressed and head back to town.`%');
				sln('');
				say_slow2('  SOMEWHERE MAGIC HAS HAPPENED!');
				sln('');
				sln('');						
				log_line('  `%'+player.name+' was seen leaving `$Seth Able\s Cabin `2whistling!');
				player.laid += 1;
				player.exp += player.level * 150;
				player.forest_fights += 2;
				player.cha += 10;
				mswait(2000);
				f.writeln('  `%Jennie:');
				f.writeln('  `$'+player.name+', `2what were you doing at Seth\'s Cabin?');
				f.close();
				good_bye();			
			break;
				
			case 3: // seth 3 some (choice)
				lln('  `2As you enter Seth\'s Cabin you hear the sounds');
				lln('  `2of passionate love making coming from the bedroom');
				sln('');
				more_nomail();
				lln('  `2Feeling boldly curious, you go to the bedroom door');
				lln('  and look in.  You see that Jennie is busy pleasuring');
				lln('  `$Seth Able!');
				sln('');
				more_nomail();
				display_file(gamedir('/grabbag/menus.lrd'));
				mswait(2000);
				get_head('Being offered a threesome with Seth and Jennie');
				lln('  `2As you stand there taking in the spectacle, Jennie');
				lln('  catches you watching and invites you to join them.');
				sln('');
				lln('  `2(`0A`2)ccept and join in');
				lln('  `2(`0D`2)ecline and head home');
				sln('');
				lw('  `2You decide to ... (`0D`2): `%');
				ch = getkey().toUpperCase();
				if('AD'.indexOf(ch) == -1) {
					ch = 'D';
				}
				sln(ch);
				sln('');
				if(ch === 'D') {
					log_line('  `0HEAR YE! HEAR YE! `%'+player.name+' `0is an Honourable Warrior!');
					lln('  `2For whatever reasons, you decline the invitation');
					lln('  apologize for the intrusion and leave quietly.');
					sln('');
					lln('  `2On you way back to town you find `%1000 Gold Coins');
					player.cha += 10;
					player.gold += 1000;
					player.exp += 100;
					good_bye();
				}
				else
				{
				  lln('  `$You eagerly accept their invitation and jump in as fast');
				  lln('  as you can!');
				  sln('');
				  lln('  `2After hours of wild and kinky sex, you get up');
				  lln('  get dressed and head back to town.`%');
				  sln('');
				  say_slow2('  SOMEWHERE MAGIC HAS HAPPENED');
				  mswait(1500);
				  log_line('  `%'+player.name+' `2had fun with `$Seth `2and `$Jennie');
				  f.writeln('  `%Seth Able:');
				  f.writeln('  `%Jennie `2wasn\'t it fun playing with `$'+player.name+' `2last night?');
				  f.writeln('  `%Jennie:');
				  f.writeln('  `0Oh, Yes, Seth, it sure was! `$<wink>');
				  f.writeln('  `%'+player.name+':');
				  f.writeln('  `4** blushes **');
				  f.close();
				  player.laid +=2;
				  player.exp += 1000;
				  player.cha += 25;
				  player.kids +=1; 
				  have_baby();				  
				  good_bye();				
				}					
			break;
		}		
	}
}

function jennie_cabin() {
	var ch = undefined;
	var amt = 0;
	var react = undefined;
	var f = new File(gamedir('bar.lrd'));
	if (!f.open('a')) {
		throw('Unable to open '+f.name);
	}	
	get_head('Going to Jennie\'s Cabin');
	lln('  `2You decide that making an univited visit to');
	lln('  `%Jennie\'s Cabin `2seems like a good idea.');
	sln('');
	walk();
	get_head('Arriving at Jennie\'s Cabin');
	lln('  `2When you finally arrive you stop and contemplate');
	lln('  whether you should ... ');
	sln('');
	lln('  `2(`0K`2)nock on the door');
	lln('  `2(`0W`2)alk in like you\'re best friends');
	lln('  `2(`0H`2)ead back to town');
	sln('');
	lw('  `2You decide to ... (`$H`2): `%');
	ch = getkey().toUpperCase();
	if('KWH'.indexOf(ch) == -1) {
		ch = 'H';
	}
	sln(ch);
	sln('');
	
	if(ch === 'H') {
		lln('  `2You figure that perhaps you should have');
		lln('  been a little bit more courteous and not');
		lln('  have just shown up uninvited');
		sln('');
		more_nomail();
		amt = Math.round(player.exp/20);
		lln('  `0You gained `$'+pretty_int(amt)+' Experience `2and `$1 Charm!'); 
		player.cha += 1;
		player.exp += amt;
		sln('');
		good_bye();
	}
	
	if(ch === 'K') {		
		get_head('Knocking on Jennie\'s Door');
		lln('  `2You politely kncok on Jennie\'s door.');
		sln('');
		mswait(2000);
		lln('  Moments later, the door opens and you are greeted');
		lw('  by a `%'); wait(); wait(); wait();		
		react = random(3);
		
		switch ( react ) {
			case 0: //jennie is home and happy
				var did_jennie = false;
				if(player.level < 2 || player.cha < 10 || settings.clean_mode) {
					amt = Math.round(player.exp/10);
					say_slow2('  smiling Jennie!');
					sln('');
					sln('');
					lln('  `2She invites you in and pours you a cup of tea.');
					sln('');
					lln('  `2After a pleasant visit you decide to head back');
					lln('  to town.');
					sln('');					
					more_nomail();
					lln('  `2For being polite you recieve `%'+pretty_int(amt)+' Experience.');
					sln('');
					lln('  `2Your Charm increases by `$2');
					sln('');
					player.exp += amt;
					player.cha += 2;
					mswait(2000);
					
					good_bye();
				}
				else if(player.level < 5 && player.cha > 10)
				{
					amt = Math.round(player.exp/10);
					say_slow2('  happy Jennie!');
					sln('');
					sln('');
					lln('  `2She invites you in and pours you a cup of tea.');
					sln('');
					lln('  `2After a pleasant visit you decide to head back');
					lln('  to town.');
					sln('');					
					more_nomail();
					lln('  `2For being polite you recieve `%'+pretty_int(amt)+' Experience.');
					sln('');
					lln('  `2Your Charm increases by `$5');
					sln('');
					player.exp += amt;
					player.cha += 5;
					player.forest_fights += 2;
					player.gold += 1000;
					lln('  `2On your way back to town you find `$1000 Gold Coins');	
					mswait(2000);
					f.writeln('  `%Seth Able:');
					f.writeln('  `2'+player.name+', why were you visiting Jennie today?');
					f.close();				
					good_bye();	
				}
				else if(player.level > 5 || player.cha > 50 ) {
					if(player.cha < 100) { // jennie is horny
						say_slow2(' a scantily clad Jennie!');
						sln('');
						lln('`0');
						say_slow2('  Jennie, invites you in and escorts you to her bed.');
						sln('');
						say_slow2('  Without saying a word, she removes her nighty and');
						sln('');
						say_slow2('  helps you out of your '+player.arm);
						sln('');
						sln('');
						more_nomail();
						display_file(gamedir('/grabbag/menus.lrd'));
						mswait(1500);
						get_head('Getting down with Jennie');
						lln('  `2After hours of passionate love making you get up,');
						lln('  get dressed and head back to town.`%');
						sln('');
						say_slow2('  SOMEWHERE MAGIC HAS HAPPENED!');
						sln('');
						sln('');						
						log_line('  `%'+player.name+' was seen leaving `$Jennie\s Cabin `2whistling!');
						player.laid += 1;
						player.exp += player.level * 150;
						player.forest_fights += 2;
						player.cha += 10;
						mswait(2000);
						f.writeln('  `%Seth Able:');
						f.writeln('  `$'+player.name+', `2what were you doing at Jennie\'s Cabin?');
						f.close();
						good_bye();
					}
					else // jennie is horny, gets pregnant 
					{
						say_slow2(' a totally naked Jennie!');
						lln('`0');
						say_slow2('  Jennie, invites you in and escorts you to her bed.');
						sln('');
						say_slow2('  Without saying a word, she removes her nighty and');
						sln('');
						say_slow2('  helps you out of your '+player.arm);
						sln('');
						sln('');
						more_nomail();
						display_file(gamedir('/grabbag/menus.lrd'));
						mswait(1500);
						get_head('Getting Down with Jennie');
						lln('  `2After hours of passionate love making you get up,');
						lln('  get dressed and head back to town.`%');
						sln('');
						say_slow2('  SOMEWHERE MAGIC HAS HAPPENED!');
						sln('');
						sln('');						
						player.laid += 1;
						player.exp += player.level * 150;
						player.forest_fights += 2;
						player.cha += 10;												
						player.laid += 1;
						player.exp += player.level * 150;
						player.forest_fights += 2;
						player.cha += 10;
						player.kids += 1;
						log_line('  `$Jennie `2was seen at the Market today.  Has she gained weight?');
						log_line('  `2In other news, `%'+player.name+' `0looks a little worried!');
						mswait(2000);

						f.writeln('  `%Seth Able:');
						f.writeln('  `$'+player.name+', `2prepare to `4DIE! `2You knocked up my `$Jennie!');
						f.close();						
						good_bye();
					}
				}
				if(!did_jennie) { // just in case the math was wrong somewhere, lol
					amt = Math.round(player.exp/10);
					say_slow2('  smiling Jennie!');
					sln('');
					sln('');
					lln('  `2She invites you in and pours you a cup of tea.');
					sln('');
					lln('  `2After a pleasant visit you decide to head back');
					lln('  to town.');
					sln('');					
					more_nomail();
					lln('  `2For being polite you recieve `%'+pretty_int(amt)+' Experience.');
					sln('');
					lln('  `2Your Charm increases by `$2');
					sln('');
					player.exp += amt;
					player.cha += 2;
					mswait(2000);										
					good_bye();	
				}
			break;
			
			case 1:  //jennie gets mad
				say_slow2('  a very angrey Jennie');
				sln('');
				sln('');
				lln('  `%Jennie `2promptly kicks you in the groin,');
				lln('  you fall to the ground, crying like a baby!');
				sln('');
				more_nomail();
				sln('  She then, grabs you by you '+player.arm+' and');
				sln('  grags you off of her porch!');
				sln('');
				more_nomail();
				lln('  `2After you recover, you get up and head back');
				sln('  to town.');
				sln('');
				lln('  On the way, you find `$100 Gold Coins');
				sln('');
				player.gold += 100;
				good_bye();						
			break;
			
			case 2: // jennie is not home
				say_slow2('  deafing silence!');
				lln('  `0');
				sln('');
				say_slow2('  Jennie is not home!');
				sln('');
				lln('  `2You turn away from the door and head back to');
				lln('  with a glum feeling.');
				lln('');
				more_nomail();
				player.forest_fights += 2;
				player.exp += 100;
				player.cha += 1;
				good_bye();
			break;		
		}
	}
	
	if(ch === 'W') {
		get_head('Breaking into Jennie\'s Cabin');
		lln('  `2You decide that knocking is above you so you');
		sln('  just open the door and walk in.');
		sln('');
		react = random(4);
		if(settings.clean_mode) react = 0;
		switch ( react ) {
			case 0: // jennie makes tea				
				lln('  `2She is happy to see  you in and pours you a');
				sln('  cup of tea.');
				sln('');
				lln('  `2After a pleasant visit you decide to head back');
				lln('  to town.');
				sln('');					
				more_nomail();
				lln('  `2For being a rude dick, you only recieve `%10 Experience.');
				sln('');
				lln('  `2Your Charm decreases by `$1');
				sln('');
				player.exp += 10;
				player.cha -= 1;
				mswait(2000);
				good_bye();
			break;
			
			case 1: // jennie  gets mad
				lln('  `%Jennie `0sees you, screams and grabs her `$Crystal Shard!');
				lln('  `0She lunges at you and strikes your `%'+player.arm);
				sln('');
				more_nomail();
				lln('  `2You quickly turn and run out through the open door.`%');
				sln('');
				amt = player.hp_max - 1;
				player.hp = 1;
				say_slow2('  You Lose '+pretty_int(amt)+' HIT POINTS');
				sln('');
				sln('');
				log_line('  `%Jennie `0kicked `$'+player.name+'\'s `0ASS!');
				good_bye();
			break;
			
			case 2: // jennie is horney
				lln('  `%Jennie is just getting out of the wash barrel.');				
				lln('  `0Her naked body shines as bright as an angel!');
				sln('');
				more_nomail();
				say_slow2('  Jennie, invites you in and escorts you to her bed.');
				sln('');
				say_slow2('  Without saying a word, she removes her nighty and');
				sln('');
				say_slow2('  helps you out of your '+player.arm);
				sln('');
				sln('');
				more_nomail();
				display_file(gamedir('/grabbag/menus.lrd'));
				mswait(1500);
				get_head('Getting down with Jennie');
				lln('  `2After hours of passionate love making you get up,');
				lln('  get dressed and head back to town.`%');
				sln('');
				say_slow2('  SOMEWHERE MAGIC HAS HAPPENED!');
				sln('');
				sln('');						
				log_line('  `%'+player.name+' was seen leaving `$Jennie\s Cabin `2whistling!');
				player.laid += 1;
				player.exp += player.level * 150;
				player.forest_fights += 2;
				player.cha += 10;
				mswait(2000);
				f.writeln('  `%Seth Able:');
				f.writeln('  `$'+player.name+', `2what were you doing at Jennie\'s Cabin?');
				f.close();
				good_bye();			
			break;
			
			case 3: // jennie 3 some (choice)
				lln('  `2As you enter Jennie\'s Cabin you hear the sounds');
				lln('  `2of passionate love making coming from the bedroom');
				sln('');
				more_nomail();
				lln('  `2Feeling boldly curious, you go to the bedroom door');
				lln('  and look in.  You see that Jennie is busy pleasuring');
				lln('  `$Seth Able!');
				sln('');
				more_nomail();
				display_file(gamedir('/grabbag/menus.lrd'));
				mswait(2000);
				get_head('Being offered a threesome with Seth and Jennie');
				lln('  `2As you stand there taking in the spectacle, Jennie');
				lln('  catches you watching and invites you to join them.');
				sln('');
				lln('  `2(`0A`2)ccept and join in');
				lln('  `2(`0D`2)ecline and head home');
				sln('');
				lw('  `2You decide to ... (`0D`2): `%');
				ch = getkey().toUpperCase();
				if('AD'.indexOf(ch) == -1) {
					ch = 'D';
				}
				sln(ch);
				sln('');
				if(ch === 'D') {
					log_line('  `0HEAR YE! HEAR YE! `%'+player.name+' `0is an Honourable Warrior!');
					lln('  `2For whatever reasons, you decline the invitation');
					lln('  apologize for the intrusion and leave quietly.');
					sln('');
					lln('  `2On you way back to town you find `%1000 Gold Coins');
					player.cha += 10;
					player.gold += 1000;
					player.exp += 100;
					good_bye();
				}
				else
				{
					lln('  `$You eagerly accept their invitation and jump in as fast');
				  	lln('  as you can!');
				  	sln('');
				  	lln('  `2After hours of wild and kinky sex, you get up');
				  	lln('  get dressed and head back to town.`%');
				  	sln('');
				  	say_slow2('  SOMEWHERE MAGIC HAS HAPPENED');
				  	mswait(1500);
				  	log_line('  `%'+player.name+' `2had fun with `$Seth `2and `$Jennie');
				  	f.writeln('  `%Seth Able:');
				  	f.writeln('  `%Jennie `2wasn\'t it fun playing with `$'+player.name+' `2last night?');
				  	f.writeln('  `%Jennie:');
				  	f.writeln('  `0Oh, Yes, Seth, it sure was! `$<wink>');
				  	f.writeln('  `%'+player.name+':');
				  	f.writeln('  `4** blushes **');
				  	f.close();
				  	player.laid +=2;
				  	player.exp += 1000;
				  	player.cha += 25;
				  	player.kids +=1; // but who's the daddy? you or seth ;-P				  
				  	good_bye();				
				}				
			break;
		}		
		
	}
}

function veldore_cabin(trainer) {
	var ch = undefined;
	var vrand = undefined;
	var amt = undefined;
	get_head('Going to '+trainer.name+'\'s Cabin');
	lln('  `2You decide that making an univited visit to');
	lln('  `%'+trainer.name+'\'s Cabin `2seems like a good idea.');
	sln('');
	more_nomail();
	get_head('Standing at '+trainer.name+'\'s Door');
	lln('  `2When you finally arrive you stop and contemplate');
		lln('  whether you should ... ');
		sln('');
		lln('  `2(`0K`2)nock on the door');
		lln('  `2(`0W`2)alk in like you\'re best friends');
		lln('  `2(`0H`2)ead back to town');
		sln('');
		lw('  `2You decide to ... (`$H`2): `%');
		ch = getkey().toUpperCase();
		if('KWH'.indexOf(ch) == -1) {
			ch = 'H';
		}
		sln(ch);
		sln('');
		
		if(ch === 'H') {
			lln('  `2You figure that perhaps you should have');
			lln('  been a little bit more courteous and not');
			lln('  have just shown up uninvited!');
			sln('');
			more_nomail();
			amt = Math.round(player.exp/20);
			lln('  `0You gained `$'+pretty_int(amt)+' Experience `2and `$1 Charm!'); 
			player.cha += 1;
			player.exp += amt;
			sln('');
			good_bye();
		}
		
		if(ch === 'K') {
			var curse = undefined;
			if(settings.clean_mode) curse = '`$IN TARNATION`%'; else curse = '`$THE FUCK`%';		
			get_head('Knocking on '+trainer.name+'\'s Door');
			lln('  `2As a courteous Warrior, you politely knock');
			sln('  on '+trainer.name+'\'s door.');
			sln('');
			mswait(2000);
			lln('  `2After some time, the large wooden door slowly opens');
			lw('  and you can tell immdiately that '+trainer.name+' is');
			lw('  `% '); wait(); wait();wait();
			vrand = random(5);
			
			switch ( vrand ) {
				case 0:
					say_slow2('drunk!');
					sln('');
					sln('');				
					lln('  `%"WHAT '+curse+' DO YOU WANT, KID?"`0,'+trainer.name+' Yells.');
					sln('');
					more_nomail();
					lln('  `0Suddenly, right before your eyes, '+trainer.name+' changes');
					lln('  and turns into the Monster `6'+husband.name+'!');
					sln('');
					lln('  `0It draws it\'s `$'+husband.weapon+' `0and lunges at you.');
					sln('');
					lln('  `0You draw your `$'+player.weapon+' `0and prepare to battle.');
					sln('');
					more_nomail();
					battle(husband, false, false);
					sln('');
					lln('  `0'+trainer.name+', er I mean `6'+husband.name+' `0falls backwards.');
					lln('  You take the opportunity to get the hell out');
					lln('  of there as fast as you can!');
					sln('');
					more_nomail();
					log_line('  `5'+player.name+' `0battled the drunk Monster `6'+husband.name);
					good_bye('frightening');					
				break;
				
				case 1:
					say_slow2('annoyed!');
					sln('');
					sln('');
					lln('  `0'+trainer.name+' looks at you with a perturbed look on his face,');
					lln('  and asks `%"What '+curse+' do you want, kid?"');
					sln('');
					lln('  `2(`0J`2)ust wanted to say hello');
					lln('  `2(`0T`2)o Kick your ASS, '+trainer.name);
					lln('  `2(`0S`2)orry, I made a wrong turn');
					sln('');
					lw('  `2You decide to ... (`$J`2) `%');
					ch = getkey().toUpperCase();
					if('JTS'.indexOf(ch) == -1) {
						ch = 'J';
					}
					sln(ch);
					sln('');
					
					switch ( ch ) {
						case 'J':
							lln('  `2Just saying hello!');
							sln('');
							more_nomail();
							lln('  `6'+trainer.name+' `0looks at you oddly then he pulls out a deck of cards');
							lln('  and points at the table in the corner of the room.');
							lln('  You sit down and look at him expectantly!');
							sln('');
							more_nomail();
							bjack(trainer.name);
							sln('');
							lln('  `%"Well, that was fun, '+trainer.name+'.  We should do it');
							lln('  again sometime!"`0, you say as you get up and leave.');
							sln('');
							player.forest_fights+=3;
							lln('  `$YOU GAIN 3 FOREST FIGHTS');							
						break;
						
						case 'T':
							lln('  `2Fighting with '+trainer.name+'!');
							sln('');
							more_nomail();
							sln('');
							battle(trainer, false, false);
							sln('');
							lln('  `0'+trainer.name+' `0falls backwards and hits his head on the table.');
							lln('  You take the opportunity to get the hell out');
							lln('  of there as fast as you can!');
							sln('');
							more_nomail();
							log_line('  `5'+player.name+' `0broke into `6'+trainer.name+'\'s `0cabin and attacked him');
							good_bye('great');battle(trainer, false, false);
						break;
						
						case 'S':
							lln('  `%"Sorry, '+trainer.name+', I thought you were someone else!"`2,');
							lln('  you say as you turn and walk away.');
							sln('');
							player.forest_fights+=1;
							amt = player.level * 10;
							player.exp += amt;
							lln('  `0You earned '+pretty_int(amt)+' Experience');
							sln('');							
							more_nomail();
							good_bye();
						break;
					}					
				break;
				
				case 2:
					say_slow2('happy to see you');
					sln('');
					sln('');
					lln('  `0'+trainer.name+' looks at you with a happy look on his face,');
					lln('  and says `%"Hey, '+player.name+' come on in and have a drink"');
					sln('');
					lln('  `2(`0A`2)ccept');
					lln('  `2(`0S`2)ay thank you but leave');
					sln('');
					lw('  `2You decide to  ... (`$S`2) `%');
					ch = getkey().toUpperCase();
					if('AS'.indexOf(ch) == -1) {
						ch = 'S';
					}
					sln(ch);
					sln('');
					
					switch ( ch ) {
						case 'A':
							get_head('Having a Drink with '+trainer.name);
							lln('  `2After a few drinks and some laughs '+trainer.name+' offers');
							lln('  you a place to crash for the night');
							sln('');
							lln('  `2(`0A`2)ccept');
							lln('  `2(`0S`2)ay thank you and leave');
							sln('');
							lw('  `2You decide to ... (`$S`2) `%');
							ch = getkey().toUpperCase();
							if('AS'.indexOf(ch) == -1) {
								ch = 'S';
							}
							sln(ch);
							sln('');							
							switch ( ch) {
								case 'A':
								lln('  `2You accept his offer and find comfortable place to sleep.');
								sln('');
								more_nomail();
								sleep_here('v');
								break;
							}
						break;
						
						case 'S':
							lln('  `%Um, no, sorry, but I really have to go, but thank you!"');
							lln('  `0you say as you turn around and leave.');
							sln('');
							lln('  `$You Gain '+pretty_int(player.level * 10)+' Experience!');							
							player.exp += player.level * 10;							
							sln('');
							more_nomail();
							good_bye();
						break;
					}										
				break;
				
				case 3:
					say_slow2('angry');
					sln('');
					lln('  `%"WHAT '+curse+' DO YOU WANT, KID?"`0, '+trainer.name+' Yells.');
					sln('');
					more_nomail();
					lln('  `0Suddenly, right before your eyes, '+trainer.name+' changes');
					lln('  and turns into the Monster `6'+husband.name+'!');
					sln('');
					lln('  `0It draws it\'s `$'+husband.weapon+' `0and lunges at you.');
					sln('');
					lln('  `0You draw your `$'+player.weapon+' `0and prepare to battle.');
					sln('');
					more_nomail();
					battle(husband, false, false);
					sln('');
					lln('  `0'+trainer.name+', er I mean `6'+husband.name+' `0falls backwards.');
					lln('  You take the opportunity to get the hell out');
					lln('  of there as fast as you can!');
					sln('');
					more_nomail();
					log_line('  `5'+player.name+' `0battled the angry Monster `6'+husband.name);
					sln('');
					good_bye('frightening');
				break;
				
				case 4:
					say_slow2('busy');
					sln('');
					sln('');					
					more_nomail();
					lln('  `%"Hey, '+player.name+' nice to see you but I am very busy!"`0,');
					lln('  '+trainer.name+' says.  `%Come visit me at Turgons Training Camp."');					
					sln('');					
					lln('  `$You Gain '+pretty_int(player.level * 10)+' Experience');
					sln('');
					more_nomail();
					good_bye('disappointing');
				break;
			}	
			
			more_nomail();
			good_bye();
		}
		
		if(ch === 'W') {
			if(settings.clean_mode) curse = '`$IN TARNATION`%'; else curse = '`$THE FUCK`%';		
			get_head('Breaking into '+trainer.name+'\'s Cabin');
			lln('  `2You decide that knocking on a Warrior\'s door');
			lln('  is beneath you, so you walk in like you own the');
			sln('  place.  As you stand in the small front room you');
			lw('  see that `6'+trainer.name+'`2 is `%'); wait(); wait(); wait();			
			sln('');
			vrand = random(5);
			
			switch ( vrand ) {
				case 0: // no one is home
					lln('  `0not even at home!  You take a minute to rummage through');
					lw('  his belongings and find `%');
					
					vrand = random(3);
					
					switch( vrand ) {
						case 0:
							lln('A DRAGONS TOOTH!');
							player.hp += 100;							
						break;
						
						case 1:
							lln('AN AMULET OF ACCURACY!');
							player.amulet = true;
						break;
							
						case 2:
							lln('A FAIRY!');
							player.has_fairy = true;	
						break;
						
						sln('');
						more_nomail();
						log_line('  `%'+trainer.name+' `0reported a break in at his cabin');
						good_bye();
					}
				break;
				
				case 1: // trainer is pissed ... battle
					say_slow2('  drunk!');
					sln('');
					sln('');				
					lln('  `%"WHAT '+curse+' DO YOU WANT, KID?"`0,'+trainer.name+' Yells.');
					sln('');
					more_nomail();
					lln('  `0Suddenly, right before your eyes, '+trainer.name+' changes');
					lln('  and turns into the Monster `6'+husband.name+'!');
					sln('');
					lln('  `0It draws it\'s `$'+husband.weapon+' `0and lunges at you.');
					sln('');
					lln('  `0You draw your `$'+player.weapon+' `0and prepare to battle.');
					sln('');
					more_nomail();
					battle(husband, false, false);
					sln('');
					lln('  `0'+trainer.name+', er I mean `6'+husband.name+' `0falls backwards.');
					lln('  You take the opportunity to get the hell out');
					lln('  of there as fast as you can!');
					sln('');
					more_nomail();
					log_line('  `5'+player.name+' `0battled the drunk Monster `6'+husband.name);
					good_bye('frightening');					
				break
				
				case 2: // trainer is busy ... sends you away
					sln('  busy honing his '+trainer.weapon);
					sln('');
					lln('  `%"Oh, sorry, I didn\'t mean to disturb you."`0, you say');
					lln('  as you turn and leave the way you came.');
					sln('');
					more_nomail();
					lln('  `%"HEY!"`0, '+trainer.name+' yells, `%"Thanks for dropping by,');
					lln('  sorry, I am little busy, I have a Big Training Session tomorrow,');
					lln('  here, take something for your troubles!');
					sln('');
					more_nomail();
					amt = player.level * 10;
					lln('  `6'+trainer.name+' `0hands you `$'+pretty_int(amt)+' `0Experience!');
					player.exp += amt;
					sln('');
					more_nomail();
					good_bye();
					
				break;
				
				case 3: // trainer is cool ... drinks offers sleep
					say_slow2('  happy to see you');
					sln('');
					sln('');
					lln('  `%"WHAT '+curse+' DO YOU WANT, KID?"`0,'+trainer.name+' laughs.');
					sln('');
					lln('  `0'+trainer.name+' looks at you with a happy look on his face,');
					lln('  and says `%"Hey, '+player.name+' come on in and have a drink"');
					sln('');
					lln('  `2(`0A`2)ccept');
					lln('  `2(`0S`2)ay thank you but leave');
					sln('');
					lw('  `2You decide to  ... (`$S`2) `%');
					ch = getkey().toUpperCase();
					if('AS'.indexOf(ch) == -1) {
						ch = 'S';
					}
					sln(ch);
					sln('');
									
					switch ( ch ) {
						case 'A':
							get_head('Having a Drink with '+trainer.name);
							lln('  `2After a few drinks and some laughs '+trainer.name+' offers');
							lln('  you a place to crash for the night');
							sln('');
							lln('  `2(`0A`2)ccept');
							lln('  `2(`0S`2)ay thank you and leave');
							sln('');
							lw('  `2You decide to ... (`$S`2) `%');
							ch = getkey().toUpperCase();
							if('AS'.indexOf(ch) == -1) {
								ch = 'S';
							}
							sln(ch);
							sln('');							
							switch ( ch) {
								case 'A':
								lln('  `2You accept his offer and find comfortable place to sleep.');
								sln('');
								more_nomail();
								sleep_here('v');
								break;
							}
						break;
										
						case 'S':
							lln('  `%Um, no, sorry, but I really have to go, but thank you!"');
							lln('  `0you say as you turn around and leave.');
							sln('');
							lln('  `$You Gain '+pretty_int(player.level * 10)+' Experience!');							
							player.exp += player.level * 10;							
							sln('');
							more_nomail();
							good_bye();
						break;
				}				
				break;
				
				case 4: // trainer is happy ... plays cards
					lln('  pleasantly surprised');
					sln('');
					
					lln('  `6'+trainer.name+' `0looks at you oddly then he pulls out a deck of cards');
					lln('  and points at the table in the corner of the room.');
					lln('  You sit down and look at him expectantly!');
					sln('');
					more_nomail();
					bjack(trainer.name);
					sln('');
					lln('  `%"Well, that was fun, '+trainer.name+'.  We should do it');
					lln('  again sometime!"`0, you say as you get up and leave.');
					sln('');
					player.forest_fights+=3;
					lln('  `$YOU GAIN 3 FOREST FIGHTS');					
				break;
			}
			
			more_nomail();			
			good_bye();
		}
}


function get_head(str)
{
	lln('`r0`0`2`c  `%' + str);
	lln('`0-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
	sln('');
}

function search() {
	var found = '';
	var reward = 0;
	var trainer = undefined;
	if (player.level < 12) 
	{
		trainer = get_trainer(player.level);
	}
	else 
	{
		trainer = get_trainer(11);
	}
	
	get_head('Searching The Forest');	
	lrdfile('FOREST');
	sln('');		
	sln('');	
	lln('  `2You decide that you\'d rather take your chances');
	sln('  searching for items other Warriors may have lost');
	sln('  while trudging through The Forest.');
	sln('');
	more_nomail();
	walk();
	lln('  `2After some time, you stumble across something.');
	sln('');
	lw('  You stop, bend down and pick up `%.');
	wait(); wait(); wait();
	
	var sum_shit = random(11);
	
	switch ( sum_shit ) {	
		case 0:
			reward = Math.round(player.hp / 2);
			say_slow2(' A DRAGON\'S TOOTH!');
			sln('');
			lln('  `2YOUR HIT POINTS INCREASE BY `$'+pretty_int(reward));
			player.hp += reward;
			log_line('  `5'+player.name+' `2FOUND A DRAGON\'S TOOTH IN THE FOREST');
		break;
		
		case 1:
			reward = Math.round(player.hp / 10);
			say_slow2(' A RUSTY SWORD!');
			sln('');
			lln('  `0YOU LOSE `%'+pretty_int(reward)+' `0HIT POINTS');
			player.hp -= reward;
			player.weapon = 'Rusty Sword';	
		break;
		
		case 2:
			say_slow2('  AN AMULET OF ACCURACY!');
			player.amulet = true;
			log_line('  `5'+player.name+' `0Found an `$AMULET OF ACCURACY `0in The Forest');	
		break;
			
		case 3:
			reward = player.level * Math.round(player.exp/10);			
			if(player.sex === 'M') {
				say_slow2('  A MAP TO JENNIE\'S CABIN!');
				sln('');
				more_nomail();
				cabin_shit('Jennie');
			}
			else {
				say_slow2('  A MAP TO SETH ABLE\'S CABIN');
				sln('');
				more_nomail();
				cabin_shit('Seth');
			}			
		break;
		
		case 4:				
			player.exp += reward;
			say_slow2(' A MAP TO '+trainer.name.toUpperCase()+'\'S CABIN!');
			sln('');
			more_nomail();
			cabin_shit('Veldore');			
		break;
		
		case 5:
			if(player.horse) 
			{
				say_slow2(' A LOST CHILD!');
				player.kids += 1;
				log_line('  `5'+player.name+' `2FOUND A MISSING CHILD IN THE FOREST');
			}
			else
			{
				say_slow2(' A HORSE!');
				player.horse = true;
			}			
		break;
		
		case 6:
			say_slow2(' A LOST CHILD!');
			player.kids += 1;
			log_line('  `5'+player.name+' `2FOUND A MISSING CHILD IN THE FOREST');
		break;
		
		case 7:
			if(player.has_fairy) 
			{
				if(settings.clean_mode) 
				{ 
					say_slow2(' A USED SNOT RAG!');
				 	lln('  `0YOU LOSE `%1 `0CHARM'); 
				}
				else 
				{ 
					say_slow2(' A USED CONDOM!');
				  	lln('  `0YOU LOSE `%1 `0CHARM'); }
					player.cha -= 1;				
				}
			else
			{
				say_slow2(' A SLEEPING FAIRY!');
				player.has_fairy = true;
			}
		break;
		
		case 8:
			reward = player.hp_max * 5;
			say_slow2(' A POUCH WITH '+pretty_int(reward)+' GOLD COINS');
			player.gold += reward;
		break;
		
		case 9:
			reward = player.level;
			if(reward < 3) reward = 3;
			say_slow2(' A POUCH WITH '+pretty_int(reward)+' GEMS');
			player.gem += reward;			
		break;
		
		case 10:
			lw('`4');
			say_slow2(' A SLEEPING MONSTER!');
			sln('');
			more_nomail();
			lln('  `0You startle the Monster awake.  It jumps to it\'s feet');
			lln('  and draws it\'s `6'+husband.weapon+' `0and lunges');
			lln('  at you yelling `%"Why you wake `6'+husband.name+'`%?"');
			sln('');
			more_nomail();
			battle(husband, false, false);		
			log_line('  `5'+player.name+' `0startled the monster `6'+husband.name);
		break;																
	}
	
	sln('');
	more_nomail();	
	good_bye();	
}

function climb() {
	var reward = 0;
	var crand = undefined;
	get_head('Taking Your Chances');
	lln('  `0You look up at the ominous set of stairs rising before you.');
	sln('  As you take a deep breath you begin the strenuous climb.');
	sln('');
	more_nomail();
	sln('');
	sln('  After some time, you reach the platform at the top.');
	sln('  You look over the railing, the tree tops seem like');
	sln('  small plants!');
	sln('');
	more_nomail();
	sln('');
	sln('  You take another deep breath and reach your hand into');
	sln('  bag!  Suddenly, you feel something grab your arm and ');
	sln('  start pulling on it!  You feel your arm stretch, like ');
	lln('  it was an `$Rubber Band!`2');
	sln('');
	more_nomail();
	sln('');
	sln('  Just as you feel as though your arm is about to be pulled');
	lw('  out of it\'s socket, your hand touches something `%');
	wait(); wait(); wait();
	sln('');
	sln('');
	crand = random(10);
	
	switch ( crand ) {
		case 0:
			reward = 11 * player.hp_max;
		
			say_slow2('  YOU FOUND A POUCH WITH '+pretty_int(reward)+' GOLD IN IT!');
			player.gold += reward;
			if (player.gold > 2000000000) {
				player.gold = 2000000000;
			}
		break;
		
		case 1:
			reward = 2 + player.level;			
			say_slow2('  YOU FOUND A POUCH WITH '+pretty_int(reward)+' GEMS IN IT!');
			player.gem += reward;
		break;
		
		case 2:
			reward = Math.round(player.exp / 5);
			say_slow2('  YOU FOUND '+pretty_int(reward)+' EXPERIENCE POINTS!');
			player.exp += reward;
		break;
		
		case 3:
			player.forest_fights += 3;
			say_slow2('  YOU FOUND 3 FOREST FIGHTS');
		break;
		
		case 4:
			player.pvp_fights += 1;
			say_slow2('  YOU SNATCHED UP 1 USER BATTLE');
		break;
		
		case 5:
			reward = Math.round(player.str / 10);
			if(reward < 1) reward = 1;
			player.str -= reward;
			if(player.str < 1) player.str = 1;
			lln('  YOU GOT BITTEN BY A VENUMOUS SNAKE!');
			more_nomail();
			say_slow2('  YOU LOSE '+pretty_int(reward)+' STRENGTH');
		break;
			
		case 6:
			reward = Math,round(player.exp / 10);
			player.hp += reward;
			lln('  YOU GRABBED AN EMPTY POUCH!');
			more_nomail();
			say_slow2('  YOU LOSE '+pretty_int(reward)+' EXPERIENCE');	
		break;
		
		case 7:
			reward = player.hp + player.level;
			player.hp += reward;
			say_slow2('  YOU FOUND '+pretty_int(reward)+' HIT POINTS');
		break;
		
		case 8:
			reward = player.level;
			player.cha += reward;
			
			if(player.sex === 'M') {
				say_slow2('  YOU FOUND A DINNER INVITATION FROM VILOET!');
				var say1_lognow = '  `5'+player.name+' `2got laid by `5Violet!';							
			} else {
				say_slow2('  YOU FOUND A DINNER INVITATION FROM SETH!');
				var say1_lognow = '  `5'+player.name+' `2got laid by `$Seth Able!';			
			}
			if(settings.clean_mode) {
				sln('');
				say_slow2('  YOUR CHARM GOES UP BY ' + pretty_int(reward));				
			} else {			
				sln('');
				lln('  `2You accept the invitation.  After 2 hours of');
				lln('  great sex you feel invigorated!');
				more_nomail();
				lln('  `0YOUR CHARM GOES UP BY ' + pretty_int(reward));
				player.laid += 1;
				log_line(say1_lognow);				
			}			
		break;
		
		case 9:
			if(player.horse) {
				say_slow2('  YOU FOUND A MISSING CHILD!');
				log_line('  `5'+player.name+' `2FOUND A MISSING CHILD IN THE FOREST!');
				player.kids += 1;
			} else {
				say_slow2('  YOU FOUND A HORSE');
				player.horse = true;
			}
		break;
		
	}
	sln('');
	sln('');
	more_nomail();
	good_bye();	
}

function good_bye(what) {
	if(what === undefined) what = 'fun';
	sln('');
	lln('  `2You have had a `$'+what+' `2visit to the Grab Bag today.');
	sln('');
	lw('  You continue your on you way back to `4');	
	wait(), wait(); wait();	
	say_slow(' The Realm!');
	mswait(1000);
	exit(0);
}

/* should add wood nymph, seth, jennie, violet data here
var AssGrabDefs = [
	{
	name:
	 .... ???
	}
];
*/
var grabbagDefs = [
	{
		prop:'day',
		type:'SignedInteger',
		def:-1
	},
	{
		prop:'can_play',
		type:'Array:150:Boolean',
		def:eval('var aret = []; while(aret.length < 150) aret.push(true); aret;')
	}
];

function run_maint(b)
{
	var i;

	for (i = 0; i < b.can_play.length; i++) {
		b.can_play[i] = true;
	}
	b.day = state.days;
	b.put();
}

// globals
var bs;
load('array.js'); // probably no longer needed
var mnum = undefined;			
if (player.level === 1) 
{
	mnum = random(10);
}
else 
{
	if (random(6) !== 2) 
	{
		mnum = ((player.level-1)*11)+random(10);
	}
	else 
	{
		mnum = (random(player.level) * 11) + random(10);
	}
}

var husband = load_monster(mnum); // sets up monster battle and nymph husband

// end globals

function main()
{
	'use strict';
	var ch;
	var b;
	var i;

	foreground(2);
	background(0);
	
	get_head('The Grab Bag');
	
	if (!dk.console.ansi) {
		sln('  NOTE:  The \'arcade\' sequences in this IGM *REQUIRE* ANSI terminal');
		sln('  support.  Things will look out of wack in your current settings.');
		sln('  You can switch to ANSI inside of LORD by pressing 3 from the main');
		sln('  menu.  You just better hope your terminal supports it...');
		sln('');
	}

	bs = new RecordFile(js.exec_dir+'grabbag.dat', grabbagDefs);
	js.on_exit('bs.locks.forEach(function(x) {bs.unLock(x); bs.file.close()});');
	if (bs.length < 1) {
		b = bs.new();
	}
	else {
		b = bs.get(0);
	}
	
	if (b.day != state.days) {
		run_maint(b);
	}
	
	if(user.is_sysop) // allows for sysop to always be able to play for testing IGM
	{ 
		player.sex = 'M'; // remove this, it is only for testing M/F 
		player.forest_fights = player.forest_fights + 1; 
		player.hp = player.hp_max + 1;
		b.can_play[player.Record] = true; 
	}
	
	if(!b.can_play[player.Record] || player.forest_fights < 1) {
		lln('  `2As you, begin your journey, you suddenly feel confused,');
		sln('  it seems you have forgotten how to get there. You turn');		
		sln('  around and head back to town.');		
		sln('');
		lln('  `$Maybe Tomorrow `2you\'ll remember the way!');
		sln('');  
		more_nomail();
		good_bye();
	}
	
	b.can_play[player.Record] = false;
	b.put();

	player.forest_fights--; // I dislike this :-(
	if(settings.clean_mode) { lln('  `0Clean Mode is `$ON `0'); sln(''); }
	else 
	{ 
		sln('');		
		lln('  `0Clean Mode is `$OFF`0');
		sln('');
		lln('  `0With clean mode `4OFF `0things can get');
		lln('  a bit graphic in here!');
		sln('');
		lw('  (`$C`0)ontinue (`4L`0)eave? `%')
		ch = getkey().toUpperCase();
		if('CL'.indexOf(ch) == -1) ch = 'C';
		sln(ch);
		sln('');
		if(ch === 'L') {
			lln('  `2I understand!');
			sln('');
			player.forest_fights += 2;
			good_bye();
		}
		
	}
	mswait(1500);

var done = false;
while(!done) {	// let's player view instructions without kicking them out as though they played
	get_head('The Grab Bag');
	lln('  `2Feeling lucky, you decide to take a chance to score');
	sln('  some free stuff.  It\'s a long journey and you are rather');
	lln('  tired when you finally arrive at `$The Grab Bag.');
	sln('');
	lln('  `2(`0C`2)limb the ladder');
	lln('  `2(`0S`2)earch the forest instead');
	//lln('  `2(`0T`2)odo - Feature Plans');
	lln('  `2(`0H`2)ead back to town');
	sln('');
	lw('  `2You decide to... [`0C`2] :`%');
	ch = getkey().toUpperCase();
	if ('HCS'.indexOf(ch) == -1) {
		ch = 'C';
	}
	sln(ch);
	sln('');
	if (ch === 'H') {
		lln('  `2You decide maybe you should earn your rewards the Warrior\'s Way');
		sln('  and head home.');
		sln('');
		more_nomail();
		player.forest_fights += 1; // why punish them for not playing?
		good_bye('boring');
	}
	if (ch === 'C') {
		climb();
		good_bye();
	}
	if (ch == 'S') {
		search();
		good_bye();
	}
	
	if (ch == "T") {
		whats_this();
	}
}	
}

sln('');
get_head('`$The Grab Bag - `8An IGM for `4L`%egend `4O`%f the `4R`%ed `4D`%ragon\r\n  `$Version 5.00 JS `0by mortifis');
sln2('');
lln('    `0Credits to: `$Seth Able Robinson for creating LORD!');
lln('    `0Stephen Hurd - Deuce - `$For porting LORD to JS');
lln('    `0Rob Swindell - Digital Man - `$For Authoring SBBS');
lln('    `0echicken `$For helping me learn JS');
sln('');
lln('`6');
say_slow2('  I put these credits in here because Seth Able said ');
lln('`%');
say_slow2('  "Credit me in your IGM or I will, uh ... send someone');
sln('');
say_slow2('   to break your thumbs!"');
sln2('');

more_nomail();

if(argv == 'w') wake_up();  // sleeping at either seth's or jennie's
if(argv == 'v') wake_up_at_veldores();

if (argc == 1 && argv[0] == 'INSTALL') {
	var install = {
		desc:'`$T`0he `$G`0rab `$B`0ag`2',
	}
	exit(0);
}
else {
	main();
	exit(0); // most routines end with good_bye();
}
