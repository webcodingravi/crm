import axios from 'axios'
import apiUrl from './useHttp';

axios.defaults.baseURL=apiUrl;


const fetcher=async (url) => {
    try {
        const { data }=await axios.get(url)
        return data;
    }
    catch (err) {
        throw new Error(err)

    }
}

export default fetcher;