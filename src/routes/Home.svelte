<script>
    import Landing from '../../src/components/landing.svelte';
    import Wall from '../../src/components/wall.svelte';
    import Footer from '../../src/components/footer.svelte';
    import { fetchPosts } from '../../api/munch_hub';

    // We need to fetch the posts from the database
    // Data is passed to the wall component (wall.svelte)
    let posts = [];

    // This is to get the posts from the database
    const getPosts = async () => {
        try {
            // Await the fetchPosts function from munch_hub.js
            const data = await fetchPosts();
            posts = data.posts;
            console.log("posts: ", posts) // To debug or handle error /(>..,<)\
        } catch (error) {
            console.error('Error Fetching Posts:', error.message); // To debug or handle error /(>..,<)\
        }
    };
    const handleRefetch = async () => {
        getPosts();
    }

    getPosts();
</script>

<main>
    <div id="landing"><Landing/></div>
    <div id="wall"><Wall {posts} on:refetch={handleRefetch}/></div>
    <div><Footer /></div>
</main>

<style>
</style>