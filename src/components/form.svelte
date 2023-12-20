<script>
    import { CaretDown, X, ArrowUpRight, ImageSquare, Detective } from "phosphor-svelte";
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    export let expandForm;
    import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
    const { add } = toasts;
    import { submitPost } from "../../api/munch_hub";
    import { createEventDispatcher } from "svelte";

    let input; // Input file of the image
    let container; // Container of the image preview
    let selectedValue = "Tag"; // Selected tag of the post; Placeholder value is "Tag"
    let contentValue = ''; // Content of the post
    let authorValue = ''; // Author of the post
    let titleValue = ''; // Title of the post
    let image; // Image of the post
    let showImage = false; // Determines if the image is shown or not in the preview
    let showTagsList = false; // Determines if the tags list is shown or not
    let imageDataURL = ''; // Contains the image data URL of the post

    const dispatch = createEventDispatcher();

    // This is to show toast notifications
    const showToast = (type, description, progress) => {

        const title = (type === 'success' || type === 'error') ? 
            (type === 'success' ? 'Success' : 'Error') : 'Upload';

        const toastType = (type === 'success' && title === 'Success') ? 'success' : 
                        (type === 'error' && title === 'Error') ? 'error' : 'info';

        toasts.add({
            title: title,
            description: (type === 'success' && title === 'Success') ? 
                `Form submitted successfully (${progress}%)` : description,
            duration: 3000,
            placement: 'bottom-left',
            type: toastType,
            theme: 'dark',
            showProgress: type === 'success', 
            onClick: () => {},
            onRemove: () => {},
        });
    };

    // Array that contain the value, label, and icon of each tag option to easily add more tags in the future /(>..,<)\
    const tags = ['Meals', 'Small Bites', 'Sweets', 'Beverages', 'Others']; 

    // This function toggles the tags list
    function toggleTagsList(event) {
        showTagsList = !showTagsList;
        event.stopPropagation();
    }

    // This function is for the tag list's state
    function handleBodyClick(event) {
        const isInsideTagsList = event.target.closest('.tags-list'); // Check if the clicked element is inside the tags list
        if (!isInsideTagsList) {
            showTagsList = false;
        }
    }

    // This function is called when the image is changed then saves the form data
    function onChange() {
        const file = input.files[0];
        if (file) {
            showImage = true;
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                image.setAttribute("src", reader.result);
            });
            reader.readAsDataURL(file);    
                return;
        } 
        showImage = false;
        saveFormData();
    }

    // This function is called when the title is changed then saves the form data
    function onTitleChange(event) {
        titleValue = event.target.value;
        saveFormData();
    }

    // This function is called when the author is changed then saves the form data
    function onAuthorChange(event) {
        authorValue = event.target.value.trim();
        saveFormData();
    }

    // This function is called when a tag option is clicked then saves the form data
    function selectTag(tag) {
        selectedValue = tag;
        saveFormData();
    }

    // This function is called when the anonymous button is clicked then saves the form data
    function toggleAuthorValue() {
        authorValue = authorValue === '' ? 'Anonymous' : '';
        saveFormData();
    }

    // This function is called when the content is changed then saves the form data
    function onContentChange(event) {
        contentValue = event.target.value;
        saveFormData();
    }

    // This function is called when a tag option is clicked then saves the form data
    function onTagChange(tag) {
        selectedValue = tag;
    }

    // This function saves the form data to local storage
    function saveFormData() {
        
        const imageDataURL = showImage ? image.src : null; // If the image is shown, get the image data URL; Otherwise, set it to null
        const formData = {
            titleValue,
            authorValue,
            selectedValue,
            contentValue,
            imageDataURL,
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    }

    // This function is called when the clear button is clicked, which clears the form
    function handleClearData(event) {
        localStorage.removeItem('formData');
        titleValue = '';
        authorValue = '';
        selectedValue = 'Tag';
        contentValue = '';
        imageDataURL = '';
        showImage = false;

        showTagsList = false;
        expandForm(event);

        if (event) {
            event.preventDefault();
        }
    }

    // This function is called when the submit button is clicked, which submits the form
    async function handleSubmit() {
        // Prevent the form from submitting if the author, title, tag, or content is empty; Image is optional
        if(authorValue !== '' && titleValue == '' || selectedValue == 'Tag' || contentValue == '') {
            console.error('Failed to submit the form!'); // To debug or handle error /(>..,<)\
            return;
        }

        showToast('uploading', 'Uploading your post...', 0); // Show a toast notification that the form is being uploaded

        // Get the current date and format it to ISO string
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        // Call the saveFormData() function to save the data to local storage
        await onChange();
        const formData = new FormData(); // Create a new form data
        formData.append('title', titleValue);
        formData.append('author', authorValue);
        formData.append('tag', selectedValue);
        formData.append('content', contentValue);
        formData.append('date', formattedDate);
        
        // If there is an image, append it to the form data
        if(input.files.length > 0) {
            formData.append('image', input.files[0]);
        }

        // Try to submit the form, and show a toast notification based on the response: success or error
        try {
            // Call the submitPost() function from api/munch_hub.js
            const response = await submitPost(formData); 
            if (response.ok) {
                console.log('Form submitted successfully!'); // To debug or handle error /(>..,<)\
                console.log(response);

                showToast('success', '', 100);
                localStorage.removeItem('formData'); // Remove the saved data from local storage as it is no longer needed or already submitted
                handleClearData(); // Clear the form

                dispatch('refetch'); // Dispatch an event to notify other components that the form has been submitted
            }
            else {
                console.error('Failed to submit the form'); // To debug or handle error /(>..,<)\
                showToast('error', 'Failed to submit the form. Please try again later.', 0);
            }
        } catch (e) {
            showToast('error', 'An unexpected error occurred. Please try again later.', 0);
        }
    }

    // On mount, add event listener to body click to close the tags list, and image data URL is set to the saved data
    onMount(() => {
        document.body.addEventListener('click', handleBodyClick);

        const savedData = JSON.parse(localStorage.getItem('formData')) || {};
        titleValue = savedData.titleValue || '';
        authorValue = savedData.authorValue || '';
        selectedValue = savedData.selectedValue || 'Tag';
        contentValue = savedData.contentValue || '';
        imageDataURL = savedData.imageDataURL || '';
        if (imageDataURL) {
            showImage = true;
        }
    });

    // On destroy, remove event listener to prevent memory leaks just to be clean/safe /(>..,<)\
    onDestroy(() => {
        document.body.removeEventListener('click', handleBodyClick);
    });
</script>

<main>
    <ToastContainer let:data={data}>
        <FlatToast {data}/>
    </ToastContainer>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="btn flex-center-sb">
            <button type="reset" class="btn-text pointer clear flex-center-row" on:click={handleClearData}><X size={20} weight="bold" /></button> 
            <button type="submit" class="btn-text clear flex-center-sb {authorValue !== '' && titleValue !== '' && selectedValue !== 'Tag' && contentValue !== '' ? 'allow' : 'not-allow'}">Munch it<ArrowUpRight size={20} weight="bold" /></button>
        </div>
        <div>
            <input type="text" class="title clear" placeholder="Review Title" maxlength="30" bind:value={titleValue} on:input={onTitleChange}/>
            <div class="a-t flex-center-sb">
                <span class="author">By: <input type="text" class="clear content-white" placeholder="Author" maxlength="10" bind:value={authorValue} on:input={onAuthorChange}/></span>
                <div class="an-t flex-center-end">
                    <span class="anon pointer" on:click|stopPropagation={toggleAuthorValue}>
                        {#if authorValue === ''}
                            <Detective size={20} weight="fill" />
                        {:else}
                            <X size={22} weight="bold" />
                        {/if}
                    </span>
                    <div class="tags-menu">
                        <span class="flex-center-sb pointer" on:click={toggleTagsList}>
                            <span class="tag">{selectedValue}</span>
                            {#if selectedValue === 'Tag'}
                                <CaretDown size={12} weight="fill" />
                            {/if}
                        </span>
                        <div class="tags-list pointer" class:show={showTagsList}>
                            {#each tags as tag}
                                <span on:click={() => {selectTag(tag); onTagChange(tag);}}>{tag}</span>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <textarea class="clear content-white" placeholder="Write your review post here..." maxlength="300" bind:value={contentValue} on:input={onContentChange}/>
        <div class="content-mark flex-center-end">
            {300 - contentValue.length}/300
        </div>
        <div>
            <div class="img-prev" bind:this={container}>
                {#if showImage}
                    <span class="img-container">
                        <img bind:this={image} src="" alt="Preview" />
                        <span class="img-close flex-center-row pointer" on:click|stopPropagation={() => { input.value = null; showImage = false;}}>
                            <X size={12} weight="bold" />
                        </span>
                    </span>
                {/if}
            </div>
            <label class="img-upload pointer flex-center-sb content-white">
                <input bind:this={input} on:change={onChange} type="file" />
                <ImageSquare size={16} weight="bold" />Add a photo
            </label>
        </div>    
    </form>
</main>

<style>
    form {
        border-radius: 25px 25px 0 0;
        padding: 25px;
        background-color: #141414;
        width: 365px;
        height: 500px;
        transition: all 0.3s ease-in-out;
    }

    form div.a-t {
        padding-bottom: 10px;
        border-bottom: 2px solid #ededed;
        margin-bottom: 10px;
    }

    form div.btn {
        padding-bottom: 20px;
    }

    button {
        font-weight: 600;
        border-radius: 10px;
        transition: all 0.3s ease;
    }

    button:first-child {
        padding: 5px 10px;
        background-color: #272727;
        color: #ADADAD;
    }

    button:nth-child(2) {
        width: 110px;
        padding: 5px 10px;
        color: #DBDBDB;
    }

    .not-allow {
        background-color: #272727;
    }

    .allow {
        cursor: pointer;
        background-color: #911F27;
    }

    button:first-child:hover {
        box-shadow: 0px 2px 15px -7px #000000;
        background-color: #3D3D3D;
        transition: all 0.3s ease;
    }

    button:first-child:active {
        box-shadow: 0px 2px 15px -7px #000000;
        background-color: #1B1B1B;
        transition: all 0.3s ease;
    }

    button:last-child.allow:hover {
        box-shadow: 0px 2px 15px -7px #000000;
        background-color: #A6262F;
        transition: all 0.3s ease;
    }


    button:last-child.allow:active {
        box-shadow: 0px 2px 15px -7px #000000;
        background-color: #630A10;
        transition: all 0.3s ease;
    }

    span.author{
        color: #727272;
    }

    .anon {
        color: #727272;
        transition: all 0.3s ease;
    }

    .anon:hover {
        color: #E5E5E5;
    }

    .anon:active {
        color: #ADADAD;
    }

    input.title {
        width: 100%;
        color: #E5E5E5;
        font-size: 20px;
        font-weight: 600;
    }

    .author input {
       width: 120px;
       font-size: 16px;
    }

    textarea {
        width: 100%;
        min-height: 150px;
        max-height: 200px;
        overflow: auto;
        resize: none;
    }

    .tags-menu {
        position: relative;
        background-color: #272727;
        padding: 8px 10px;
        border-radius: 2px;
        color: #F2F2F2;
        border-radius: 10px;
        margin-left: 20px;
        transition: all 0.3s ease-in-out;
    }

    .tag {
        padding-right: 1px;
    }

    .tags-menu:hover {
        transform: scale(1.02);
        background-color: #141414;
    }

    .tags-list {
        display: none;
        position: absolute;
        background-color: #727272;
        right: 0px;
        top: 30px;
        width: 110px;
        box-shadow: 0px 8px 16px 0px #000000;
        border-radius: 2px;
        z-index: 1;
        transition: all 0.3s ease;
    }

    .tags-list.show {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .tags-list span {
        width: 100px;
        padding: 10px 10px;
    }

    .tags-list span:hover {
        background-color: #3D3D3D;
        box-shadow: 0px 2px 15px -7px #141414;
    }

    div.img-prev {
        margin: 15px 0;
        height: 120px;
        width: 100%;
        background-image: url('https://munch-hub-v1.s3.ap-southeast-1.amazonaws.com/assets/hexagon-black.png');
        background-position: center;
        background-repeat: no-repeat;
    }

    div.img-prev span.img-container {
        display: inline-block;
        position: relative;
        width: auto;
        height: 120px;
    }

    img {   
        width: auto;
        height: 120px;
        border-radius: 10px;
    }
    
    input[type="file"] {
        display: none;
    }

    label.img-upload {
        padding: 5px 10px;
        border-radius: 10px;
        width: 115px;
        background-color: #272727;
        transition: all 0.3s ease-in-out;
    }

    label.img-upload:hover{
        background-color: #3D3D3D;
        box-shadow: 0px 2px 15px -7px #000000;
    }

    .img-close {
        position: absolute;
        background-color: #911F27;
        top: -8px;
        right: -8px;
        z-index: 3;
        color: #F2F2F2;
        border-radius: 50px;
        padding: 4px;
        opacity: 0.5; 
        transition: all 0.3s ease-in-out;
    }

    .img-close:hover {
        opacity: 0.8;
    }

    /* responsive */

    @media (max-width: 450px) {
        form {
            width: 78vw;
        }

        .title, .title::placeholder {
            font-size: 18px;
        } 

        button, .author, textarea, .author input, .author input::placeholder, textarea::placeholder, .tags-menu {
            font-size: 14px;
        }

        .tags-menu {
            margin-left: 5px;
            font-size: 12px;
        }

        input.title {
            font-size: 18px;
        }
    }
</style>