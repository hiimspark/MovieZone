const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  };

const headersWithContentType = { "Content-Type": "application/json" };

export const registerUser = (username, password) => {
    return fetch(`/api/auth/users/`, {
      method: "POST",
      headers: headersWithContentType,
      body: JSON.stringify({ username, password }),
    });
};

export const loginUser = (username, password) => {
    return fetch(`/api/auth/token/login/`, {
      method: "POST",
      headers: headersWithContentType,
      body: JSON.stringify({ username, password }),
    })
      .then(checkResponse)
      .then((data) => {
        if (data.auth_token) {
          localStorage.setItem("auth_token", `Token ${data.auth_token}`);
          return data;
        }
        return null;
      });
};


export const logoutUser = () => {
    return fetch(`/api/token/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("auth_token")}`,
      },
    }).then((res) => {
      if (res.status === 204) {
        localStorage.removeItem("auth_token");
        return res;
      }
      return null;
    });
};

export const getMovies = () => {
  return fetch(`/api/movies/`,{
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
  })
};

export const getSingleMovie = (movieId) => {
  return fetch(`/api/movies/${movieId}/`,{
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
  })
};

export const getWatchlog = () => {
  return fetch(`/api/watchlist/`,{
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("auth_token")}`,
    },
  })
};

export const changeStatus = async (statusName, watchlogId) => {
  const formData = new FormData();

  formData.append('status', statusName);

  try {
    const response = await fetch(`/api/watchlist/status/${watchlogId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Status changing failed:', error);
    throw error;
  }
};


export const changeEpisodes = async (increment, watchlogId) => {
  try {
    const response = await fetch(`/api/watchlist/episodes/${watchlogId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({ direction: increment }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Episodes changing failed:', error);
    throw error;
  }
};


export const getReview = async (reviewId) => {
  try {
    const response = await fetch(`/api/review/my/${reviewId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetching review failed:', error);
    throw error;
  }
};

export const createReview = async (rating, text, watchlogId) => {
  const formData = new FormData();
  formData.append('rating', rating);
  formData.append('content', text);

  try {
    const response = await fetch(`/api/review/add/${watchlogId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Review creation failed:', error);
    throw error;
  }
};

export const updateReview = async (rating, text, watchlogId) => {
  const formData = new FormData();
  formData.append('rating', rating);
  formData.append('content', text);

  try {
    const response = await fetch(`/api/review/update/${watchlogId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Review update failed:', error);
    throw error;
  }
};

export const addToWatchlog = (movieId) => {
  try {
    const response = fetch(`/api/watchlist/add/${movieId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('auth_token')}`,
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Adding to watchlist failed:', error);
    throw error;
  }
};

