export const RetrieveUserDetails = async (userId) => {
    const request = await fetch(`http://localhost:3000/api/retrieve-user-profile/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
    })

    const response = await request.json();
    return response;
}