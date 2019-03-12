var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function assignTrue(tar, src) {
		for (var k in src) tar[k] = 1;
		return tar;
	}

	function callAfter(fn, i) {
		if (i === 0) fn();
		return () => {
			if (!--i) fn();
		};
	}

	function addLoc(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		fn();
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createSvgElement(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function selectOption(select, value) {
		for (var i = 0; i < select.options.length; i += 1) {
			var option = select.options[i];

			if (option.__value === value) {
				option.selected = true;
				return;
			}
		}
	}

	function selectValue(select) {
		var selectedOption = select.querySelector(':checked') || select.options[0];
		return selectedOption && selectedOption.__value;
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function destroyDev(detach) {
		destroy.call(this, detach);
		this.destroy = function() {
			console.warn('Component was already destroyed');
		};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function setDev(newState) {
		if (typeof newState !== 'object') {
			throw new Error(
				this._debugName + '.set was called without an object of data key-values to update.'
			);
		}

		this._checkReadOnly(newState);
		set.call(this, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var protoDev = {
		destroy: destroyDev,
		get,
		fire,
		on,
		set: setDev,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	/* src/pages/ch-000-000-loading.html generated by Svelte v2.16.1 */

	const file = "src/pages/ch-000-000-loading.html";

	function create_main_fragment(component, ctx) {
		var h1, current;

		return {
			c: function create() {
				h1 = createElement("h1");
				h1.textContent = "Loading...";
				addLoc(h1, file, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy(detach) {
				if (detach) {
					detachNode(h1);
				}
			}
		};
	}

	function Ch_000_000_loading(options) {
		this._debugName = '<Ch_000_000_loading>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Ch_000_000_loading.prototype, protoDev);

	Ch_000_000_loading.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var dictionary = {
	  words: [
	    'ad',
	    'adipisicing',
	    'aliqua',
	    'aliquip',
	    'amet',
	    'anim',
	    'aute',
	    'cillum',
	    'commodo',
	    'consectetur',
	    'consequat',
	    'culpa',
	    'cupidatat',
	    'deserunt',
	    'do',
	    'dolor',
	    'dolore',
	    'duis',
	    'ea',
	    'eiusmod',
	    'elit',
	    'enim',
	    'esse',
	    'est',
	    'et',
	    'eu',
	    'ex',
	    'excepteur',
	    'exercitation',
	    'fugiat',
	    'id',
	    'in',
	    'incididunt',
	    'ipsum',
	    'irure',
	    'labore',
	    'laboris',
	    'laborum',
	    'Lorem',
	    'magna',
	    'minim',
	    'mollit',
	    'nisi',
	    'non',
	    'nostrud',
	    'nulla',
	    'occaecat',
	    'officia',
	    'pariatur',
	    'proident',
	    'qui',
	    'quis',
	    'reprehenderit',
	    'sint',
	    'sit',
	    'sunt',
	    'tempor',
	    'ullamco',
	    'ut',
	    'velit',
	    'veniam',
	    'voluptate'
	  ]
	};

	var dictionary_1 = dictionary;

	var generator_1 = createCommonjsModule(function (module) {
	function generator() {
	  var options = (arguments.length) ? arguments[0] : {}
	    , count = options.count || 1
	    , units = options.units || 'sentences'
	    , sentenceLowerBound = options.sentenceLowerBound || 5
	    , sentenceUpperBound = options.sentenceUpperBound || 15
	    , paragraphLowerBound = options.paragraphLowerBound || 3
	    , paragraphUpperBound = options.paragraphUpperBound || 7
	    , format = options.format || 'plain'
	    , words = options.words || dictionary_1.words
	    , random = options.random || Math.random
	    , suffix = options.suffix;

	  if (!suffix) {
	    var isNode = module.exports;
	    var isReactNative = typeof product !== 'undefined' && product.navigator === 'ReactNative';
	    var isWindows = typeof process !== 'undefined' && 'win32' === process.platform;

	    if (!isReactNative && isNode && isWindows) {
	      suffix = '\r\n';
	    } else {
	      suffix = '\n';
	    }
	  }

	  units = simplePluralize(units.toLowerCase());

	  function randomInteger(min, max) {
	    return Math.floor(random() * (max - min + 1) + min);
	  }
	  function randomWord(words) {
	    return words[randomInteger(0, words.length - 1)];
	  }
	  function randomSentence(words, lowerBound, upperBound) {
	    var sentence = ''
	      , bounds = {min: 0, max: randomInteger(lowerBound, upperBound)};

	    while (bounds.min < bounds.max) {
	      sentence += ' ' + randomWord(words);
	      bounds.min++;
	    }

	    if (sentence.length) {
	      sentence = sentence.slice(1);
	      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
	    }

	    return sentence;
	  }
	  function randomParagraph(words, lowerBound, upperBound, sentenceLowerBound, sentenceUpperBound) {
	    var paragraph = ''
	      , bounds = {min: 0, max: randomInteger(lowerBound, upperBound)};

	    while (bounds.min < bounds.max) {
	      paragraph += '. ' + randomSentence(words, sentenceLowerBound, sentenceUpperBound);
	      bounds.min++;
	    }

	    if (paragraph.length) {
	      paragraph = paragraph.slice(2);
	      paragraph += '.';
	    }

	    return paragraph;
	  }

	  var bounds = {min: 0, max: count}
	    , string = ''
	    , openingTag
	    , closingTag;

	  if (format === 'html') {
	    openingTag = '<p>';
	    closingTag = '</p>';
	  }

	  while (bounds.min < bounds.max) {
	    switch (units.toLowerCase()) {
	      case 'words':
	        string += ' ' + randomWord(words);
	        break;
	      case 'sentences':
	        string += '. ' + randomSentence(words, sentenceLowerBound, sentenceUpperBound);
	        break;
	      case 'paragraphs':
	        var nextString = randomParagraph(words, paragraphLowerBound, paragraphUpperBound, sentenceLowerBound, sentenceUpperBound);

	        if (format === 'html') {
	          nextString = openingTag + nextString + closingTag;
	          if (bounds.min < bounds.max - 1) {
	            nextString += suffix; // Each paragraph on a new line
	          }
	        } else if (bounds.min < bounds.max - 1) {
	          nextString += suffix + suffix; // Double-up the EOL character to make distinct paragraphs, like carriage return
	        }

	        string += nextString;

	        break;
	    }

	    bounds.min++;
	  }

	  if (string.length) {
	    var pos = 0;

	    if (string.indexOf('. ') === 0) {
	      pos = 2;
	    } else if (string.indexOf('.') === 0 || string.indexOf(' ') === 0) {
	      pos = 1;
	    }

	    string = string.slice(pos);

	    if (units === 'sentences') {
	      string += '.';
	    }
	  }

	  return string;
	}
	function simplePluralize(string) {
	  if (string.indexOf('s', string.length - 1) === -1) {
	    return string + 's';
	  }
	  return string;
	}

	module.exports = generator;
	});

	/* src/components/lipsum.html generated by Svelte v2.16.1 */

	function data() {
		return {
			paragraphs: [
				generator_1({ units: 'paragraph' })
			]
		};
	}
	const file$1 = "src/components/lipsum.html";

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.par = list[i];
		return child_ctx;
	}

	function create_main_fragment$1(component, ctx) {
		var each_anchor, current;

		var each_value = ctx.paragraphs;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.paragraphs) {
					each_value = ctx.paragraphs;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_anchor.parentNode, each_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy(detach) {
				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(each_anchor);
				}
			}
		};
	}

	// (1:0) {#each paragraphs as par}
	function create_each_block(component, ctx) {
		var p, text_value = ctx.par, text;

		return {
			c: function create() {
				p = createElement("p");
				text = createText(text_value);
				addLoc(p, file$1, 1, 0, 26);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, text);
			},

			p: function update(changed, ctx) {
				if ((changed.paragraphs) && text_value !== (text_value = ctx.par)) {
					setData(text, text_value);
				}
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	function Lipsum(options) {
		this._debugName = '<Lipsum>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign(data(), options.data);
		if (!('paragraphs' in this._state)) console.warn("<Lipsum> was created without expected data property 'paragraphs'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Lipsum.prototype, protoDev);

	Lipsum.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-000-001-title.html generated by Svelte v2.16.1 */



	const file$2 = "src/pages/ch-000-001-title.html";

	function create_main_fragment$2(component, ctx) {
		var div1, h1, text1, div0, text2, text3, current;

		var lipsum0 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum1 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum2 = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div1 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Our Ghana longform story";
				text1 = createText("\n  ");
				div0 = createElement("div");
				lipsum0._fragment.c();
				text2 = createText("\n    ");
				lipsum1._fragment.c();
				text3 = createText("\n    ");
				lipsum2._fragment.c();
				addLoc(h1, file$2, 1, 2, 21);
				div0.className = "textbody";
				addLoc(div0, file$2, 2, 2, 57);
				div1.className = "page svelte-6ukgze";
				addLoc(div1, file$2, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, h1);
				append(div1, text1);
				append(div1, div0);
				lipsum0._mount(div0, null);
				append(div0, text2);
				lipsum1._mount(div0, null);
				append(div0, text3);
				lipsum2._mount(div0, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 3);

				if (lipsum0) lipsum0._fragment.o(outrocallback);
				if (lipsum1) lipsum1._fragment.o(outrocallback);
				if (lipsum2) lipsum2._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div1);
				}

				lipsum0.destroy();
				lipsum1.destroy();
				lipsum2.destroy();
			}
		};
	}

	function Ch_000_001_title(options) {
		this._debugName = '<Ch_000_001_title>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$2(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_000_001_title.prototype, protoDev);

	Ch_000_001_title.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-001-title.html generated by Svelte v2.16.1 */



	const file$3 = "src/pages/ch-001-001-title.html";

	function create_main_fragment$3(component, ctx) {
		var div1, h1, text_1, div0, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div1 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "A data driven revolution";
				text_1 = createText("\n  ");
				div0 = createElement("div");
				lipsum._fragment.c();
				addLoc(h1, file$3, 1, 2, 21);
				div0.className = "textbody";
				addLoc(div0, file$3, 2, 2, 58);
				div1.className = "page";
				addLoc(div1, file$3, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, h1);
				append(div1, text_1);
				append(div1, div0);
				lipsum._mount(div0, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div1);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_001_001_title(options) {
		this._debugName = '<Ch_001_001_title>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$3(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_001_title.prototype, protoDev);

	Ch_001_001_title.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-002-introduction.html generated by Svelte v2.16.1 */



	const file$4 = "src/pages/ch-001-002-introduction.html";

	function create_main_fragment$4(component, ctx) {
		var div1, h1, text1, div0, text2, text3, current;

		var lipsum0 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum1 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum2 = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div1 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text1 = createText("\n  ");
				div0 = createElement("div");
				lipsum0._fragment.c();
				text2 = createText("\n    ");
				lipsum1._fragment.c();
				text3 = createText("\n    ");
				lipsum2._fragment.c();
				addLoc(h1, file$4, 1, 2, 21);
				div0.className = "textbody";
				addLoc(div0, file$4, 2, 2, 45);
				div1.className = "page";
				addLoc(div1, file$4, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, h1);
				append(div1, text1);
				append(div1, div0);
				lipsum0._mount(div0, null);
				append(div0, text2);
				lipsum1._mount(div0, null);
				append(div0, text3);
				lipsum2._mount(div0, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 3);

				if (lipsum0) lipsum0._fragment.o(outrocallback);
				if (lipsum1) lipsum1._fragment.o(outrocallback);
				if (lipsum2) lipsum2._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div1);
				}

				lipsum0.destroy();
				lipsum1.destroy();
				lipsum2.destroy();
			}
		};
	}

	function Ch_001_002_introduction(options) {
		this._debugName = '<Ch_001_002_introduction>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$4(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_002_introduction.prototype, protoDev);

	Ch_001_002_introduction.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector(compare) {
	  if (compare.length === 1) compare = ascendingComparator(compare);
	  return {
	    left: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) < 0) lo = mid + 1;
	        else hi = mid;
	      }
	      return lo;
	    },
	    right: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) > 0) hi = mid;
	        else lo = mid + 1;
	      }
	      return lo;
	    }
	  };
	}

	function ascendingComparator(f) {
	  return function(d, x) {
	    return ascending(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending);
	var bisectRight = ascendingBisect.right;

	var e10 = Math.sqrt(50),
	    e5 = Math.sqrt(10),
	    e2 = Math.sqrt(2);

	function ticks(start, stop, count) {
	  var reverse,
	      i = -1,
	      n,
	      ticks,
	      step;

	  stop = +stop, start = +start, count = +count;
	  if (start === stop && count > 0) return [start];
	  if (reverse = stop < start) n = start, start = stop, stop = n;
	  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

	  if (step > 0) {
	    start = Math.ceil(start / step);
	    stop = Math.floor(stop / step);
	    ticks = new Array(n = Math.ceil(stop - start + 1));
	    while (++i < n) ticks[i] = (start + i) * step;
	  } else {
	    start = Math.floor(start * step);
	    stop = Math.ceil(stop * step);
	    ticks = new Array(n = Math.ceil(start - stop + 1));
	    while (++i < n) ticks[i] = (start - i) / step;
	  }

	  if (reverse) ticks.reverse();

	  return ticks;
	}

	function tickIncrement(start, stop, count) {
	  var step = (stop - start) / Math.max(0, count),
	      power = Math.floor(Math.log(step) / Math.LN10),
	      error = step / Math.pow(10, power);
	  return power >= 0
	      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
	      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
	}

	function tickStep(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10) step1 *= 10;
	  else if (error >= e5) step1 *= 5;
	  else if (error >= e2) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	function initRange(domain, range) {
	  switch (arguments.length) {
	    case 0: break;
	    case 1: this.range(domain); break;
	    default: this.range(range).domain(domain); break;
	  }
	  return this;
	}

	var prefix = "$";

	function Map() {}

	Map.prototype = map.prototype = {
	  constructor: Map,
	  has: function(key) {
	    return (prefix + key) in this;
	  },
	  get: function(key) {
	    return this[prefix + key];
	  },
	  set: function(key, value) {
	    this[prefix + key] = value;
	    return this;
	  },
	  remove: function(key) {
	    var property = prefix + key;
	    return property in this && delete this[property];
	  },
	  clear: function() {
	    for (var property in this) if (property[0] === prefix) delete this[property];
	  },
	  keys: function() {
	    var keys = [];
	    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
	    return keys;
	  },
	  values: function() {
	    var values = [];
	    for (var property in this) if (property[0] === prefix) values.push(this[property]);
	    return values;
	  },
	  entries: function() {
	    var entries = [];
	    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
	    return entries;
	  },
	  size: function() {
	    var size = 0;
	    for (var property in this) if (property[0] === prefix) ++size;
	    return size;
	  },
	  empty: function() {
	    for (var property in this) if (property[0] === prefix) return false;
	    return true;
	  },
	  each: function(f) {
	    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
	  }
	};

	function map(object, f) {
	  var map = new Map;

	  // Copy constructor.
	  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

	  // Index array by numeric index or specified key function.
	  else if (Array.isArray(object)) {
	    var i = -1,
	        n = object.length,
	        o;

	    if (f == null) while (++i < n) map.set(i, object[i]);
	    else while (++i < n) map.set(f(o = object[i], i, object), o);
	  }

	  // Convert object to map.
	  else if (object) for (var key in object) map.set(key, object[key]);

	  return map;
	}

	function Set() {}

	var proto = map.prototype;

	Set.prototype = set$1.prototype = {
	  constructor: Set,
	  has: proto.has,
	  add: function(value) {
	    value += "";
	    this[prefix + value] = value;
	    return this;
	  },
	  remove: proto.remove,
	  clear: proto.clear,
	  values: proto.keys,
	  size: proto.size,
	  empty: proto.empty,
	  each: proto.each
	};

	function set$1(object, f) {
	  var set = new Set;

	  // Copy constructor.
	  if (object instanceof Set) object.each(function(value) { set.add(value); });

	  // Otherwise, assume it’s an array.
	  else if (object) {
	    var i = -1, n = object.length;
	    if (f == null) while (++i < n) set.add(object[i]);
	    else while (++i < n) set.add(f(object[i], i, object));
	  }

	  return set;
	}

	var array = Array.prototype;

	var map$1 = array.map;
	var slice = array.slice;

	function define(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color() {}

	var darker = 0.7;
	var brighter = 1 / darker;

	var reI = "\\s*([+-]?\\d+)\\s*",
	    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
	    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
	    reHex3 = /^#([0-9a-f]{3})$/,
	    reHex6 = /^#([0-9a-f]{6})$/,
	    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
	    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
	    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
	    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
	    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
	    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define(Color, color, {
	  displayable: function() {
	    return this.rgb().displayable();
	  },
	  hex: function() {
	    return this.rgb().hex();
	  },
	  toString: function() {
	    return this.rgb() + "";
	  }
	});

	function color(format) {
	  var m;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
	      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named.hasOwnProperty(format) ? rgbn(named[format])
	      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb;
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function rgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Rgb, rgb, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function() {
	    return this;
	  },
	  displayable: function() {
	    return (0 <= this.r && this.r <= 255)
	        && (0 <= this.g && this.g <= 255)
	        && (0 <= this.b && this.b <= 255)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  hex: function() {
	    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
	  },
	  toString: function() {
	    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "rgb(" : "rgba(")
	        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	        + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	function hex(value) {
	  value = Math.max(0, Math.min(255, Math.round(value) || 0));
	  return (value < 16 ? "0" : "") + value.toString(16);
	}

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl;
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function hsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hsl, hsl, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(
	      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb(h, m1, m2),
	      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  displayable: function() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	var deg2rad = Math.PI / 180;
	var rad2deg = 180 / Math.PI;

	// https://beta.observablehq.com/@mbostock/lab-and-rgb
	var K = 18,
	    Xn = 0.96422,
	    Yn = 1,
	    Zn = 0.82521,
	    t0 = 4 / 29,
	    t1 = 6 / 29,
	    t2 = 3 * t1 * t1,
	    t3 = t1 * t1 * t1;

	function labConvert(o) {
	  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
	  if (o instanceof Hcl) {
	    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
	    var h = o.h * deg2rad;
	    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = rgb2lrgb(o.r),
	      g = rgb2lrgb(o.g),
	      b = rgb2lrgb(o.b),
	      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
	  if (r === g && g === b) x = z = y; else {
	    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
	    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
	  }
	  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	}

	function lab(l, a, b, opacity) {
	  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
	}

	function Lab(l, a, b, opacity) {
	  this.l = +l;
	  this.a = +a;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Lab, lab, extend(Color, {
	  brighter: function(k) {
	    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  darker: function(k) {
	    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  rgb: function() {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    x = Xn * lab2xyz(x);
	    y = Yn * lab2xyz(y);
	    z = Zn * lab2xyz(z);
	    return new Rgb(
	      lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
	      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
	      lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
	      this.opacity
	    );
	  }
	}));

	function xyz2lab(t) {
	  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	}

	function lab2xyz(t) {
	  return t > t1 ? t * t * t : t2 * (t - t0);
	}

	function lrgb2rgb(x) {
	  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	}

	function rgb2lrgb(x) {
	  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	}

	function hclConvert(o) {
	  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
	  if (!(o instanceof Lab)) o = labConvert(o);
	  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
	  var h = Math.atan2(o.b, o.a) * rad2deg;
	  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	}

	function hcl(h, c, l, opacity) {
	  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
	}

	function Hcl(h, c, l, opacity) {
	  this.h = +h;
	  this.c = +c;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hcl, hcl, extend(Color, {
	  brighter: function(k) {
	    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function(k) {
	    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function() {
	    return labConvert(this).rgb();
	  }
	}));

	var A = -0.14861,
	    B = +1.78277,
	    C = -0.29227,
	    D = -0.90649,
	    E = +1.97294,
	    ED = E * D,
	    EB = E * B,
	    BC_DA = B * C - D * A;

	function cubehelixConvert(o) {
	  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	      bl = b - l,
	      k = (E * (g - l) - C * bl) / D,
	      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
	      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	}

	function Cubehelix(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Cubehelix, cubehelix, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(
	      255 * (l + a * (A * cosh + B * sinh)),
	      255 * (l + a * (C * cosh + D * sinh)),
	      255 * (l + a * (E * cosh)),
	      this.opacity
	    );
	  }
	}));

	function constant(x) {
	  return function() {
	    return x;
	  };
	}

	function linear(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
	}

	var rgb$1 = (function rgbGamma(y) {
	  var color = gamma(y);

	  function rgb$1(start, end) {
	    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb$1.gamma = rgbGamma;

	  return rgb$1;
	})(1);

	function array$1(a, b) {
	  var nb = b ? b.length : 0,
	      na = a ? Math.min(nb, a.length) : 0,
	      x = new Array(na),
	      c = new Array(nb),
	      i;

	  for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
	  for (; i < nb; ++i) c[i] = b[i];

	  return function(t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);
	    return c;
	  };
	}

	function date(a, b) {
	  var d = new Date;
	  return a = +a, b -= a, function(t) {
	    return d.setTime(a + b * t), d;
	  };
	}

	function number(a, b) {
	  return a = +a, b -= a, function(t) {
	    return a + b * t;
	  };
	}

	function object(a, b) {
	  var i = {},
	      c = {},
	      k;

	  if (a === null || typeof a !== "object") a = {};
	  if (b === null || typeof b !== "object") b = {};

	  for (k in b) {
	    if (k in a) {
	      i[k] = value(a[k], b[k]);
	    } else {
	      c[k] = b[k];
	    }
	  }

	  return function(t) {
	    for (k in i) c[k] = i[k](t);
	    return c;
	  };
	}

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
	    reB = new RegExp(reA.source, "g");

	function zero(b) {
	  return function() {
	    return b;
	  };
	}

	function one(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	function string(a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA.exec(a))
	      && (bm = reB.exec(b))) {
	    if ((bs = bm.index) > bi) { // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }
	    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else { // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({i: i, x: number(am, bm)});
	    }
	    bi = reB.lastIndex;
	  }

	  // Add remains of b.
	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  }

	  // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.
	  return s.length < 2 ? (q[0]
	      ? one(q[0].x)
	      : zero(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	}

	function value(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant(b)
	      : (t === "number" ? number
	      : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
	      : b instanceof color ? rgb$1
	      : b instanceof Date ? date
	      : Array.isArray(b) ? array$1
	      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
	      : number)(a, b);
	}

	function interpolateRound(a, b) {
	  return a = +a, b -= a, function(t) {
	    return Math.round(a + b * t);
	  };
	}

	var degrees = 180 / Math.PI;

	var rho = Math.SQRT2;

	function constant$1(x) {
	  return function() {
	    return x;
	  };
	}

	function number$1(x) {
	  return +x;
	}

	var unit = [0, 1];

	function identity(x) {
	  return x;
	}

	function normalize(a, b) {
	  return (b -= (a = +a))
	      ? function(x) { return (x - a) / b; }
	      : constant$1(isNaN(b) ? NaN : 0.5);
	}

	function clamper(domain) {
	  var a = domain[0], b = domain[domain.length - 1], t;
	  if (a > b) t = a, a = b, b = t;
	  return function(x) { return Math.max(a, Math.min(b, x)); };
	}

	// normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
	// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
	function bimap(domain, range, interpolate) {
	  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
	  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
	  else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
	  return function(x) { return r0(d0(x)); };
	}

	function polymap(domain, range, interpolate) {
	  var j = Math.min(domain.length, range.length) - 1,
	      d = new Array(j),
	      r = new Array(j),
	      i = -1;

	  // Reverse descending domains.
	  if (domain[j] < domain[0]) {
	    domain = domain.slice().reverse();
	    range = range.slice().reverse();
	  }

	  while (++i < j) {
	    d[i] = normalize(domain[i], domain[i + 1]);
	    r[i] = interpolate(range[i], range[i + 1]);
	  }

	  return function(x) {
	    var i = bisectRight(domain, x, 1, j) - 1;
	    return r[i](d[i](x));
	  };
	}

	function copy(source, target) {
	  return target
	      .domain(source.domain())
	      .range(source.range())
	      .interpolate(source.interpolate())
	      .clamp(source.clamp())
	      .unknown(source.unknown());
	}

	function transformer() {
	  var domain = unit,
	      range = unit,
	      interpolate = value,
	      transform,
	      untransform,
	      unknown,
	      clamp = identity,
	      piecewise,
	      output,
	      input;

	  function rescale() {
	    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
	    output = input = null;
	    return scale;
	  }

	  function scale(x) {
	    return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
	  }

	  scale.invert = function(y) {
	    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), number)))(y)));
	  };

	  scale.domain = function(_) {
	    return arguments.length ? (domain = map$1.call(_, number$1), clamp === identity || (clamp = clamper(domain)), rescale()) : domain.slice();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range = slice.call(_), interpolate = interpolateRound, rescale();
	  };

	  scale.clamp = function(_) {
	    return arguments.length ? (clamp = _ ? clamper(domain) : identity, scale) : clamp !== identity;
	  };

	  scale.interpolate = function(_) {
	    return arguments.length ? (interpolate = _, rescale()) : interpolate;
	  };

	  scale.unknown = function(_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  return function(t, u) {
	    transform = t, untransform = u;
	    return rescale();
	  };
	}

	function continuous(transform, untransform) {
	  return transformer()(transform, untransform);
	}

	// Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimal(1.23) returns ["123", 0].
	function formatDecimal(x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	  var i, coefficient = x.slice(0, i);

	  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	  return [
	    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	    +x.slice(i + 1)
	  ];
	}

	function exponent(x) {
	  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	}

	function formatGroup(grouping, thousands) {
	  return function(value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	}

	function formatNumerals(numerals) {
	  return function(value) {
	    return value.replace(/[0-9]/g, function(i) {
	      return numerals[+i];
	    });
	  };
	}

	// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
	var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

	function formatSpecifier(specifier) {
	  return new FormatSpecifier(specifier);
	}

	formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

	function FormatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
	  var match;
	  this.fill = match[1] || " ";
	  this.align = match[2] || ">";
	  this.sign = match[3] || "-";
	  this.symbol = match[4] || "";
	  this.zero = !!match[5];
	  this.width = match[6] && +match[6];
	  this.comma = !!match[7];
	  this.precision = match[8] && +match[8].slice(1);
	  this.trim = !!match[9];
	  this.type = match[10] || "";
	}

	FormatSpecifier.prototype.toString = function() {
	  return this.fill
	      + this.align
	      + this.sign
	      + this.symbol
	      + (this.zero ? "0" : "")
	      + (this.width == null ? "" : Math.max(1, this.width | 0))
	      + (this.comma ? "," : "")
	      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	      + (this.trim ? "~" : "")
	      + this.type;
	};

	// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
	function formatTrim(s) {
	  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (s[i]) {
	      case ".": i0 = i1 = i; break;
	      case "0": if (i0 === 0) i0 = i; i1 = i; break;
	      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
	    }
	  }
	  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
	}

	var prefixExponent;

	function formatPrefixAuto(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1],
	      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	      n = coefficient.length;
	  return i === n ? coefficient
	      : i > n ? coefficient + new Array(i - n + 1).join("0")
	      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	}

	function formatRounded(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1];
	  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	}

	var formatTypes = {
	  "%": function(x, p) { return (x * 100).toFixed(p); },
	  "b": function(x) { return Math.round(x).toString(2); },
	  "c": function(x) { return x + ""; },
	  "d": function(x) { return Math.round(x).toString(10); },
	  "e": function(x, p) { return x.toExponential(p); },
	  "f": function(x, p) { return x.toFixed(p); },
	  "g": function(x, p) { return x.toPrecision(p); },
	  "o": function(x) { return Math.round(x).toString(8); },
	  "p": function(x, p) { return formatRounded(x * 100, p); },
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	  "x": function(x) { return Math.round(x).toString(16); }
	};

	function identity$1(x) {
	  return x;
	}

	var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

	function formatLocale(locale) {
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$1,
	      currency = locale.currency,
	      decimal = locale.decimal,
	      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$1,
	      percent = locale.percent || "%";

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);

	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        trim = specifier.trim,
	        type = specifier.type;

	    // The "n" type is an alias for ",g".
	    if (type === "n") comma = true, type = "g";

	    // The "" type, and any invalid type, is an alias for ".12~g".
	    else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

	    // If zero fill is specified, padding goes after sign and before digits.
	    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

	    // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.
	    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

	    // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?
	    var formatType = formatTypes[type],
	        maybeSuffix = /[defgprs%]/.test(type);

	    // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].
	    precision = precision == null ? 6
	        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	        : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i, n, c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value;

	        // Perform the initial formatting.
	        var valueNegative = value < 0;
	        value = formatType(Math.abs(value), precision);

	        // Trim insignificant zeros.
	        if (trim) value = formatTrim(value);

	        // If a negative value rounds to zero during formatting, treat as positive.
	        if (valueNegative && +value === 0) valueNegative = false;

	        // Compute the prefix and suffix.
	        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

	        // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.
	        if (maybeSuffix) {
	          i = -1, n = value.length;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      }

	      // If the fill character is not "0", grouping is applied before padding.
	      if (comma && !zero) value = group(value, Infinity);

	      // Compute the padding.
	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : "";

	      // If the fill character is "0", grouping is applied after padding.
	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	      // Reconstruct the final output based on the desired alignment.
	      switch (align) {
	        case "<": value = valuePrefix + value + valueSuffix + padding; break;
	        case "=": value = valuePrefix + padding + value + valueSuffix; break;
	        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
	        default: value = padding + valuePrefix + value + valueSuffix; break;
	      }

	      return numerals(value);
	    }

	    format.toString = function() {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function(value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	}

	var locale;
	var format;
	var formatPrefix;

	defaultLocale({
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});

	function defaultLocale(definition) {
	  locale = formatLocale(definition);
	  format = locale.format;
	  formatPrefix = locale.formatPrefix;
	  return locale;
	}

	function precisionFixed(step) {
	  return Math.max(0, -exponent(Math.abs(step)));
	}

	function precisionPrefix(step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	}

	function precisionRound(step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent(max) - exponent(step)) + 1;
	}

	function tickFormat(start, stop, count, specifier) {
	  var step = tickStep(start, stop, count),
	      precision;
	  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
	  switch (specifier.type) {
	    case "s": {
	      var value = Math.max(Math.abs(start), Math.abs(stop));
	      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
	      return formatPrefix(specifier, value);
	    }
	    case "":
	    case "e":
	    case "g":
	    case "p":
	    case "r": {
	      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	      break;
	    }
	    case "f":
	    case "%": {
	      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	      break;
	    }
	  }
	  return format(specifier);
	}

	function linearish(scale) {
	  var domain = scale.domain;

	  scale.ticks = function(count) {
	    var d = domain();
	    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	  };

	  scale.tickFormat = function(count, specifier) {
	    var d = domain();
	    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
	  };

	  scale.nice = function(count) {
	    if (count == null) count = 10;

	    var d = domain(),
	        i0 = 0,
	        i1 = d.length - 1,
	        start = d[i0],
	        stop = d[i1],
	        step;

	    if (stop < start) {
	      step = start, start = stop, stop = step;
	      step = i0, i0 = i1, i1 = step;
	    }

	    step = tickIncrement(start, stop, count);

	    if (step > 0) {
	      start = Math.floor(start / step) * step;
	      stop = Math.ceil(stop / step) * step;
	      step = tickIncrement(start, stop, count);
	    } else if (step < 0) {
	      start = Math.ceil(start * step) / step;
	      stop = Math.floor(stop * step) / step;
	      step = tickIncrement(start, stop, count);
	    }

	    if (step > 0) {
	      d[i0] = Math.floor(start / step) * step;
	      d[i1] = Math.ceil(stop / step) * step;
	      domain(d);
	    } else if (step < 0) {
	      d[i0] = Math.ceil(start * step) / step;
	      d[i1] = Math.floor(stop * step) / step;
	      domain(d);
	    }

	    return scale;
	  };

	  return scale;
	}

	function linear$1() {
	  var scale = continuous(identity, identity);

	  scale.copy = function() {
	    return copy(scale, linear$1());
	  };

	  initRange.apply(scale, arguments);

	  return linearish(scale);
	}

	var t0$1 = new Date,
	    t1$1 = new Date;

	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = new Date(+date)), date;
	  }

	  interval.floor = interval;

	  interval.ceil = function(date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function(date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function(date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function(start, stop, step) {
	    var range = [], previous;
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
	    while (previous < start && start < stop);
	    return range;
	  };

	  interval.filter = function(test) {
	    return newInterval(function(date) {
	      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
	    }, function(date, step) {
	      if (date >= date) {
	        if (step < 0) while (++step <= 0) {
	          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
	        } else while (--step >= 0) {
	          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
	        }
	      }
	    });
	  };

	  if (count) {
	    interval.count = function(start, end) {
	      t0$1.setTime(+start), t1$1.setTime(+end);
	      floori(t0$1), floori(t1$1);
	      return Math.floor(count(t0$1, t1$1));
	    };

	    interval.every = function(step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null
	          : !(step > 1) ? interval
	          : interval.filter(field
	              ? function(d) { return field(d) % step === 0; }
	              : function(d) { return interval.count(0, d) % step === 0; });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function() {
	  // noop
	}, function(date, step) {
	  date.setTime(+date + step);
	}, function(start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function(k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function(date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function(date, step) {
	    date.setTime(+date + step * k);
	  }, function(start, end) {
	    return (end - start) / k;
	  });
	};
	var milliseconds = millisecond.range;

	var durationSecond = 1e3;
	var durationMinute = 6e4;
	var durationHour = 36e5;
	var durationDay = 864e5;
	var durationWeek = 6048e5;

	var second = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds());
	}, function(date, step) {
	  date.setTime(+date + step * durationSecond);
	}, function(start, end) {
	  return (end - start) / durationSecond;
	}, function(date) {
	  return date.getUTCSeconds();
	});
	var seconds = second.range;

	var minute = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getMinutes();
	});
	var minutes = minute.range;

	var hour = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getHours();
	});
	var hours = hour.range;

	var day = newInterval(function(date) {
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setDate(date.getDate() + step);
	}, function(start, end) {
	  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
	}, function(date) {
	  return date.getDate() - 1;
	});
	var days = day.range;

	function weekday(i) {
	  return newInterval(function(date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
	  });
	}

	var sunday = weekday(0);
	var monday = weekday(1);
	var tuesday = weekday(2);
	var wednesday = weekday(3);
	var thursday = weekday(4);
	var friday = weekday(5);
	var saturday = weekday(6);

	var sundays = sunday.range;

	var month = newInterval(function(date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function(start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function(date) {
	  return date.getMonth();
	});
	var months = month.range;

	var year = newInterval(function(date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function(start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function(date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};
	var years = year.range;

	var utcMinute = newInterval(function(date) {
	  date.setUTCSeconds(0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getUTCMinutes();
	});
	var utcMinutes = utcMinute.range;

	var utcHour = newInterval(function(date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getUTCHours();
	});
	var utcHours = utcHour.range;

	var utcDay = newInterval(function(date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function(start, end) {
	  return (end - start) / durationDay;
	}, function(date) {
	  return date.getUTCDate() - 1;
	});
	var utcDays = utcDay.range;

	function utcWeekday(i) {
	  return newInterval(function(date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function(start, end) {
	    return (end - start) / durationWeek;
	  });
	}

	var utcSunday = utcWeekday(0);
	var utcMonday = utcWeekday(1);
	var utcTuesday = utcWeekday(2);
	var utcWednesday = utcWeekday(3);
	var utcThursday = utcWeekday(4);
	var utcFriday = utcWeekday(5);
	var utcSaturday = utcWeekday(6);

	var utcSundays = utcSunday.range;

	var utcMonth = newInterval(function(date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function(start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function(date) {
	  return date.getUTCMonth();
	});
	var utcMonths = utcMonth.range;

	var utcYear = newInterval(function(date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function(start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function(date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};
	var utcYears = utcYear.range;

	function localDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	    date.setFullYear(d.y);
	    return date;
	  }
	  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	}

	function utcDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }
	  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	}

	function newYear(y) {
	  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	}

	function formatLocale$1(locale) {
	  var locale_dateTime = locale.dateTime,
	      locale_date = locale.date,
	      locale_time = locale.time,
	      locale_periods = locale.periods,
	      locale_weekdays = locale.days,
	      locale_shortWeekdays = locale.shortDays,
	      locale_months = locale.months,
	      locale_shortMonths = locale.shortMonths;

	  var periodRe = formatRe(locale_periods),
	      periodLookup = formatLookup(locale_periods),
	      weekdayRe = formatRe(locale_weekdays),
	      weekdayLookup = formatLookup(locale_weekdays),
	      shortWeekdayRe = formatRe(locale_shortWeekdays),
	      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	      monthRe = formatRe(locale_months),
	      monthLookup = formatLookup(locale_months),
	      shortMonthRe = formatRe(locale_shortMonths),
	      shortMonthLookup = formatLookup(locale_shortMonths);

	  var formats = {
	    "a": formatShortWeekday,
	    "A": formatWeekday,
	    "b": formatShortMonth,
	    "B": formatMonth,
	    "c": null,
	    "d": formatDayOfMonth,
	    "e": formatDayOfMonth,
	    "f": formatMicroseconds,
	    "H": formatHour24,
	    "I": formatHour12,
	    "j": formatDayOfYear,
	    "L": formatMilliseconds,
	    "m": formatMonthNumber,
	    "M": formatMinutes,
	    "p": formatPeriod,
	    "Q": formatUnixTimestamp,
	    "s": formatUnixTimestampSeconds,
	    "S": formatSeconds,
	    "u": formatWeekdayNumberMonday,
	    "U": formatWeekNumberSunday,
	    "V": formatWeekNumberISO,
	    "w": formatWeekdayNumberSunday,
	    "W": formatWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatYear,
	    "Y": formatFullYear,
	    "Z": formatZone,
	    "%": formatLiteralPercent
	  };

	  var utcFormats = {
	    "a": formatUTCShortWeekday,
	    "A": formatUTCWeekday,
	    "b": formatUTCShortMonth,
	    "B": formatUTCMonth,
	    "c": null,
	    "d": formatUTCDayOfMonth,
	    "e": formatUTCDayOfMonth,
	    "f": formatUTCMicroseconds,
	    "H": formatUTCHour24,
	    "I": formatUTCHour12,
	    "j": formatUTCDayOfYear,
	    "L": formatUTCMilliseconds,
	    "m": formatUTCMonthNumber,
	    "M": formatUTCMinutes,
	    "p": formatUTCPeriod,
	    "Q": formatUnixTimestamp,
	    "s": formatUnixTimestampSeconds,
	    "S": formatUTCSeconds,
	    "u": formatUTCWeekdayNumberMonday,
	    "U": formatUTCWeekNumberSunday,
	    "V": formatUTCWeekNumberISO,
	    "w": formatUTCWeekdayNumberSunday,
	    "W": formatUTCWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatUTCYear,
	    "Y": formatUTCFullYear,
	    "Z": formatUTCZone,
	    "%": formatLiteralPercent
	  };

	  var parses = {
	    "a": parseShortWeekday,
	    "A": parseWeekday,
	    "b": parseShortMonth,
	    "B": parseMonth,
	    "c": parseLocaleDateTime,
	    "d": parseDayOfMonth,
	    "e": parseDayOfMonth,
	    "f": parseMicroseconds,
	    "H": parseHour24,
	    "I": parseHour24,
	    "j": parseDayOfYear,
	    "L": parseMilliseconds,
	    "m": parseMonthNumber,
	    "M": parseMinutes,
	    "p": parsePeriod,
	    "Q": parseUnixTimestamp,
	    "s": parseUnixTimestampSeconds,
	    "S": parseSeconds,
	    "u": parseWeekdayNumberMonday,
	    "U": parseWeekNumberSunday,
	    "V": parseWeekNumberISO,
	    "w": parseWeekdayNumberSunday,
	    "W": parseWeekNumberMonday,
	    "x": parseLocaleDate,
	    "X": parseLocaleTime,
	    "y": parseYear,
	    "Y": parseFullYear,
	    "Z": parseZone,
	    "%": parseLiteralPercent
	  };

	  // These recursive directive definitions must be deferred.
	  formats.x = newFormat(locale_date, formats);
	  formats.X = newFormat(locale_time, formats);
	  formats.c = newFormat(locale_dateTime, formats);
	  utcFormats.x = newFormat(locale_date, utcFormats);
	  utcFormats.X = newFormat(locale_time, utcFormats);
	  utcFormats.c = newFormat(locale_dateTime, utcFormats);

	  function newFormat(specifier, formats) {
	    return function(date) {
	      var string = [],
	          i = -1,
	          j = 0,
	          n = specifier.length,
	          c,
	          pad,
	          format;

	      if (!(date instanceof Date)) date = new Date(+date);

	      while (++i < n) {
	        if (specifier.charCodeAt(i) === 37) {
	          string.push(specifier.slice(j, i));
	          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	          else pad = c === "e" ? " " : "0";
	          if (format = formats[c]) c = format(date, pad);
	          string.push(c);
	          j = i + 1;
	        }
	      }

	      string.push(specifier.slice(j, i));
	      return string.join("");
	    };
	  }

	  function newParse(specifier, newDate) {
	    return function(string) {
	      var d = newYear(1900),
	          i = parseSpecifier(d, specifier, string += "", 0),
	          week, day$1;
	      if (i != string.length) return null;

	      // If a UNIX timestamp is specified, return it.
	      if ("Q" in d) return new Date(d.Q);

	      // The am-pm flag is 0 for AM, and 1 for PM.
	      if ("p" in d) d.H = d.H % 12 + d.p * 12;

	      // Convert day-of-week and week-of-year to day-of-year.
	      if ("V" in d) {
	        if (d.V < 1 || d.V > 53) return null;
	        if (!("w" in d)) d.w = 1;
	        if ("Z" in d) {
	          week = utcDate(newYear(d.y)), day$1 = week.getUTCDay();
	          week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
	          week = utcDay.offset(week, (d.V - 1) * 7);
	          d.y = week.getUTCFullYear();
	          d.m = week.getUTCMonth();
	          d.d = week.getUTCDate() + (d.w + 6) % 7;
	        } else {
	          week = newDate(newYear(d.y)), day$1 = week.getDay();
	          week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
	          week = day.offset(week, (d.V - 1) * 7);
	          d.y = week.getFullYear();
	          d.m = week.getMonth();
	          d.d = week.getDate() + (d.w + 6) % 7;
	        }
	      } else if ("W" in d || "U" in d) {
	        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
	        day$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	        d.m = 0;
	        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
	      }

	      // If a time zone is specified, all fields are interpreted as UTC and then
	      // offset according to the specified time zone.
	      if ("Z" in d) {
	        d.H += d.Z / 100 | 0;
	        d.M += d.Z % 100;
	        return utcDate(d);
	      }

	      // Otherwise, all fields are in local time.
	      return newDate(d);
	    };
	  }

	  function parseSpecifier(d, specifier, string, j) {
	    var i = 0,
	        n = specifier.length,
	        m = string.length,
	        c,
	        parse;

	    while (i < n) {
	      if (j >= m) return -1;
	      c = specifier.charCodeAt(i++);
	      if (c === 37) {
	        c = specifier.charAt(i++);
	        parse = parses[c in pads ? specifier.charAt(i++) : c];
	        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	      } else if (c != string.charCodeAt(j++)) {
	        return -1;
	      }
	    }

	    return j;
	  }

	  function parsePeriod(d, string, i) {
	    var n = periodRe.exec(string.slice(i));
	    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortWeekday(d, string, i) {
	    var n = shortWeekdayRe.exec(string.slice(i));
	    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseWeekday(d, string, i) {
	    var n = weekdayRe.exec(string.slice(i));
	    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortMonth(d, string, i) {
	    var n = shortMonthRe.exec(string.slice(i));
	    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseMonth(d, string, i) {
	    var n = monthRe.exec(string.slice(i));
	    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseLocaleDateTime(d, string, i) {
	    return parseSpecifier(d, locale_dateTime, string, i);
	  }

	  function parseLocaleDate(d, string, i) {
	    return parseSpecifier(d, locale_date, string, i);
	  }

	  function parseLocaleTime(d, string, i) {
	    return parseSpecifier(d, locale_time, string, i);
	  }

	  function formatShortWeekday(d) {
	    return locale_shortWeekdays[d.getDay()];
	  }

	  function formatWeekday(d) {
	    return locale_weekdays[d.getDay()];
	  }

	  function formatShortMonth(d) {
	    return locale_shortMonths[d.getMonth()];
	  }

	  function formatMonth(d) {
	    return locale_months[d.getMonth()];
	  }

	  function formatPeriod(d) {
	    return locale_periods[+(d.getHours() >= 12)];
	  }

	  function formatUTCShortWeekday(d) {
	    return locale_shortWeekdays[d.getUTCDay()];
	  }

	  function formatUTCWeekday(d) {
	    return locale_weekdays[d.getUTCDay()];
	  }

	  function formatUTCShortMonth(d) {
	    return locale_shortMonths[d.getUTCMonth()];
	  }

	  function formatUTCMonth(d) {
	    return locale_months[d.getUTCMonth()];
	  }

	  function formatUTCPeriod(d) {
	    return locale_periods[+(d.getUTCHours() >= 12)];
	  }

	  return {
	    format: function(specifier) {
	      var f = newFormat(specifier += "", formats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    parse: function(specifier) {
	      var p = newParse(specifier += "", localDate);
	      p.toString = function() { return specifier; };
	      return p;
	    },
	    utcFormat: function(specifier) {
	      var f = newFormat(specifier += "", utcFormats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    utcParse: function(specifier) {
	      var p = newParse(specifier, utcDate);
	      p.toString = function() { return specifier; };
	      return p;
	    }
	  };
	}

	var pads = {"-": "", "_": " ", "0": "0"},
	    numberRe = /^\s*\d+/, // note: ignores next directive
	    percentRe = /^%/,
	    requoteRe = /[\\^$*+?|[\]().{}]/g;

	function pad(value, fill, width) {
	  var sign = value < 0 ? "-" : "",
	      string = (sign ? -value : value) + "",
	      length = string.length;
	  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	}

	function requote(s) {
	  return s.replace(requoteRe, "\\$&");
	}

	function formatRe(names) {
	  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	}

	function formatLookup(names) {
	  var map = {}, i = -1, n = names.length;
	  while (++i < n) map[names[i].toLowerCase()] = i;
	  return map;
	}

	function parseWeekdayNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.w = +n[0], i + n[0].length) : -1;
	}

	function parseWeekdayNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.u = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.U = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberISO(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.V = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.W = +n[0], i + n[0].length) : -1;
	}

	function parseFullYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 4));
	  return n ? (d.y = +n[0], i + n[0].length) : -1;
	}

	function parseYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	}

	function parseZone(d, string, i) {
	  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
	  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	}

	function parseMonthNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	}

	function parseDayOfMonth(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.d = +n[0], i + n[0].length) : -1;
	}

	function parseDayOfYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	}

	function parseHour24(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.H = +n[0], i + n[0].length) : -1;
	}

	function parseMinutes(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.M = +n[0], i + n[0].length) : -1;
	}

	function parseSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.S = +n[0], i + n[0].length) : -1;
	}

	function parseMilliseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.L = +n[0], i + n[0].length) : -1;
	}

	function parseMicroseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 6));
	  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
	}

	function parseLiteralPercent(d, string, i) {
	  var n = percentRe.exec(string.slice(i, i + 1));
	  return n ? i + n[0].length : -1;
	}

	function parseUnixTimestamp(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.Q = +n[0], i + n[0].length) : -1;
	}

	function parseUnixTimestampSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
	}

	function formatDayOfMonth(d, p) {
	  return pad(d.getDate(), p, 2);
	}

	function formatHour24(d, p) {
	  return pad(d.getHours(), p, 2);
	}

	function formatHour12(d, p) {
	  return pad(d.getHours() % 12 || 12, p, 2);
	}

	function formatDayOfYear(d, p) {
	  return pad(1 + day.count(year(d), d), p, 3);
	}

	function formatMilliseconds(d, p) {
	  return pad(d.getMilliseconds(), p, 3);
	}

	function formatMicroseconds(d, p) {
	  return formatMilliseconds(d, p) + "000";
	}

	function formatMonthNumber(d, p) {
	  return pad(d.getMonth() + 1, p, 2);
	}

	function formatMinutes(d, p) {
	  return pad(d.getMinutes(), p, 2);
	}

	function formatSeconds(d, p) {
	  return pad(d.getSeconds(), p, 2);
	}

	function formatWeekdayNumberMonday(d) {
	  var day = d.getDay();
	  return day === 0 ? 7 : day;
	}

	function formatWeekNumberSunday(d, p) {
	  return pad(sunday.count(year(d), d), p, 2);
	}

	function formatWeekNumberISO(d, p) {
	  var day = d.getDay();
	  d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
	  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
	}

	function formatWeekdayNumberSunday(d) {
	  return d.getDay();
	}

	function formatWeekNumberMonday(d, p) {
	  return pad(monday.count(year(d), d), p, 2);
	}

	function formatYear(d, p) {
	  return pad(d.getFullYear() % 100, p, 2);
	}

	function formatFullYear(d, p) {
	  return pad(d.getFullYear() % 10000, p, 4);
	}

	function formatZone(d) {
	  var z = d.getTimezoneOffset();
	  return (z > 0 ? "-" : (z *= -1, "+"))
	      + pad(z / 60 | 0, "0", 2)
	      + pad(z % 60, "0", 2);
	}

	function formatUTCDayOfMonth(d, p) {
	  return pad(d.getUTCDate(), p, 2);
	}

	function formatUTCHour24(d, p) {
	  return pad(d.getUTCHours(), p, 2);
	}

	function formatUTCHour12(d, p) {
	  return pad(d.getUTCHours() % 12 || 12, p, 2);
	}

	function formatUTCDayOfYear(d, p) {
	  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
	}

	function formatUTCMilliseconds(d, p) {
	  return pad(d.getUTCMilliseconds(), p, 3);
	}

	function formatUTCMicroseconds(d, p) {
	  return formatUTCMilliseconds(d, p) + "000";
	}

	function formatUTCMonthNumber(d, p) {
	  return pad(d.getUTCMonth() + 1, p, 2);
	}

	function formatUTCMinutes(d, p) {
	  return pad(d.getUTCMinutes(), p, 2);
	}

	function formatUTCSeconds(d, p) {
	  return pad(d.getUTCSeconds(), p, 2);
	}

	function formatUTCWeekdayNumberMonday(d) {
	  var dow = d.getUTCDay();
	  return dow === 0 ? 7 : dow;
	}

	function formatUTCWeekNumberSunday(d, p) {
	  return pad(utcSunday.count(utcYear(d), d), p, 2);
	}

	function formatUTCWeekNumberISO(d, p) {
	  var day = d.getUTCDay();
	  d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
	  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
	}

	function formatUTCWeekdayNumberSunday(d) {
	  return d.getUTCDay();
	}

	function formatUTCWeekNumberMonday(d, p) {
	  return pad(utcMonday.count(utcYear(d), d), p, 2);
	}

	function formatUTCYear(d, p) {
	  return pad(d.getUTCFullYear() % 100, p, 2);
	}

	function formatUTCFullYear(d, p) {
	  return pad(d.getUTCFullYear() % 10000, p, 4);
	}

	function formatUTCZone() {
	  return "+0000";
	}

	function formatLiteralPercent() {
	  return "%";
	}

	function formatUnixTimestamp(d) {
	  return +d;
	}

	function formatUnixTimestampSeconds(d) {
	  return Math.floor(+d / 1000);
	}

	var locale$1;
	var timeFormat;
	var timeParse;
	var utcFormat;
	var utcParse;

	defaultLocale$1({
	  dateTime: "%x, %X",
	  date: "%-m/%-d/%Y",
	  time: "%-I:%M:%S %p",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	});

	function defaultLocale$1(definition) {
	  locale$1 = formatLocale$1(definition);
	  timeFormat = locale$1.format;
	  timeParse = locale$1.parse;
	  utcFormat = locale$1.utcFormat;
	  utcParse = locale$1.utcParse;
	  return locale$1;
	}

	var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	function formatIsoNative(date) {
	  return date.toISOString();
	}

	var formatIso = Date.prototype.toISOString
	    ? formatIsoNative
	    : utcFormat(isoSpecifier);

	function parseIsoNative(string) {
	  var date = new Date(string);
	  return isNaN(date) ? null : date;
	}

	var parseIso = +new Date("2000-01-01T00:00:00.000Z")
	    ? parseIsoNative
	    : utcParse(isoSpecifier);

	/* src/components/scatterplot.html generated by Svelte v2.16.1 */

	const xScale = linear$1();
	const yScale = linear$1();

	function xTicks({ width }) {
		return width > 180 ?
			[0, 4, 8, 12, 16, 20] :
			[0, 10, 20];
	}

	function yTicks({ height }) {
		return height > 180 ?
			[0, 2, 4, 6, 8, 10, 12] :
			[0, 4, 8, 12];
	}

	function xScale_1({ padding, width }) {
		return xScale
			.domain([0, 20])
			.range([padding.left, width - padding.right]);
	}

	function yScale_1({ padding, height }) {
		return yScale
			.domain([0, 12])
			.range([height - padding.bottom, padding.top]);
	}

	function data$1() {
		return {
			padding: { top: 20, right: 40, bottom: 40, left: 25 },
			height: 200,
			width: 500,
			xTicks: [0, 4, 8, 12, 16, 20],
			yTicks: [0, 2, 4, 6, 8, 10, 12]
		};
	}
	var methods = {
		resize() {
			const { width, height } = this.refs.svg.getBoundingClientRect();
			this.set({ width, height });
		}
	};

	function oncreate() {
		this.resize();
	}
	const file$5 = "src/components/scatterplot.html";

	function get_each2_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.point = list[i];
		return child_ctx;
	}

	function get_each1_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.tick = list[i];
		return child_ctx;
	}

	function get_each0_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.tick = list[i];
		return child_ctx;
	}

	function create_main_fragment$5(component, ctx) {
		var svg, g0, g1, current;

		function onwindowresize(event) {
			component.resize();	}
		window.addEventListener("resize", onwindowresize);

		var each0_value = ctx.yTicks;

		var each0_blocks = [];

		for (var i = 0; i < each0_value.length; i += 1) {
			each0_blocks[i] = create_each_block_2(component, get_each0_context(ctx, each0_value, i));
		}

		var each1_value = ctx.xTicks;

		var each1_blocks = [];

		for (var i = 0; i < each1_value.length; i += 1) {
			each1_blocks[i] = create_each_block_1(component, get_each1_context(ctx, each1_value, i));
		}

		var each2_value = ctx.points;

		var each2_blocks = [];

		for (var i = 0; i < each2_value.length; i += 1) {
			each2_blocks[i] = create_each_block$1(component, get_each2_context(ctx, each2_value, i));
		}

		return {
			c: function create() {
				svg = createSvgElement("svg");
				g0 = createSvgElement("g");

				for (var i = 0; i < each0_blocks.length; i += 1) {
					each0_blocks[i].c();
				}

				g1 = createSvgElement("g");

				for (var i = 0; i < each1_blocks.length; i += 1) {
					each1_blocks[i].c();
				}

				for (var i = 0; i < each2_blocks.length; i += 1) {
					each2_blocks[i].c();
				}
				setAttribute(g0, "class", "axis y-axis");
				addLoc(g0, file$5, 4, 1, 71);
				setAttribute(g1, "class", "axis x-axis svelte-m1ljbi");
				addLoc(g1, file$5, 14, 1, 340);
				setAttribute(svg, "class", "svelte-m1ljbi");
				addLoc(svg, file$5, 2, 0, 39);
			},

			m: function mount(target, anchor) {
				insert(target, svg, anchor);
				append(svg, g0);

				for (var i = 0; i < each0_blocks.length; i += 1) {
					each0_blocks[i].m(g0, null);
				}

				append(svg, g1);

				for (var i = 0; i < each1_blocks.length; i += 1) {
					each1_blocks[i].m(g1, null);
				}

				for (var i = 0; i < each2_blocks.length; i += 1) {
					each2_blocks[i].m(svg, null);
				}

				component.refs.svg = svg;
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.yTicks || changed.yScale || changed.padding || changed.xScale) {
					each0_value = ctx.yTicks;

					for (var i = 0; i < each0_value.length; i += 1) {
						const child_ctx = get_each0_context(ctx, each0_value, i);

						if (each0_blocks[i]) {
							each0_blocks[i].p(changed, child_ctx);
						} else {
							each0_blocks[i] = create_each_block_2(component, child_ctx);
							each0_blocks[i].c();
							each0_blocks[i].m(g0, null);
						}
					}

					for (; i < each0_blocks.length; i += 1) {
						each0_blocks[i].d(1);
					}
					each0_blocks.length = each0_value.length;
				}

				if (changed.xScale || changed.xTicks || changed.height || changed.padding || changed.yScale) {
					each1_value = ctx.xTicks;

					for (var i = 0; i < each1_value.length; i += 1) {
						const child_ctx = get_each1_context(ctx, each1_value, i);

						if (each1_blocks[i]) {
							each1_blocks[i].p(changed, child_ctx);
						} else {
							each1_blocks[i] = create_each_block_1(component, child_ctx);
							each1_blocks[i].c();
							each1_blocks[i].m(g1, null);
						}
					}

					for (; i < each1_blocks.length; i += 1) {
						each1_blocks[i].d(1);
					}
					each1_blocks.length = each1_value.length;
				}

				if (changed.xScale || changed.points || changed.yScale) {
					each2_value = ctx.points;

					for (var i = 0; i < each2_value.length; i += 1) {
						const child_ctx = get_each2_context(ctx, each2_value, i);

						if (each2_blocks[i]) {
							each2_blocks[i].p(changed, child_ctx);
						} else {
							each2_blocks[i] = create_each_block$1(component, child_ctx);
							each2_blocks[i].c();
							each2_blocks[i].m(svg, null);
						}
					}

					for (; i < each2_blocks.length; i += 1) {
						each2_blocks[i].d(1);
					}
					each2_blocks.length = each2_value.length;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy(detach) {
				window.removeEventListener("resize", onwindowresize);

				if (detach) {
					detachNode(svg);
				}

				destroyEach(each0_blocks, detach);

				destroyEach(each1_blocks, detach);

				destroyEach(each2_blocks, detach);

				if (component.refs.svg === svg) component.refs.svg = null;
			}
		};
	}

	// (6:2) {#each yTicks as tick}
	function create_each_block_2(component, ctx) {
		var g, line, line_x__value, line_x__value_1, text1, text0_value = ctx.tick, text0, text1_x_value, g_class_value, g_transform_value;

		return {
			c: function create() {
				g = createSvgElement("g");
				line = createSvgElement("line");
				text1 = createSvgElement("text");
				text0 = createText(text0_value);
				setAttribute(line, "x1", line_x__value = ctx.padding.left);
				setAttribute(line, "x2", line_x__value_1 = ctx.xScale(22));
				setAttribute(line, "class", "svelte-m1ljbi");
				addLoc(line, file$5, 7, 4, 197);
				setAttribute(text1, "x", text1_x_value = ctx.padding.left - 8);
				setAttribute(text1, "y", "+4");
				setAttribute(text1, "class", "svelte-m1ljbi");
				addLoc(text1, file$5, 8, 4, 247);
				setAttribute(g, "class", g_class_value = "tick tick-" + ctx.tick + " svelte-m1ljbi");
				setAttribute(g, "transform", g_transform_value = "translate(0, " + ctx.yScale(ctx.tick) + ")");
				addLoc(g, file$5, 6, 3, 123);
			},

			m: function mount(target, anchor) {
				insert(target, g, anchor);
				append(g, line);
				append(g, text1);
				append(text1, text0);
			},

			p: function update(changed, ctx) {
				if ((changed.padding) && line_x__value !== (line_x__value = ctx.padding.left)) {
					setAttribute(line, "x1", line_x__value);
				}

				if ((changed.xScale) && line_x__value_1 !== (line_x__value_1 = ctx.xScale(22))) {
					setAttribute(line, "x2", line_x__value_1);
				}

				if ((changed.yTicks) && text0_value !== (text0_value = ctx.tick)) {
					setData(text0, text0_value);
				}

				if ((changed.padding) && text1_x_value !== (text1_x_value = ctx.padding.left - 8)) {
					setAttribute(text1, "x", text1_x_value);
				}

				if ((changed.yTicks) && g_class_value !== (g_class_value = "tick tick-" + ctx.tick + " svelte-m1ljbi")) {
					setAttribute(g, "class", g_class_value);
				}

				if ((changed.yScale || changed.yTicks) && g_transform_value !== (g_transform_value = "translate(0, " + ctx.yScale(ctx.tick) + ")")) {
					setAttribute(g, "transform", g_transform_value);
				}
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(g);
				}
			}
		};
	}

	// (16:2) {#each xTicks as tick}
	function create_each_block_1(component, ctx) {
		var g, line, line_y__value, line_y__value_1, text1, text0_value = ctx.tick, text0, text1_y_value, g_transform_value;

		return {
			c: function create() {
				g = createSvgElement("g");
				line = createSvgElement("line");
				text1 = createSvgElement("text");
				text0 = createText(text0_value);
				setAttribute(line, "y1", line_y__value = ctx.yScale(0));
				setAttribute(line, "y2", line_y__value_1 = ctx.yScale(13));
				setAttribute(line, "class", "svelte-m1ljbi");
				addLoc(line, file$5, 17, 4, 453);
				setAttribute(text1, "y", text1_y_value = ctx.height - ctx.padding.bottom + 16);
				setAttribute(text1, "class", "svelte-m1ljbi");
				addLoc(text1, file$5, 18, 4, 500);
				setAttribute(g, "class", "tick svelte-m1ljbi");
				setAttribute(g, "transform", g_transform_value = "translate(" + ctx.xScale(ctx.tick) + ",0)");
				addLoc(g, file$5, 16, 3, 392);
			},

			m: function mount(target, anchor) {
				insert(target, g, anchor);
				append(g, line);
				append(g, text1);
				append(text1, text0);
			},

			p: function update(changed, ctx) {
				if ((changed.yScale) && line_y__value !== (line_y__value = ctx.yScale(0))) {
					setAttribute(line, "y1", line_y__value);
				}

				if ((changed.yScale) && line_y__value_1 !== (line_y__value_1 = ctx.yScale(13))) {
					setAttribute(line, "y2", line_y__value_1);
				}

				if ((changed.xTicks) && text0_value !== (text0_value = ctx.tick)) {
					setData(text0, text0_value);
				}

				if ((changed.height || changed.padding) && text1_y_value !== (text1_y_value = ctx.height - ctx.padding.bottom + 16)) {
					setAttribute(text1, "y", text1_y_value);
				}

				if ((changed.xScale || changed.xTicks) && g_transform_value !== (g_transform_value = "translate(" + ctx.xScale(ctx.tick) + ",0)")) {
					setAttribute(g, "transform", g_transform_value);
				}
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(g);
				}
			}
		};
	}

	// (25:1) {#each points as point}
	function create_each_block$1(component, ctx) {
		var circle, circle_cx_value, circle_cy_value;

		return {
			c: function create() {
				circle = createSvgElement("circle");
				setAttribute(circle, "cx", circle_cx_value = ctx.xScale(ctx.point.x));
				setAttribute(circle, "cy", circle_cy_value = ctx.yScale(ctx.point.y));
				setAttribute(circle, "r", "5");
				setAttribute(circle, "class", "svelte-m1ljbi");
				addLoc(circle, file$5, 25, 2, 622);
			},

			m: function mount(target, anchor) {
				insert(target, circle, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.xScale || changed.points) && circle_cx_value !== (circle_cx_value = ctx.xScale(ctx.point.x))) {
					setAttribute(circle, "cx", circle_cx_value);
				}

				if ((changed.yScale || changed.points) && circle_cy_value !== (circle_cy_value = ctx.yScale(ctx.point.y))) {
					setAttribute(circle, "cy", circle_cy_value);
				}
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(circle);
				}
			}
		};
	}

	function Scatterplot(options) {
		this._debugName = '<Scatterplot>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.refs = {};
		this._state = assign(data$1(), options.data);

		this._recompute({ width: 1, height: 1, padding: 1 }, this._state);
		if (!('width' in this._state)) console.warn("<Scatterplot> was created without expected data property 'width'");
		if (!('height' in this._state)) console.warn("<Scatterplot> was created without expected data property 'height'");
		if (!('padding' in this._state)) console.warn("<Scatterplot> was created without expected data property 'padding'");




		if (!('points' in this._state)) console.warn("<Scatterplot> was created without expected data property 'points'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$5(this, this._state);

		this.root._oncreate.push(() => {
			oncreate.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Scatterplot.prototype, protoDev);
	assign(Scatterplot.prototype, methods);

	Scatterplot.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('xTicks' in newState && !this._updatingReadonlyProperty) throw new Error("<Scatterplot>: Cannot set read-only property 'xTicks'");
		if ('yTicks' in newState && !this._updatingReadonlyProperty) throw new Error("<Scatterplot>: Cannot set read-only property 'yTicks'");
		if ('xScale' in newState && !this._updatingReadonlyProperty) throw new Error("<Scatterplot>: Cannot set read-only property 'xScale'");
		if ('yScale' in newState && !this._updatingReadonlyProperty) throw new Error("<Scatterplot>: Cannot set read-only property 'yScale'");
	};

	Scatterplot.prototype._recompute = function _recompute(changed, state) {
		if (changed.width) {
			if (this._differs(state.xTicks, (state.xTicks = xTicks(state)))) changed.xTicks = true;
		}

		if (changed.height) {
			if (this._differs(state.yTicks, (state.yTicks = yTicks(state)))) changed.yTicks = true;
		}

		if (changed.padding || changed.width) {
			if (this._differs(state.xScale, (state.xScale = xScale_1(state)))) changed.xScale = true;
		}

		if (changed.padding || changed.height) {
			if (this._differs(state.yScale, (state.yScale = yScale_1(state)))) changed.yScale = true;
		}
	};

	/* src/components/line-area-chart.html generated by Svelte v2.16.1 */

	const xScale$1 = linear$1();
	const yScale$1 = linear$1();

	function minX({ points }) {
		return points[0].x;
	}

	function maxX({ points }) {
		return points[points.length - 1].x;
	}

	function xScale_1$1({ padding, width, minX, maxX }) {
		return xScale$1
			.domain([minX, maxX])
			.range([padding.left, width - padding.right]);
	}

	function yScale_1$1({ padding, height, yTicks }) {
		return yScale$1
			.domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
			.range([height - padding.bottom, padding.top]);
	}

	function path({ points, xScale, yScale }) {
		return 'M' + points
			.map(function (point, i) {
				return xScale(point.x) + ',' + yScale(point.y);
			})
			.join('L');
	}

	function area({ points, xScale, yScale, minX, maxX, path }) {
		return path + (
			'L' + xScale(maxX) + ',' + yScale(0) +
			'L' + xScale(minX) + ',' + yScale(0) +
			'Z'
		);
	}

	function data$2() {
		return {
			padding: { top: 20, right: 15, bottom: 20, left: 25 },
			height: 200,
			width: 500,
			xTicks: [1980, 1990, 2000, 2010],
			yTicks: [0, 2, 4, 6, 8],
			formatMobile(tick) {
				return "'" + tick % 100;
			}
		};
	}
	var methods$1 = {
		resize: function () {
			const { width, height } = this.refs.svg.getBoundingClientRect();
			this.set({ width, height });
		}
	};

	function oncreate$1() {
		this.resize();
	}
	const file$6 = "src/components/line-area-chart.html";

	function get_each1_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.tick = list[i];
		return child_ctx;
	}

	function get_each0_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.tick = list[i];
		return child_ctx;
	}

	function create_main_fragment$6(component, ctx) {
		var div, svg, g0, g0_transform_value, g1, path0, path1, current;

		function onwindowresize(event) {
			component.resize();	}
		window.addEventListener("resize", onwindowresize);

		var each0_value = ctx.yTicks;

		var each0_blocks = [];

		for (var i = 0; i < each0_value.length; i += 1) {
			each0_blocks[i] = create_each_block_1$1(component, get_each0_context$1(ctx, each0_value, i));
		}

		var each1_value = ctx.xTicks;

		var each1_blocks = [];

		for (var i = 0; i < each1_value.length; i += 1) {
			each1_blocks[i] = create_each_block$2(component, get_each1_context$1(ctx, each1_value, i));
		}

		return {
			c: function create() {
				div = createElement("div");
				svg = createSvgElement("svg");
				g0 = createSvgElement("g");

				for (var i = 0; i < each0_blocks.length; i += 1) {
					each0_blocks[i].c();
				}

				g1 = createSvgElement("g");

				for (var i = 0; i < each1_blocks.length; i += 1) {
					each1_blocks[i].c();
				}

				path0 = createSvgElement("path");
				path1 = createSvgElement("path");
				setAttribute(g0, "class", "axis y-axis");
				setAttribute(g0, "transform", g0_transform_value = "translate(0, " + ctx.padding.top + ")");
				addLoc(g0, file$6, 6, 2, 95);
				setAttribute(g1, "class", "axis x-axis svelte-1jop9rq");
				addLoc(g1, file$6, 16, 2, 422);
				setAttribute(path0, "class", "path-area svelte-1jop9rq");
				setAttribute(path0, "d", ctx.area);
				addLoc(path0, file$6, 26, 2, 738);
				setAttribute(path1, "class", "path-line svelte-1jop9rq");
				setAttribute(path1, "d", ctx.path);
				addLoc(path1, file$6, 27, 2, 783);
				setAttribute(svg, "class", "svelte-1jop9rq");
				addLoc(svg, file$6, 4, 1, 61);
				div.className = "chart svelte-1jop9rq";
				addLoc(div, file$6, 2, 0, 39);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, svg);
				append(svg, g0);

				for (var i = 0; i < each0_blocks.length; i += 1) {
					each0_blocks[i].m(g0, null);
				}

				append(svg, g1);

				for (var i = 0; i < each1_blocks.length; i += 1) {
					each1_blocks[i].m(g1, null);
				}

				append(svg, path0);
				append(svg, path1);
				component.refs.svg = svg;
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.yTicks || changed.yScale || changed.padding) {
					each0_value = ctx.yTicks;

					for (var i = 0; i < each0_value.length; i += 1) {
						const child_ctx = get_each0_context$1(ctx, each0_value, i);

						if (each0_blocks[i]) {
							each0_blocks[i].p(changed, child_ctx);
						} else {
							each0_blocks[i] = create_each_block_1$1(component, child_ctx);
							each0_blocks[i].c();
							each0_blocks[i].m(g0, null);
						}
					}

					for (; i < each0_blocks.length; i += 1) {
						each0_blocks[i].d(1);
					}
					each0_blocks.length = each0_value.length;
				}

				if ((changed.padding) && g0_transform_value !== (g0_transform_value = "translate(0, " + ctx.padding.top + ")")) {
					setAttribute(g0, "transform", g0_transform_value);
				}

				if (changed.xTicks || changed.xScale || changed.height || changed.width || changed.formatMobile || changed.padding) {
					each1_value = ctx.xTicks;

					for (var i = 0; i < each1_value.length; i += 1) {
						const child_ctx = get_each1_context$1(ctx, each1_value, i);

						if (each1_blocks[i]) {
							each1_blocks[i].p(changed, child_ctx);
						} else {
							each1_blocks[i] = create_each_block$2(component, child_ctx);
							each1_blocks[i].c();
							each1_blocks[i].m(g1, null);
						}
					}

					for (; i < each1_blocks.length; i += 1) {
						each1_blocks[i].d(1);
					}
					each1_blocks.length = each1_value.length;
				}

				if (changed.area) {
					setAttribute(path0, "d", ctx.area);
				}

				if (changed.path) {
					setAttribute(path1, "d", ctx.path);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy(detach) {
				window.removeEventListener("resize", onwindowresize);

				if (detach) {
					detachNode(div);
				}

				destroyEach(each0_blocks, detach);

				destroyEach(each1_blocks, detach);

				if (component.refs.svg === svg) component.refs.svg = null;
			}
		};
	}

	// (8:3) {#each yTicks as tick}
	function create_each_block_1$1(component, ctx) {
		var g, line, text2, text0_value = ctx.tick, text0, text1_value = ctx.tick === 8 ? ' million sq km' : '', text1, g_class_value, g_transform_value;

		return {
			c: function create() {
				g = createSvgElement("g");
				line = createSvgElement("line");
				text2 = createSvgElement("text");
				text0 = createText(text0_value);
				text1 = createText(text1_value);
				setAttribute(line, "x2", "100%");
				setAttribute(line, "class", "svelte-1jop9rq");
				addLoc(line, file$6, 9, 5, 281);
				setAttribute(text2, "y", "-4");
				setAttribute(text2, "class", "svelte-1jop9rq");
				addLoc(text2, file$6, 10, 5, 310);
				setAttribute(g, "class", g_class_value = "tick tick-" + ctx.tick + " svelte-1jop9rq");
				setAttribute(g, "transform", g_transform_value = "translate(0, " + (ctx.yScale(ctx.tick) - ctx.padding.bottom) + ")");
				addLoc(g, file$6, 8, 4, 189);
			},

			m: function mount(target, anchor) {
				insert(target, g, anchor);
				append(g, line);
				append(g, text2);
				append(text2, text0);
				append(text2, text1);
			},

			p: function update(changed, ctx) {
				if ((changed.yTicks) && text0_value !== (text0_value = ctx.tick)) {
					setData(text0, text0_value);
				}

				if ((changed.yTicks) && text1_value !== (text1_value = ctx.tick === 8 ? ' million sq km' : '')) {
					setData(text1, text1_value);
				}

				if ((changed.yTicks) && g_class_value !== (g_class_value = "tick tick-" + ctx.tick + " svelte-1jop9rq")) {
					setAttribute(g, "class", g_class_value);
				}

				if ((changed.yScale || changed.yTicks || changed.padding) && g_transform_value !== (g_transform_value = "translate(0, " + (ctx.yScale(ctx.tick) - ctx.padding.bottom) + ")")) {
					setAttribute(g, "transform", g_transform_value);
				}
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(g);
				}
			}
		};
	}

	// (18:3) {#each xTicks as tick}
	function create_each_block$2(component, ctx) {
		var g, line, line_y__value, line_y__value_1, text1, text0_value = ctx.width > 380 ? ctx.tick : ctx.formatMobile(ctx.tick), text0, g_class_value, g_transform_value;

		return {
			c: function create() {
				g = createSvgElement("g");
				line = createSvgElement("line");
				text1 = createSvgElement("text");
				text0 = createText(text0_value);
				setAttribute(line, "y1", line_y__value = "-" + ctx.height);
				setAttribute(line, "y2", line_y__value_1 = "-" + ctx.padding.bottom);
				setAttribute(line, "x1", "0");
				setAttribute(line, "x2", "0");
				setAttribute(line, "class", "svelte-1jop9rq");
				addLoc(line, file$6, 19, 5, 559);
				setAttribute(text1, "y", "-2");
				setAttribute(text1, "class", "svelte-1jop9rq");
				addLoc(text1, file$6, 20, 5, 630);
				setAttribute(g, "class", g_class_value = "tick tick-" + ctx.tick + " svelte-1jop9rq");
				setAttribute(g, "transform", g_transform_value = "translate(" + ctx.xScale(ctx.tick) + "," + ctx.height + ")");
				addLoc(g, file$6, 18, 4, 476);
			},

			m: function mount(target, anchor) {
				insert(target, g, anchor);
				append(g, line);
				append(g, text1);
				append(text1, text0);
			},

			p: function update(changed, ctx) {
				if ((changed.height) && line_y__value !== (line_y__value = "-" + ctx.height)) {
					setAttribute(line, "y1", line_y__value);
				}

				if ((changed.padding) && line_y__value_1 !== (line_y__value_1 = "-" + ctx.padding.bottom)) {
					setAttribute(line, "y2", line_y__value_1);
				}

				if ((changed.width || changed.xTicks || changed.formatMobile) && text0_value !== (text0_value = ctx.width > 380 ? ctx.tick : ctx.formatMobile(ctx.tick))) {
					setData(text0, text0_value);
				}

				if ((changed.xTicks) && g_class_value !== (g_class_value = "tick tick-" + ctx.tick + " svelte-1jop9rq")) {
					setAttribute(g, "class", g_class_value);
				}

				if ((changed.xScale || changed.xTicks || changed.height) && g_transform_value !== (g_transform_value = "translate(" + ctx.xScale(ctx.tick) + "," + ctx.height + ")")) {
					setAttribute(g, "transform", g_transform_value);
				}
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(g);
				}
			}
		};
	}

	function Line_area_chart(options) {
		this._debugName = '<Line_area_chart>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this.refs = {};
		this._state = assign(data$2(), options.data);

		this._recompute({ points: 1, padding: 1, width: 1, minX: 1, maxX: 1, height: 1, yTicks: 1, xScale: 1, yScale: 1, path: 1 }, this._state);
		if (!('points' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'points'");
		if (!('padding' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'padding'");
		if (!('width' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'width'");


		if (!('height' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'height'");
		if (!('yTicks' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'yTicks'");



		if (!('xTicks' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'xTicks'");
		if (!('formatMobile' in this._state)) console.warn("<Line_area_chart> was created without expected data property 'formatMobile'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$6(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$1.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Line_area_chart.prototype, protoDev);
	assign(Line_area_chart.prototype, methods$1);

	Line_area_chart.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('minX' in newState && !this._updatingReadonlyProperty) throw new Error("<Line_area_chart>: Cannot set read-only property 'minX'");
		if ('maxX' in newState && !this._updatingReadonlyProperty) throw new Error("<Line_area_chart>: Cannot set read-only property 'maxX'");
		if ('xScale' in newState && !this._updatingReadonlyProperty) throw new Error("<Line_area_chart>: Cannot set read-only property 'xScale'");
		if ('yScale' in newState && !this._updatingReadonlyProperty) throw new Error("<Line_area_chart>: Cannot set read-only property 'yScale'");
		if ('path' in newState && !this._updatingReadonlyProperty) throw new Error("<Line_area_chart>: Cannot set read-only property 'path'");
		if ('area' in newState && !this._updatingReadonlyProperty) throw new Error("<Line_area_chart>: Cannot set read-only property 'area'");
	};

	Line_area_chart.prototype._recompute = function _recompute(changed, state) {
		if (changed.points) {
			if (this._differs(state.minX, (state.minX = minX(state)))) changed.minX = true;
			if (this._differs(state.maxX, (state.maxX = maxX(state)))) changed.maxX = true;
		}

		if (changed.padding || changed.width || changed.minX || changed.maxX) {
			if (this._differs(state.xScale, (state.xScale = xScale_1$1(state)))) changed.xScale = true;
		}

		if (changed.padding || changed.height || changed.yTicks) {
			if (this._differs(state.yScale, (state.yScale = yScale_1$1(state)))) changed.yScale = true;
		}

		if (changed.points || changed.xScale || changed.yScale) {
			if (this._differs(state.path, (state.path = path(state)))) changed.path = true;
		}

		if (changed.points || changed.xScale || changed.yScale || changed.minX || changed.maxX || changed.path) {
			if (this._differs(state.area, (state.area = area(state)))) changed.area = true;
		}
	};

	/* src/pages/ch-001-003-provoke-interest.html generated by Svelte v2.16.1 */



	function data$3() {
	  return {
	    points: [
	      {
	        "x": 10,
	        "y": 8.04
	      },
	      {
	        "x": 8,
	        "y": 6.95
	      },
	      {
	        "x": 13,
	        "y": 7.58
	      },
	      {
	        "x": 9,
	        "y": 8.81
	      },
	      {
	        "x": 11,
	        "y": 8.33
	      },
	      {
	        "x": 14,
	        "y": 9.96
	      },
	      {
	        "x": 6,
	        "y": 7.24
	      },
	      {
	        "x": 4,
	        "y": 4.26
	      },
	      {
	        "x": 12,
	        "y": 10.84
	      },
	      {
	        "x": 7,
	        "y": 4.82
	      },
	      {
	        "x": 5,
	        "y": 5.68
	      }
	    ],
	    points2: [
	      {
	        "x": 1979,
	        "y": 7.19
	      },
	      {
	        "x": 1980,
	        "y": 7.83
	      },
	      {
	        "x": 1981,
	        "y": 7.24
	      },
	      {
	        "x": 1982,
	        "y": 7.44
	      },
	      {
	        "x": 1983,
	        "y": 7.51
	      },
	      {
	        "x": 1984,
	        "y": 7.1
	      },
	      {
	        "x": 1985,
	        "y": 6.91
	      },
	      {
	        "x": 1986,
	        "y": 7.53
	      },
	      {
	        "x": 1987,
	        "y": 7.47
	      },
	      {
	        "x": 1988,
	        "y": 7.48
	      },
	      {
	        "x": 1989,
	        "y": 7.03
	      },
	      {
	        "x": 1990,
	        "y": 6.23
	      },
	      {
	        "x": 1991,
	        "y": 6.54
	      },
	      {
	        "x": 1992,
	        "y": 7.54
	      },
	      {
	        "x": 1993,
	        "y": 6.5
	      },
	      {
	        "x": 1994,
	        "y": 7.18
	      },
	      {
	        "x": 1995,
	        "y": 6.12
	      },
	      {
	        "x": 1996,
	        "y": 7.87
	      },
	      {
	        "x": 1997,
	        "y": 6.73
	      },
	      {
	        "x": 1998,
	        "y": 6.55
	      },
	      {
	        "x": 1999,
	        "y": 6.23
	      },
	      {
	        "x": 2000,
	        "y": 6.31
	      },
	      {
	        "x": 2001,
	        "y": 6.74
	      },
	      {
	        "x": 2002,
	        "y": 5.95
	      },
	      {
	        "x": 2003,
	        "y": 6.13
	      },
	      {
	        "x": 2004,
	        "y": 6.04
	      },
	      {
	        "x": 2005,
	        "y": 5.56
	      },
	      {
	        "x": 2006,
	        "y": 5.91
	      },
	      {
	        "x": 2007,
	        "y": 4.29
	      },
	      {
	        "x": 2008,
	        "y": 4.72
	      },
	      {
	        "x": 2009,
	        "y": 5.38
	      },
	      {
	        "x": 2010,
	        "y": 4.92
	      },
	      {
	        "x": 2011,
	        "y": 4.61
	      },
	      {
	        "x": 2012,
	        "y": 3.62
	      },
	      {
	        "x": 2013,
	        "y": 5.35
	      },
	      {
	        "x": 2014,
	        "y": 5.28
	      },
	      {
	        "x": 2015,
	        "y": 4.63
	      },
	      {
	        "x": 2016,
	        "y": 4.72
	      }
	    ]
	  }
	}
	const file$7 = "src/pages/ch-001-003-provoke-interest.html";

	function create_main_fragment$7(component, ctx) {
		var h1, text1, div, text2, current;

		var scatterplot_initial_data = { points: ctx.points };
		var scatterplot = new Scatterplot({
			root: component.root,
			store: component.store,
			data: scatterplot_initial_data
		});

		var lineareachart_initial_data = { points: ctx.points2 };
		var lineareachart = new Line_area_chart({
			root: component.root,
			store: component.store,
			data: lineareachart_initial_data
		});

		return {
			c: function create() {
				h1 = createElement("h1");
				h1.textContent = "using statistics";
				text1 = createText("\n");
				div = createElement("div");
				scatterplot._fragment.c();
				text2 = createText("\n  ");
				lineareachart._fragment.c();
				addLoc(h1, file$7, 1, 0, 1);
				div.className = "page";
				addLoc(div, file$7, 2, 0, 27);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text1, anchor);
				insert(target, div, anchor);
				scatterplot._mount(div, null);
				append(div, text2);
				lineareachart._mount(div, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var scatterplot_changes = {};
				if (changed.points) scatterplot_changes.points = ctx.points;
				scatterplot._set(scatterplot_changes);

				var lineareachart_changes = {};
				if (changed.points2) lineareachart_changes.points = ctx.points2;
				lineareachart._set(lineareachart_changes);
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (scatterplot) scatterplot._fragment.o(outrocallback);
				if (lineareachart) lineareachart._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text1);
					detachNode(div);
				}

				scatterplot.destroy();
				lineareachart.destroy();
			}
		};
	}

	function Ch_001_003_provoke_interest(options) {
		this._debugName = '<Ch_001_003_provoke_interest>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign(data$3(), options.data);
		if (!('points' in this._state)) console.warn("<Ch_001_003_provoke_interest> was created without expected data property 'points'");
		if (!('points2' in this._state)) console.warn("<Ch_001_003_provoke_interest> was created without expected data property 'points2'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$7(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_003_provoke_interest.prototype, protoDev);

	Ch_001_003_provoke_interest.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/components/video.html generated by Svelte v2.16.1 */

	const file$8 = "src/components/video.html";

	function create_main_fragment$8(component, ctx) {
		var div, video, source, current;

		return {
			c: function create() {
				div = createElement("div");
				video = createElement("video");
				source = createElement("source");
				source.src = ctx.src;
				addLoc(source, file$8, 2, 4, 59);
				video.muted = true;
				video.controls = ctx.controls;
				video.loop = ctx.loop;
				video.className = "svelte-dcv3s";
				addLoc(video, file$8, 1, 2, 22);
				div.className = "video svelte-dcv3s";
				addLoc(div, file$8, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, video);
				append(video, source);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.src) {
					source.src = ctx.src;
				}

				if (changed.controls) {
					video.controls = ctx.controls;
				}

				if (changed.loop) {
					video.loop = ctx.loop;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: run,

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	function Video(options) {
		this._debugName = '<Video>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		if (!('controls' in this._state)) console.warn("<Video> was created without expected data property 'controls'");
		if (!('loop' in this._state)) console.warn("<Video> was created without expected data property 'loop'");
		if (!('src' in this._state)) console.warn("<Video> was created without expected data property 'src'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$8(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}

		this._intro = true;
	}

	assign(Video.prototype, protoDev);

	Video.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-004-meet-main-character.html generated by Svelte v2.16.1 */



	const file$9 = "src/pages/ch-001-004-meet-main-character.html";

	function create_main_fragment$9(component, ctx) {
		var div, current;

		var video_initial_data = {
		 	src: "/media/mp4/The-Surfers.mp4",
		 	controls: true
		 };
		var video = new Video({
			root: component.root,
			store: component.store,
			data: video_initial_data
		});

		return {
			c: function create() {
				div = createElement("div");
				video._fragment.c();
				div.className = "page";
				addLoc(div, file$9, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				video._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (video) video._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				video.destroy();
			}
		};
	}

	function Ch_001_004_meet_main_character(options) {
		this._debugName = '<Ch_001_004_meet_main_character>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$9(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_004_meet_main_character.prototype, protoDev);

	Ch_001_004_meet_main_character.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-005-role-of-chv.html generated by Svelte v2.16.1 */



	const file$a = "src/pages/ch-001-005-role-of-chv.html";

	function create_main_fragment$a(component, ctx) {
		var div1, h1, text1, div0, text2, text3, current;

		var lipsum0 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum1 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum2 = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div1 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "CHV in the community";
				text1 = createText("\n  ");
				div0 = createElement("div");
				lipsum0._fragment.c();
				text2 = createText("\n    ");
				lipsum1._fragment.c();
				text3 = createText("\n    ");
				lipsum2._fragment.c();
				addLoc(h1, file$a, 1, 2, 21);
				div0.className = "textbody";
				addLoc(div0, file$a, 2, 2, 53);
				div1.className = "page";
				addLoc(div1, file$a, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, h1);
				append(div1, text1);
				append(div1, div0);
				lipsum0._mount(div0, null);
				append(div0, text2);
				lipsum1._mount(div0, null);
				append(div0, text3);
				lipsum2._mount(div0, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 3);

				if (lipsum0) lipsum0._fragment.o(outrocallback);
				if (lipsum1) lipsum1._fragment.o(outrocallback);
				if (lipsum2) lipsum2._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div1);
				}

				lipsum0.destroy();
				lipsum1.destroy();
				lipsum2.destroy();
			}
		};
	}

	function Ch_001_005_role_of_chv(options) {
		this._debugName = '<Ch_001_005_role_of_chv>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$a(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_005_role_of_chv.prototype, protoDev);

	Ch_001_005_role_of_chv.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-006-introduce-data.html generated by Svelte v2.16.1 */



	const file$b = "src/pages/ch-001-006-introduce-data.html";

	function create_main_fragment$b(component, ctx) {
		var div, current;

		var video_initial_data = {
		 	src: "/media/mp4/Pigeons-and-Pond.mp4",
		 	controls: true
		 };
		var video = new Video({
			root: component.root,
			store: component.store,
			data: video_initial_data
		});

		return {
			c: function create() {
				div = createElement("div");
				video._fragment.c();
				div.className = "page";
				addLoc(div, file$b, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				video._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (video) video._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				video.destroy();
			}
		};
	}

	function Ch_001_006_introduce_data(options) {
		this._debugName = '<Ch_001_006_introduce_data>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$b(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_006_introduce_data.prototype, protoDev);

	Ch_001_006_introduce_data.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-007-return-to-chv.html generated by Svelte v2.16.1 */





	const file$c = "src/pages/ch-001-007-return-to-chv.html";

	function create_main_fragment$c(component, ctx) {
		var div2, h1, text1, div0, text2, div1, text3, text4, current;

		var video_initial_data = {
		 	src: "/media/mp4/Pigeons-and-Pond.mp4",
		 	loop: true
		 };
		var video = new Video({
			root: component.root,
			store: component.store,
			data: video_initial_data
		});

		var lipsum0 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum1 = new Lipsum({
			root: component.root,
			store: component.store
		});

		var lipsum2 = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div2 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Return to the CHV";
				text1 = createText("\n  ");
				div0 = createElement("div");
				video._fragment.c();
				text2 = createText("\n  ");
				div1 = createElement("div");
				lipsum0._fragment.c();
				text3 = createText("\n      ");
				lipsum1._fragment.c();
				text4 = createText("\n      ");
				lipsum2._fragment.c();
				addLoc(h1, file$c, 1, 2, 21);
				div0.className = "bgvideo svelte-1urkuif";
				addLoc(div0, file$c, 2, 2, 50);
				div1.className = "textbody svelte-1urkuif";
				addLoc(div1, file$c, 5, 2, 142);
				div2.className = "page svelte-1urkuif";
				addLoc(div2, file$c, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, h1);
				append(div2, text1);
				append(div2, div0);
				video._mount(div0, null);
				append(div2, text2);
				append(div2, div1);
				lipsum0._mount(div1, null);
				append(div1, text3);
				lipsum1._mount(div1, null);
				append(div1, text4);
				lipsum2._mount(div1, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 4);

				if (video) video._fragment.o(outrocallback);
				if (lipsum0) lipsum0._fragment.o(outrocallback);
				if (lipsum1) lipsum1._fragment.o(outrocallback);
				if (lipsum2) lipsum2._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div2);
				}

				video.destroy();
				lipsum0.destroy();
				lipsum1.destroy();
				lipsum2.destroy();
			}
		};
	}

	function Ch_001_007_return_to_chv(options) {
		this._debugName = '<Ch_001_007_return_to_chv>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$c(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_007_return_to_chv.prototype, protoDev);

	Ch_001_007_return_to_chv.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-001-008-big-picture.html generated by Svelte v2.16.1 */



	const file$d = "src/pages/ch-001-008-big-picture.html";

	function create_main_fragment$d(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$d, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$d, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_001_008_big_picture(options) {
		this._debugName = '<Ch_001_008_big_picture>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$d(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_001_008_big_picture.prototype, protoDev);

	Ch_001_008_big_picture.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-002-001-title.html generated by Svelte v2.16.1 */



	const file$e = "src/pages/ch-002-001-title.html";

	function create_main_fragment$e(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$e, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$e, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_002_001_title(options) {
		this._debugName = '<Ch_002_001_title>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$e(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_002_001_title.prototype, protoDev);

	Ch_002_001_title.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-002-002-background-history.html generated by Svelte v2.16.1 */



	const file$f = "src/pages/ch-002-002-background-history.html";

	function create_main_fragment$f(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$f, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$f, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_002_002_background_history(options) {
		this._debugName = '<Ch_002_002_background_history>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$f(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_002_002_background_history.prototype, protoDev);

	Ch_002_002_background_history.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-002-003-what-is-er.html generated by Svelte v2.16.1 */



	const file$g = "src/pages/ch-002-003-what-is-er.html";

	function create_main_fragment$g(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$g, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$g, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_002_003_what_is_er(options) {
		this._debugName = '<Ch_002_003_what_is_er>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$g(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_002_003_what_is_er.prototype, protoDev);

	Ch_002_003_what_is_er.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-002-004-how-er-works.html generated by Svelte v2.16.1 */



	const file$h = "src/pages/ch-002-004-how-er-works.html";

	function create_main_fragment$h(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$h, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$h, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_002_004_how_er_works(options) {
		this._debugName = '<Ch_002_004_how_er_works>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$h(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_002_004_how_er_works.prototype, protoDev);

	Ch_002_004_how_er_works.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-0025-001-title.html generated by Svelte v2.16.1 */



	const file$i = "src/pages/ch-0025-001-title.html";

	function create_main_fragment$i(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$i, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$i, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_0025_001_title(options) {
		this._debugName = '<Ch_0025_001_title>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$i(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_0025_001_title.prototype, protoDev);

	Ch_0025_001_title.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-0025-002-introducing-navrongo.html generated by Svelte v2.16.1 */



	const file$j = "src/pages/ch-0025-002-introducing-navrongo.html";

	function create_main_fragment$j(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$j, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$j, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_0025_002_introducing_navrongo(options) {
		this._debugName = '<Ch_0025_002_introducing_navrongo>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$j(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_0025_002_introducing_navrongo.prototype, protoDev);

	Ch_0025_002_introducing_navrongo.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-003-001-research-in-practice-1.html generated by Svelte v2.16.1 */



	const file$k = "src/pages/ch-003-001-research-in-practice-1.html";

	function create_main_fragment$k(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$k, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$k, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_003_001_research_in_practice_1(options) {
		this._debugName = '<Ch_003_001_research_in_practice_1>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$k(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_003_001_research_in_practice_1.prototype, protoDev);

	Ch_003_001_research_in_practice_1.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-003-002-research-in-practice-2.html generated by Svelte v2.16.1 */



	const file$l = "src/pages/ch-003-002-research-in-practice-2.html";

	function create_main_fragment$l(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$l, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$l, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_003_002_research_in_practice_2(options) {
		this._debugName = '<Ch_003_002_research_in_practice_2>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$l(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_003_002_research_in_practice_2.prototype, protoDev);

	Ch_003_002_research_in_practice_2.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-003-003-research-in-practice-3.html generated by Svelte v2.16.1 */



	const file$m = "src/pages/ch-003-003-research-in-practice-3.html";

	function create_main_fragment$m(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$m, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$m, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_003_003_research_in_practice_3(options) {
		this._debugName = '<Ch_003_003_research_in_practice_3>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$m(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_003_003_research_in_practice_3.prototype, protoDev);

	Ch_003_003_research_in_practice_3.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/pages/ch-003-004-research-in-practice-4.html generated by Svelte v2.16.1 */



	const file$n = "src/pages/ch-003-004-research-in-practice-4.html";

	function create_main_fragment$n(component, ctx) {
		var div, h1, text_1, current;

		var lipsum = new Lipsum({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Introduction";
				text_1 = createText("\n  ");
				lipsum._fragment.c();
				addLoc(h1, file$n, 1, 2, 21);
				div.className = "page";
				addLoc(div, file$n, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, text_1);
				lipsum._mount(div, null);
				current = true;
			},

			p: noop,

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (lipsum) lipsum._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div);
				}

				lipsum.destroy();
			}
		};
	}

	function Ch_003_004_research_in_practice_4(options) {
		this._debugName = '<Ch_003_004_research_in_practice_4>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign({}, options.data);
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$n(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(Ch_003_004_research_in_practice_4.prototype, protoDev);

	Ch_003_004_research_in_practice_4.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src/App.html generated by Svelte v2.16.1 */



	function data$4() {
		return {
			navOrder: [
				'Ch000000',
				'Ch000001',
				'Ch001001',
				'Ch001002',
				'Ch001003',
				'Ch001004',
				'Ch001005',
				'Ch001006',
				'Ch001007',
				'Ch001008',
				'Ch002001',
				'Ch002002',
				'Ch002003',
				'Ch002004',
				'Ch0025001',
				'Ch0025002',
				'Ch003001',
				'Ch003002',
				'Ch003003',
				'Ch003004',
			],
			navIndex: 0,
			c: {
				Ch000000: Ch_000_000_loading,
				Ch000001: Ch_000_001_title,
				Ch001001: Ch_001_001_title,
				Ch001002: Ch_001_002_introduction,
				Ch001003: Ch_001_003_provoke_interest,
				Ch001004: Ch_001_004_meet_main_character,
				Ch001005: Ch_001_005_role_of_chv,
				Ch001006: Ch_001_006_introduce_data,
				Ch001007: Ch_001_007_return_to_chv,
				Ch001008: Ch_001_008_big_picture,
				Ch002001: Ch_002_001_title,
				Ch002002: Ch_002_002_background_history,
				Ch002003: Ch_002_003_what_is_er,
				Ch002004: Ch_002_004_how_er_works,
				Ch0025001: Ch_0025_001_title,
				Ch0025002: Ch_0025_002_introducing_navrongo,
				Ch003001: Ch_003_001_research_in_practice_1,
				Ch003002: Ch_003_002_research_in_practice_2,
				Ch003003: Ch_003_003_research_in_practice_3,
				Ch003004: Ch_003_004_research_in_practice_4
			}
		}
	}
	var methods$2 = {
		nav(dir) {
			const {navOrder, navIndex} = this.get();
			if (navIndex + dir < 0 || navIndex + dir > navOrder.length-1) return
			this.set({
				navIndex: navIndex + dir
			});
		}
	};

	const file$o = "src/App.html";

	function create_main_fragment$o(component, ctx) {
		var div0, select, option0, option1, option2, select_updating = false, text3, div1, text4, div1_class_value, current;

		function select_change_handler() {
			select_updating = true;
			component.set({ navStyle: selectValue(select) });
			select_updating = false;
		}

		var if_block0 = ((ctx.navStyle==="scroll" || ctx.navStyle==="snap")) && create_if_block_1(component, ctx);

		var if_block1 = ((ctx.navStyle==="click")) && create_if_block(component, ctx);

		return {
			c: function create() {
				div0 = createElement("div");
				select = createElement("select");
				option0 = createElement("option");
				option0.textContent = "snap";
				option1 = createElement("option");
				option1.textContent = "scroll";
				option2 = createElement("option");
				option2.textContent = "click";
				text3 = createText("\n");
				div1 = createElement("div");
				if (if_block0) if_block0.c();
				text4 = createText("\n\n\t");
				if (if_block1) if_block1.c();
				option0.__value = "snap";
				option0.value = option0.__value;
				addLoc(option0, file$o, 2, 3, 59);
				option1.__value = "scroll";
				option1.value = option1.__value;
				addLoc(option1, file$o, 3, 2, 96);
				option2.__value = "click";
				option2.value = option2.__value;
				addLoc(option2, file$o, 4, 2, 137);
				addListener(select, "change", select_change_handler);
				if (!('navStyle' in ctx)) component.root._beforecreate.push(select_change_handler);
				addLoc(select, file$o, 1, 1, 27);
				div0.className = "app-options svelte-6cqgjw";
				addLoc(div0, file$o, 0, 0, 0);
				div1.id = "app";
				div1.className = div1_class_value = "nav-" + ctx.navStyle + " svelte-6cqgjw";
				addLoc(div1, file$o, 7, 0, 192);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				append(div0, select);
				append(select, option0);
				append(select, option1);
				append(select, option2);

				selectOption(select, ctx.navStyle);

				insert(target, text3, anchor);
				insert(target, div1, anchor);
				if (if_block0) if_block0.m(div1, null);
				append(div1, text4);
				if (if_block1) if_block1.m(div1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (!select_updating && changed.navStyle) selectOption(select, ctx.navStyle);

				if ((ctx.navStyle==="scroll" || ctx.navStyle==="snap")) {
					if (!if_block0) {
						if_block0 = create_if_block_1(component, ctx);
						if_block0.c();
					}
					if_block0.i(div1, text4);
				} else if (if_block0) {
					if_block0.o(function() {
						if_block0.d(1);
						if_block0 = null;
					});
				}

				if ((ctx.navStyle==="click")) {
					if (if_block1) {
						if_block1.p(changed, ctx);
					} else {
						if_block1 = create_if_block(component, ctx);
						if (if_block1) if_block1.c();
					}

					if_block1.i(div1, null);
				} else if (if_block1) {
					if_block1.o(function() {
						if_block1.d(1);
						if_block1 = null;
					});
				}

				if ((!current || changed.navStyle) && div1_class_value !== (div1_class_value = "nav-" + ctx.navStyle + " svelte-6cqgjw")) {
					div1.className = div1_class_value;
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 2);

				if (if_block0) if_block0.o(outrocallback);
				else outrocallback();

				if (if_block1) if_block1.o(outrocallback);
				else outrocallback();

				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div0);
				}

				removeListener(select, "change", select_change_handler);
				if (detach) {
					detachNode(text3);
					detachNode(div1);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};
	}

	// (9:1) {#if (navStyle==="scroll" || navStyle==="snap")}
	function create_if_block_1(component, ctx) {
		var div0, text0, div1, text1, div2, text2, div3, text3, div4, text4, div5, text5, div6, text6, div7, text7, div8, text8, div9, text9, div10, text10, div11, text11, div12, text12, div13, text13, div14, text14, div15, text15, div16, text16, div17, text17, div18, text18, div19, current;

		var ch000000 = new Ch_000_000_loading({
			root: component.root,
			store: component.store
		});

		var ch000001 = new Ch_000_001_title({
			root: component.root,
			store: component.store
		});

		var ch001001 = new Ch_001_001_title({
			root: component.root,
			store: component.store
		});

		var ch001002 = new Ch_001_002_introduction({
			root: component.root,
			store: component.store
		});

		var ch001003 = new Ch_001_003_provoke_interest({
			root: component.root,
			store: component.store
		});

		var ch001004 = new Ch_001_004_meet_main_character({
			root: component.root,
			store: component.store
		});

		var ch001005 = new Ch_001_005_role_of_chv({
			root: component.root,
			store: component.store
		});

		var ch001006 = new Ch_001_006_introduce_data({
			root: component.root,
			store: component.store
		});

		var ch001007 = new Ch_001_007_return_to_chv({
			root: component.root,
			store: component.store
		});

		var ch001008 = new Ch_001_008_big_picture({
			root: component.root,
			store: component.store
		});

		var ch002001 = new Ch_002_001_title({
			root: component.root,
			store: component.store
		});

		var ch002002 = new Ch_002_002_background_history({
			root: component.root,
			store: component.store
		});

		var ch002003 = new Ch_002_003_what_is_er({
			root: component.root,
			store: component.store
		});

		var ch002004 = new Ch_002_004_how_er_works({
			root: component.root,
			store: component.store
		});

		var ch0025001 = new Ch_0025_001_title({
			root: component.root,
			store: component.store
		});

		var ch0025002 = new Ch_0025_002_introducing_navrongo({
			root: component.root,
			store: component.store
		});

		var ch003001 = new Ch_003_001_research_in_practice_1({
			root: component.root,
			store: component.store
		});

		var ch003002 = new Ch_003_002_research_in_practice_2({
			root: component.root,
			store: component.store
		});

		var ch003003 = new Ch_003_003_research_in_practice_3({
			root: component.root,
			store: component.store
		});

		var ch003004 = new Ch_003_004_research_in_practice_4({
			root: component.root,
			store: component.store
		});

		return {
			c: function create() {
				div0 = createElement("div");
				ch000000._fragment.c();
				text0 = createText("\n\t");
				div1 = createElement("div");
				ch000001._fragment.c();
				text1 = createText("\n\t");
				div2 = createElement("div");
				ch001001._fragment.c();
				text2 = createText("\n\t");
				div3 = createElement("div");
				ch001002._fragment.c();
				text3 = createText("\n\t");
				div4 = createElement("div");
				ch001003._fragment.c();
				text4 = createText("\n\t");
				div5 = createElement("div");
				ch001004._fragment.c();
				text5 = createText("\n\t");
				div6 = createElement("div");
				ch001005._fragment.c();
				text6 = createText("\n\t");
				div7 = createElement("div");
				ch001006._fragment.c();
				text7 = createText("\n\t");
				div8 = createElement("div");
				ch001007._fragment.c();
				text8 = createText("\n\t");
				div9 = createElement("div");
				ch001008._fragment.c();
				text9 = createText("\n\t");
				div10 = createElement("div");
				ch002001._fragment.c();
				text10 = createText("\n\t");
				div11 = createElement("div");
				ch002002._fragment.c();
				text11 = createText("\n\t");
				div12 = createElement("div");
				ch002003._fragment.c();
				text12 = createText("\n\t");
				div13 = createElement("div");
				ch002004._fragment.c();
				text13 = createText("\n\t");
				div14 = createElement("div");
				ch0025001._fragment.c();
				text14 = createText("\n\t");
				div15 = createElement("div");
				ch0025002._fragment.c();
				text15 = createText("\n\t");
				div16 = createElement("div");
				ch003001._fragment.c();
				text16 = createText("\n\t");
				div17 = createElement("div");
				ch003002._fragment.c();
				text17 = createText("\n\t");
				div18 = createElement("div");
				ch003003._fragment.c();
				text18 = createText("\n\t");
				div19 = createElement("div");
				ch003004._fragment.c();
				div0.className = "page svelte-6cqgjw";
				addLoc(div0, file$o, 9, 1, 281);
				div1.className = "page svelte-6cqgjw";
				addLoc(div1, file$o, 12, 1, 324);
				div2.className = "page svelte-6cqgjw";
				addLoc(div2, file$o, 15, 1, 367);
				div3.className = "page svelte-6cqgjw";
				addLoc(div3, file$o, 18, 1, 410);
				div4.className = "page svelte-6cqgjw";
				addLoc(div4, file$o, 21, 1, 453);
				div5.className = "page svelte-6cqgjw";
				addLoc(div5, file$o, 24, 1, 496);
				div6.className = "page svelte-6cqgjw";
				addLoc(div6, file$o, 27, 1, 539);
				div7.className = "page svelte-6cqgjw";
				addLoc(div7, file$o, 30, 1, 582);
				div8.className = "page svelte-6cqgjw";
				addLoc(div8, file$o, 33, 1, 625);
				div9.className = "page svelte-6cqgjw";
				addLoc(div9, file$o, 36, 1, 668);
				div10.className = "page svelte-6cqgjw";
				addLoc(div10, file$o, 39, 1, 711);
				div11.className = "page svelte-6cqgjw";
				addLoc(div11, file$o, 42, 1, 754);
				div12.className = "page svelte-6cqgjw";
				addLoc(div12, file$o, 45, 1, 797);
				div13.className = "page svelte-6cqgjw";
				addLoc(div13, file$o, 48, 1, 840);
				div14.className = "page svelte-6cqgjw";
				addLoc(div14, file$o, 51, 1, 883);
				div15.className = "page svelte-6cqgjw";
				addLoc(div15, file$o, 54, 1, 927);
				div16.className = "page svelte-6cqgjw";
				addLoc(div16, file$o, 57, 1, 971);
				div17.className = "page svelte-6cqgjw";
				addLoc(div17, file$o, 60, 1, 1014);
				div18.className = "page svelte-6cqgjw";
				addLoc(div18, file$o, 63, 1, 1057);
				div19.className = "page svelte-6cqgjw";
				addLoc(div19, file$o, 66, 1, 1100);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);
				ch000000._mount(div0, null);
				insert(target, text0, anchor);
				insert(target, div1, anchor);
				ch000001._mount(div1, null);
				insert(target, text1, anchor);
				insert(target, div2, anchor);
				ch001001._mount(div2, null);
				insert(target, text2, anchor);
				insert(target, div3, anchor);
				ch001002._mount(div3, null);
				insert(target, text3, anchor);
				insert(target, div4, anchor);
				ch001003._mount(div4, null);
				insert(target, text4, anchor);
				insert(target, div5, anchor);
				ch001004._mount(div5, null);
				insert(target, text5, anchor);
				insert(target, div6, anchor);
				ch001005._mount(div6, null);
				insert(target, text6, anchor);
				insert(target, div7, anchor);
				ch001006._mount(div7, null);
				insert(target, text7, anchor);
				insert(target, div8, anchor);
				ch001007._mount(div8, null);
				insert(target, text8, anchor);
				insert(target, div9, anchor);
				ch001008._mount(div9, null);
				insert(target, text9, anchor);
				insert(target, div10, anchor);
				ch002001._mount(div10, null);
				insert(target, text10, anchor);
				insert(target, div11, anchor);
				ch002002._mount(div11, null);
				insert(target, text11, anchor);
				insert(target, div12, anchor);
				ch002003._mount(div12, null);
				insert(target, text12, anchor);
				insert(target, div13, anchor);
				ch002004._mount(div13, null);
				insert(target, text13, anchor);
				insert(target, div14, anchor);
				ch0025001._mount(div14, null);
				insert(target, text14, anchor);
				insert(target, div15, anchor);
				ch0025002._mount(div15, null);
				insert(target, text15, anchor);
				insert(target, div16, anchor);
				ch003001._mount(div16, null);
				insert(target, text16, anchor);
				insert(target, div17, anchor);
				ch003002._mount(div17, null);
				insert(target, text17, anchor);
				insert(target, div18, anchor);
				ch003003._mount(div18, null);
				insert(target, text18, anchor);
				insert(target, div19, anchor);
				ch003004._mount(div19, null);
				current = true;
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				outrocallback = callAfter(outrocallback, 20);

				if (ch000000) ch000000._fragment.o(outrocallback);
				if (ch000001) ch000001._fragment.o(outrocallback);
				if (ch001001) ch001001._fragment.o(outrocallback);
				if (ch001002) ch001002._fragment.o(outrocallback);
				if (ch001003) ch001003._fragment.o(outrocallback);
				if (ch001004) ch001004._fragment.o(outrocallback);
				if (ch001005) ch001005._fragment.o(outrocallback);
				if (ch001006) ch001006._fragment.o(outrocallback);
				if (ch001007) ch001007._fragment.o(outrocallback);
				if (ch001008) ch001008._fragment.o(outrocallback);
				if (ch002001) ch002001._fragment.o(outrocallback);
				if (ch002002) ch002002._fragment.o(outrocallback);
				if (ch002003) ch002003._fragment.o(outrocallback);
				if (ch002004) ch002004._fragment.o(outrocallback);
				if (ch0025001) ch0025001._fragment.o(outrocallback);
				if (ch0025002) ch0025002._fragment.o(outrocallback);
				if (ch003001) ch003001._fragment.o(outrocallback);
				if (ch003002) ch003002._fragment.o(outrocallback);
				if (ch003003) ch003003._fragment.o(outrocallback);
				if (ch003004) ch003004._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div0);
				}

				ch000000.destroy();
				if (detach) {
					detachNode(text0);
					detachNode(div1);
				}

				ch000001.destroy();
				if (detach) {
					detachNode(text1);
					detachNode(div2);
				}

				ch001001.destroy();
				if (detach) {
					detachNode(text2);
					detachNode(div3);
				}

				ch001002.destroy();
				if (detach) {
					detachNode(text3);
					detachNode(div4);
				}

				ch001003.destroy();
				if (detach) {
					detachNode(text4);
					detachNode(div5);
				}

				ch001004.destroy();
				if (detach) {
					detachNode(text5);
					detachNode(div6);
				}

				ch001005.destroy();
				if (detach) {
					detachNode(text6);
					detachNode(div7);
				}

				ch001006.destroy();
				if (detach) {
					detachNode(text7);
					detachNode(div8);
				}

				ch001007.destroy();
				if (detach) {
					detachNode(text8);
					detachNode(div9);
				}

				ch001008.destroy();
				if (detach) {
					detachNode(text9);
					detachNode(div10);
				}

				ch002001.destroy();
				if (detach) {
					detachNode(text10);
					detachNode(div11);
				}

				ch002002.destroy();
				if (detach) {
					detachNode(text11);
					detachNode(div12);
				}

				ch002003.destroy();
				if (detach) {
					detachNode(text12);
					detachNode(div13);
				}

				ch002004.destroy();
				if (detach) {
					detachNode(text13);
					detachNode(div14);
				}

				ch0025001.destroy();
				if (detach) {
					detachNode(text14);
					detachNode(div15);
				}

				ch0025002.destroy();
				if (detach) {
					detachNode(text15);
					detachNode(div16);
				}

				ch003001.destroy();
				if (detach) {
					detachNode(text16);
					detachNode(div17);
				}

				ch003002.destroy();
				if (detach) {
					detachNode(text17);
					detachNode(div18);
				}

				ch003003.destroy();
				if (detach) {
					detachNode(text18);
					detachNode(div19);
				}

				ch003004.destroy();
			}
		};
	}

	// (72:1) {#if (navStyle==="click")}
	function create_if_block(component, ctx) {
		var div0, text0, div1, text1_value = ctx.navOrder[ctx.navIndex], text1, text2, a0, text4, a1, current;

		var switch_value = ctx.c[ctx.navOrder[ctx.navIndex]];

		function switch_props(ctx) {
			return {
				root: component.root,
				store: component.store
			};
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		function click_handler(event) {
			event.preventDefault();
			component.nav(-1);
		}

		function click_handler_1(event) {
			event.preventDefault();
			component.nav(1);
		}

		return {
			c: function create() {
				div0 = createElement("div");
				if (switch_instance) switch_instance._fragment.c();
				text0 = createText("\n\n\t");
				div1 = createElement("div");
				text1 = createText(text1_value);
				text2 = createText("\n\t\t");
				a0 = createElement("a");
				a0.textContent = "prev";
				text4 = createText("\n\t\t");
				a1 = createElement("a");
				a1.textContent = "next";
				div0.className = "page svelte-6cqgjw";
				addLoc(div0, file$o, 72, 1, 1179);
				addListener(a0, "click", click_handler);
				a0.href = "#";
				a0.className = "svelte-6cqgjw";
				addLoc(a0, file$o, 78, 2, 1312);
				addListener(a1, "click", click_handler_1);
				a1.href = "#";
				a1.className = "svelte-6cqgjw";
				addLoc(a1, file$o, 79, 2, 1369);
				div1.className = "nav-bar svelte-6cqgjw";
				addLoc(div1, file$o, 76, 1, 1265);
			},

			m: function mount(target, anchor) {
				insert(target, div0, anchor);

				if (switch_instance) {
					switch_instance._mount(div0, null);
				}

				insert(target, text0, anchor);
				insert(target, div1, anchor);
				append(div1, text1);
				append(div1, text2);
				append(div1, a0);
				append(div1, text4);
				append(div1, a1);
				current = true;
			},

			p: function update(changed, ctx) {
				if (switch_value !== (switch_value = ctx.c[ctx.navOrder[ctx.navIndex]])) {
					if (switch_instance) {
						const old_component = switch_instance;
						old_component._fragment.o(() => {
							old_component.destroy();
						});
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));
						switch_instance._fragment.c();
						switch_instance._mount(div0, null);
					} else {
						switch_instance = null;
					}
				}

				if ((!current || changed.navOrder || changed.navIndex) && text1_value !== (text1_value = ctx.navOrder[ctx.navIndex])) {
					setData(text1, text1_value);
				}
			},

			i: function intro(target, anchor) {
				if (current) return;

				this.m(target, anchor);
			},

			o: function outro(outrocallback) {
				if (!current) return;

				if (switch_instance) switch_instance._fragment.o(outrocallback);
				current = false;
			},

			d: function destroy(detach) {
				if (detach) {
					detachNode(div0);
				}

				if (switch_instance) switch_instance.destroy();
				if (detach) {
					detachNode(text0);
					detachNode(div1);
				}

				removeListener(a0, "click", click_handler);
				removeListener(a1, "click", click_handler_1);
			}
		};
	}

	function App(options) {
		this._debugName = '<App>';
		if (!options || (!options.target && !options.root)) {
			throw new Error("'target' is a required option");
		}

		init(this, options);
		this._state = assign(data$4(), options.data);
		if (!('navStyle' in this._state)) console.warn("<App> was created without expected data property 'navStyle'");
		if (!('c' in this._state)) console.warn("<App> was created without expected data property 'c'");
		if (!('navOrder' in this._state)) console.warn("<App> was created without expected data property 'navOrder'");
		if (!('navIndex' in this._state)) console.warn("<App> was created without expected data property 'navIndex'");
		this._intro = !!options.intro;

		this._fragment = create_main_fragment$o(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}

		this._intro = true;
	}

	assign(App.prototype, protoDev);
	assign(App.prototype, methods$2);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	const app = new App({
		target: document.body
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
