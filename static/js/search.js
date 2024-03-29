// Focus on the search input as soon as the search page loads
const searchInput = document.getElementById("searchInput")
searchInput.focus()

const postPreviewFallbackImageSpan = document.getElementById("post-preview-fallback-image")
const postPreviewFallbackImage = JSON.parse(postPreviewFallbackImageSpan.textContent)
postPreviewFallbackImageSpan.remove()

// Fetch the posts from posts.json
fetch("/static/js/posts.json")
	.then((response) => response.json())
	.then((posts) => {
		// Get the searched string and assign it to a query constant
		const params = new URLSearchParams(window.location.search)
		const query = params.get("searchString")

		// Global and case insensitive regex to filter the posts depending on the query
		const reg = new RegExp(query, "gi")

		// Filter the posts by title and content depending on the regex
		const titleSearch = posts.filter((post) => post[1].frontmatter.title.match(reg))
		const contentSearch = posts.filter((post) => post[1].content.match(reg))

		// Concatenate the results of titleSearch and contentSearch
		const concat = titleSearch.concat(contentSearch)

		// Get the unique result(s) by removing duplicates from concat array
		const uniqueProps = []
		const result = concat.filter((post) => {
			const isDuplicate = uniqueProps.includes(post[1].frontmatter.title)

			if (!isDuplicate) {
				uniqueProps.push(post[1].frontmatter.title)

				return true
			}

			return false
		})

		// If a search is made and the result array is not empty
		if (query && result.length > 0) {
			// Define an empty string that will hold the search result(s)
			let searchResultString = ""
			// Define the markup for each post of the result array
			result.forEach((post, index) => {
				const postFilename = post[0].replace(/\.[^/.]+$/, "")
				const postTitle = post[1].frontmatter.title
				const postFeaturedImage = post[1].frontmatter.featuredImage
				const postDate = post[1].frontmatter.date
				const postDescription = post[1].frontmatter.description
				const postTags = post[1].frontmatter.tags
				const postContent = post[1].content
				const postExcerpt = postContent.substring(0, 180) + "..."

				// Define the image path depending on the postFeaturedImage
				let imagePath
				if (!postFeaturedImage) {
					imagePath = postPreviewFallbackImage
				} else {
					imagePath = postFeaturedImage
				}

				// Define an empty string that will hold the tag(s) if any
				let tagsLinks = "",
					tagLink
				// If a post have tag(s)
				if (postTags) {
					// Define the markup of each tag
					postTags.forEach((tag) => {
						tagLink = `<span class="post-tag"><a href="/tags/${tag}">${tag}</a></span> `
						// Add each tag markup to the tagsLinks
						tagsLinks += tagLink
					})
				}

				// Define the markup of the preview for a post
				const singlePostPreview = `
				<article class="postList-article">
					<header class="post-header">
						<h2 class="post-title">
							<a href="/posts/${postFilename}" class="postList-link" rel="bookmark">${postTitle}</a>
						</h2>
						<p class="post-meta">
							<span>Posted on</span>
							<span class="posted-on">
								<time class="postList-date" datetime="${postDate.replace("/", "-")}">
									${new Date(postDate).toDateString()}
								</time>
							</span>

							<br />
							Tagged
							${postTags ? `${tagsLinks}` : ""}
						</p>
					</header>

					<div class="postList-description">
						<p>This post is about ${postDescription}</p>
					</div>
					<p>
						<a
							href="/posts/${postFilename}"
							class="read-more-link"
							aria-label="Read More about ${postTitle}"
							tabindex="0"
							role="button"
							target="_self"
						>
							Read The Post
						</a>
					</p>
				</article>`

				// Add each post preview markup to the searchResultString
				searchResultString += singlePostPreview
			})
			// Count the number of matching post(s)
			let searchResultCount
			if (result.length >= 2) {
				searchResultCount = `<p>Your search returned ${result.length} posts</p>`
			} else {
				searchResultCount = `<p>Your search returned 1 post</p>`
			}
			// Insert searchResultCount at the beginning of searchResult
			const searchResult = document.getElementById("searchResult")
			searchResult.insertAdjacentHTML("afterbegin", searchResultCount)
			// Insert the searchResultString at the end of the content
			const content = document.getElementById("content")
			content.insertAdjacentHTML("beforeend", searchResultString)
		} else if (query && !result.length) {
			// Define a message when no result comes back from a search
			const noResult = `
			<p>
				Sorry, your search didn't return any result.
				<br />
				Please try some other keyword(s) or,
				<br />
				browse the posts in the
				<a class="archive-link" href="/posts">archive</a>
				📦
			</p>
			`
			// Insert searchResultCount at the beginning of searchResult
			const searchResult = document.getElementById("searchResult")
			searchResult.insertAdjacentHTML("afterbegin", noResult)
		}
	})
