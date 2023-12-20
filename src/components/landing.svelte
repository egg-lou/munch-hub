<script>
    import { CaretDown } from "phosphor-svelte";
    import { onMount, onDestroy } from 'svelte';

    // This is to show the navbar when scrolled down
    let show = false;
    const scrollNavBar = 60;

    // This function scrolls to the element with the given id, which is the munch section
    function scrollToMunch() {
        const munch_s = document.getElementById('wall');
        munch_s.scrollIntoView({behavior: 'smooth'});
    }

    // On mount, add event listener to window scroll to show the navbar when scrolled down
    onMount(() => {
        window.onscroll = () => {
            if (window.scrollY > scrollNavBar) {
                show = true
            } else {
                show = false
            }
        }
    });
    
    // On destroy, remove event listener to prevent memory leaks just to be clean/safe /(>..,<)\
    onDestroy(() => {
        window.onscroll = () => {}
    });
</script>

<main>
    <section class="main flex-center-col">
        <span class="early-access">early access</span>
        <img src="https://munch-hub-v1.s3.ap-southeast-1.amazonaws.com/assets/pupmh-logo.png" alt="logo">
        <div class="title">
            <span>PUP</span>
            <span>Munch</span>
            <span>Hub</span>
        </div>
        <div class="subtitle">
            <span>Byte Every Flavor, Munch Every Wit!</span>
        </div>
        <div class="flex-center-col" style="height: 75px;">
            <button on:click={scrollToMunch}>Start Munching!<CaretDown size={28} weight="bold" color="#171A20" /></button>
        </div>
        
    </section>
</main>

<style>
    main {
        background: url('https://munch-hub-v1.s3.ap-southeast-1.amazonaws.com/assets/landing-bg.png') center center fixed;
        background-size: cover;
        height: 100svh;
        border-bottom: 2px solid #272727;
    }

    img {
        margin: 30px 0px;
        width: 250px;
        height: auto;
    }

    div.title {
        text-align: center;
    }

    div.title span {
        font-size: 75px;
        font-stretch: expanded;
        font-weight: 700;
        margin: 0px 5px;
    }

    div.title span:first-child {
        color: #272727;
    }

    div.title span:nth-child(2) {
        color: #630A10;
    }

    div.title span:nth-child(3) {
        background-color: #141414;
        border-radius: 42px;
        padding: 0px 15px;
        color: #E5E5E5;
    }

    div.subtitle {
        height: 100px;
        margin-top: 20px;
        text-align: center;
    }

    div.subtitle span {
        color: #141414;
        font-weight: 600;
        font-stretch: expanded;
        font-size: 25px;
    }

    button{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: none;
        background: none;
        color: #911F27;
        font-size: 30px;
        font-style: italic;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    button:hover {
        font-size: 31px;
        color: #630A10;
        transition: all 0.3s ease;
    }

    /* responsive */

    @media (max-width: 768px) {
        img {
            width: 200px;
        }

        div.title span {
            font-size: 50px;
        }

        div.subtitle span {
            font-size: 20px;
        }

        button {
            font-size: 25px;
        }
    }
</style>