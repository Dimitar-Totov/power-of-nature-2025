export const getErrorMessage = (err) => {
    const errorType = err.name;
    switch (errorType){
        case 'ValidationError':
            return Object.values(err.errors).at(0).message;
        default:
            return err.message;
    }
}