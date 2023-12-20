<script>
    import Nav from "../../src/components/navigation.svelte";
    import { PencilSimple, CaretUp } from "phosphor-svelte";
    import SearchFilter from "./searchFilter.svelte";
    import CardList from "../../src/components/cardList.svelte";
    import Form from "./form.svelte";
    import { onMount, onDestroy, createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();
    // Data passed to use for the posts
    export let posts;

    let refetch;

    let searchTerm = ''; // Search query
    let toSearch =''; // Search query in lowercase
    let selectedSort; // Sort option
    let selectedTag; // Tag option
    let isExpanded = false; // Determines if the form is expanded or not
    let show = false; // Determines if the div id wall is shown or not
    let showNav = false; // Determines if the navbar is shown or not
    let showUp = false; // Determines if the up button is shown or not
    let showCreate = false; // Determines if the create button is shown or not

    // This function is called when the search query is submitted
    // Data from dispatch is passed here from searchFilter.svelte
    function handleSearchChange(event) {
        const {searchTerm} = event.detail;
        toSearch = searchTerm.toLowerCase(); // Convert to lowercase to make it case-insensitive
        console.log('Received searchTerm:', toSearch); // To debug or handle error /(>..,<)\
    }

    // This function is called when a sort option is clicked
    // Data from dispatch is passed here from searchFilter.svelte
    function handleSortChange(event) {
        const sortChange = event.detail;
        selectedSort = sortChange;
        console.log('Sort:', selectedSort);
    }

    // This function is called when a tag option is clicked
    // Data from dispatch is passed here from searchFilter.svelte
    function handleTagChange(event) {
        const tagType = event.detail;
        selectedTag = tagType;
        console.log('Tag:', selectedTag);
    }

    // This function handles the scroll event
    function handleScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const hideThreshold = 0.1 * windowHeight;
        const endOfWindow = document.documentElement.scrollHeight - windowHeight;

        show = scrollPosition > 0.6 * windowHeight;
        showNav = scrollPosition > 0.9 * windowHeight;

        const hidePosition = endOfWindow - 0.4 * windowHeight;
        showCreate = (scrollPosition > 0.6 * windowHeight) && (scrollPosition < hidePosition);
        showUp = (scrollPosition > 1.25 * windowHeight) && (scrollPosition < hidePosition);
    }

    // This function is called when the create button is clicked, which expands the form
    function expandForm(event) {
        isExpanded = !isExpanded;
        if (event) {
            event.stopPropagation();
        }
    }


    // This function is called when the up button is clicked, which scrolls to the top
    function headToTop(event){
        const wallElement = document.getElementById('wall');
        if (wallElement) {
            wallElement.scrollIntoView({ behavior: 'smooth' });
        }
        if (event) {
            event.stopPropagation();
        }
    }

    // This function is to close the form when clicked outside
    function handleBodyClick(event) {
        const eForm = event.target.closest('.form-create');
        if (!eForm) {
            isExpanded = false;
        }
    }
        
    function handleRefetch() {
        dispatch('refetch');
    }

    // On mount, add event listeners to window scroll
    onMount(() => {
        document.body.addEventListener('click', handleBodyClick);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    // On destroy, remove event listeners to prevent memory leaks just to be clean/safe /(>..,<)\
    onDestroy(() => {
        document.body.removeEventListener('click', handleBodyClick);
    });

</script>

<main class="flex-center-col" class:hidden={!show}>
    <div class="sticky" class:hidden={!showNav}>
        <Nav showNav={showNav} />
    </div>
    <div class="wall"> 

        <div class="container flex-end-end">
            <SearchFilter {selectedSort} {selectedTag} {searchTerm} on:sortChange={handleSortChange} on:tagChange={handleTagChange} on:searchChange={handleSearchChange} />
        </div>
        <div class="form-create" class:show={isExpanded}>
            <Form {expandForm} on:refetch={handleRefetch} />
        </div> 
        <div class="wall-cards flex-center-col">           
            <CardList {posts} {selectedSort} {selectedTag} {toSearch} />
        </div>
        {#if !isExpanded}
            <div class="btns flex-center-sb-col">
                <button class="clear pointer flex-center-row" class:hidden={!showUp} disabled={!showUp} on:click={headToTop}>
                    <CaretUp size={24} weight="bold" />
                </button>

                <button class="clear pointer flex-center-row" class:hidden={!showCreate} disabled={!showCreate} on:click={expandForm}>
                    <PencilSimple size={24} weight="bold" />
                </button>
            </div>
            
        {/if}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
    }

    .sticky {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        opacity: 1;
        transition: all 0.2s ease-in-out;
    }

    .hidden {
        cursor: default ;
        opacity: 0;
        transition: all 0.2s ease-in-out;
    }

    div.wall {
        padding: 12vh 0;
        position: relative;
        width: 75%;
        min-height: 100vh;
    }

    div.container {
        height: 40px;
    }

    .form-create{
        position: fixed;
        bottom: 0;
        right: 50px;
        height: 0px;
        z-index: 7;
        transition: all 0.5s ease;
    }

    .show{
        height: 520px;
        position: fixed;
        bottom: 0;
        right: 50px;
        z-index: 5;
        transition: all 0.3s ease;
    }

    div.wall-cards {
        width: 100%;
        padding: 20px 0;
    }

    div.btns {
        position: fixed;
        right: 50px;
        bottom: 50px;
        z-index: 6;
        height: 120px;
    }

    div.btns button:first-child{
        padding: 12px;
        color: #272727;
        background-color: #EBEBEB;
        box-shadow: 0px 2px 10px -2px #000000;
        border-radius: 50px;
        transition: all 0.3s ease;
    }

    div.btns button:last-child{
        padding: 15px;
        color: #E5E5E5;
        background-color: #272727;
        box-shadow: 0px 2px 10px -2px #000000;
        border-radius: 50px;
        transition: all 0.3s ease;
    }

    div.btns button:last-child:hover {
        background-color: #3D3D3D;
        transform: scale(1.02);
        transition: all 0.3s ease;
    }

    /* responsive */
    
    @media (max-width: 600px) {
        div.btns {
            right: 25px;
            bottom: 25px;
        }

        .form-create{
            right: 10px;
        }
    }

    @media (max-width: 450px) {
        div.btns {
            right: 25px;
            bottom: 25px;
        }
    }

</style>