<script>
    import { MagnifyingGlass, Funnel, Coffee, BowlFood, Cookie, IceCream, ForkKnife, FunnelSimple, SortAscending, SortDescending } from "phosphor-svelte";
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';


    // Data to pass to know the selected sort and tag and the search query
    export let selectedSort = 0;
    export let selectedTag;
    export let searchTerm;

    let isExpanded = false; // Determines if the search bar is expanded or not
    let showFloat = false; // Determines if the filter menu is shown or not

    // Used an array here to make it easier to add more sort and tag options in the future /(>..,<)\

    // Array that contain the value, label, and icon of each sort option
    const sortOptions = [
        { value: 'Most Recent', label: 'Most Recent', icon: FunnelSimple },
        { value: 'A-Z', label: 'A-Z', icon: SortAscending },
        { value: 'Z-A', label: 'Z-A', icon: SortDescending }
    ];

    // Araay that contain the value, label, and icon of each tag option
    const tagOptions = [
        { value: 'Meals', label: 'Meals', icon: BowlFood },
        { value: 'Small Bites', label: 'Small Bites', icon: Cookie },
        { value: 'Sweets', label: 'Sweets', icon: IceCream },
        { value: 'Beverages', label: 'Beverages', icon: Coffee },
        { value: 'Others', label: 'Others', icon: ForkKnife }
    ];

    // This is used to dispatch events to pass data as props
    const dispatch = createEventDispatcher();

    // This function is called when a sort option is clicked
    function handleSortClick(index) {
        selectedSort = index;
        console.log(selectedSort);
        dispatch('sortChange', selectedSort);
    }

    // This function is called when a tag option is clicked
    function handleTagClick(index) {
        selectedTag = index;
        console.log(selectedTag);
        dispatch('tagChange', selectedTag);
    }

    // This function is called when the search bar is toggled to expand or collapse
    const handleToggleExpand = () => {
        // Used a condition to prevent unecessary submitSearch() calls
        if (isExpanded && searchTerm !== '') {
            submitSearch();
        } else {
            console.log('Nothing to search here!'); // To debug or handle error /(>..,<)\
            isExpanded = !isExpanded;
            showFloat = false;
        }
    };

    // This function is called to show the sort/filter menu
    const handleClickFunnel = (event) => {
        event.stopPropagation();
        showFloat = !showFloat;
    };

    // This is called to submit the search query
    const submitSearch = () => {
        console.log('Searching for: ', searchTerm); // To debug or handle error /(>..,<)\
        dispatch('searchChange', {searchTerm}); // Dispatches the search query to pass as props
        searchTerm = ''; // Resets the search query
    };

    // This is to submit the search query when the enter key is pressed
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if(searchTerm !== '') {
                submitSearch();
            } else {
                console.log('Nothing to search here!'); // To debug or handle error /(>..,<)\
            }
        }
    };

    // This function is to close the filter menu when clicked outside
    function handleOutsideClick(event) {
        const searchBar = document.querySelector('.search-bar');
        const menu = document.querySelector('.menu');

        if (menu && (event.target === menu || menu.contains(event.target))) {
            return;
        }
        if (searchBar && !searchBar.contains(event.target)) {
            isExpanded = false;
            showFloat = false;
        }
    }

    // This function is to reset the sort and filter options to default
    function resetFilters() {
        handleSortClick(0);
        selectedTag = handleTagClick();
        submitSearch();
        console.log('Reset!'); // To debug or handle error /(>..,<)\
    }

    // On mount, default sort is "Most Recent" sort based on the index 0 passed to handleSortClick()
    onMount(() => {
        handleSortClick(0);
        window.addEventListener('click', handleOutsideClick);
    });

    // On destroy, remove event listener to prevent memory leaks just to be clean/safe /(>..,<)\
    onDestroy(() => {
        window.removeEventListener('click', handleOutsideClick);
    });
</script>

<main>
    <div class="container flex-center-row">
        <div class="flex-center-row search-bar" class:expanded={isExpanded} on:click={handleToggleExpand}>
            <MagnifyingGlass size={20} weight="bold" cursor="pointer" />
            {#if isExpanded}
                <input type="search" id="searchField" placeholder="Search munches" bind:value={searchTerm} on:click={(e) => e.stopPropagation()} on:keydown={handleKeyDown}/>
            {/if}
        </div>
        
        {#if isExpanded}
            <div class="funnel-icon" on:click={handleClickFunnel}>
                <Funnel size={20} weight="bold" cursor="pointer" />
            </div>
        {/if}
    </div>
        
    <div class:float-visible={showFloat} class="float">
        <div class="menu">
            <span>SORTING</span>
            {#each sortOptions as { value, label, icon }, index}
                <span on:click={() => handleSortClick(index)} class:selected={selectedSort === index}>
                    <div>{#if icon}<svelte:component this={icon} size={16} weight="bold" />{/if}</div>{label}
                </span>
            {/each}
        
            <span>FILTER TAGS</span>
            {#each tagOptions as { value, label, icon }, index}
                <span on:click={() => handleTagClick(index)} class:selected={selectedTag === index}>
                    <div>{#if icon}<svelte:component this={icon} size={16} weight="bold" />{/if}</div>{label}
                </span>
            {/each}
        
            <span on:click={resetFilters}>RESET</span>
        </div>
    </div>
</main>

<style>
    main {
        position: relative;
    }

    div.search-bar{
        padding: 5px 10px;
        width: 20px;
        border: 2px solid transparent;
        border-radius: 50px;
        height: 25px;
        margin-right: 5px;
        transition: all 0.3s ease;
    }

    div.search-bar.expanded {
        border: 2px solid #171717;
        border-radius: 50px;
        height: 25px;
        width: 220px;
        transition: all 0.3s ease;
    }

    div.search-bar input{
        background: none;
        width: 200px;
        border: none;
        height: 25px;
        padding: 0px 10px;
        transition: all 0.3s ease;
        cursor:"text";
        filter: grayscale(100%);
    }

    .float.float-visible {
        display: block;
    }

    .float {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 100;
        display: none;
    }

    div.menu {
        box-shadow: 0px 2px 10px -7px #171717;
        background-color: #CACACA;
        width: 270px;
        margin-top: 10px;
        border-radius: 25px;
        
    }

    div.menu span {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    div.menu span div {
        margin-right: 10px;
    }

    div.menu span:nth-child(n+2):nth-child(-n+4), div.menu span:nth-child(n+6):nth-child(-n+10) {
        background-color: #F2F2F2;
        padding: 10px 20px;
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }

    div.menu span:nth-child(n+2):nth-child(-n+4):hover, div.menu span:nth-child(n+6):nth-child(-n+10):hover {
        transition: all 0.3s ease;
        background-color: #E5E5E5;
    }

    div.menu span:first-child, div.menu span:nth-child(5), div.menu span:last-child {
        height: 35px;
        padding: 10px 20px;
        width: 100%;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    div.menu span:last-child:hover {
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    div.menu span.selected {
        color: #A6262F;
        transition: all 0.3s ease;
    }

</style>

    