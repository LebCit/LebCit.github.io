/**
 * URL Redirect Handler for GitHub Pages
 * Handles migration from old URL structure to new one
 */

// Specific post title mappings for renamed posts
const POST_TITLE_MAPPINGS = {
	"google-ql-wrapper": "googles-query-language-wrapper",
	"breaking-up-with-express": "breaking-up-with-expressjs",
	"from-regexes-to-ast": "from-regexes-to-ast-ste-journey-to-adulthood",
	"blog-doc-the-simplest-nodejs-cms-ssg": "blog-doc-the-simplest-nodejs-cms-and-ssg",
	"modifying-wordpress-theme-copyright-from-the-customizer":
		"modifying-wordpress-themes-copyright-from-the-customizer",
	"hide-wordpress-toolbar-with-wp_add_inline_style": "hide-wordpress-toolbar-with-wp-add-inline-style",
	"transferring-variables-and-functions-from-server-to-client-in-a-node-js-application-using-ejs-and-eta":
		"transferring-variables-and-functions-from-server-to-client-in-a-nodejs-application-using-ejs-and-eta",
	"ultimate-markdown-based-application-tutorial-in-node-js": "ultimate-markdown-based-application-tutorial-in-nodejs",
}

/**
 * Handle URL redirects from old structure to new structure
 * @returns {boolean} - Returns true if redirect was performed
 */
function handleRedirect() {
	const currentPath = window.location.pathname
	const currentHost = window.location.origin
	let newPath = null

	// Handle /posts/ → /post/ redirects
	if (currentPath.startsWith("/posts/")) {
		const postSlug = currentPath.replace("/posts/", "")
		const mappedSlug = POST_TITLE_MAPPINGS[postSlug] || postSlug
		newPath = "/post/" + mappedSlug + "/"
	}

	// Handle /tags/ → /tag/ redirects (and convert to lowercase)
	// But skip the tags listing page itself (/tags/ or /tags)
	else if (currentPath.startsWith("/tags/") && currentPath !== "/tags/" && currentPath !== "/tags") {
		const tagName = currentPath.replace("/tags/", "").toLowerCase()
		newPath = "/tag/" + tagName + "/"
	}

	// Handle /pages/ → /page/ redirects
	else if (currentPath.startsWith("/pages/")) {
		const pageName = currentPath.replace("/pages/", "")
		newPath = "/page/" + pageName + "/"
	}

	// Perform redirect if a new path was determined
	if (newPath && newPath !== currentPath) {
		console.log("Redirecting from", currentPath, "to", newPath)
		window.location.replace(currentHost + newPath)
		return true
	}

	return false
}

/**
 * Initialize redirect handling
 */
export function initRedirect() {
	// Only run on pages that need redirecting
	const currentPath = window.location.pathname

	if (currentPath.startsWith("/posts/") || currentPath.startsWith("/tags/") || currentPath.startsWith("/pages/")) {
		handleRedirect()
	}
}
