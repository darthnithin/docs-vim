//@ts-check
vim = {
	mode: 'insert', // Keep track of current mode
	num: '', // Keep track of number keys pressed by the user
	currentSequence: '', // Keep track of key sequences
	keys: {
		move: 'hjkl', // QWERTY: hjkl
		escapeSequence: 'jk', // QWERTY: jk or jl
	},
};

vim.addKeyMappings = function (baseMap) {
	baseMap[vim.keys.move[0]] = 'ArrowLeft';
	baseMap[vim.keys.move[1]] = 'ArrowDown';
	baseMap[vim.keys.move[2]] = 'ArrowUp';
	baseMap[vim.keys.move[3]] = 'ArrowRight';
};

vim.switchToNormalMode = function () {
	vim.currentSequence = '';
	vim.mode = 'normal';
	vim.num = '';
	docs.setCursorWidth('7px');
};

vim.switchToVisualMode = function () {
	vim.currentSequence = '';
	vim.mode = 'visual';
	vim.num = '';
	docs.setCursorWidth('7px');
};

vim.switchToInsertMode = function () {
	vim.currentSequence = '';
	vim.mode = 'insert';
	vim.num = '';
	docs.setCursorWidth('2px');
};

vim.moveTo = function (type) {
	const selectedType = type.toUpperCase();
	switch (selectedType) {
		case 'END':
			docs.pressKey(35, false, false);
			break;
		case 'HOME':
			docs.pressKey(36, false, false);
			break;
		case 'LEFT':
			docs.pressKey(37, false, false);
			break;
		case 'UP':
			docs.pressKey(38, false, false);
			break;
		case 'RIGHT':
			docs.pressKey(39, false, false);
			break;
		case 'DOWN':
			docs.pressKey(40, false, false);
			break;
		default:
			break;
	}
};

vim.enterNewLine = function () {
	docs.pressKey(13, false, false);
};

// Called in normal mode.
vim.normal_keydown = function (e) {
	if (e.key.match(/F\d+/)) {
		// Pass through any function keys.
		return true;
	}

	e.preventDefault();
	e.stopPropagation();

	if (e.key == 'i') {
		vim.switchToInsertMode();
		return true;
	}

	if (e.key == 'I') {
		vim.switchToInsertMode();
		vim.moveTo('Home');
		return true;
	}

	if (e.key == 'a') {
		vim.moveTo('Right');
		vim.switchToInsertMode();
		return true;
	}

	if (e.key == 'A') {
		vim.switchToInsertMode();
		vim.moveTo('End');
		return true;
	}

	if (e.key == 'o') {
		vim.switchToInsertMode();
		vim.moveTo('end');
		vim.enterNewLine();
		return true;
	}

	if (e.key == 'O') {
		vim.switchToInsertMode();
		vim.moveTo('up');
		vim.moveTo('end');
		vim.enterNewLine();
		return true;
	}

	if (e.key == '$') {
		vim.moveTo('End');
		return true;
	}

	if (e.key == '0' || e.key =='^') {
		vim.moveTo('Home');
		return true;
	}

	if (e.key == 'v') {
		vim.switchToVisualMode();
		return true;
	}

	var keyMap = { Backspace: 'ArrowLeft', x: 'Delete' };
	vim.addKeyMappings(keyMap);

	if (e.key.match(/\d+/)) {
		vim.num += e.key.toString();
	}

	if (e.key in keyMap) {
		e.key = keyMap[e.key];
	}

	if (e.key.indexOf('Arrow') == 0 || e.key == 'Delete') {
		if (vim.num.length == 0 || isNaN(vim.num)) {
			vim.num = '1';
		}
		for (var i = 0; i < Number(vim.num); i++) {
			docs.pressKey(docs.codeFromKey(e.key));
		}
		vim.num = '';
	}

	return false;
};

// Called in visual mode.
vim.visual_keydown = function (e) {
	if (e.key.match(/F\d+/)) {
		// Pass through any function keys.
		return true;
	}

	if (e.key == 'Escape') {
		// Escape visual mode.
		vim.switchToNormalMode();
	}

	vim.currentSequence += e.key;
	if (vim.currentSequence == vim.keys.escapeSequence) {
		e.preventDefault();
		e.stopPropagation();

		vim.switchToNormalMode();
		return false;
	}
	if (vim.keys.escapeSequence.indexOf(vim.currentSequence) != 0) {
		vim.currentSequence = e.key;
	}

	e.preventDefault();
	e.stopPropagation();

	var keyMap = { Backspace: 'ArrowLeft', x: 'Delete' };
	vim.addKeyMappings(keyMap);

	if (e.key.match(/\d+/)) {
		vim.num += e.key.toString();
	}

	if (e.key in keyMap) {
		e.key = keyMap[e.key];
	}

	if (e.key.indexOf('Arrow') == 0 || e.key == 'Delete') {
		if (vim.num.length == 0 || isNaN(vim.num)) {
			vim.num = '1';
		}
		for (var i = 0; i < Number(vim.num); i++) {
			if (e.key.indexOf('Arrow') == 0) {
				docs.pressKey(docs.codeFromKey(e.key), false, true);
			} else {
				docs.pressKey(docs.codeFromKey(e.key));
				// Switch to normal mode when 'x' pressed
				vim.switchToNormalMode();
			}
		}
		vim.num = '';
	}

	return false;
};

// Called in insert mode.
vim.insert_keydown = function (e) {
	if (e.key == 'Escape') {
		vim.switchToNormalMode();
	}

	vim.currentSequence += e.key;
	if (vim.currentSequence == vim.keys.escapeSequence) {
		e.preventDefault();
		e.stopPropagation();

		// We need to delete the first character already typed in the escape
		// sequence.
		for (var i = 0; i < vim.currentSequence.length - 1; i++) {
			docs.backspace();
		}

		vim.switchToNormalMode();
		return false;
	}
	if (vim.keys.escapeSequence.indexOf(vim.currentSequence) != 0) {
		vim.currentSequence = e.key;
	}
};

docs.keydown = function (e) {
	// pass thru meta key combination
	if (e.key == 'Meta' || e.metaKey) {
		return true;
	}
	if (vim.mode == 'insert') {
		return vim.insert_keydown(e);
	}
	if (vim.mode == 'normal') {
		return vim.normal_keydown(e);
	}
	if (vim.mode == 'visual') {
		return vim.visual_keydown(e);
	}
};
