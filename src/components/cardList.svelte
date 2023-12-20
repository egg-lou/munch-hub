<script>
    import Card from './card.svelte';
    import { onMount, afterUpdate } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    // Data from App.svelte
    // Passed to use for sorting and filtering
    export let posts;
    export let selectedSort;
    export let selectedTag;
    export let toSearch;

    let resultCount; // Number of posts that match the search
    let sortedPosts = []; // Posts that are sorted according to selectedSort or selectedTag
    let visiblePosts = []; // Posts that are displayed
    let maxVisiblePosts = 12; // Maximum number of posts that can be displayed

    $: {
        sortedPosts = [...posts]; // Get a copy of posts to easily sort and filter and not affect the original posts

        // Sort posts according to selectedSort
        switch (selectedSort) {
            case 1:
                sortedPosts = sortAlphabet(sortedPosts, 'descending');
                break;
            case 2:
                sortedPosts = sortAlphabet(sortedPosts, 'ascending');
                break;
            default:
                sortedPosts = sortDate([...posts]);
        }

        // Filter posts according to selectedTag
        switch (selectedTag) {
            case 0:
                sortedPosts = sortedPosts.filter(post => post.tag === 'Meals');
                break;
            case 1:
                sortedPosts = sortedPosts.filter(post => post.tag === 'Small Bites');
                break;
            case 2:
                sortedPosts = sortedPosts.filter(post => post.tag === 'Sweets');
                break;
            case 3:
                sortedPosts = sortedPosts.filter(post => post.tag === 'Beverages');
                break;
            case 4:
                sortedPosts = sortedPosts.filter(post => post.tag === 'Others');
                break;
            default:
                // wala lang TT_TT
        }

        // If there is a search query, call filterPosts()
        if (toSearch) {
            sortedPosts = filterPosts(sortedPosts); 
        }

        // Set visiblePosts to the first 12 posts
        visiblePosts = sortedPosts.slice(0, maxVisiblePosts);
    }

    // This function sorts posts according to date by getting the difference of the date in milliseconds, where the post with the latest date will have the highest value
    function sortDate(posts) {
        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // This function sorts posts alphabetically by title by getting the difference of the title in alphabetical order, where the post with the latest title will have the highest value
    // Posts is used indirectly because the function is called in the $: block
    function sortAlphabet(posts, order) {
        return sortedPosts.sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return order === 'descending' ? comparison : -comparison;
        });
    }

    // This function filters posts according to the search query if it matches the title or author of the post
    function filterPosts(posts) {
        return posts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(toSearch);
            const authorMatch = post.author.toLowerCase().includes(toSearch);
            return titleMatch || authorMatch;
        });
    }

    // On mount, default sort is by date or "Most Recent" sort
    onMount(() => {
        sortedPosts = sortDate([...posts]);
    });

    // We get the number of posts that match the search query after the posts have been updated
    afterUpdate(() => {
        resultCount = sortedPosts.length;
        console.log('Searched Posts: ', sortedPosts);
        console.log('Number of matching posts: ', resultCount)
    })

    let heap = []; // Heap data structure to load more posts

    // This function uses a heap data structure to load more posts
    function loadMorePosts() {
        if (visiblePosts.length < sortedPosts.length) {
            // Get the remaining posts that haven't been loaded yet
            let remainingPosts = sortedPosts.slice(visiblePosts.length);
            let numPostsToAdd = Math.min(12, remainingPosts.length);

            // Add the remaining posts to the heap
            for (let i = 0; i < numPostsToAdd; i++) {
                heap.push(remainingPosts[i]);
            }

            // Sort the heap based on the date of the posts
            heap.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Add the top posts from the heap to the visiblePosts array
            let newVisiblePosts = visiblePosts.concat(heap.splice(0, numPostsToAdd));
            visiblePosts = newVisiblePosts;
        }
    }

    // This is used to dispatch an event to App.svelte to show the "View More" button
    const dispatch = createEventDispatcher();

    // This function is called when the "View More" button is clicked to load more posts until there are no more posts to load
    function handleViewMore() {
        loadMorePosts();
        dispatch('viewMore');
    }
</script>

<main>
    <div class="card">
        {#each visiblePosts as post (post.post_id)}
            <Card
                id={post.post_id}
                title={post.title}
                image_url={post.image_url}
                author={post.author}
                date={post.date}
                tag={post.tag}
                content={post.content}
                likes={post.likes}
            />
        {/each}
    </div>
    {#if visiblePosts.length === 0}
        <span class="flex-center-col">
            <img src="./src/lib/images/pupmh-logo.png" alt="logo" class="no-post"> 
        </span> 
    {:else}
        {#if visiblePosts.length < sortedPosts.length}
            <span class="view-more flex-center-row">
                <button class="clear pointer" on:click={handleViewMore}>VIEW MORE</button>
            </span>
        {:else}
            <span class="no-more-view flex-center-row">
                END OF MUNCHES
            </span>
        {/if}
    {/if}

</main>

<style>
    main {
        width: 100%;
    }

    div.card {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-auto-rows: 350px;
        gap: 20px;
    }

    .no-post {
        padding: 50px 0;
        opacity: 0.1;
        width: 40%;
    }

    .view-more, .no-more-view {
        height: 50px;
        width: 100%;
        margin: 50px 0;
    }

    .no-more-view {
        background-color: #E5E5E5;
        color: #727272;
        font-weight: 600;
    }

    .view-more button {
        color: #E5E5E5;
        font-size: 12px;
        box-shadow: 0px 2px 10px -2px #000000;
        background-color: #272727;
        padding: 10px 20px;
        transition: all 0.3s ease;
    }

    .view-more button:hover {
        background-color: #171717;
        font-size: 13px;
        color: #EBEBEB;
        transition: all 0.3s ease;
    }
</style>
