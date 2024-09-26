const LocalStorageService = {
    // Save data to local storage in JSON format
    setItem: (key: any, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            localStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error("Error saving to localStorage", error);
        }
    },

    // Retrieve data from local storage and parse JSON
    getItem: (key: any) => {
        try {
            const jsonValue = localStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return null;
        }
    },

    // Remove an item from local storage
    removeItem: (key: any) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing from localStorage", error);
        }
    },

    // Clear all local storage data
    clear: (areYouSure: boolean) => {
        if (areYouSure) {
            try {
                localStorage.clear();
            } catch (error) {
                console.error("Error clearing localStorage", error);
            }
        }
    },
};

export default LocalStorageService;
