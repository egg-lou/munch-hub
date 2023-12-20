<script>
    import { onMount } from "svelte";

    let show = false; // Determines if logo is shown or not

    // This function shows the logo when scroll position is less than 50% of window height
    function handleScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        show = scrollPosition < 0.5 * window.innerHeight;
    }

    // On mount, add event listener to window scroll to know when to show logo
    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<main class="flex-center-col">
    
    <div class="main-container">
        <div class="title">
            &#8220;<span>Byte</span> Every Flavor, <span>Munch</span> Every Wit&#33;&#8221;
        </div>
        <div class="body">
            <div>
                Welcome! <span>PUP MunchHub</span> is a virtual bulletin platform for food and drink reviews centered around the eats and sips available around Polytechnic University of the Philippines &#40;PUP&#41;, Main Campus. Created by students for the community, this platform allows you to share your taste test takes and hot opinions on campus grub.
            </div>
            <div>
                We capture our spirit of biting into every flavor profile and munching on every morsel of witty wisdom our reviewers have to share. We take food seriously, but don&rsquo;t take ourselves too seriously — this is a judgement-free zone to dish on local options!
            </div>
            <div>
                As an early access web application, the PUP MunchHub platform is still cooking! We have some great ingredients in the pot already but are excited to continue sprinkling in new features and improvements as our technology and community evolve. Bear with us through the occasional tough bite or under-seasoned moment because it&rsquo;s all part of perfecting our recipe!
            </div>
            <div>
                The PUP MunchHub team welcomes everyone to sample reviews, share your hot takes, peruse campus foodie finds, and relish in the dish on this virtual bulletin platform! While still in early access mode, we already know our platter will only get more delicious with time.
            </div>
            <span class="last">
                We can&rsquo;t wait to bite in and start munching for the PUP community!
            </span>
        </div>
        <img class="fixed-logo" class:hidden={!show} src="https://munch-hub-v1.s3.ap-southeast-1.amazonaws.com/assets/pupmh-logo.png" alt="logo"> 
    </div>
</main>

<style>
    main {
        width: 100%;
        min-height: 100svh;
    }

    div.main-container {
        width: 75vw;
        height: 100%;
        margin-top: 10svh;
    }

    div.title {
        color: #272727;
        font-family: 'Mona Sans-SBI', system-ui, Avenir, Helvetica, Arial, sans-serif;
        padding: 50px 0 30px 0;
        font-stretch: expanded;
        font-weight: 600;
        font-size:calc(28px + 3vw);
    }

    div.title span{
        font-family: 'Mona Sans-SBI', system-ui, Avenir, Helvetica, Arial, sans-serif;
        color: #630A10;
    }

    div.body {
        text-align: justify;
        width: 80%;
        color: #272727;
        font-size: 22px;
    }

    div.body div {
        margin: 25px 0;
        font-weight: 500;
    }

    div.body div span {
        font-weight: 600;
        color: #630A10;
    }

    span.last {
        font-family: 'Mona Sans-SBI', system-ui, Avenir, Helvetica, Arial, sans-serif;
    }

    img.fixed-logo {
        position: fixed;
        top: 35vh;
        right: -75px;
        rotate: -30deg;
        width: 25vw;
        height: auto;
        z-index: 3;
        transition: all 0.3s ease;
    }

    .hidden {
        opacity: 0;
        transition: all 0.2s ease-in-out;
    }
    
    /* responsive */

    @media (max-width: 500px) {
        div.body {
            width: 100%;
        }

        img.fixed-logo {
            opacity: calc(0);
            transition: all 0.3s ease;
        }
    }

</style>