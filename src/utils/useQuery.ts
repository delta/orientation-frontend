import { useLocation } from "react-router-dom";

// returns an object of all the queries in the url
export const useQuery = () => {
	const { search } = useLocation();

	return Object.fromEntries(new URLSearchParams(search).entries());
};
