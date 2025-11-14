const highlightText = (htmlString, searchTerm) => {
    if (!searchTerm || !htmlString) return htmlString;

    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    return htmlString.replace(regex, '<mark>$1</mark>');
};

export default highlightText;
