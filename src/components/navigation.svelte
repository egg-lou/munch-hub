<script>
    import { push, location } from "svelte-spa-router";
    import { onMount, afterUpdate } from 'svelte';

    // Data passed from parent component
    // Used to disable navigation when hidden
    export let showNav; 

    let currentPath = ''; // Current path of the page: / or /about
    let scrollY = 0; // Current scroll position of the page
    let activeTab = ''; // Active tab of the navigation: wall, about, or team
    let navActive = false; // Determines if the navigation is active or not

    // This function toggles the navigation's active state
    function toggleNav() {
        navActive = !navActive;
    }

    // This is to redirect to landing
    const redir_home = () => { 
        push("/");
        scrollToElement("landing");
    }

    // This is to redirect to about
    const redir_about = () => { 
        push("/about");
        scrollToElement("about");
    }

    // This is to redirect to munch
    const redir_munch = () => {
        push("/");
        scrollToElement("wall");
    }

    // This is to redirect to team
    const redir_team = () => { 
        push("/about");
        scrollToElement("team");
    }

    // This function scrolls to the element with the given id
    function scrollToElement(id) { 
        setTimeout(() => {
        const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }, 50);
    }

    // This function updates the active tab based on the current path and scroll position
    function updateActiveTab() {
        currentPath = $location;
        if (currentPath === '/' && scrollY < 500 || activeTab === 'wall') {
            activeTab = 'wall';
        } else if (currentPath === '/about' && scrollY <= 500) {
            activeTab = 'about';
        } else if (currentPath === '/about' && scrollY >= 501) {
            activeTab = 'team'; 
        }
    }

    // On mount, add event listeners to window scroll and hashchange to update the active tab
    onMount(() => { 
        updateActiveTab();

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            updateActiveTab();
        });

        window.addEventListener('hashchange', () => {
            updateActiveTab();
        });
    });

    // After update, update the active tab
    afterUpdate(() => {
        updateActiveTab();
    });

</script>

<main class="flex-center-row">
    <div class="nav flex-center-sb">
        {#if showNav}
            <div class="logo flex-center-row pointer" on:click={redir_home}>
                <img src="./src/lib/images/pupmh-logo.png" alt="logo">
                <div class="title">
                    <span>PUP</span>
                    <span>Munch</span>
                    <span>Hub</span>
                </div>
            </div>
            <div class="navthru flex-center-sb btn-text" class:nav-active={navActive}>
                <span class="btn pointer {activeTab === 'wall' ? 'active' : ''}" on:click={redir_munch}>MUNCH NOW!</span>
                <span class="btn pointer {activeTab === 'about' ? 'active' : ''}" on:click={redir_about}>ABOUT</span>
                <span class="pointer"><a href="https://www.pup.edu.ph/about/" class="btn btn-text btn-1">CAMPUS</a></span>
                <span class="btn pointer {activeTab === 'team' ? 'active' : ''}" on:click={redir_team}>TEAM</span>
                <span class="early-access">early access</span>
            </div>
            <div class="burger pointer" class:toggle={navActive} on:click={toggleNav}>
                <div class="line-1"></div>
                <div class="line-2"></div>
                <div class="line-3"></div>
            </div>
        {/if}
    </div>
</main>

<style>
    main {
        background-color: #EBEBEB;
        border-bottom: 2px solid #911F27;
    }

    div.nav {
        height: 10vh;
        width: 75%;
    }
    
    div.logo img {
        width: 25px;
        margin-right: 5px;
    }

    div.logo div.title span {
        font-size: 20px;
        font-weight: 600;
        font-stretch: expanded;
    }

    div.logo div.title span:first-child {
        color: #272727;
    }

    div.logo div.title span:nth-child(2) {
        color: #630A10;
    }

    div.logo div.title span:nth-child(3) {
        background-color: #141414;
        border-radius: 42px;
        padding: 1px 6px;
        color: #E5E5E5;
    }

    div.navthru {
        width: 60%;
    }

    div.navthru span {
        font-weight: 600;
    }

    div.navthru .btn:hover {
        color: #911F27;
    }

    .active {
        color: #911F27;
    }

    .burger div {
        background-color: #911F27;
        border-radius: 5px;
        width: 25px;
        height: 5px;
        margin: 3px;
        transition: all 0.3s ease;
    }

    .burger {
        display: none;
    }

    .nav-active {
        transform: translateX(0%);
        transition: all 0.3s ease;
    }

    @media screen and (max-width: 1100px) {
        .navthru {
            position: absolute;
            width: 100%;
            height: 90vh;
            top: 10vh;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
            z-index: 9;
            transform: translateX(100%);
            box-shadow: 0px 2px 10px -2px #000000;
            background-color: #EBEBEB;
            transition: all 0.3s ease;
        }

        .burger {
            display: block;
        }

        .navthru.nav-active  {
            opacity: 1;
            transform: translateX(0%);
        }

        div.navthru {
            width: 100%;
        }
    }

    .toggle .line-1 {
        transform: rotate(-45deg) translate(-5px, 6px);
        transition: all 0.3s ease;
    }

    .toggle .line-2 {
        opacity: 0;
        transition: all 0.3s ease;
    }

    .toggle .line-3 {
        transform: rotate(45deg) translate(-5px, -6px);
        transition: all 0.3s ease;
    }


</style>