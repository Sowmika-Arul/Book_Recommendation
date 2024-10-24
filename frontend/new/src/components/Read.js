// src/Read.js

import React, { useEffect, useState } from 'react';

const Read = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const bookContent = localStorage.getItem('bookContent');
        if (bookContent) {
            setContent(bookContent);
        }
    }, []);

    return (
        <div className="read-container">
            <h1>Book Content</h1>
            <pre>{content}</pre> {/* Displaying content in preformatted text */}
        </div>
    );
};

export default Read;
