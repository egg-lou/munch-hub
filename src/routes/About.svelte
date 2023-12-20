<script>
    import Nav from "../../src/components/navigation.svelte";
    import Abt from "../../src/components/about.svelte"; 
    import Team from "../../src/components/team.svelte";
    import Footer from '../../src/components/footer.svelte';

    let showNav = true;
</script>

<main>
    <div id="about">
        <div class="sticky"><Nav {showNav}/></div>
        <Abt />
    </div>
    <div id="team"><Team /></div>
    <div><Footer /></div>
</main>

<style>
    .sticky {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        opacity: 1;
        transition: all 0.2s ease-in-out;
    }
</style>