// This is your main script file

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


	function initApp() {
		disableNavLinks();
	}

	function detectWidth(x) {
		if (x.matches) { // If media query matches
			navMenu.style.width = "60%";
		} else {
			navMenu.style.width = "100%";
		}
	}
	let x = window.matchMedia("(min-width: 1024px)");

	navButton.addEventListener('click', event => {
		event.preventDefault();
		document.body.classList.toggle('active');
		if (document.body.classList.contains('active')) {
			enableNavLinks();
			detectWidth(x); // Call listener function at run time
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
			detectWidth(x); // Call listener function at run time
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
		: (document.title = currentTabTitle);
});

/** Add icon to external links */
/** -------------------------  */
const externalLinks = document.querySelectorAll('[target="_blank"]');
for (let externalLink of externalLinks) {
	externalLink.setAttribute('rel', 'external noopener')
	externalLink.insertAdjacentHTML('beforeend', ' <i class="gg-external" role ="img" aria-label=" (opens in a new tab)"></i> ');
}

/** Check if post has featured image and add class */
/** ---------------------------------------------  */
const sidebar = document.querySelector('.sidebar');
if (sidebar.style.backgroundImage) {
	sidebar.classList.add('bio');
}