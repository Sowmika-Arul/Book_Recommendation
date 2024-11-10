const fetchRecommendedBooks = async (profile) => {
    const { favoriteBooks, favoriteAuthors, favoriteGenres, themes } = profile;

    
    const queries = [];

    if (favoriteBooks && favoriteBooks.length) {
        favoriteBooks.forEach(book => {
            queries.push(`intitle:${book}`);
            console.log(`Adding favorite book to query: intitle:${book}`); 
        });
    }

    if (favoriteAuthors && favoriteAuthors.length) {
        favoriteAuthors.forEach(author => {
            queries.push(`inauthor:${author}`);
            console.log(`Adding favorite author to query: inauthor:${author}`); 
        });
    }

    if (favoriteGenres && favoriteGenres.length) {
        favoriteGenres.forEach(genre => {
            queries.push(`subject:${genre}`);
            console.log(`Adding favorite genre to query: subject:${genre}`);
        });
    }

    if (themes && themes.length) {
        themes.forEach(theme => {
            queries.push(`subject:${theme}`);
            console.log(`Adding theme to query: subject:${theme}`); 
        });
    }

    const allBooks = [];

    for (const query of queries) {
        const encodedQuery = encodeURIComponent(query); 
        console.log('Executing Search Query:', query); 

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&key=AIzaSyB1ZDjfU1JjNa8SE57ojxvCfQiHrBbCPy4`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Google Books API response:', data); 

            if (data.items && data.items.length) {
                allBooks.push(...data.items);
            }
        } catch (error) {
            console.error('Error fetching recommended books:', error);
        }
    }

    return allBooks; 
};

export default fetchRecommendedBooks;
