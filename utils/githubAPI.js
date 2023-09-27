export const fetchUserData = async (githubURL, username) => {
    try {
        const user_response = await fetch(githubURL + username);
        const repo_response = await fetch(githubURL + username + "/repos");

        const user = await user_response.json();
        const repos = await repo_response.json();

        return { user, repos };
    } catch (error) {
        // Handle any errors that occurred during the fetch requests.
        console.error("Error fetching user and repo data:", error);
        throw error; // Rethrow the error for the calling code to handle if needed.
    }
};
