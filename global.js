'use strict';

/** Web Components - Custom Elements */
/** -------------------------------  */

/** MainNav | main-navigation */
class MainNav extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="main-navigation" aria-label="Main navigation" class="overlay" tabindex="-1">
				<a href="javascript:void(0)" id="close-button" class="close-button" aria-label="Close menu" title="Close menu">&times;</a>
				<div class="overlay-content">
					<a href="/about.html">About</a>
					<a href="https://github.com/LebCit" target="_blank" rel="external noopener">GitHub <i class="gg-external" role="img" aria-label=" (opens in a new tab)"></i></a>
				</div>
			</div>
		`;
	}
}
customElements.define('main-navigation', MainNav);

/** TheHeader | the-header */
class TheHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="sidebar unit-1 unit-lg-2-5">
				<div class="header">
					<h1 class="brand-title">
						<a href="/">&lbrace; LebCit &rbrace;</a>
					</h1>
					<p class="brand-tagline">
						Autodidactic WordPress Developer.<br>
						Love to Read, Learn & DIMySelf !
					</p>

					<nav class="nav">
						<ul class="nav-list">
							
							<li class="nav-item">
								<a id="menu-button" aria-controls="main-navigation" aria-haspopup="true" tabindex="0" role="button">
									MENU
									<span class="menu-icon" aria-hidden="true">
										<svg version='1.1' x='0px' y='0px' width='30px' height='30px' viewBox='0 0 30 30' enable-background='new 0 0 30 30'><rect width='30' height='5'/><rect y='24' width='30' height='5' /><rect y='12' width='30' height='5'/></svg>
								  	</span>
								</a>
							</li>
						</ul>
						
					</nav>
				</div>
			</div>
		`;
	}
}
customElements.define('the-header', TheHeader);


/** Navigation | Open/Close */
/** ----------------------- */
let openCloseMenu = {};
openCloseMenu.App = (function () {
	const navButton = document.getElementById('menu-button');
	const navMenu = document.querySelector('#main-navigation');
	const navLinks = navMenu.querySelectorAll("a");
	let lastNavLink = navMenu.lastElementChild.lastElementChild;
	let beforeLastNavLink = lastNavLink.previousElementSibling;
	const closeButton = document.getElementById('close-button');
	let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;


	function initApp() {
		disableNavLinks();
	}

	navButton.addEventListener('click', event => {
		event.preventDefault();
		document.body.classList.toggle('active');
		if (document.body.classList.contains('active')) {
			enableNavLinks();
			if (w < "1024") {
				navMenu.style.width = "100%";
			} else {
				navMenu.style.width = "60%";
			}
		} else {
			disableNavLinks();
			navMenu.style.width = "0%";
		}
	});

	navButton.addEventListener('keydown', event => {
		if ((document.body.classList.contains('active')) && (event.key === " " || event.key === "Enter" || event.key === "Spacebar" || event.key === "Esc" || event.key === "Escape")) {
			event.preventDefault();
			document.body.classList.remove('active');
			disableNavLinks();
			navMenu.style.width = "0%";
		} else if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
			event.preventDefault();
			document.body.classList.add('active');
			enableNavLinks();
			if (w < "1024") {
				navMenu.style.width = "100%";
			} else {
				navMenu.style.width = "60%";
			}
		}
	});

	closeButton.addEventListener('click', event => {
		event.preventDefault();
		document.body.classList.remove('active');
		disableNavLinks();
		navMenu.style.width = "0%";
		navButton.focus();
	});

	closeButton.addEventListener('keydown', event => {
		if ((event.key === " " || event.key === "Enter" || event.key === "Spacebar" || event.key === "Esc" || event.key === "Escape")) {
			event.preventDefault();
			document.body.classList.remove('active');
			disableNavLinks();
			navMenu.style.width = "0%";
			navButton.focus();
		} else if (event.shiftKey && event.key === "Tab") {
			event.preventDefault();
			lastNavLink.focus();
		}
	});

	lastNavLink.addEventListener('keydown', event => {
		if (event.shiftKey && event.key === "Tab") {
			event.preventDefault();
			beforeLastNavLink.focus();
		} else if (event.key === "Tab") {
			event.preventDefault();
			closeButton.focus();
		}
	});

	function enableNavLinks() {
		navLinks[0].focus();
		navButton.setAttribute('aria-label', 'Menu expanded');
		navMenu.removeAttribute('aria-hidden');
		navLinks.forEach(function (link) {
			link.removeAttribute('tabIndex');
		});
	}

	function disableNavLinks() {
		navButton.setAttribute('aria-label', 'Menu collapsed');
		navMenu.setAttribute('aria-hidden', 'true');
		navLinks.forEach(function (link) {
			link.setAttribute('tabIndex', '-1');
		});
	}

	return {
		init: function () {
			initApp();
		}
	}
})();

window.addEventListener('DOMContentLoaded', (event) => {
	event.preventDefault();
	new openCloseMenu.App.init();
});

/** Helps with accessibility for keyboard only users. */
/** ------------------------------------------------- */
(function () {
	var isIe = /(trident|msie)/i.test(navigator.userAgent);

	if (isIe && document.getElementById && window.addEventListener) {
		window.addEventListener('hashchange', function () {
			var id = location.hash.substring(1),
				element;

			if (!(/^[A-z0-9_-]+$/.test(id))) {
				return;
			}

			element = document.getElementById(id);

			if (element) {
				if (!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false);
	}
}());

/** Change document title */
/** --------------------  */
// Grab the document title of the current tab.
let currentTabTitle = document.title;
// Listen to visibility change events
document.addEventListener('visibilitychange', function () {
	// Fires when user leaves site's tab.
	document.visibilityState === "hidden"
		// Document title when user leaves site's tab.
		? (document.title = `Ne Me Quitte Pas 😭`)
		// Document title when user comes back to site's tab.
	// Document title when user comes back to site's tab. 
		// Document title when user comes back to site's tab.
		: (document.title = currentTabTitle);
});