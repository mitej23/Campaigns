import qs from 'qs'

export const getGoogleOAuthTokens = async ({ code }) => {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: process.env.AUTH_GOOGLE_ID,
    client_secret: process.env.AUTH_GOOGLE_SECRET,
    redirect_uri: process.env.AUTH_GOOGLE_REDIRECT_URL,
    grant_type: "authorization_code",
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData.error);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.log(error)
  }
}

export const getGoogleUser = async ({
  id_token,
  access_token,
}) => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData, "Error fetching Google user");
      throw new Error(errorData.error || 'Failed to fetch Google user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}