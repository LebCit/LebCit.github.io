const searchInput = document.getElementById("searchInput")
searchInput.focus()

document.getElementById("searchForm").addEventListener("submit", async function (event) {
	event.preventDefault() // Prevent the default form submission

	const searchQuery = document.getElementById("searchInput").value.toLowerCase() // Get the user's search query
	const searchResultDiv = document.getElementById("searchResult") // Get the div where the results will be displayed
	searchResultDiv.innerHTML = "" // Clear previous results

	try {
		const response = await fetch("/static/scripts/posts.json")
		if (!response.ok) {
			throw new Error("Network response was not ok")
		}

		const posts = await response.json()
		const filteredPosts = posts.filter((post) => {
			return (
				post.title.toLowerCase().includes(searchQuery) || post.description.toLowerCase().includes(searchQuery)
			)
		})

		if (filteredPosts.length > 0) {
			const postCountText = `Your search returned ${filteredPosts.length} post${
				filteredPosts.length > 1 ? "s" : ""
			}`
			searchResultDiv.insertAdjacentHTML("beforeend", `<p>${postCountText}</p>`)

			filteredPosts.forEach((post) => {
				// Generate the tags HTML
				const tagsHTML = post.tags
					.map((tag) => `<span class="post-tag"><a href="/tags/${encodeURIComponent(tag)}">${tag}</a></span>`)
					.join(" ")

				// Format the publish date
				const publishDate = new Date(post.publish_date).toDateString()

				// Construct the HTML for each post
				const postHTML = `
                    <article class="postList-article">
                        <header class="post-header">
                            <h2 class="post-title">
                                <a href="/posts/${post.fileBaseName}" class="postList-link" rel="bookmark">${post.title}</a>
                            </h2>
                            <p class="post-meta">
                                <span>Posted on</span>
                                <span class="posted-on">
                                    <time class="postList-date" datetime="${post.publish_date}">
                                        ${publishDate}
                                    </time>
                                </span>
                                <br>
                                Tagged
                                ${tagsHTML}
                            </p>
                        </header>

                        <div class="postList-description">
                            <p>This post is about ${post.description}.</p>
                        </div>
                        <p>
                            <a href="/posts/${post.fileBaseName}" class="read-more-link" aria-label="Read More about ${post.title}" tabindex="0" role="button" target="_self">
                                Read The Post
                            </a>
                        </p>
                    </article>
                `

				// Append the generated post HTML to the search result div
				searchResultDiv.insertAdjacentHTML("beforeend", postHTML)
			})
		} else {
			searchResultDiv.innerHTML =
				'<p>Sorry, your search didn\'t return any result. <br /> Please try some other keyword(s) or, <br /> browse the posts in the <a class="archive-link" href="/posts">archive</a> 📦</p>'
		}
	} catch (error) {
		console.error("Error fetching the posts:", error)
		searchResultDiv.innerHTML = "<p>An error occurred while searching. Please try again later.</p>"
	}
})
