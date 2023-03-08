export const createFile = (bits, name, options) => {
    try {
        // If this fails, we go for Blob
        return new File(bits, name, options);
    } catch (e) {
        // If we're here a new File could not be constructed
        var myBlob = new Blob(bits, options || {});
        myBlob.lastModified = new Date();
        myBlob.name = name;
        return myBlob;
    }
};