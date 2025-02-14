const TEST_PATTERNS = [
    /[-_.](test|spec)\./i,  // Matches .test. or .spec. in filenames
    /[\\/](tests?|__tests__|__test__|spec|specs|intTest)[\\/]/i,  // Matches directories like /test/, /tests/, /__tests__/, /spec/, etc.
    /.*(Test|IT)\..*/i       // Matches any file named *Test.* or *IT.*
];

function getFileType(filepath) {
    const normalizedPath = filepath.replace(/\\/g, '/');

    if (TEST_PATTERNS.some(pattern => pattern.test(normalizedPath))) {
        return 'test';
    }

    return 'regular';
}

function processSingleFileView() {
    // Find all file headers in the PR
    const fileHeaders = document.querySelectorAll('.file-header:not([data-highlighter-file-highlighter-type])');

    fileHeaders.forEach(fileHeader => {
        // Skip if already processed
        if (fileHeader.hasAttribute('data-highlighter-file-highlighter-type')) {
            return;
        }

        // Get the file full path and name
        const filepath = fileHeader.querySelector('.file-info a.Link--primary')?.title;
        if (!filepath) return;

        // Mark what type this file is
        let fileType = getFileType(filepath);
        fileHeader.classList.add(`file-highlighter-type-${fileType}`);
        fileHeader.setAttribute('data-highlighter-file-highlighter-type', fileType);
    });
}

// Watch for dynamic content changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            processSingleFileView();
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial processing
processSingleFileView();
