const validateWebsite = (url) => {
    const websiteRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

    if (!websiteRegex.test(url)) {
        return null; // Invalid website
    }

    // Add https:// if missing
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }

    return url;
};

export { validateWebsite };
