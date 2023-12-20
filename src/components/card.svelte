<script>
    import { CaretDown, CaretUp, ShareFat, DotOutline, Heart } from 'phosphor-svelte';
    import { onMount, afterUpdate } from 'svelte';
    import html2canvas from 'html2canvas';
    import { likePost } from '../../api/munch_hub';

    // Data passed in from cardList
    // Passed to be able to use in each card
    export let id;
    export let title;
    export let author;
    export let date;
    export let tag;
    export let content;
    export let image_url;
    export let likes = 0;

    let card; // Card element
    let showExpand = false; // Determine if the expand button should be shown
    let isExpanded = false; // Determine if the card is expanded
    let isFullSizeVisible = false; // Determine if the full size image overlay is visible
    let readyToExport = false; // Determine if the card is ready to export
    let isPostLiked = false; // Determine if the post is liked
    let postLocalStorageKey; // Unique key for the post in local storage to save like state
    
    // This toggles the expand state of the card
    const toggleExpand = () => {
        isExpanded = !isExpanded;
    };

    // This checks the height of the card to see if it needs to show the expand button
    const checkCardHeight = () => {
        if (card && card.offsetHeight > 300) {
            showExpand = true;
        } else {
            showExpand = false;
        }
    };

    // This checks the height of the card after it has been updated
    afterUpdate(checkCardHeight);

    // This function toggles the full size image overlay
    function toggleFullSize() {
        isFullSizeVisible = !isFullSizeVisible;
        document.body.style.overflow = isFullSizeVisible ? 'hidden' : 'auto';
    }

    // This function is called when the user clicks the export button
    async function exportToPNG() {
        const exportDiv = card; // The card that we will export

        // Call prepareExport to set the readyToExport flag
        await prepareExport();

        // Check if the card is ready to export
        if (readyToExport) {
            // We used html2canvas (a third-party library) to export the card as an image
            html2canvas(exportDiv, { useCORS: true, allowTaint: false })
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = 'pupmunchhub-post.png';
                    link.click();
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    readyToExport = false; // Reset the ready to export state
                });
        } else {
            console.error("Not ready to export!"); // To debug or handle error /(>..,<)\
        }
    }

    // This function prepares the card for export 
    function prepareExport() {
        return new Promise(resolve => {
            setTimeout(() => {
                readyToExport = true;
                resolve();
            }, 100); 
        });
    }

    // On mount, we check the height of the card then add a resize listener and create the unique local storage key
    onMount(() => {
        checkCardHeight();
        window.addEventListener('resize', checkCardHeight);

        postLocalStorageKey = `post_like_state_${id}`; 

        const storedLikeState = localStorage.getItem(postLocalStorageKey);
        if (storedLikeState) {
            const { liked, count } = JSON.parse(storedLikeState);
            isPostLiked = liked;
            likes = count;
        }

        return () => {
            window.removeEventListener('resize', checkCardHeight);
        };
    });

    // This function handles the like button click
    const handleLikePost = async () => {
        try {
            // Toggle like state, update like count, save to local storage
            isPostLiked = !isPostLiked;
            likes = isPostLiked ? likes + 1 : likes - 1;

            localStorage.setItem(
                postLocalStorageKey,
                JSON.stringify({ liked: isPostLiked, count: likes })
            );

            // Call the API to update the like status on the server
            const response = await likePost(id);

        } catch (e) {
            console.error("Error handling like: ", e); // To debug or handle error /(>..,<)\
        }
    };

</script>

<main>
    <div class="flex-center-col">
        <div class="main-container {isExpanded ? 'expanded' : (readyToExport ? 'exportExpanded' : 'not-expanded')}">
            <div class="card" bind:this={card}>
                <div class="top flex-center-sb">
                    <img src="https://munch-hub-v1.s3.ap-southeast-1.amazonaws.com/assets/pupmh-logo.png" alt="logo">
                    <div class="btns flex-center-se">
                        <span class="likes">{likes}</span>
                        <button class="clear pointer" on:click={handleLikePost}>
                            {#if isPostLiked}
                                <Heart size={20} color="#BD454E" weight="fill" />
                            {:else}
                                <Heart size={20} weight="bold" />
                            {/if}
                        </button>   
                        <button class="clear pointer" on:click={exportToPNG}><ShareFat size={20} weight="bold" /></button>
                    </div>
                </div>
                <span class="title">{title}</span>
                {#if image_url}
                <div class="post-container">
                    <img class="post-image pointer" src={image_url} alt="post" on:click={toggleFullSize} />
                    {#if isFullSizeVisible}
                    <div class="overlay" on:click={toggleFullSize}>
                        <div class="full-size-container">
                            <img class="full-size-image" src={image_url} alt="post" />
                        </div>
                    </div>
                    {/if}
                </div>
                {/if}
                <div class="a-d-t flex-center-sb">
                    <div class="flex-center-start" style="flex-wrap: wrap; width: 60%;">
                        <span class="author">{author}</span>
                        <div class="flex-center-row">
                            <DotOutline size={16} weight="fill" />
                            <span class="date">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <span class="tag">{tag}</span>
                </div>
                <div class="content content-black">
                    {content}
                </div>
                {#if showExpand}
                    {#if isExpanded}
                        <div class="expand flex-center-row pointer" on:click={toggleExpand}>
                            <CaretUp size={20} weight="bold" color="#A6262F" />
                        </div>
                    {:else}
                        <div class="expand flex-center-row pointer" on:click={toggleExpand}>
                            <CaretDown size={20} weight="bold" color="#A6262F" />
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    .post-container {
        position: relative;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .full-size-container {
        max-width: 80vh;
        max-height: 80vh;
        padding: 2rem;
    }

    .full-size-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .main-container {
        word-wrap: break-word;
        background-color: #EBEBEB;
        /* border: 1px solid #272727; */
        box-shadow: 0px 2px 15px -7px #000000;
        position: relative;
        margin: 10px 0;
        width: 95%;
        border-radius: 10px;
        transition: all 0.3s ease;
    }

    .not-expanded {
        overflow: hidden;
        height: 300px;
    }

    .expanded {
        height: auto;
        z-index: 2;
    }

    .exportExpanded {
        height: auto;
        z-index: 2;
    }

    .exportExpanded img.post-image {
        width: 100%;
        height: auto;
        margin: 10px 0 0 0;
        object-fit: cover;
        object-position: center;
        transition: all 0.3s ease;
    }

    div.card {
        height: auto;
        padding-bottom: 20px;
    }

    .btns {
        height: 100%;
        width: 35%;
    }

    .top{
        margin: 0 20px;
        padding: 20px 0 10px 0;
        height: auto;
        border-bottom: 2px solid #ADADAD;
    }

    .top button {
        transition:all 0.3s ease; 
    }

    .top button:hover {
        color: #911F27;
        transition:all 0.3s ease; 
    }

    .top button:active {
        color: #BD454E;
        transition:all 0.3s ease;    }

    .top img {
        width: 15px;
    }

    .likes {
        font-size: 16px;
        color: #ADADAD;
    }

    .not-expanded img.post-image, .expanded img.post-image {
        width: 100%;
        height: 100px;
        margin: 10px 0 0 0;
        object-fit: cover;
        object-position: center;
        transition: all 0.3s ease;
    }

    img.post-image:hover {
        opacity: 0.9;
        transition: all 0.3s ease;
    }

    .title {
        display: block;
        height: auto;
        padding: 10px 20px 0 20px;
        font-size: 18px;
        font-weight: 700;
    }

    .a-d-t {
        font-size: 12px;
        padding: 5px 20px;
    }

    .author {
        font-weight: 600;
    }

    .date {
        color: #727272;
    }

    .tag {
        background-color: #DBDBDB;
        border-radius: 5px;
        padding: 2px 5px;
        font-size: 11px;
    }

    .content {
        padding: 5px 20px 20px 20px;
    }

    .expand {
        border-radius: 10px;
        width: 100%;
        position: absolute;
        bottom: 0;
        z-index: 4;
        padding: 5px 0;
        background: linear-gradient(0deg, rgba(235,235,235,1) 40%, rgba(255,255,255,0) 100%);
    }

    .expand:hover {
        background: linear-gradient(0deg, rgba(219,219,219,1) 40%, rgba(219,219,219,0) 100%);
    }
</style>