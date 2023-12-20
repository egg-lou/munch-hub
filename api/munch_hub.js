// This is an endpoint to fetch posts from the backend
async function fetchPosts() {
    try {
        // Await the response from the backend if it is successful
        const response = await fetch(
            `https://7xu8ft3yhc.execute-api.ap-southeast-1.amazonaws.com/munch_hub/get_posts`
        );

        // If the response is not ok, throw an error
        // To debug or handle error /(>..,<)\
        if (!response.ok) {
            throw new Error(
                `Failed to fetch posts. Status: ${response.status}`
            );
        }

        // If the response is ok, return the response data
        const responseData = response.json();
        return responseData;
    } catch (e) {
        console.error('Error fetching posts: ', e); // To debug or handle error /(>..,<)\
    }
}

// This is an endpoint to submit posts to the backend
async function submitPost(data) {
    try {
        // Await the response from the backend if it is successful and return the response
        const response = await fetch(
            `https://7xu8ft3yhc.execute-api.ap-southeast-1.amazonaws.com/munch_hub/create_post`,
            {
                method: 'POST',
                body: data,
            }
        );
        return response; 
    } catch (e) {
        console.error('Error submitting form: ', e); // To debug or handle error /(>..,<)\
    }
}

// This is an endpoint in liking posts
async function likePost(post_id) {
    try {
        // Await the response from the backend if it is successful and return the response
        const response = await fetch(
            `https://7xu8ft3yhc.execute-api.ap-southeast-1.amazonaws.com/munch_hub/like_post/${post_id}`,
            {
                method: 'PUT',
            }
        );
        return response;
    } catch (e) {
        console.error('Error liking post: ', e); // To debug or handle error /(>..,<)\
    }
}

// Export the functions to be used in other files
export { fetchPosts, submitPost, likePost }; 
