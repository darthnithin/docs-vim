# docs-vim
Firefox extention that enables VIM-like keybinds and modes in google docs.

## Overview
This simulates very limited versions of vim's insert and normal modes on Google
Docs.

Currently supported features:
* Insert mode:
    * Typing
    * Escaping to normal with Esc
    * Escaping to normal with a two-key combination
* Normal mode
    * Getting to insert mode with the "i" key
    * Moving with the home-row keys
    * Repeated motions using the number keys
    * Delete a single character with the "x" key
    * Enter visual mode with the "v" key
* Visual mode
    * Getting to normal mode with Esc
    * Moving with the home-row keys
    * Repeated motions using the number keys
    * Delete selected text with the "x" key
* Chrome (tested on 63.0)
* (Not really) Firefox
    * It will install, but many of the features work incorrectly.

## How?
Glad you asked - this project is built with the [docs-plus
library](https://github.com/matthewsot/docs-plus), which enables rich
interactions with the Google Docs editor. Improvements made to the library here
(particularly those in the ``docs-plus-plus.js`` file) will probably eventually
be pushed back up to the main docs-plus library.

## Keys
Currently set up to work with my DVORAK layout, these are the default keybindings:

* Insert Mode:
    * Esc: enter normal mode
    * hn: enter normal mode (dvorak)
    * jk: enter normal mode (qwerty)
* Normal Mode:
    * i: enter insert mode
    * I: enter insert mode from home
    * a: enter insert mode
    * A: enter insert mode from end
    * o: enter new line with insert mode
    * O: enter new line with insert mode
    * dhtn: move (dvorak)
    * hjkl: move (qwerty)

Note that most of these can be changed in ``docs-vim.js``. For example, if you
want to use the more common QWERTY keybindings, you'd change to:

```
vim = {
    ...
    "keys": {
        "move": "hjkl",
        "escapeSeq": "jk",
    }
};
```

Near the top of ``docs-vim.js``.

## Cloning Instructions
This repository uses ``git submodule``, after cloning it you should run ``git
submodule init`` and ``git submodule update``. Also uses web-ext so install that with npm.
