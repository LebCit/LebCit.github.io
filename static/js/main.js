/**
 * File main.js.
 *
 * Helps with accessibility for keyboard only users.
 * Learn more: https://git.io/vWdr2
 *
 * Handles navigation's behavior (Open/Close).
 * Traps TAB inside navigation.
 * Moves navigation's place in DOM depending on window width.
 *
 * Changes document title when user leaves site's tab.
 *
 * Adds icon to external links.
 *
 * Close others <details> tag.
 */

/** skip-link-focus-fix */
;(function () {
	var isIe = /(trident|msie)/i.test(navigator.userAgent)

	if (isIe && document.getElementById && window.addEventListener) {
		window.addEventListener(
			"hashchange",
			function () {
				var id = location.hash.substring(1),
					element

				if (!/^[A-z0-9_-]+$/.test(id)) {
					return
				}

				element = document.getElementById(id)

				if (element) {
					if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
						element.tabIndex = -1
					}

					element.focus()
				}
			},
			false
		)
	}
})()

if (!window.location.pathname.startsWith("/admin")) {
	/** Navigation | Open/Close */
	let openCloseMenu = {}
	openCloseMenu.App = (function () {
		const navButton = document.getElementById("menu-button")
		const navMenu = document.querySelector("#main-nav")
		const navLinks = navMenu.querySelectorAll("a")
		let lastNavLink = navMenu.lastElementChild.lastElementChild
		let beforeLastNavLink = lastNavLink.previousElementSibling
		const closeButton = document.getElementById("close-button")
		let mql = window.matchMedia("(min-width: 1024px)")

		function initApp() {
			disableNavLinks()
		}

		navButton.addEventListener("click", (event) => {
			event.preventDefault()
			document.body.classList.toggle("active")
			if (document.body.classList.contains("active")) {
				enableNavLinks()
				if (window.matchMedia("screen and (min-width: 1024px)").matches) {
					navMenu.style.width = "60%"
				} else {
					navMenu.style.width = "100%"
				}
			} else {
				disableNavLinks()
				navMenu.style.width = "0%"
			}
		})

		/* Listen to window width and change navMenu width accordingly. */
		mql.addEventListener("change", (e) => {
			if (document.body.classList.contains("active")) {
				if (e.matches) {
					/* the viewport is 1024 pixels or more */
					navMenu.style.width = "60%"
				} else {
					/* the viewport is 1023 pixels or less */
					navMenu.style.width = "100%"
				}
			} else {
				disableNavLinks()
				navMenu.style.width = "0%"
			}
		})

		navButton.addEventListener("keydown", (event) => {
			if (
				document.body.classList.contains("active") &&
				(event.key === " " ||
					event.key === "Enter" ||
					event.key === "Spacebar" ||
					event.key === "Esc" ||
					event.key === "Escape")
			) {
				event.preventDefault()
				document.body.classList.remove("active")
				disableNavLinks()
				navMenu.style.width = "0%"
			} else if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
				event.preventDefault()
				document.body.classList.add("active")
				enableNavLinks()
				if (window.matchMedia("screen and (min-width: 1024px)").matches) {
					navMenu.style.width = "60%"
				} else {
					navMenu.style.width = "100%"
				}
			}
		})

		closeButton.addEventListener("click", (event) => {
			event.preventDefault()
			document.body.classList.remove("active")
			disableNavLinks()
			navMenu.style.width = "0%"
			navButton.focus()
		})

		closeButton.addEventListener("keydown", (event) => {
			if (
				event.key === " " ||
				event.key === "Enter" ||
				event.key === "Spacebar" ||
				event.key === "Esc" ||
				event.key === "Escape"
			) {
				event.preventDefault()
				document.body.classList.remove("active")
				disableNavLinks()
				navMenu.style.width = "0%"
				navButton.focus()
			} else if (event.shiftKey && event.key === "Tab") {
				event.preventDefault()
				lastNavLink.focus()
			}
		})

		lastNavLink.addEventListener("keydown", (event) => {
			if (event.shiftKey && event.key === "Tab") {
				event.preventDefault()
				beforeLastNavLink.focus()
			} else if (event.key === "Tab") {
				event.preventDefault()
				closeButton.focus()
			}
		})

		function enableNavLinks() {
			/**
			 * For accessibility to work, we have to hide navMenu.
			 * To focus on closeButton after it becomes visible,
			 * we use a setTimeout() function to run the focus() method
			 * after 100 ms of clicking on navButton.
			 */
			setTimeout(function () {
				closeButton.focus()
			}, 100)
			navButton.setAttribute("aria-label", "Menu expanded")
			navMenu.removeAttribute("aria-hidden")
			navMenu.classList.remove("invisible")
			navLinks.forEach(function (link) {
				link.removeAttribute("tabIndex")
			})
		}

		function disableNavLinks() {
			navButton.setAttribute("aria-label", "Menu collapsed")
			navMenu.setAttribute("aria-hidden", "true")
			navMenu.classList.add("invisible")
			navLinks.forEach(function (link) {
				link.setAttribute("tabIndex", "-1")
			})
		}

		return {
			init: function () {
				initApp()
			},
		}
	})()

	window.addEventListener("DOMContentLoaded", (event) => {
		event.preventDefault()
		new openCloseMenu.App.init()
	})

	/** Move navigation depending on window width */
	let newMQL = window.matchMedia("(min-width: 1024px)")
	let insertedNode = document.getElementById("nav")
	let originalParent = document.querySelector("div.sidebar")
	let parentNode = document.getElementById("page")
	let originalReference = document.querySelector("div.site-branding")
	let referenceNode = document.getElementById("masthead")

	if (window.matchMedia("screen and (max-width: 1023.5px)").matches) {
		parentNode.insertBefore(insertedNode, referenceNode)
	}

	newMQL.addEventListener("change", (e) => {
		if (!e.matches) {
			/* the viewport is 1023 pixels or less */
			parentNode.insertBefore(insertedNode, referenceNode)
		} else {
			/* the viewport is 1024 pixels or more */
			originalParent.insertBefore(insertedNode, originalReference.nextSibling)
		}
	})
}

/** Change document title */
// Grab the document title of the current tab.
let currentTabTitle = document.title
// Listen to visibility change events
document.addEventListener("visibilitychange", function () {
	// Fires when user leaves site's tab.
	document.visibilityState === "hidden"
		? // Document title when user leaves site's tab.
		  (document.title = `Ne Me Quitte Pas 😭`)
		: // Document title when user comes back to site's tab.
		  (document.title = currentTabTitle)
})

// Detect external links
const isExternalLink = (url) => {
	const tmp = document.createElement("a")
	tmp.href = url
	return tmp.host !== window.location.host
}
// Select all links
const allLinks = document.querySelectorAll("a")
// Add attributes and icon to each external link
allLinks.forEach((link) => {
	if (isExternalLink(link) && link.id != "close-button") {
		link.setAttribute("target", "_blank")
		link.setAttribute("rel", "external noopener noreferrer")
		link.insertAdjacentHTML(
			"beforeend",
			`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-external-link" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: bottom;">
<title>External link. Opens in a new tab</title>
<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
<path d="M11 13l9 -9"></path>
<path d="M15 4h5v5"></path>
</svg>`
		)
	}
})

/** Close others <details> tag */
const allDetails = document.querySelectorAll("details")

allDetails.forEach((details) => {
	details.addEventListener("toggle", (e) => {
		if (details.open) {
			allDetails.forEach((details) => {
				if (details != e.target && details.open) {
					details.open = false
				}
			})
		}
	})
})
