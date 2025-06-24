/**
 * Enhanced search functionality with better performance and features
 *
 * @param {HTMLElement} searchInput
 * @param {HTMLElement} searchResults
 * @param {Array} searchIndex
 * @param {Object} options - Configuration options
 */
export function initializeSearch(searchInput, searchResults, searchIndex, options = {}) {
    const config = {
        minQueryLength: 2,
        debounceDelay: 250,
        maxResults: 20,
        previewLength: 150,
        highlightClass: "highlight",
        searchInContent: true,
        searchInTags: true,
        caseSensitive: false,
        maxCacheSize: 100,
        ...options,
    }

    // Cache for performance
    const searchCache = new Map()

    function debounce(func, wait) {
        let timeout
        return function (...args) {
            clearTimeout(timeout)
            timeout = setTimeout(() => func.apply(this, args), wait)
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    function performSearch(query) {
        const trimmedQuery = query.trim()

        if (!trimmedQuery || trimmedQuery.length < config.minQueryLength) {
            hideResults()
            return
        }

        // Check cache first
        if (searchCache.has(trimmedQuery)) {
            displaySearchResults(searchCache.get(trimmedQuery), trimmedQuery)
            return
        }

        const queryLower = config.caseSensitive ? trimmedQuery : trimmedQuery.toLowerCase()
        const results = []

        // Score-based search for better relevance
        for (const item of searchIndex) {
            const score = calculateRelevanceScore(item, queryLower)
            if (score > 0) {
                results.push({ ...item, score })
            }
        }

        // Sort by relevance score (higher is better)
        results.sort((a, b) => b.score - a.score)

        // Limit results
        const limitedResults = results.slice(0, config.maxResults)

        // Cache the results
        searchCache.set(trimmedQuery, limitedResults)

        // ADD CACHE SIZE LIMIT
        if (searchCache.size > config.maxCacheSize) {
            const firstKey = searchCache.keys().next().value
            searchCache.delete(firstKey)
        }

        displaySearchResults(limitedResults, trimmedQuery)
    }

    function calculateRelevanceScore(item, query) {
        let score = 0

        const title = config.caseSensitive ? item.title : item.title.toLowerCase()
        const content = config.caseSensitive ? item.content : item.content.toLowerCase()

        // Title matches are most important
        if (title.includes(query)) {
            score += 100
            // Exact title match gets bonus
            if (title === query) score += 200
            // Title starts with query gets bonus
            if (title.startsWith(query)) score += 50
        }

        // Content matches
        if (config.searchInContent && content.includes(query)) {
            score += 10
            // Count occurrences for more relevance
            const matches = (content.match(new RegExp(escapeRegExp(query), "g")) || []).length
            score += matches * 5
        }

        // Tag matches (if available)
        if (config.searchInTags && item.tags && Array.isArray(item.tags)) {
            const tagMatch = item.tags.some((tag) => {
                const tagText = config.caseSensitive ? tag : tag.toLowerCase()
                return tagText.includes(query)
            })
            if (tagMatch) score += 25
        }

        // Category matches (if available)
        if (item.category) {
            const category = config.caseSensitive ? item.category : item.category.toLowerCase()
            if (category.includes(query)) score += 20
        }

        // Path matches (useful for documentation)
        if (item.path) {
            const path = config.caseSensitive ? item.path : item.path.toLowerCase()
            if (path.includes(query)) score += 15
        }

        return score
    }

    function displaySearchResults(results, query) {
        const resultsContainer = searchResults.querySelector(".search-results-inner")
        if (!resultsContainer) {
            console.error("Search results container (.search-results-inner) not found")
            return
        }

        resultsContainer.innerHTML = ""

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for "${escapeHtml(query)}"</p>
                    <small>Try different keywords or check spelling</small>
                </div>
            `
            showResults()
            return
        }

        // Add results count
        const countDiv = document.createElement("div")
        countDiv.className = "search-results-count"
        countDiv.textContent = `${results.length} result${results.length !== 1 ? "s" : ""} found`
        resultsContainer.appendChild(countDiv)

        // Group results by type if desired
        const groupedResults = groupResultsByType(results)

        Object.entries(groupedResults).forEach(([type, typeResults]) => {
            if (typeResults.length === 0) return

            // Add type header
            const typeHeader = document.createElement("div")
            typeHeader.className = "search-results-type-header"
            typeHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1) + "s"
            resultsContainer.appendChild(typeHeader)

            typeResults.forEach((result) => {
                const resultItem = createResultItem(result, query)
                resultsContainer.appendChild(resultItem)
            })
        })

        showResults()
    }

    function groupResultsByType(results) {
        return results.reduce((groups, result) => {
            const type = result.type || "other"
            if (!groups[type]) groups[type] = []
            groups[type].push(result)
            return groups
        }, {})
    }

    function createResultItem(result, query) {
        const resultItem = document.createElement("div")
        resultItem.className = "search-result-item"
        resultItem.dataset.id = result.id
        resultItem.dataset.type = result.type || "unknown"

        const highlightedTitle = highlightText(result.title, query)
        const highlightedContent = highlightText(getPreviewText(result.content, query), query)

        // Build additional info
        const additionalInfo = []
        if (result.category) additionalInfo.push(`Category: ${result.category}`)
        if (result.author && result.author !== "Unknown") additionalInfo.push(`By ${result.author}`)
        if (result.publishDate) {
            const date = new Date(result.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            })
            additionalInfo.push(date)
        }

        resultItem.innerHTML = `
            <div class="search-result-content">
                <div class="search-result-title">${highlightedTitle}</div>
                <div class="search-result-path">${escapeHtml(result.path)}</div>
                <div class="search-result-preview">${highlightedContent}</div>
                ${
                    additionalInfo.length > 0
                        ? `<div class="search-result-meta">${additionalInfo.join(" • ")}</div>`
                        : ""
                }
            </div>
            <div class="search-result-type-badge">${result.type || "content"}</div>
        `

        // Add click handler
        resultItem.addEventListener("click", (e) => {
            e.preventDefault()

            // Navigate to the result
            if (result.path) {
                if (result.id && result.path.includes("#")) {
                    // Handle anchor links
                    window.location.href = result.path
                } else {
                    window.location.href = result.path
                }
            }

            hideResults()
            searchInput.value = ""
        })

        // Add keyboard navigation
        resultItem.tabIndex = 0
        resultItem.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                resultItem.click()
            }
        })

        return resultItem
    }

    function getPreviewText(content, query) {
        if (!content) return ""

        const queryLower = config.caseSensitive ? query : query.toLowerCase()
        const contentLower = config.caseSensitive ? content : content.toLowerCase()
        const index = contentLower.indexOf(queryLower)

        let start = 0
        let end = config.previewLength

        if (index !== -1) {
            // Center the preview around the match
            start = Math.max(0, index - config.previewLength / 2)
            end = Math.min(content.length, start + config.previewLength)
            start = Math.max(0, end - config.previewLength)
        }

        let preview = content.substring(start, end)

        // Add ellipsis
        if (start > 0) preview = "..." + preview
        if (end < content.length) preview += "..."

        return preview
    }

    function highlightText(text, query) {
        if (!text) return ""

        const escapedQuery = escapeRegExp(query)
        const flags = config.caseSensitive ? "g" : "gi"
        return text.replace(new RegExp(`(${escapedQuery})`, flags), `<span class="${config.highlightClass}">$1</span>`)
    }

    function escapeHtml(text) {
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
    }

    function showResults() {
        searchResults.style.display = "block"
        searchResults.setAttribute("aria-hidden", "false")
    }

    function hideResults() {
        searchResults.style.display = "none"
        searchResults.setAttribute("aria-hidden", "true")
    }

    // Event listeners
    const debouncedSearch = debounce(function () {
        performSearch(this.value)
    }, config.debounceDelay)

    searchInput.addEventListener("input", debouncedSearch)

    // Handle keyboard navigation
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideResults()
            searchInput.blur()
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            const firstResult = searchResults.querySelector(".search-result-item")
            if (firstResult) firstResult.focus()
        }
    })

    // Handle clicks outside
    document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            hideResults()
        }
    })

    // Clean up function
    return {
        destroy() {
            searchInput.removeEventListener("input", debouncedSearch)
            document.removeEventListener("click", hideResults)
            searchCache.clear()
        },
        clearCache() {
            searchCache.clear()
        },
        getStats() {
            return {
                indexSize: searchIndex.length,
                cacheSize: searchCache.size,
            }
        },
    }
}

export async function loadSearchIndex() {
    const searchIndexUrl = "/content/themes/midday-custom/assets/json/search-index.json"

    try {
        const response = await fetch(searchIndexUrl)

        if (!response.ok) {
            throw new Error(`HTTP: Failed to fetch search index: ${response.status}`)
        }

        const data = await response.json()
        const searchMeta = data.meta || {}
        const searchIndex = data.index || []

        return { searchMeta, searchIndex }
    } catch (error) {
        console.error("Failed to load search index:", error)
    }
}

export async function triggerSearch() {
    const searchInput = document.getElementById("searchInput")
    const searchResults = document.getElementById("searchResults")
    const searchClear = document.getElementById("searchClear")
    const searchLoading = document.getElementById("searchLoading")
    const searchError = document.getElementById("searchError")

    let searchInstance = null

    // Show loading state
    searchLoading.style.display = "block"
    searchInput.disabled = true

    try {
        // Fetch search index
        const { searchMeta, searchIndex } = await loadSearchIndex()

        // Hide loading
        searchLoading.style.display = "none"
        searchInput.disabled = false

        if (searchIndex.length === 0) {
            throw new Error("Search index is empty")
        }

        // Initialize search
        searchInstance = initializeSearch(searchInput, searchResults, searchIndex, {
            previewLength: 200,
        })

        // Update placeholder
        searchInput.placeholder = `Search ${searchMeta.totalItems} items...`

        // Clear button functionality
        if (searchClear) {
            searchClear.addEventListener("click", function () {
                searchInput.value = ""
                searchResults.style.display = "none"
                searchClear.style.display = "none"
                searchInput.focus()
            })

            searchInput.addEventListener("input", function () {
                searchClear.style.display = this.value ? "block" : "none"
            })
        }

        // Auto-focus for better UX
        searchInput.focus()

        console.log(`Search initialized with ${searchIndex.length} items`)
    } catch (error) {
        console.error("Search initialization error:", error)
        searchLoading.style.display = "none"
        searchError.style.display = "block"
        searchInput.disabled = true
        searchInput.placeholder = "Search unavailable"
    }

    // Cleanup
    window.addEventListener("beforeunload", function () {
        if (searchInstance && typeof searchInstance.destroy === "function") {
            searchInstance.destroy()
        }
    })
}
