/**
 * Updates all external links on the current page by adding `target="_blank"` and
 * `rel="external noopener noreferrer"` attributes to them.
 */
export function updateExternalLinks() {
	// Select all anchor (`<a>`) elements whose `href` attribute starts with 'http' and does not contain the current host
	const potentialExternalLinks = document.querySelectorAll(
		"a[href^='http']:not([href*='" + window.location.host + "'])"
	)

	/**
	 * Checks if a given URL is external by comparing its host to the current window's host.
	 *
	 * @param {string} url - The URL to check.
	 * @returns {boolean} `true` if the URL is external, `false` otherwise.
	 */
	const isExternalLink = (url) => {
		const tmp = document.createElement("a")
		tmp.href = url
		return tmp.host !== window.location.host
	}

	// SVG icon for external links
	const externalLinkIcon = `
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
			<polyline points="15 3 21 3 21 9"></polyline>
			<line x1="10" y1="14" x2="21" y2="3"></line>
		</svg>`

	// Iterate through each potential external link found
	potentialExternalLinks.forEach((link) => {
		// Check if the link is external
		if (isExternalLink(link.href)) {
			// If external, set attributes to open link in a new tab and improve security
			link.setAttribute("target", "_blank")
			link.setAttribute("rel", "external noopener noreferrer")
			link.setAttribute("title", `External link to ${link.textContent}. Opens in a new tab.`)

			// Insert the SVG icon after the link's text
			link.insertAdjacentHTML("beforeend", `${externalLinkIcon}`)
		}
	})
}
