<script>
  import Router from 'svelte-spa-router'; // Svelte is a single page application router, which is why we import Router from svelte-spa-router to be able to use single page application routing in our app; So, we can route to different pages /(>..,<)\
  import About from "./routes/About.svelte"
  import Home from "./routes/Home.svelte";

  // Define routes and their corresponding components: / for Home and /about for About
  let routes = {
    "/": Home,
    "/about": About
  }
</script>

<main>
  <Router {routes} />
</main>

<style>

</style>